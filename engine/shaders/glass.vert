#version 300 es
layout(location = 0) in vec2 aPos;
uniform vec4 uQuad;
uniform vec2 uResolution;
out vec2 vPixel;

void main() {
  vec2 pixel = uQuad.xy + aPos * uQuad.zw;
  vPixel = pixel;
  vec2 clip = vec2(pixel.x / uResolution.x * 2.0 - 1.0, 1.0 - pixel.y / uResolution.y * 2.0);
  gl_Position = vec4(clip, 0.0, 1.0);
}
