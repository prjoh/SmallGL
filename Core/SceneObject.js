import {gl} from "../main.js";
import Transform from "./Transform.js"

class SceneObject {
  constructor(id, geometry) {
    this.identifier = id;
    this.geometry = geometry;
    this.parentObject = null;
    this.children = [];
    this.transform = new Transform(); // Model Matrix
    this.worldMat = mat4.create();
  }

  cleanUp() {
    this.geometry.cleanUp();
  }

  draw() {
    let geometry = this.geometry;
    let shaderProgram = geometry.shaderProgram;
    let count = this.geometry.count;

    shaderProgram.set();
    geometry.setVAO();
    geometry.bindTextures();

    if (this.geometry.indexed) {
      gl.drawElements(geometry.drawMode, count, gl.UNSIGNED_SHORT, 0);
    } else {
      gl.drawArrays(geometry.drawMode, 0, count);
    }

    geometry.unbindTextures();
    geometry.unsetVAO();
    shaderProgram.unset();
  }

  setParent(parent) {
    if (this.parentObject) {
      let index = this.parentObject.children.indexOf(this);

      if (index >= 0) {
        this.parentObject.children.splice(index, 1);
      }
    }

    if (parent) {
      parent.children.push(this);
    }
    this.parentObject = parent;
  }

  updateWorldMatrix(parentWorldMat) {
    if (parentWorldMat) {
      mat4.mul(this.worldMat, parentWorldMat, this.transform.getModelMatrix());
    } else {
      mat4.copy(this.worldMat, this.transform.getModelMatrix());
    }

    let worldMat = this.worldMat;

    this.children.forEach(function(child) {
      child.updateWorldMatrix(worldMat);
    });
  }
}

export default SceneObject;