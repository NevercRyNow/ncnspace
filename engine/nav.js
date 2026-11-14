import { LiquidGlassEngine } from './engine.js?v=20261117i';
import { LiquidGlassNavbar } from './components.js?v=20261117i';

const wrap = document.querySelector('[data-nav-liquid]');
const canvas = wrap?.querySelector('[data-nav-liquid-canvas]');
const desktop = window.matchMedia('(min-width: 981px)');

if (wrap && canvas && desktop.matches) {
  const engine = new LiquidGlassEngine(canvas, {
    quality: 'balanced',
    theme: 'dark',
    background: 'assets/img/nav-field.svg?v=20261117i',
  });
  wrap._liquidNavEngine = engine;
  engine.onReady = () => {
    wrap.classList.add('is-webgl');
    const rect = canvas.getBoundingClientRect();
    engine.setSurfaces([
      LiquidGlassNavbar({
        id: 'nav',
        x: 0,
        y: 0,
        w: 1,
        h: 1,
        radius: 0.5,
        curvature: 2.15,
        material: 'ice',
        z: 1,
        overrides: { refraction: 1.6, chroma: 0.8, highlight: 1.2, blur: 0.9, opacity: 0.16 },
      }),
    ]);
    if (rect.width < 10) wrap.classList.remove('is-webgl');
  };
  engine.onError = (error) => {
    console.warn('[NCNSPACE liquid nav]', error);
    wrap.classList.add('is-fallback');
  };
  engine.init().catch((error) => {
    console.warn('[NCNSPACE liquid nav]', error);
    wrap.classList.add('is-fallback');
  });
}
