function toRadians(degrees) {
  return degrees * Math.PI / 180;
}
 
function toDegrees(radians) {
  return radians * 180 / Math.PI;
}

function computeNormals(vertices, indices) {
  var normals = [];

  for (var i = 0; i < vertices.length; i++) {
    normals[i] = 0;
  }

  for (var i = 0; i < indices.length;) {
    var ia = indices[i];
    var ib = indices[i+1];
    var ic = indices[i+2];
    var a = [vertices[ia*3], vertices[ia*3+1], vertices[ia*3+2]];
    var b = [vertices[ib*3], vertices[ib*3+1], vertices[ib*3+2]];
    var c = [vertices[ic*3], vertices[ic*3+1], vertices[ic*3+2]];
    var ab = vec3.create();
    var ac = vec3.create();
    var cross = vec3.create();
    var normal = vec3.create();

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

  for (var i = 0; i < normals.length;) {
    var normal = [normals[i], normals[i+1], normals[i+2]];
    var nNormal = vec3.create();

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
  computeNormals
};