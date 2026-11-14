#version 300 es
precision highp float;

uniform sampler2D uScene;
uniform sampler2D uBlur;
uniform vec2 uResolution;
uniform vec4 uShape;
uniform vec4 uQuad;
uniform vec2 uPointer;
uniform float uTime;
uniform float uPress;
uniform float uSpeed;
uniform vec3 uTint;
uniform vec3 uLightColor;
uniform float uOpacity;
uniform float uRefraction;
uniform float uBlurMix;
uniform float uChroma;
uniform float uHighlight;
uniform float uShadow;
uniform float uRadius;
uniform float uCurvature;

in vec2 vPixel;
out vec4 outColor;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

// Rounded rectangle with a superellipse corner profile.
// The higher the curvature exponent, the more the corner behaves like a
// continuous-curvature squircle rather than a circular quarter arc.
float sdGlass(vec2 p, vec2 b, float r, float n) {
  r = clamp(r, 0.0, min(b.x, b.y));
  vec2 q = abs(p) - b + r;
  vec2 qq = max(q, vec2(0.0));
  float d = pow(pow(qq.x, n) + pow(qq.y, n), 1.0 / n) - r;
  return d + min(max(q.x, q.y), 0.0);
}

float glassPotential(vec2 p, vec2 b, float n) {
  vec2 q = abs(p) / max(b, vec2(1.0));
  return pow(pow(q.x, n) + pow(q.y, n), 1.0 / n);
}

vec2 glassNormal(vec2 p, vec2 b, float n) {
  vec2 q = abs(p) / max(b, vec2(1.0));
  vec2 grad = vec2(
    n * pow(q.x, n - 1.0) / max(b.x, 1.0) * sign(p.x),
    n * pow(q.y, n - 1.0) / max(b.y, 1.0) * sign(p.y)
  );
  return normalize(grad + vec2(0.0001));
}

float AA(float d) {
  // d is already expressed in device pixels. A fixed-width smoothstep avoids
  // derivative discontinuities at the two triangle edges of the quad.
  return 1.0 - smoothstep(-0.85, 0.85, d);
}

void main() {
  vec2 shapeCenter = uShape.xy + uShape.zw * 0.5;
  vec2 halfSize = max(uShape.zw * 0.5, vec2(1.0));
  vec2 p = vPixel - shapeCenter;
  float n = max(2.0, uCurvature);
  float radius = uRadius * min(halfSize.x, halfSize.y);
  float d = sdGlass(p, halfSize, radius, n);
  float inside = AA(d);

  // Use a smooth superellipse potential for shading normals and interior
  // depth. The exact silhouette still comes from the rounded-box SDF, but the
  // interior of that SDF has a max(q.x,q.y) crease; using it for lighting
  // produced a visible diagonal line inside every panel.
  float potential = clamp(glassPotential(p, halfSize, n), 0.0, 1.5);
  float smoothDepth = max(0.0, (1.0 - potential) * min(halfSize.x, halfSize.y));
  float bevel = smoothstep(0.50, 1.0, potential);
  vec2 normal2 = glassNormal(p, halfSize, n) * bevel;
  vec3 surfaceNormal = normalize(vec3(normal2 * 0.72, 1.0));
  float insideDepth = clamp(smoothDepth, 0.0, 90.0);
  float edge = 1.0 - smoothstep(0.0, 28.0, insideDepth);
  float rim = exp(-insideDepth * 0.42) * uHighlight;

  vec2 uv = gl_FragCoord.xy / uResolution;
  vec2 pointer = (uPointer - 0.5) * vec2(1.0, -1.0);
  vec2 lightDir = normalize(vec2(0.58, 0.78) + pointer * 0.28);
  float press = clamp(uPress, 0.0, 1.0);
  float speed = clamp(uSpeed, 0.0, 1.0);

  // A lens offset driven by the shape normal. Chromatic aberration splits
  // the low-frequency channels by a small additional offset.
  vec2 lens = normal2 * uRefraction * (0.012 + edge * 0.052) * (1.0 + press * 0.30);
  vec2 chroma = normal2 * uChroma * 0.016;
  vec3 refracted;
  refracted.r = texture(uScene, clamp(uv + lens + chroma, 0.001, 0.999)).r;
  refracted.g = texture(uScene, clamp(uv + lens, 0.001, 0.999)).g;
  refracted.b = texture(uScene, clamp(uv + lens - chroma, 0.001, 0.999)).b;

  vec3 blurred = texture(uBlur, clamp(uv + lens * 0.55, 0.001, 0.999)).rgb;
  float blurWeight = clamp(uBlurMix * (0.55 + edge * 0.45), 0.0, 0.96);
  vec3 color = mix(refracted, blurred, blurWeight);

  // Material body: the tint is intentionally understated so background
  // luminance remains legible through the glass.
  float tintWeight = uOpacity * (0.12 + (1.0 - edge) * 0.20);
  color = mix(color, uTint, tintWeight);

  // Light mode needs a slightly darker body to preserve contrast.
  float bodyShade = smoothstep(0.20, 0.92, length(color));
  color *= mix(0.80, 1.03, bodyShade);

  float fresnel = pow(1.0 - clamp(surfaceNormal.z, 0.0, 1.0), 2.4);
  vec3 lightVector = normalize(vec3(lightDir * 0.52, 0.82));
  float specular = pow(max(dot(surfaceNormal, lightVector), 0.0), 30.0);
  vec3 highlight = uLightColor * (rim * 0.30 + fresnel * 0.12 + specular * 0.34);
  highlight *= 1.0 + press * 0.22;

  float rimLine = smoothstep(2.2, 0.0, abs(d)) * uHighlight;
  float topEdge = smoothstep(0.0, 1.0, -normal2.y) * rim * 0.55;
  color += uLightColor * (rimLine * 0.82 + topEdge * 0.28);
  color += uLightColor * rimLine * rimLine * 0.18;

  float inner = smoothstep(0.0, 22.0, insideDepth);
  color *= mix(0.68, 1.0, inner * 0.62 + 0.38);

  float shadowDistance = max(d, 0.0);
  float shadow = (1.0 - inside) * exp(-shadowDistance * 0.075) * uShadow * 0.55;
  float shadowOffset = smoothstep(8.0, -3.0, d);
  shadow *= shadowOffset;

  color += highlight * (1.0 - speed * 0.08);

  // Broad surface sheen: a diagonal light sweep inside the glass, not a
  // one-pixel SDF crease.
  vec2 localUv = clamp((vPixel - uShape.xy) / max(uShape.zw, vec2(1.0)), 0.0, 1.0);
  float sheen = exp(-pow((localUv.x * 0.72 + localUv.y * 0.4 - 0.58 + pointer.x * 0.04) * 3.0, 2.0));
  color += uLightColor * sheen * uHighlight * 0.20;
  color += (hash(gl_FragCoord.xy) - 0.5) * 0.010;

  float alpha = inside * (0.34 + edge * 0.36);
  vec3 glassColor = color + highlight * 0.15;
  vec4 glass = vec4(glassColor, alpha);
  vec4 shadowLayer = vec4(0.0, 0.0, 0.0, shadow);
  outColor = mix(shadowLayer, glass, inside);
}
