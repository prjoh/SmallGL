#version 300 es

precision mediump float;

struct Light {
    vec3 position;
  
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
};

uniform Light u_light;
uniform mat4 u_modelViewProjMat;
uniform mat4 u_modelViewMat;
uniform mat4 u_viewMat;
uniform mat3 u_normalMat;

in vec3 a_position;
in vec3 a_normal;
in vec2 a_texCoord;

out vec2 v_texCoord;
out vec3 v_normal;
out vec3 f_position;
out vec3 v_lightPos;

void main() {
  v_normal = u_normalMat * a_normal;
  v_texCoord = a_texCoord;
  f_position = vec3(u_modelViewMat * vec4(a_position, 1.0));
  v_lightPos = vec3(u_viewMat * vec4(u_light.position, 1.0));
  gl_Position = u_modelViewProjMat * vec4(a_position, 1.0);
}