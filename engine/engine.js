import {
  createProgram, createTexture, createFramebuffer, createFullscreenQuad,
  createUnitQuad, bindColorTexture, deleteFramebuffer, deleteProgram,
} from './gl-utils.js?v=20261117g';
import { Spring } from './spring.js?v=20261117g';
import { MATERIALS, QUALITY, pickQuality, resolveMaterial } from './materials.js?v=20261117g';

const SHADER_DIR = new URL('./shaders/', import.meta.url);

async function readShader(name) {
  const response = await fetch(new URL(`${name}?v=20261117g`, SHADER_DIR));
  if (!response.ok) throw new Error(`Shader ${name} returned ${response.status}`);
  return response.text();
}

function clamp(value, min, max) { return Math.min(max, Math.max(min, value)); }

export class LiquidGlassEngine {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.options = options;
    this.gl = null;
    this.ready = false;
    this.destroyed = false;
    this.quality = options.quality || pickQuality();
    this.qualitySpec = QUALITY[this.quality];
    this.dpr = 1;
    this.width = 1;
    this.height = 1;
    this.cssWidth = 1;
    this.cssHeight = 1;
    this.surfaces = [];
    this.hovered = null;
    this.dragging = null;
    this.pointer = { x: 0.5, y: 0.5, lastX: 0.5, lastY: 0.5, time: 0, speed: 0 };
    this.dirty = true;
    this.frameHandle = 0;
    this.lastFrame = 0;
    this.frames = 0;
    this.fpsStart = 0;
    this.fps = 0;
    this.bgToken = 0;
    this.background = null;
    this.hasImage = false;
    this.bgImageSize = [1, 1];
    this.theme = options.theme || 'dark';
    this.reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.stats = { fps: 0, frames: 0, quality: this.quality, dpr: 1 };
    this._onPointerMove = this.onPointerMove.bind(this);
    this._onPointerDown = this.onPointerDown.bind(this);
    this._onPointerUp = this.onPointerUp.bind(this);
    this._onPointerLeave = this.onPointerLeave.bind(this);
    this._onResize = this.resize.bind(this);
    this._onContextLost = this.onContextLost.bind(this);
  }

  async init() {
    const gl = this.canvas.getContext('webgl2', {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      preserveDrawingBuffer: true,
      powerPreference: 'high-performance',
    });
    if (!gl) throw new Error('WebGL2 is not available');
    this.gl = gl;
    gl.getExtension('EXT_color_buffer_float');

    const [fullVert, sceneFrag, blurFrag, presentFrag, glassVert, glassFrag] = await Promise.all([
      readShader('fullscreen.vert'),
      readShader('scene.frag'),
      readShader('blur.frag'),
      readShader('present.frag'),
      readShader('glass.vert'),
      readShader('glass.frag'),
    ]);

    this.programs = {
      scene: createProgram(gl, fullVert, sceneFrag, 'scene'),
      blur: createProgram(gl, fullVert, blurFrag, 'blur'),
      present: createProgram(gl, fullVert, presentFrag, 'present'),
      glass: createProgram(gl, glassVert, glassFrag, 'glass'),
    };
    this.uniforms = {};
    for (const [name, program] of Object.entries(this.programs)) {
      const count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
      const map = {};
      for (let i = 0; i < count; i += 1) {
        const info = gl.getActiveUniform(program, i);
        if (info) map[info.name.replace(/\[0\]$/, '')] = gl.getUniformLocation(program, info.name);
      }
      this.uniforms[name] = map;
    }

    this.fullQuad = createFullscreenQuad(gl);
    this.unitQuad = createUnitQuad(gl);
    this.targets = {};
    this.sceneTex = createTexture(gl, 1, 1);
    this.sceneFBO = createFramebuffer(gl, this.sceneTex);
    this.compTex = createTexture(gl, 1, 1);
    this.compFBO = createFramebuffer(gl, this.compTex);
    this.scratchTex = createTexture(gl, 1, 1);
    this.scratchFBO = createFramebuffer(gl, this.scratchTex);
    this.blurATex = createTexture(gl, 1, 1);
    this.blurAFBO = createFramebuffer(gl, this.blurATex);
    this.blurBTex = createTexture(gl, 1, 1);
    this.blurBFBO = createFramebuffer(gl, this.blurBTex);
    this.bgTex = createTexture(gl, 1, 1);
    gl.bindTexture(gl.TEXTURE_2D, this.bgTex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([11, 16, 28, 255]));

    this.setTheme(this.theme);
    this.resize();
    this.bindEvents();
    this.ready = true;
    if (this.options.background) {
      await this.setBackground(this.options.background).catch(() => {});
    }
    this.onReady?.();
    this.requestRender();
  }

  bindEvents() {
    this.canvas.addEventListener('pointermove', this._onPointerMove, { passive: false });
    this.canvas.addEventListener('pointerdown', this._onPointerDown, { passive: false });
    this.canvas.addEventListener('pointerup', this._onPointerUp, { passive: true });
    this.canvas.addEventListener('pointercancel', this._onPointerUp, { passive: true });
    this.canvas.addEventListener('pointerleave', this._onPointerLeave, { passive: true });
    this.canvas.addEventListener('webglcontextlost', this._onContextLost, false);
    this.canvas.addEventListener('webglcontextrestored', () => {
      this.ready = false;
      this.onContextRestored?.();
    }, false);
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(this._onResize);
      this.resizeObserver.observe(this.canvas);
    }
    window.addEventListener('resize', this._onResize, { passive: true });
  }

  onContextLost(event) {
    event.preventDefault();
    this.ready = false;
    this.cancelFrame();
    this.onError?.(new Error('WebGL context lost'));
  }

  resize() {
    if (!this.gl || !this.ready || this.destroyed) return;
    const rect = this.canvas.getBoundingClientRect();
    const cssWidth = Math.max(1, rect.width || this.canvas.clientWidth || 1);
    const cssHeight = Math.max(1, rect.height || this.canvas.clientHeight || 1);
    const spec = QUALITY[this.quality] || QUALITY.balanced;
    const maxDpr = Math.min(spec.dpr, window.devicePixelRatio || 1);
    const maxTexture = this.gl.getParameter(this.gl.MAX_TEXTURE_SIZE) || 4096;
    let dpr = maxDpr;
    if (cssWidth * dpr > maxTexture) dpr = maxTexture / cssWidth;
    if (cssHeight * dpr > maxTexture) dpr = Math.min(dpr, maxTexture / cssHeight);
    dpr = Math.max(1, dpr);
    const width = Math.max(1, Math.round(cssWidth * dpr));
    const height = Math.max(1, Math.round(cssHeight * dpr));
    if (width === this.width && height === this.height && cssWidth === this.cssWidth && cssHeight === this.cssHeight) return;

    this.cssWidth = cssWidth;
    this.cssHeight = cssHeight;
    this.dpr = dpr;
    this.width = width;
    this.height = height;
    this.canvas.width = width;
    this.canvas.height = height;
    this.stats.dpr = Number(dpr.toFixed(2));
    this.stats.quality = this.quality;

    this.resizeTexture(this.sceneTex, width, height);
    this.resizeTexture(this.compTex, width, height);
    this.resizeTexture(this.scratchTex, width, height);
    const blurW = Math.max(1, Math.round(width * spec.blurScale));
    const blurH = Math.max(1, Math.round(height * spec.blurScale));
    this.blurWidth = blurW;
    this.blurHeight = blurH;
    this.resizeTexture(this.blurATex, blurW, blurH);
    this.resizeTexture(this.blurBTex, blurW, blurH);

    this.requestRender();
  }

  resizeTexture(texture, width, height) {
    const gl = this.gl;
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  }

  setQuality(name) {
    if (!QUALITY[name] || name === this.quality) return;
    this.quality = name;
    this.qualitySpec = QUALITY[name];
    this.stats.quality = name;
    this.resize();
    this.dirty = true;
    this.requestRender();
  }

  setTheme(theme) {
    this.theme = theme === 'light' ? 'light' : 'dark';
    this.sceneTop = this.theme === 'light' ? [0.82, 0.88, 0.96] : [0.055, 0.075, 0.125];
    this.sceneBottom = this.theme === 'light' ? [0.48, 0.56, 0.66] : [0.012, 0.016, 0.026];
    this.sceneAccent = this.theme === 'light' ? [0.40, 0.56, 1.0] : [0.44, 0.64, 1.0];
    this.lightColor = this.theme === 'light' ? [0.95, 0.98, 1.0] : [0.78, 0.88, 1.0];
    this.dirty = true;
    this.requestRender();
  }

  async setBackground(url) {
    if (!this.gl) return;
    const token = ++this.bgToken;
    if (!url) {
      this.hasImage = false;
      this.background = null;
      this.dirty = true;
      this.requestRender();
      return;
    }
    const image = new Image();
    image.decoding = 'async';
    image.crossOrigin = 'anonymous';
    image.src = url;
    await new Promise((resolve, reject) => {
      image.onload = resolve;
      image.onerror = () => reject(new Error(`Background ${url} failed to load`));
    });
    if (token !== this.bgToken || this.destroyed) return;
    const gl = this.gl;
    gl.bindTexture(gl.TEXTURE_2D, this.bgTex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    this.background = url;
    this.hasImage = true;
    this.bgImageSize = [image.naturalWidth || image.width, image.naturalHeight || image.height];
    this.dirty = true;
    this.requestRender();
  }

  setSurfaces(surfaces) {
    this.surfaces = surfaces.map((surface) => this.normalizeSurface(surface));
    this.surfaces.sort((a, b) => (a.z || 0) - (b.z || 0));
    this.dirty = true;
    this.requestRender();
  }

  normalizeSurface(surface) {
    return {
      id: surface.id || `surface-${Math.random().toString(36).slice(2)}`,
      x: clamp(surface.x ?? 0.1, -1, 2),
      y: clamp(surface.y ?? 0.1, -1, 2),
      w: clamp(surface.w ?? 0.4, 0.02, 2),
      h: clamp(surface.h ?? 0.2, 0.02, 2),
      radius: surface.radius ?? 0.28,
      curvature: surface.curvature ?? 3.4,
      material: surface.material || 'obsidian',
      z: surface.z ?? 1,
      draggable: Boolean(surface.draggable),
      press: 0,
      pressSpring: new Spring(0, 190, 21),
      hover: 0,
      pointerX: 0.5,
      pointerY: 0.5,
      speed: 0,
      overrides: surface.overrides || {},
    };
  }

  updateSurface(id, patch) {
    const surface = this.surfaces.find((item) => item.id === id);
    if (!surface) return;
    Object.assign(surface, patch);
    this.dirty = true;
    this.requestRender();
  }

  setParam(name, value, id = null) {
    const targets = id ? this.surfaces.filter((surface) => surface.id === id) : this.surfaces;
    targets.forEach((surface) => { surface.overrides[name] = value; });
    this.dirty = true;
    this.requestRender();
  }

  setMaterial(name, id = null) {
    const targets = id ? this.surfaces.filter((surface) => surface.id === id) : this.surfaces;
    targets.forEach((surface) => { surface.material = name; surface.overrides = {}; });
    this.dirty = true;
    this.requestRender();
  }

  getSurfaceAt(nx, ny) {
    for (let i = this.surfaces.length - 1; i >= 0; i -= 1) {
      const s = this.surfaces[i];
      if (nx >= s.x && nx <= s.x + s.w && ny >= s.y && ny <= s.y + s.h) return s;
    }
    return null;
  }

  updatePointerFromEvent(event) {
    const rect = this.canvas.getBoundingClientRect();
    const x = clamp((event.clientX - rect.left) / Math.max(1, rect.width), 0, 1);
    const y = clamp((event.clientY - rect.top) / Math.max(1, rect.height), 0, 1);
    const now = performance.now();
    const dx = x - this.pointer.lastX;
    const dy = y - this.pointer.lastY;
    const dt = Math.max(8, now - this.pointer.time);
    this.pointer.speed = clamp(Math.hypot(dx, dy) / (dt / 1000) * 0.16, 0, 1);
    this.pointer.lastX = x;
    this.pointer.lastY = y;
    this.pointer.time = now;
    this.pointer.x = x;
    this.pointer.y = y;
    return { x, y };
  }

  onPointerMove(event) {
    if (!this.ready) return;
    const { x, y } = this.updatePointerFromEvent(event);
    if (this.dragging) {
      const surface = this.dragging.surface;
      const rect = this.canvas.getBoundingClientRect();
      const dx = (event.clientX - this.dragging.startClientX) / Math.max(1, rect.width);
      const dy = (event.clientY - this.dragging.startClientY) / Math.max(1, rect.height);
      surface.x = clamp(this.dragging.startX + dx, -surface.w * 0.2, 1 - surface.w * 0.8);
      surface.y = clamp(this.dragging.startY + dy, -surface.h * 0.2, 1 - surface.h * 0.8);
      this.canvas.style.cursor = 'grabbing';
    }
    const hit = this.getSurfaceAt(x, y);
    this.surfaces.forEach((surface) => {
      surface.hover = surface === hit ? 1 : 0;
      if (surface === hit) {
        surface.pointerX = (x - surface.x) / Math.max(0.001, surface.w);
        surface.pointerY = (y - surface.y) / Math.max(0.001, surface.h);
        surface.speed = this.pointer.speed;
      }
    });
    this.hovered = hit;
    if (!this.dragging) this.canvas.style.cursor = hit ? (hit.draggable ? 'grab' : 'default') : 'default';
    this.dirty = true;
    this.requestRender();
    if (event.pointerType === 'mouse') event.preventDefault();
  }

  onPointerDown(event) {
    if (!this.ready) return;
    const { x, y } = this.updatePointerFromEvent(event);
    const surface = this.getSurfaceAt(x, y);
    if (!surface) return;
    this.canvas.setPointerCapture?.(event.pointerId);
    surface.pressSpring.setTarget(1);
    this.dragging = {
      surface,
      startClientX: event.clientX,
      startClientY: event.clientY,
      startX: surface.x,
      startY: surface.y,
    };
    this.canvas.style.cursor = 'grabbing';
    this.dirty = true;
    this.requestRender();
    event.preventDefault();
  }

  onPointerUp(event) {
    if (!this.ready) return;
    if (this.dragging) {
      this.dragging.surface.pressSpring.setTarget(0);
      this.dragging = null;
    } else {
      this.surfaces.forEach((surface) => surface.pressSpring.setTarget(0));
    }
    this.canvas.style.cursor = this.hovered ? (this.hovered.draggable ? 'grab' : 'default') : 'default';
    this.dirty = true;
    this.requestRender();
  }

  onPointerLeave() {
    if (!this.ready || this.dragging) return;
    this.hovered = null;
    this.surfaces.forEach((surface) => { surface.hover = 0; surface.pressSpring.setTarget(0); });
    this.canvas.style.cursor = 'default';
    this.dirty = true;
    this.requestRender();
  }

  requestRender() {
    if (!this.ready || this.destroyed) return;
    this.dirty = true;
    if (this.frameHandle) return;
    this.lastFrame = performance.now();
    this.frameHandle = requestAnimationFrame((time) => this.tick(time));
  }

  cancelFrame() {
    if (this.frameHandle) cancelAnimationFrame(this.frameHandle);
    this.frameHandle = 0;
  }

  tick(time) {
    this.frameHandle = 0;
    if (!this.ready || this.destroyed) return;
    const dt = Math.min(0.05, Math.max(0.001, (time - this.lastFrame) / 1000));
    this.lastFrame = time;
    let animating = false;
    this.surfaces.forEach((surface) => {
      if (surface.pressSpring.update(dt)) animating = true;
      surface.press = surface.pressSpring.value;
    });
    if (this.dirty || animating) this.render();
    this.dirty = false;
    if (animating) this.requestRender();
    else this.frameHandle = 0;
  }

  render() {
    if (!this.gl || !this.ready) return;
    const gl = this.gl;
    const time = performance.now() * 0.001;
    this.renderScene();
    this.renderBlur();
    this.renderComposite(time);
    this.frames += 1;
    this.stats.frames = this.frames;
    const now = performance.now();
    if (!this.fpsStart) this.fpsStart = now;
    if (now - this.fpsStart > 500) {
      this.fps = Math.round(this.frames * 1000 / (now - this.fpsStart));
      this.stats.fps = this.fps;
      this.frames = 0;
      this.fpsStart = now;
      this.onStats?.(this.stats);
    }
  }

  renderScene() {
    const gl = this.gl;
    const u = this.uniforms.scene;
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.sceneFBO);
    gl.viewport(0, 0, this.width, this.height);
    gl.disable(gl.BLEND);
    gl.useProgram(this.programs.scene);
    gl.bindVertexArray(this.fullQuad.vao);
    bindColorTexture(gl, this.programs.scene, u.uImage, this.bgTex, 0);
    gl.uniform2f(u.uResolution, this.width, this.height);
    gl.uniform2f(u.uImageSize, this.bgImageSize[0], this.bgImageSize[1]);
    gl.uniform1f(u.uHasImage, this.hasImage ? 1 : 0);
    gl.uniform3fv(u.uTop, this.sceneTop);
    gl.uniform3fv(u.uBottom, this.sceneBottom);
    gl.uniform3fv(u.uAccent, this.sceneAccent);
    gl.uniform2f(u.uPointer, this.pointer.x, this.pointer.y);
    gl.uniform1f(u.uTime, performance.now() * 0.001);
    gl.uniform1f(u.uLightMode, this.theme === 'light' ? 1 : 0);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  renderBlur() {
    const gl = this.gl;
    const u = this.uniforms.blur;
    gl.useProgram(this.programs.blur);
    gl.bindVertexArray(this.fullQuad.vao);
    gl.disable(gl.BLEND);
    // Horizontal: scene -> blur A.
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.blurAFBO);
    gl.viewport(0, 0, this.blurWidth, this.blurHeight);
    bindColorTexture(gl, this.programs.blur, u.uTexture, this.sceneTex, 0);
    gl.uniform2f(u.uTexel, 1 / this.width, 1 / this.height);
    gl.uniform2f(u.uDirection, 1, 0);
    gl.uniform1f(u.uRadius, (QUALITY[this.quality] || QUALITY.balanced).blurRadius);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    // Vertical: blur A -> blur B.
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.blurBFBO);
    bindColorTexture(gl, this.programs.blur, u.uTexture, this.blurATex, 0);
    gl.uniform2f(u.uTexel, 1 / this.blurWidth, 1 / this.blurHeight);
    gl.uniform2f(u.uDirection, 0, 1);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  present(texture, framebuffer = null) {
    const gl = this.gl;
    const u = this.uniforms.present;
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.viewport(0, 0, this.width, this.height);
    gl.useProgram(this.programs.present);
    gl.bindVertexArray(this.fullQuad.vao);
    bindColorTexture(gl, this.programs.present, u.uTexture, texture, 0);
    gl.disable(gl.BLEND);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  blit(sourceFBO, targetFBO, x0, y0, x1, y1) {
    const gl = this.gl;
    if (x1 <= x0 || y1 <= y0) return;
    gl.bindFramebuffer(gl.READ_FRAMEBUFFER, sourceFBO);
    gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, targetFBO);
    gl.blitFramebuffer(x0, y0, x1, y1, x0, y0, x1, y1, gl.COLOR_BUFFER_BIT, gl.NEAREST);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }

  renderComposite(time) {
    const gl = this.gl;
    // Keep the accumulated scene as a texture and perform the 2-blit
    // scissored scratch pattern for each glass element. No element ever
    // samples the framebuffer it is writing to.
    this.present(this.sceneTex, this.compFBO);
    const u = this.uniforms.glass;
    gl.useProgram(this.programs.glass);
    gl.bindVertexArray(this.unitQuad.vao);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    for (const surface of this.surfaces) {
      if (!surface || (surface.visible === false)) continue;
      const material = resolveMaterial({ ...surface, ...surface.overrides });
      const sx = surface.x * this.width;
      const sy = surface.y * this.height;
      const sw = surface.w * this.width;
      const sh = surface.h * this.height;
      const margin = Math.max(20 * this.dpr, 18);
      const qx = Math.max(0, Math.floor(sx - margin));
      const qy = Math.max(0, Math.floor(sy - margin));
      const qw = Math.min(this.width - qx, Math.ceil(sw + margin * 2));
      const qh = Math.min(this.height - qy, Math.ceil(sh + margin * 2));
      if (qw <= 0 || qh <= 0) continue;
      const bx0 = qx;
      const by0 = Math.max(0, this.height - (qy + qh));
      const bx1 = Math.min(this.width, qx + qw);
      const by1 = Math.min(this.height, this.height - qy);

      // 1) Copy the affected backdrop region into the scratch target.
      this.blit(this.compFBO, this.scratchFBO, bx0, by0, bx1, by1);
      // 2) Draw the glass passes into the scratch target, sampling compTex.
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.scratchFBO);
      gl.viewport(0, 0, this.width, this.height);
      gl.enable(gl.SCISSOR_TEST);
      gl.scissor(bx0, by0, bx1 - bx0, by1 - by0);
      bindColorTexture(gl, this.programs.glass, u.uScene, this.compTex, 0);
      bindColorTexture(gl, this.programs.glass, u.uBlur, this.blurBTex, 1);
      gl.uniform2f(u.uResolution, this.width, this.height);
      gl.uniform4f(u.uShape, sx, sy, sw, sh);
      gl.uniform4f(u.uQuad, qx, qy, qw, qh);
      gl.uniform2f(u.uPointer, surface.pointerX, surface.pointerY);
      gl.uniform1f(u.uTime, time);
      gl.uniform1f(u.uPress, clamp(surface.press, 0, 1));
      gl.uniform1f(u.uSpeed, clamp(surface.speed || 0, 0, 1));
      gl.uniform3fv(u.uTint, material.tint);
      gl.uniform3fv(u.uLightColor, this.lightColor);
      gl.uniform1f(u.uOpacity, material.opacity);
      gl.uniform1f(u.uRefraction, material.refraction);
      gl.uniform1f(u.uBlurMix, material.blur);
      gl.uniform1f(u.uChroma, material.chroma);
      gl.uniform1f(u.uHighlight, material.highlight);
      gl.uniform1f(u.uShadow, material.shadow);
      gl.uniform1f(u.uRadius, clamp(surface.overrides.radius ?? surface.radius, 0.01, 0.5));
      gl.uniform1f(u.uCurvature, clamp(surface.overrides.curvature ?? surface.curvature ?? 3.4, 2, 6));
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      gl.disable(gl.SCISSOR_TEST);
      // 3) Merge only the affected region back into the accumulated scene.
      this.blit(this.scratchFBO, this.compFBO, bx0, by0, bx1, by1);
    }

    gl.disable(gl.BLEND);
    this.present(this.compTex, null);
    gl.bindVertexArray(null);
  }

  samplePixel(x = 0.5, y = 0.5) {
    if (!this.gl || !this.ready) return null;
    const px = Math.round(clamp(x, 0, 1) * (this.width - 1));
    const py = Math.round((1 - clamp(y, 0, 1)) * (this.height - 1));
    const pixels = new Uint8Array(4);
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.compFBO);
    this.gl.readPixels(px, py, 1, 1, this.gl.RGBA, this.gl.UNSIGNED_BYTE, pixels);
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
    return [...pixels];
  }

  dispose() {
    this.destroyed = true;
    this.cancelFrame();
    window.removeEventListener('resize', this._onResize);
    this.resizeObserver?.disconnect();
    const gl = this.gl;
    if (!gl) return;
    this.canvas.removeEventListener('pointermove', this._onPointerMove);
    this.canvas.removeEventListener('pointerdown', this._onPointerDown);
    this.canvas.removeEventListener('pointerup', this._onPointerUp);
    this.canvas.removeEventListener('pointercancel', this._onPointerUp);
    this.canvas.removeEventListener('pointerleave', this._onPointerLeave);
    Object.values(this.programs || {}).forEach((program) => deleteProgram(gl, program));
    deleteFramebuffer(gl, this.sceneFBO, this.sceneTex);
    deleteFramebuffer(gl, this.compFBO, this.compTex);
    deleteFramebuffer(gl, this.scratchFBO, this.scratchTex);
    deleteFramebuffer(gl, this.blurAFBO, this.blurATex);
    deleteFramebuffer(gl, this.blurBFBO, this.blurBTex);
    if (this.bgTex) gl.deleteTexture(this.bgTex);
    if (this.fullQuad) { gl.deleteVertexArray(this.fullQuad.vao); gl.deleteBuffer(this.fullQuad.buffer); }
    if (this.unitQuad) { gl.deleteVertexArray(this.unitQuad.vao); gl.deleteBuffer(this.unitQuad.buffer); }
  }
}

export { MATERIALS, QUALITY };
