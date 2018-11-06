#version 300 es

precision mediump float;

uniform mat4 u_viewProjMat;
uniform mat4 u_modelMat;

in vec3 a_position;

void main() {
  gl_Position = u_viewProjMat * u_modelMat * vec4(a_position, 1.0);
}