/**
 * NCNSPACE Liquid Glass component descriptors.
 *
 * These are renderer-facing components, not CSS skins: every property below
 * becomes a uniform or a geometry value in the WebGL pass. A component can be
 * used by the site stage, the lab, or a future React/DOM host without changing
 * the renderer.
 */

const defaults = {
  x: 0.1, y: 0.1, w: 0.4, h: 0.2, z: 1,
  draggable: false,
};

function surface(type, material, options = {}) {
  return {
    type,
    material,
    radius: options.radius ?? 0.2,
    curvature: options.curvature ?? 3.4,
    ...defaults,
    ...options,
    material,
  };
}

export const LiquidGlassPanel = (options = {}) => surface('panel', options.material || 'titanium', {
  radius: 0.16, curvature: 3.8, z: 1, ...options,
});

export const LiquidGlassButton = (options = {}) => surface('button', options.material || 'ice', {
  radius: 0.5, curvature: 2.2, w: 0.18, h: 0.1, z: 3, ...options,
});

export const LiquidGlassNavbar = (options = {}) => surface('navbar', options.material || 'obsidian', {
  radius: 0.5, curvature: 2.3, w: 0.48, h: 0.11, z: 2, ...options,
});

export const LiquidGlassDock = (options = {}) => surface('dock', options.material || 'obsidian', {
  radius: 0.5, curvature: 2.4, w: 0.52, h: 0.095, z: 2, ...options,
});

export const LiquidGlassDialog = (options = {}) => surface('dialog', options.material || 'obsidian', {
  radius: 0.12, curvature: 3.8, w: 0.42, h: 0.3, z: 4, ...options,
});

export const LiquidGlassCard = (options = {}) => surface('card', options.material || 'crystal', {
  radius: 0.18, curvature: 3.5, w: 0.3, h: 0.3, z: 3, ...options,
});

export const LiquidGlassToggle = (options = {}) => surface('toggle', options.material || 'ice', {
  radius: 0.5, curvature: 2.1, w: 0.1, h: 0.06, z: 4, ...options,
});

export const LiquidGlassSlider = (options = {}) => surface('slider', options.material || 'obsidian', {
  radius: 0.5, curvature: 2.1, w: 0.28, h: 0.04, z: 4, ...options,
});

export const LiquidGlassPill = (options = {}) => surface('pill', options.material || 'ice', {
  radius: 0.5, curvature: 2.2, w: 0.25, h: 0.085, z: 3, ...options,
});
