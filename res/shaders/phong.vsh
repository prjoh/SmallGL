#version 300 es

precision mediump float;

uniform mat4 u_viewProjMat;
uniform mat4 u_modelMat;
uniform mat3 u_normalMat;

in vec3 a_position;
in vec3 a_normal;

out vec3 v_normal;
out vec3 f_position;

void main() {
  v_normal = u_normalMat * a_normal;
  f_position = vec3(u_modelMat * vec4(a_position, 1.0));
  gl_Position = u_viewProjMat * u_modelMat * vec4(a_position, 1.0);
}