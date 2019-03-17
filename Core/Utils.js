function toRadians(degrees) {
  return degrees * Math.PI / 180;
}
 
function toDegrees(radians) {
  return radians * 180 / Math.PI;
}

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min) ) + min;
}

function getRndFloat(min, max) {
  return (Math.random() * (max - min)) + min;
}

function computeNormals(vertices, indices) {
  let normals = [];

  for (let i = 0; i < vertices.length; i++) {
    normals[i] = 0;
  }

  for (let i = 0; i < indices.length;) {
    let ia = indices[i];
    let ib = indices[i+1];
    let ic = indices[i+2];
    let a = [vertices[ia*3], vertices[ia*3+1], vertices[ia*3+2]];
    let b = [vertices[ib*3], vertices[ib*3+1], vertices[ib*3+2]];
    let c = [vertices[ic*3], vertices[ic*3+1], vertices[ic*3+2]];
    let ab = vec3.create();
    let ac = vec3.create();
    let cross = vec3.create();
    let normal = vec3.create();

    vec3.sub(ab, b, a);
    vec3.sub(ac, c, a);
    vec3.cross(cross, ab, ac);

    normals[ia*3] = normals[ia*3] + cross[0];
    normals[ia*3+1] = normals[ia*3+1] + cross[1];
    normals[ia*3+2] = normals[ia*3+2] + cross[2];
    normals[ib*3] = normals[ib*3] + cross[0];
    normals[ib*3+1] = normals[ib*3+1] + cross[1];
    normals[ib*3+2] = normals[ib*3+2] + cross[2];
    normals[ic*3] = normals[ic*3] + cross[0];
    normals[ic*3+1] = normals[ic*3+1] + cross[1];
    normals[ic*3+2] = normals[ic*3+2] + cross[2];

    i = i+3;
  }

  for (let i = 0; i < normals.length;) {
    let normal = [normals[i], normals[i+1], normals[i+2]];
    let nNormal = vec3.create();

    vec3.normalize(nNormal, normal);

    normals[i] = nNormal[0];
    normals[i+1] = nNormal[1];
    normals[i+2] = nNormal[2];

    i = i+3;
  }

  return normals;
}

export default {
  toRadians,
  toDegrees,
  getRndInteger,
  getRndFloat,
  computeNormals
};