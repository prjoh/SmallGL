#version 300 es

precision mediump float;

uniform mat4 u_pMat;
uniform mat4 u_vMat;
uniform mat4 u_mMat;

in vec3 a_position;

void main() {
  gl_Position = u_pMat * u_vMat * u_mMat * vec4(a_position, 1.0);
}