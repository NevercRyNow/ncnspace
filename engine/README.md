# NCNSPACE Liquid Glass Engine

A dependency-free WebGL2 renderer for real refractive glass surfaces. It is
loaded directly by the static site; there is no build step.

## Files

```text
engine/
├── engine.js          renderer, FBOs, render passes, pointer routing, disposal
├── gl-utils.js        shader/program/texture/FBO/quad helpers
├── spring.js          damped spring for press feedback
├── materials.js       Obsidian / Titanium / Ice / Crystal + quality tiers
├── components.js      LiquidGlassPanel / Button / Navbar / Dock / Dialog / Card / Toggle / Slider / Pill
├── stage.js           main-site stage: canvas + DOM target + material controls
├── shaders/
│   ├── fullscreen.vert
│   ├── scene.frag     spatial scene or image background
│   ├── blur.frag      separable 9-tap Gaussian
│   ├── glass.vert
│   ├── glass.frag     superellipse SDF, refraction, chroma, blur, rim, shadow
│   └── present.frag
└── licenses/          third-party license texts
```

## Render pipeline

1. The scene is rendered into a full-resolution FBO.
2. A separable Gaussian blur is rendered at a quality-dependent lower resolution
   into two ping-pong FBOs.
3. The scene is copied into the accumulated composite FBO.
4. For every glass surface, in z order:
   - copy only the surface's expanded bbox from `compFBO` to `scratchFBO`
     (scissored blit);
   - draw the glass quad into `scratchFBO`, sampling `compTex` and `blurTex`;
   - copy the bbox back into `compFBO`.
   `compFBO` is never sampled while it is the draw target. Earlier glass is
   visible to later glass, so layers are optically composited.
5. Present `compTex` to the canvas.

No CSS `backdrop-filter` is used for these surfaces. CSS is used only when the
renderer deliberately falls back and the stage status says `CSS FALLBACK`.

## Geometry and optics

- Rounded superellipse SDF; the curvature exponent is a real uniform (2–6).
- SDF finite-difference normals.
- Refraction samples the accumulated scene with normal-driven offsets.
- RGB chromatic split around the refraction vector.
- Separable Gaussian background blur mixed by material.
- Fresnel-like rim, specular lobe, inner shadow, outer shadow, grain.
- Per-surface material tint/opacity/refraction/blur/chroma/highlight/shadow.

This is an original implementation, not a line-for-line port. The AGPL-3.0
reference could not be copied into this non-AGPL site; see
`../THIRD_PARTY_NOTICES.md` for the full licensing decision and the Apache-2.0
upstream credit.

## API

```js
import { LiquidGlassEngine } from './engine.js';
import { LiquidGlassPanel } from './components.js';

const engine = new LiquidGlassEngine(canvas, {
  quality: 'balanced',          // high | balanced | performance | mobile
  background: null,             // image URL or null for spatial gradient
  theme: 'dark',
});
engine.setSurfaces([LiquidGlassPanel({ x: .1, y: .1, w: .4, h: .3 })]);
await engine.init();
engine.setMaterial('ice', 'surface-id');
engine.setParam('refraction', 0.9, 'surface-id');
engine.setQuality('performance');
engine.dispose();
```

Surface coordinates are normalized to the canvas: `x/y/w/h` in `0..1`.
`radius` is normalized to the shortest side. Rendering is demand-driven: pointer
moves, parameter changes, drag and spring animation request frames; idle state
stops the RAF loop.

## Quality and fallback

- `high`: DPR up to 2, larger blur.
- `balanced`: DPR up to 1.5.
- `performance`: DPR 1, lower blur.
- `mobile`: DPR 1, lowest blur and surface budget.
- No WebGL2: the stage enters `.is-fallback`, shows a clear status and preserves
  the CSS surface; the lab displays a full fallback notice. It never presents CSS
  as realtime refraction.
- Context loss: rendering stops and a fallback/status is shown; reload to restore.
