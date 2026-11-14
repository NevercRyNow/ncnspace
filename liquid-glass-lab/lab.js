import { LiquidGlassEngine } from '../engine/engine.js?v=20261117i';
import { MATERIALS, QUALITY } from '../engine/materials.js?v=20261117i';
import { LiquidGlassPanel, LiquidGlassNavbar, LiquidGlassPill, LiquidGlassCard, LiquidGlassButton } from '../engine/components.js?v=20261117i';

const stage = document.querySelector('[data-lab-stage]');
const canvas = document.querySelector('[data-lab-canvas]');
const status = document.querySelector('[data-lab-status]');
const fpsNode = document.querySelector('[data-lab-fps]');
const dprNode = document.querySelector('[data-lab-dpr]');
const fallback = document.querySelector('[data-lab-fallback]');
const hint = document.querySelector('[data-lab-hint]');

const ranges = {
  refraction: [0, 1.6],
  blur: [0, 1],
  chroma: [0, 1],
  highlight: [0, 1.4],
  opacity: [0.08, 0.85],
  radius: [0.02, 0.5],
  curvature: [2, 6],
};

const defaults = [
  LiquidGlassPanel({ id: 'panel', label: 'Titanium panel', x: 0.055, y: 0.19, w: 0.43, h: 0.51, z: 1, draggable: true }),
  LiquidGlassNavbar({ id: 'nav', label: 'Obsidian nav', x: 0.55, y: 0.12, w: 0.37, h: 0.105, z: 2, draggable: true }),
  LiquidGlassPill({ id: 'pill', label: 'Ice pill', x: 0.56, y: 0.31, w: 0.25, h: 0.085, z: 3, draggable: true }),
  LiquidGlassCard({ id: 'card', label: 'Crystal card', x: 0.415, y: 0.43, w: 0.30, h: 0.31, radius: 0.14, z: 4, draggable: true }),
  LiquidGlassButton({ id: 'orb', label: 'Crystal button', material: 'crystal', x: 0.075, y: 0.73, w: 0.12, h: 0.13, z: 5, draggable: true }),
];

const forceFallback = new URLSearchParams(location.search).get('fallback') === '1';
const engine = new LiquidGlassEngine(canvas, { quality: 'balanced', theme: 'dark' });
window.ncnspaceLab = { engine, defaults };

const surfaceSelect = document.querySelector('[data-lab-surface]');
const sliders = [...document.querySelectorAll('[data-lab-param]')];
const materialButtons = [...document.querySelectorAll('[data-lab-material]')];
const backgroundButtons = [...document.querySelectorAll('[data-lab-background]')];
const quality = document.querySelector('[data-lab-quality]');
const themeButton = document.querySelector('[data-lab-theme]');
const resetButton = document.querySelector('[data-lab-reset]');

let selectedId = 'panel';
let lightField = false;

function effective(surface) {
  if (!surface) return null;
  const material = MATERIALS[surface.material] || MATERIALS.obsidian;
  const overrides = surface.overrides || {};
  return {
    ...material,
    ...Object.fromEntries(Object.entries(overrides).filter(([key]) => key in ranges)),
    radius: overrides.radius ?? surface.radius,
    curvature: overrides.curvature ?? surface.curvature,
  };
}

function formatValue(name, value) {
  if (name === 'radius') return `${Math.round(value * 100)}%`;
  if (name === 'curvature') return value.toFixed(1);
  return value.toFixed(2);
}

function syncSliders() {
  const surface = engine.surfaces.find((item) => item.id === selectedId);
  const values = effective(surface);
  if (!values) return;
  sliders.forEach((input) => {
    const name = input.getAttribute('data-lab-param');
    const [min, max] = ranges[name];
    const value = Number(values[name] ?? min);
    input.value = String(Math.round(((value - min) / (max - min)) * 100));
    const output = document.querySelector(`[data-lab-value="${name}"]`);
    if (output) output.textContent = formatValue(name, value);
  });
  materialButtons.forEach((button) => {
    const active = button.getAttribute('data-lab-material') === surface.material;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  surfaceSelect.value = selectedId;
}

function setStatus(text, state = 'live') {
  if (!status) return;
  status.textContent = text;
  status.dataset.state = state;
}

engine.setSurfaces(defaults);
engine.onReady = () => {
  stage.classList.add('is-ready');
  setStatus('WEBGL2 / 2-BLIT LAYERED');
  if (dprNode) dprNode.textContent = `DPR ${engine.stats.dpr || '—'}`;
  syncSliders();
  hint.textContent = 'DRAG THE GLASS / MOVE THE POINTER';
};
engine.onSurfaceSelect = (id) => {
  selectedId = id;
  syncSliders();
  hint.textContent = `SELECTED / ${id.toUpperCase()}`;
};
engine.onStats = (stats) => {
  if (fpsNode && stats.fps > 0) fpsNode.textContent = `${stats.fps} FPS`;
  if (dprNode) dprNode.textContent = `DPR ${stats.dpr || '—'}`;
};
engine.onError = (error) => {
  console.warn('[NCNSPACE liquid glass lab]', error);
  stage.classList.add('is-fallback');
  fallback.hidden = false;
  canvas.style.display = 'none';
  setStatus('CSS FALLBACK / WEBGL2 UNAVAILABLE', 'fallback');
  if (fpsNode) fpsNode.textContent = 'NO RAF';
  hint.textContent = 'FALLBACK / NO FAKE REFRACTION';
};
engine.onContextRestored = () => {
  setStatus('CONTEXT LOST / RELOAD TO RESTORE', 'fallback');
  fallback.hidden = false;
};

surfaceSelect.addEventListener('change', () => {
  selectedId = surfaceSelect.value;
  syncSliders();
});
materialButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const material = button.getAttribute('data-lab-material');
    engine.setMaterial(material, selectedId);
    syncSliders();
    setStatus(`${material.toUpperCase()} / ${selectedId.toUpperCase()}`);
  });
});
sliders.forEach((input) => {
  input.addEventListener('input', () => {
    const name = input.getAttribute('data-lab-param');
    const [min, max] = ranges[name];
    const value = min + (max - min) * (Number(input.value) / 100);
    engine.setParam(name, value, selectedId);
    const output = document.querySelector(`[data-lab-value="${name}"]`);
    if (output) output.textContent = formatValue(name, value);
  });
});
backgroundButtons.forEach((button) => {
  button.addEventListener('click', async () => {
    const mode = button.getAttribute('data-lab-background');
    backgroundButtons.forEach((item) => item.classList.toggle('is-active', item === button));
    lightField = mode === 'light';
    document.body.classList.toggle('is-light-field', lightField);
    themeButton.textContent = lightField ? 'DARK FIELD' : 'LIGHT FIELD';
    if (mode === 'light') {
      engine.setTheme('light');
      await engine.setBackground('../assets/img/lab-light.svg?v=20261117i');
    } else if (mode === 'desktop') {
      engine.setTheme('dark');
      await engine.setBackground('../assets/img/spatial-field.svg?v=20261117i');
    } else if (mode === 'library') {
      engine.setTheme('dark');
      await engine.setBackground('../assets/img/nav-field.svg?v=20261117i');
    } else {
      engine.setTheme('dark');
      await engine.setBackground('../assets/img/stage-field.svg?v=20261117i');
    }
    setStatus(`WEBGL2 / ${mode.toUpperCase()} FIELD`);
  });
});
quality.addEventListener('change', () => {
  engine.setQuality(quality.value);
  const label = QUALITY[quality.value]?.label || quality.value;
  setStatus(`WEBGL2 / ${label.toUpperCase()}`);
});
themeButton.addEventListener('click', async () => {
  lightField = !lightField;
  document.body.classList.toggle('is-light-field', lightField);
  themeButton.textContent = lightField ? 'DARK FIELD' : 'LIGHT FIELD';
  backgroundButtons.forEach((button) => button.classList.toggle('is-active', button.getAttribute('data-lab-background') === (lightField ? 'light' : 'spatial')));
  engine.setTheme(lightField ? 'light' : 'dark');
  await engine.setBackground(lightField ? '../assets/img/lab-light.svg?v=20261117i' : '../assets/img/stage-field.svg?v=20261117i');
  setStatus(`WEBGL2 / ${lightField ? 'LIGHT' : 'DARK'} FIELD`);
});
resetButton.addEventListener('click', () => {
  selectedId = 'panel';
  engine.setSurfaces(defaults.map((surface) => ({ ...surface, overrides: {} })));
  syncSliders();
  setStatus('WEBGL2 / SURFACES RESET');
});

if (forceFallback) {
  stage.classList.add('is-fallback');
  fallback.hidden = false;
  canvas.style.display = 'none';
  setStatus('CSS FALLBACK / FORCED FOR TEST', 'fallback');
  if (fpsNode) fpsNode.textContent = 'NO RAF';
  hint.textContent = 'FALLBACK / NO FAKE REFRACTION';
} else engine.init().then(() => {
  // Surfaces may have been normalized again during init; keep the UI in sync.
  syncSliders();
}).catch((error) => {
  console.warn('[NCNSPACE liquid glass lab]', error);
  stage.classList.add('is-fallback');
  fallback.hidden = false;
  canvas.style.display = 'none';
  setStatus('CSS FALLBACK / WEBGL2 UNAVAILABLE', 'fallback');
});
