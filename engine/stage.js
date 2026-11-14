import { LiquidGlassEngine } from './engine.js?v=20261117g';
import { LiquidGlassPanel } from './components.js?v=20261117g';

const PARAM_RANGES = {
  refraction: [0, 1.6],
  blur: [0, 1],
  chroma: [0, 1],
  highlight: [0, 1.4],
  opacity: [0.08, 0.85],
  radius: [0.02, 0.5],
  curvature: [2, 6],
};

function numeric(input) {
  return Number(input.value) / 100;
}

function mapParam(name, normalized) {
  const [min, max] = PARAM_RANGES[name] || [0, 1];
  return min + (max - min) * normalized;
}

function setStatus(stage, text, kind = 'live') {
  const node = stage.querySelector('[data-glass-status]');
  if (!node) return;
  node.textContent = text;
  node.dataset.state = kind;
}

function syncSurface(engine, stage, target) {
  if (!engine.ready || !target) return;
  const stageRect = stage.getBoundingClientRect();
  const rect = target.getBoundingClientRect();
  if (!stageRect.width || !stageRect.height) return;
  const cssRadius = parseFloat(getComputedStyle(target).borderTopLeftRadius) || 24;
  const radius = Math.min(0.5, Math.max(0.02, cssRadius / Math.min(rect.width, rect.height)));
  engine.setSurfaces([LiquidGlassPanel({
    id: 'panel',
    x: (rect.left - stageRect.left) / stageRect.width,
    y: (rect.top - stageRect.top) / stageRect.height,
    w: rect.width / stageRect.width,
    h: rect.height / stageRect.height,
    radius,
    curvature: 3.6,
    material: stage.dataset.material || 'ice',
    z: 1,
  })]);
}

function initStage(stage) {
  const forceFallback = new URLSearchParams(location.search).get('glass') === 'off';
  const canvas = stage.querySelector('[data-liquid-canvas]');
  const target = stage.querySelector('[data-liquid-target]');
  if (!canvas || !target) return;

  if (forceFallback) {
    stage.classList.add('is-fallback');
    setStatus(stage, 'CSS FALLBACK / FORCED FOR TEST', 'fallback');
    return;
  }

  const engine = new LiquidGlassEngine(canvas, {
    quality: stage.dataset.quality || undefined,
    background: stage.dataset.background || null,
    theme: 'dark',
  });
  stage._liquidEngine = engine;

  engine.onReady = () => {
    stage.classList.add('is-webgl');
    setStatus(stage, 'WEBGL2 / LIVE REFRACTION');
    syncSurface(engine, stage, target);
    const dpr = stage.querySelector('[data-glass-dpr]');
    if (dpr) dpr.textContent = `DPR ${engine.stats.dpr || '—'}`;
    if (window.ResizeObserver) {
      const observer = new ResizeObserver(() => syncSurface(engine, stage, target));
      observer.observe(stage);
      observer.observe(target);
      stage._liquidObserver = observer;
    }
  };
  engine.onError = (error) => {
    console.warn('[NCNSPACE liquid glass]', error);
    stage.classList.remove('is-webgl');
    stage.classList.add('is-fallback');
    setStatus(stage, 'CSS FALLBACK / WEBGL UNAVAILABLE', 'fallback');
  };
  engine.onContextRestored = () => {
    stage.classList.add('is-fallback');
    setStatus(stage, 'CONTEXT LOST / RELOAD TO RESTORE', 'fallback');
  };
  engine.onStats = (stats) => {
    const fps = stage.querySelector('[data-glass-fps]');
    if (fps && stats.fps > 0) fps.textContent = `${stats.fps} FPS`;
    const dpr = stage.querySelector('[data-glass-dpr]');
    if (dpr) dpr.textContent = `DPR ${stats.dpr || '—'}`;
  };

  stage.querySelectorAll('[data-glass-material]').forEach((button) => {
    button.addEventListener('click', () => {
      const material = button.getAttribute('data-glass-material');
      stage.dataset.material = material;
      engine.setMaterial(material);
      stage.querySelectorAll('[data-glass-material]').forEach((item) => {
        item.classList.toggle('is-active', item === button);
        item.setAttribute('aria-pressed', String(item === button));
      });
      setStatus(stage, `${material.toUpperCase()} / LIVE REFRACTION`);
    });
  });

  stage.querySelectorAll('[data-glass-param]').forEach((input) => {
    input.addEventListener('input', () => {
      const name = input.getAttribute('data-glass-param');
      const value = mapParam(name, numeric(input));
      engine.setParam(name, value);
      const output = input.closest('label')?.querySelector('[data-glass-value]');
      if (output) output.textContent = name === 'radius' ? `${Math.round(value * 100)}%` : value.toFixed(2);
    });
  });

  const quality = stage.querySelector('[data-glass-quality]');
  if (quality) {
    quality.addEventListener('change', () => {
      engine.setQuality(quality.value);
      setStatus(stage, `WEBGL2 / ${quality.value.toUpperCase()}`);
    });
  }

  const transparency = stage.querySelector('[data-reduce-transparency]');
  if (transparency) {
    transparency.addEventListener('change', () => {
      const solid = transparency.checked;
      stage.classList.toggle('is-solid', solid);
      setStatus(stage, solid ? 'REDUCED TRANSPARENCY / CSS SURFACE' : 'WEBGL2 / LIVE REFRACTION', solid ? 'fallback' : 'live');
    });
  }

  const lab = stage.querySelector('[data-glass-lab-link]');
  if (lab) {
    lab.addEventListener('click', (event) => {
      if (!stage.classList.contains('is-webgl')) event.preventDefault();
    });
  }

  engine.init().catch((error) => {
    console.warn('[NCNSPACE liquid glass]', error);
    stage.classList.add('is-fallback');
    setStatus(stage, 'CSS FALLBACK / WEBGL UNAVAILABLE', 'fallback');
  });
}

const stages = document.querySelectorAll('[data-glass-stage]');
stages.forEach(initStage);
