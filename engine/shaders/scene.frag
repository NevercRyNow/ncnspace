#version 300 es
precision highp float;

uniform sampler2D uImage;
uniform vec2 uResolution;
uniform vec2 uImageSize;
uniform float uHasImage;
uniform vec3 uTop;
uniform vec3 uBottom;
uniform vec3 uAccent;
uniform vec2 uPointer;
uniform float uTime;
uniform float uLightMode;

in vec2 vUv;
out vec4 outColor;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

vec3 sampleCover(vec2 uv) {
  float screenAspect = uResolution.x / max(1.0, uResolution.y);
  float imageAspect = uImageSize.x / max(1.0, uImageSize.y);
  vec2 scale = vec2(1.0);
  if (imageAspect > screenAspect) scale = vec2(screenAspect / imageAspect, 1.0);
  else scale = vec2(1.0, imageAspect / screenAspect);
  vec2 imageUv = (uv - 0.5) * scale + 0.5;
  return texture(uImage, imageUv).rgb;
}

void main() {
  vec2 uv = vUv;
  vec3 base = mix(uBottom, uTop, smoothstep(0.0, 1.0, uv.y));

  if (uHasImage > 0.5) {
    vec3 image = sampleCover(uv);
    image *= mix(0.30, 0.94, uLightMode);
    base = mix(base, image, 0.94);
  }

  vec2 p = (uv - 0.5) * vec2(uResolution.x / max(1.0, uResolution.y), 1.0);
  vec2 pointer = (uPointer - 0.5) * 0.18;
  float haloA = exp(-length(p - vec2(-0.34, 0.18) - pointer) * 5.0);
  float haloB = exp(-length(p - vec2(0.34, -0.20) + pointer * 0.7) * 4.4);
  float core = exp(-length(p - vec2(0.27, -0.06)) * 26.0);
  base += uAccent * haloA * 0.26;
  base += uAccent * haloB * 0.18;
  base += mix(uAccent, vec3(1.0), 0.45) * pow(core, 2.0) * 0.38;

  float horizon = smoothstep(0.035, 0.0, abs(uv.y - 0.67));
  base += uAccent * horizon * 0.10;

  // Spatial ring, diagonal ice sheet and a fine technical grid give the
  // lens something real to bend without turning into a particle show.
  float ring = exp(-pow((length(p - vec2(0.02, 0.02)) - 0.42) * 24.0, 2.0));
  base += mix(uAccent, vec3(1.0), 0.28) * ring * 0.30;
  float ring2 = exp(-pow((length(p - vec2(0.72, 0.58)) - 0.22) * 30.0, 2.0));
  base += mix(uAccent, vec3(1.0), 0.18) * ring2 * 0.16;
  vec2 grid = abs(fract(uv * vec2(28.0, 18.0)) - 0.5);
  float gridLine = smoothstep(0.476, 0.5, max(grid.x, grid.y));
  base += uAccent * gridLine * 0.065;
  float vertical = exp(-pow((uv.x - 0.58) * 7.0, 2.0));
  base += uAccent * vertical * 0.035;

  float vignette = smoothstep(0.92, 0.18, length(uv - 0.5));
  base *= mix(0.72, 1.0, vignette);

  float grain = hash(floor(uv * uResolution) + uTime * 0.5) - 0.5;
  base += grain * (uLightMode > 0.5 ? 0.010 : 0.018);

  outColor = vec4(base, 1.0);
}
