#version 300 es

precision mediump float;

struct Material {
  vec3 ambient;
  vec3 diffuse;
  vec3 specular;
  float shininess;
};

struct Light {
  vec3 position;
  vec3 ambient;
  vec3 diffuse;
  vec3 specular;
};

uniform Material u_material;
uniform Light u_light;
uniform vec3 u_color;
uniform vec3 u_eyePosition;

in vec3 v_normal;
in vec3 f_position;

out vec4 outColor;

void main() {
  // ambient
  vec3 ambient = u_light.ambient * u_material.ambient;

  // diffuse
  vec3 normal = normalize(v_normal);
  vec3 lightDir = normalize(u_light.position - f_position);
  float diff = max(dot(normal, lightDir), 0.0);
  vec3 diffuse = u_light.diffuse * (diff * u_material.diffuse);

  // specular
  vec3 viewDir = normalize(u_eyePosition - f_position);
  vec3 reflectDir = reflect(-lightDir, normal);
  float spec = pow(max(dot(viewDir, reflectDir), 0.0), u_material.shininess);
  vec3 specular = u_light.specular * (spec * u_material.specular);

  outColor = vec4((ambient + diffuse + specular), 1.0);
}