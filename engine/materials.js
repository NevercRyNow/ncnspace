export const MATERIALS = {
  obsidian: {
    label: 'Obsidian', sub: 'Graphite glass',
    tint: [0.035, 0.045, 0.065], opacity: 0.64, refraction: 0.76,
    blur: 0.64, chroma: 0.22, highlight: 0.74, shadow: 0.82,
  },
  titanium: {
    label: 'Titanium', sub: 'Cold metal glass',
    tint: [0.18, 0.19, 0.21], opacity: 0.48, refraction: 0.36,
    blur: 0.52, chroma: 0.10, highlight: 0.72, shadow: 0.76,
  },
  ice: {
    label: 'Ice', sub: 'Ice-blue glass',
    tint: [0.13, 0.27, 0.44], opacity: 0.36, refraction: 0.92,
    blur: 0.82, chroma: 0.34, highlight: 0.82, shadow: 0.58,
  },
  crystal: {
    label: 'Crystal', sub: 'Clear prism glass',
    tint: [0.56, 0.66, 0.76], opacity: 0.19, refraction: 1.24,
    blur: 0.90, chroma: 0.52, highlight: 0.95, shadow: 0.48,
  },
};

export const QUALITY = {
  high: { label: 'High quality', dpr: 2, blurScale: 0.5, blurRadius: 1.0, maxSurfaces: 10 },
  balanced: { label: 'Balanced', dpr: 1.5, blurScale: 0.45, blurRadius: 0.8, maxSurfaces: 8 },
  performance: { label: 'Performance', dpr: 1, blurScale: 0.35, blurRadius: 0.55, maxSurfaces: 6 },
  mobile: { label: 'Mobile saver', dpr: 1, blurScale: 0.3, blurRadius: 0.45, maxSurfaces: 4 },
};

export function pickQuality() {
  const mobile = matchMedia('(max-width: 720px)').matches;
  const memory = navigator.deviceMemory || 4;
  if (mobile || memory <= 2) return 'mobile';
  const dpr = window.devicePixelRatio || 1;
  if (dpr >= 2.5 || memory <= 4) return 'balanced';
  return 'high';
}

export function resolveMaterial(surface = {}) {
  const base = MATERIALS[surface.material] || MATERIALS.obsidian;
  return {
    tint: surface.tint || base.tint,
    opacity: surface.opacity ?? base.opacity,
    refraction: surface.refraction ?? base.refraction,
    blur: surface.blur ?? base.blur,
    chroma: surface.chroma ?? base.chroma,
    highlight: surface.highlight ?? base.highlight,
    shadow: surface.shadow ?? base.shadow,
  };
}
