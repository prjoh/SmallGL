import * as glMatrix from "./gl-matrix-min.js";

class Transform {
  constructor() {
    this.translation = new Float32Array(16);
    this.rotation = new Float32Array(16);
    this.scale = new Float32Array(16);
    this.modelMat = new Float32Array(16);

    mat4.identity(this.modelMat);
  }

  // TEST THIS
  setPosition(x, y, z) {    
    this.translation[12] = x;
    this.translation[13] = y;
    this.translation[14] = z;

    mat4.mul(this.modelMat, this.modelMat, this.translation);
  }

  getPosition() {
    var position = new Float32Array(3);
    
    position[0] = this.translation[12];
    position[1] = this.translation[13];
    position[2] = this.translation[14];

    return position;
  }

  translate (translationVector) {
    mat4.fromTranslation(this.translation, translationVector);
    mat4.mul(this.modelMat, this.modelMat, this.translation);
  }

  rotate (radian, axis) {
    mat4.fromRotation(this.rotation, radian, axis);
    mat4.mul(this.modelMat, this.modelMat, this.rotation);
  }

  scale (scalingVector) {
    mat4.fromScaling(this.scale, scalingVector);
    mat4.mul(this.modelMat, this.modelMat, this.scale);
  }

  // getModelViewProjectionMat (viewMat, projectionMat) {
  //   var modelView = new Float32Array(16);
  //   var modelViewProjectionMat = new Float32Array(16);

  //   mat4.mul(modelViewMat, viewMat, this.modelMat);
  //   mat4.mul(modelViewProjectionMat, projectionMat, modelViewMat);

  //   return modelViewProjectionMat;
  // }

  // getNormalMat (viewMat) {
  //   var modelView = new Float32Array(16);
  //   var normalMat = new Float32Array(9);

  //   mat4.mul(modelViewMat, viewMat, this.modelMat);
  //   mat3.normalFromMat4(normalMat, modelViewMat);

  //   return normalMat;
  // }
}

export default Transform;