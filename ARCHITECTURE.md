# NCNSPACE website — architecture audit and liquid-glass migration

## 1. Current project before this change

The website is **not** a Next.js/React app. It is a static, self-contained site
served directly by GitHub Pages:

| Item | Actual |
| --- | --- |
| `package.json` | none in `site/`; no build step |
| Framework | none — HTML + CSS + vanilla ES2020 JS |
| Entry | `site/index.html` |
| Routing | one page, eight hash sections, plus `404.html`; now also `liquid-glass-lab/` |
| Design tokens | CSS custom properties at the top of `styles.css` |
| Components | semantic HTML blocks + CSS classes; no component runtime |
| Animation | CSS transitions/keyframes + `main.js` observers and pointer handlers |
| Assets | real device captures, local Manrope, silent 30s film, APK |
| Deployment | `../.github/workflows/pages.yml`, artifact path `site`; standalone mirror repo deploys root |
| Responsive | breakpoints at 980 / 720 / 420 / 360 |
| Canvas/WebGL | **none before this work** |

The existing content, exact product status and the static deployment path were kept.
The page now defaults to Chinese with an English language switch, and the footer
credits producer **Only 郑壹鸣**. The v3 sticky Experience, chapter rail, lightbox and
reduced-motion behaviour remain in place.

## 2. Reference audit

Reference: <https://github.com/martin65536/liquid-glass-webgl>

- License in the repository and README badge: **AGPL-3.0**, not Apache-2.0.
- Stack: Next.js 16 / React 19 / TypeScript / Bun; a catalog app with a Prisma
  database and demo routes.
- Core renderer: ~16,400 lines across `renderer/`, `shaders/` and `shapes/`.
- Key ideas: scene FBO, separable blur, scissored local ping-pong blit, spring
  and velocity feedback, continuous-curvature silhouettes and SDF textures.
- Upstream design source: `Kyant0/AndroidLiquidGlass`, licensed **Apache-2.0**;
  the WebGL reference credits it.

### Why no direct code port

The site is not AGPL-licensed, and the reference is AGPL-3.0. Copying its
renderer, shaders, curve builder or tessellator would make the combined site a
derivative work and require AGPL distribution. The task brief incorrectly
described the reference as Apache-2.0. The safe path is therefore:

1. study the public architecture and the Apache-2.0 upstream design lineage;
2. implement an **original WebGL2 renderer** in the existing static stack;
3. document the exact gap instead of pretending to have ported every upstream
   file.

No AGPL source is included. The Apache-2.0 upstream license is included for the
design lineage. See `THIRD_PARTY_NOTICES.md` and `engine/README.md`.

## 3. What was kept / refactored / added

**Kept:** static stack, content, all real screenshots, film, APK, SEO/OG, 404,
manifest, accessible dialogs, reduced-motion support, Pages workflow, relative
asset paths.

**Refactored:** `main.js` was rewritten into one demand-driven host; Experience
became the sticky scene from v3; the material demo became a WebGL canvas with a
DOM text target; navigation gained a Liquid Glass entry; hero copy now carries
the exact `Your Device. Your Space. Your Way.` line and `Explore GitHub`.

**Added:** `engine/` (renderer, GL utilities, spring, material presets,
components, shaders, license texts), `liquid-glass-lab/`, the stage host, and
`ARCHITECTURE.md` / `THIRD_PARTY_NOTICES.md`.

## 4. Integration architecture

```text
HTML/CSS page
  ├── static content and real screenshots
  ├── <canvas data-liquid-canvas> + DOM target (.glass-panel)
  └── engine/stage.js
        └── LiquidGlassEngine
              ├── scene FBO (procedural spatial scene or image)
              ├── separable blur FBOs
              ├── comp FBO / scratch FBO (scissored 2-blit)
              ├── glass.frag per surface
              └── demand-driven rAF + DPR/quality controller
```

- The main site has one stage; the lab has one stage with five draggable
  surfaces. They do not share a WebGL context.
- Rendering is demand-driven: pointer, drag, spring, resize or parameter change
  requests a frame; idle stops the RAF loop.
- Surface coordinates are normalized; DPR and texture sizes are derived from the
  quality tier and viewport.
- The lab is a real test surface, not a screenshot: changing a slider changes
  fragment uniforms and therefore the rendered pixels.

## 5. Risks and explicit limitations

| Risk | Status / mitigation |
| --- | --- |
| AGPL-3.0 reference | No code copied; original implementation; reference license disclosed. |
| Arbitrary DOM backdrop sampling | The engine samples its own scene FBO. It does **not** capture arbitrary HTML/text behind a surface. The main stage/lab sit over a controlled spatial scene; CSS chrome remains CSS and is not presented as WebGL. |
| G2 Bezier capsule tessellator | Not copied from AGPL. This engine uses a smooth superellipse/rounded-box SDF with a real curvature uniform; no `border-radius` substitute. Exact G2 Bezier/de Casteljau mesh parity is not claimed. |
| Continuous SDF texture / adaptive luminance / device motion | Not ported in this iteration. |
| Chrome/Edge/Safari/Android/iOS | WebGL2 tested in the Workbench WebKit browser; other engines are not physically tested here. Fallback is explicit and testable with `?fallback=1` / `?glass=off`. |
| Context loss | Handlers stop rendering and show a fallback/status; automatic full context restoration is not implemented (reload restores). |
| Multiple surfaces | Lab has five surfaces including overlap; layered composition is scissored, no same-FBO read/write. Main site uses one. |
| Performance | DPR cap, blur downsampling, quality tiers, idle gate. Real FPS depends on GPU and browser. |

## 6. Test evidence (local, before deployment)

- Main stage: `WEBGL2 / LIVE REFRACTION`, canvas initialized, non-zero pixels,
  material buttons and refraction/blur uniforms exercised.
- Lab: five surfaces, drag changed normalized positions, slider changed
  overrides (`refraction 1.28`), light field toggled theme and pixels, quality
  switched to Performance with DPR 1.
- Forced fallback: lab `?fallback=1` shows `CSS FALLBACK / FORCED FOR TEST`;
  main `?glass=off` shows `CSS FALLBACK / FORCED FOR TEST`.
- The lab page has no horizontal overflow at 1180/820 and 412/597.
- Transparent surfaces are rendered by WebGL; CSS fallback is visually different
  and labeled.

## 7. Asset status (current iteration)

The page intentionally renders **zero product screenshots** (`<img>` count = 0).
Hero, Experience, Beyond, Control, Visual and Final use inline SVG schematics
derived from the Compose structure, copy, layout metrics and product model.

Why:

- The Android project is present but this iOS-hosted environment has no JVM,
  Android SDK, emulator, ADB or QEMU. A real emulator recording cannot be run
  here; `java`, `adb`, `emulator` and `sdkmanager` are absent.
- The previous site used a mix of stale/partial captures from `docs/screenshots`.
  The user explicitly asked not to add those project images for now.
- The schematics are a deliberate placeholder system, labelled
  `SOURCE-DERIVED SCHEMATIC` / `IDEAL INPUT MAP / NO DEVICE CAPTURE`, so they are
  not presented as verified device captures.

The original images remain under `assets/img/` for a later replacement pass, but
no page or preload references them. When a real build/device recording is
available, the SVGs can be swapped for captured media without changing the
layout or glass component API.

### UI liquid glass

- The site navbar is a real WebGL2 glass capsule (`engine/nav.js`) around the DOM
  nav links.
- The Visual Language material stage and `/liquid-glass-lab/` are full WebGL2
  surfaces with live uniforms.
- The schematic diagrams use SVG glass fills and CSS frames; they are
  illustrations, not claimed realtime refraction. The realtime refraction is in
  the navbar, material stage and lab.

### Liquid glass upgrade (current)

The glass is not just a translucent CSS card:

- `engine/nav.js` renders the real navigation capsule with `nav-field.svg`.
- `engine/actions.js` renders the two hero CTAs as separate WebGL glass pills with
  `action-field.svg`.
- `engine/stage.js` renders the material panel over `stage-field.svg`; the panel is
  the DOM overlay, the glass body is the WebGL surface.
- `/liquid-glass-lab/` now uses drawn fields (`stage-field`, `spatial-field`,
  `nav-field`, `lab-light`) instead of any project screenshots.
- The fragment shader uses wider bevel normals, roughly 2× the previous lens
  offset, doubled chromatic split, a brighter rim/top-edge term, a stronger
  broad sheen and a darker body for text contrast.
