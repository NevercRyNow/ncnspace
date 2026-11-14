# Third-party notices — NCNSPACE Liquid Glass Engine

The NCNSPACE site includes an original WebGL2 liquid-glass renderer. No source
code from the AGPL-3.0 WebGL project was copied into this repository.

## Studied reference

**martin65536/liquid-glass-webgl**  
<https://github.com/martin65536/liquid-glass-webgl>  
License: **GNU Affero General Public License v3.0 (AGPL-3.0)**.  
Copyright: martin65536 and contributors.

This repository was studied for its public architecture and rendering ideas:
scene FBOs, scissored 2-blit compositing, separable blur, spring/velocity
feedback and the need for continuous-curvature silhouettes. Its AGPL-3.0 source
was **not copied**, and no AGPL-licensed file is included. Direct code reuse was
rejected because this site is not distributed under AGPL-3.0. The README and
source tree were used as a specification/risk reference only.

## Apache-2.0 upstream

**Kyant0/AndroidLiquidGlass**  
<https://github.com/Kyant0/AndroidLiquidGlass>  
License: **Apache License 2.0** (copy in
`engine/licenses/AndroidLiquidGlass-APACHE-2.0.txt`).  
Copyright: Kyant and contributors.

The WebGL reference credits this project as its design source. NCNSPACE's
engine uses independent WebGL2 code; the Apache upstream is credited as the
design lineage for liquid-glass material behavior. If any Apache-licensed
material is later imported, it must retain its NOTICE and license text.

## NCNSPACE original work

The following are original NCNSPACE implementation code, not upstream copies:

- `engine/engine.js` — renderer, FBOs, scissored 2-blit compositor, input routing,
  quality tiers, disposal.
- `engine/gl-utils.js`, `engine/fbo` logic, `engine/spring.js`,
  `engine/materials.js`, `engine/components.js`.
- `engine/shaders/*.glsl` — original GLSL ES 3.00 shaders.
- `liquid-glass-lab/*` — lab UI and controls.

The engine is a focused site module, not a redistribution of the reference
project's catalog, database, navigation, or page code.
