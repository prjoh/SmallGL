import * as glMatrix from "../lib/gl-matrix-min.js";
import Utils from "./Utils.js";

class Transform {
  constructor() {
    this.translation = mat4.create();
    this.rotation = mat4.create();
    this.scaling = mat4.create();
  }

  translate(translationVector) {
    mat4.fromTranslation(this.translation, translationVector);
  }

  rotate(rotationVector) {
    let radiansX = Utils.toRadians(rotationVector[0]);
    let radiansY = Utils.toRadians(rotationVector[1]);
    let radiansZ = Utils.toRadians(rotationVector[2]);

    let xRotation = new Float32Array(16);
    let yRotation = new Float32Array(16);
    let zRotation = new Float32Array(16);

    mat4.fromXRotation(xRotation, radiansX);
    mat4.fromYRotation(yRotation, radiansY);
    mat4.fromZRotation(zRotation, radiansZ);

    mat4.mul(yRotation, yRotation, xRotation);
    mat4.mul(zRotation, zRotation, yRotation);

    this.rotation = zRotation;
  }

  scale(scalingVector) {
    mat4.fromScaling(this.scaling, scalingVector);
  }

  getModelMatrix() {
    let modelMat = mat4.create();

    mat4.mul(modelMat, modelMat, this.translation);
    mat4.mul(modelMat, modelMat, this.rotation);
    mat4.mul(modelMat, modelMat, this.scaling);

    return modelMat;
  }

  getNormalMatrix (viewMat) {
    let modelViewMat = new Float32Array(16);
    let normalMat = new Float32Array(9);

    mat4.mul(modelViewMat, viewMatrix, this.modelMat);
    mat3.normalFromMat4(normalMat, modelViewMat);

    return normalMat;
  }
}

export default Transform;