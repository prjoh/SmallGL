#version 300 es

precision mediump float;

uniform mat4 u_viewProjMat;
uniform mat4 u_modelMat;

in vec3 a_position;
in vec2 a_texCoord;

out vec2 v_texCoord;

void main() {
  v_texCoord = a_texCoord;
  gl_Position = u_viewProjMat * u_modelMat * vec4(a_position, 1.0);
}