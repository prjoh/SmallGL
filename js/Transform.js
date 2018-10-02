import * as glMatrix from "./gl-matrix-min.js";

class Transform {
  constructor() {
    this.translation = mat4.create();
    this.rotation = mat4.create();
    this.scaling = mat4.create();
    this.modelMat = mat4.create();
  }

  translate(translationVector) {
    mat4.identity(this.translation);
    mat4.fromTranslation(this.translation, translationVector);
  }

  rotate(radians, axis) {
    mat4.identity(this.rotation);
    mat4.fromRotation(this.rotation, radians, axis);
  }

  rotateX(radians) {
    mat4.identity(this.rotation);
    mat4.fromXRotation(this.rotation, radians);
  }

  rotateY(radians) {
    mat4.identity(this.rotation);
    mat4.fromYRotation(this.rotation, radians);
  }

  rotateZ(radians) {
    mat4.identity(this.rotation);
    mat4.fromZRotation(this.rotation, radians);
  }

  scale(scalingVector) {
    mat4.identity(this.scaling);
    mat4.fromScaling(this.scaling, scalingVector);
  }

  updateModelMatrix() {
    mat4.identity(this.modelMat);
    mat4.mul(this.modelMat, this.modelMat, this.translation);
    mat4.mul(this.modelMat, this.modelMat, this.rotation);
    mat4.mul(this.modelMat, this.modelMat, this.scaling);
  }

  getNormalMatrix (viewMat) {
    var modelViewMat = new Float32Array(16);
    var normalMat = new Float32Array(9);

    mat4.mul(modelViewMat, viewMatrix, this.modelMat);
    mat3.normalFromMat4(normalMat, modelViewMat);

    return normalMat;
  }
}

export default Transform;