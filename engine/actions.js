import { LiquidGlassEngine } from './engine.js?v=20261117g';
import { LiquidGlassPill } from './components.js?v=20261117g';

const wrap = document.querySelector('[data-hero-actions]');
const canvas = wrap?.querySelector('[data-actions-liquid]');
const buttons = wrap ? [...wrap.querySelectorAll('.btn')] : [];

if (wrap && canvas && buttons.length) {
  const engine = new LiquidGlassEngine(canvas, {
    quality: 'balanced',
    theme: 'dark',
    background: 'assets/img/action-field.svg?v=20261117g',
  });
  wrap._liquidActionsEngine = engine;

  const sync = () => {
    if (!engine.ready) return;
    const canvasRect = canvas.getBoundingClientRect();
    if (canvasRect.width < 10 || canvasRect.height < 10) return;
    const surfaces = buttons.map((button, index) => {
      const rect = button.getBoundingClientRect();
      return LiquidGlassPill({
        id: index === 0 ? 'primary' : 'secondary',
        x: (rect.left - canvasRect.left) / canvasRect.width,
        y: (rect.top - canvasRect.top) / canvasRect.height,
        w: rect.width / canvasRect.width,
        h: rect.height / canvasRect.height,
        radius: 0.5,
        curvature: 2.1,
        material: index === 0 ? 'ice' : 'obsidian',
        z: index + 1,
        overrides: index === 0
          ? { refraction: 1.5, chroma: 0.7, highlight: 1.25, blur: 0.85, opacity: 0.18 }
          : { refraction: 1.1, chroma: 0.55, highlight: 1.0, blur: 0.8, opacity: 0.24 },
      });
    });
    engine.setSurfaces(surfaces);
  };

  engine.onReady = () => {
    wrap.classList.add('is-webgl');
    sync();
    if (window.ResizeObserver) {
      const observer = new ResizeObserver(sync);
      observer.observe(wrap);
      buttons.forEach((button) => observer.observe(button));
      wrap._liquidActionsObserver = observer;
    }
  };
  engine.onError = (error) => {
    console.warn('[NCNSPACE liquid actions]', error);
    wrap.classList.remove('is-webgl');
  };
  engine.init().catch((error) => {
    console.warn('[NCNSPACE liquid actions]', error);
    wrap.classList.remove('is-webgl');
  });
}
