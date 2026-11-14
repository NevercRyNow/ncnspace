#version 300 es
precision highp float;

uniform sampler2D uTexture;
uniform vec2 uTexel;
uniform vec2 uDirection;
uniform float uRadius;

in vec2 vUv;
out vec4 outColor;

const float W0 = 0.2270270270;
const float W1 = 0.1945945946;
const float W2 = 0.1216216216;
const float W3 = 0.0540540541;
const float W4 = 0.0162162162;

void main() {
  vec2 stepUv = uTexel * uDirection * max(0.25, uRadius);
  vec3 color = texture(uTexture, vUv).rgb * W0;
  color += texture(uTexture, vUv + stepUv * 1.0).rgb * W1;
  color += texture(uTexture, vUv - stepUv * 1.0).rgb * W1;
  color += texture(uTexture, vUv + stepUv * 2.0).rgb * W2;
  color += texture(uTexture, vUv - stepUv * 2.0).rgb * W2;
  color += texture(uTexture, vUv + stepUv * 3.0).rgb * W3;
  color += texture(uTexture, vUv - stepUv * 3.0).rgb * W3;
  color += texture(uTexture, vUv + stepUv * 4.0).rgb * W4;
  color += texture(uTexture, vUv - stepUv * 4.0).rgb * W4;
  outColor = vec4(color, 1.0);
}
