import Mesh from "./Mesh.js";
import Transform from "./Transform.js"

class SceneObject {
  constructor(geometry, shaderProgram, drawMode) {
    this.mesh = new Mesh(geometry, shaderProgram, drawMode);
    this.parentObject = null;
    this.children = [];
    this.transform = new Transform(); // Model Matrix
    this.worldMat = mat4.create();
  }

  setParent(parent) {
    if (this.parentObject) {
      var index = this.parentObject.children.indexOf(this);

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
      mat4.mul(this.worldMat, parentWorldMat, this.transform.modelMat);
    } else {
      mat4.copy(this.worldMat, this.transform.modelMat);
    }

    var worldMat = this.worldMat;

    this.children.forEach(function(child) {
      child.updateWorldMatrix(worldMat);
    });
  }

  draw() {
    this.mesh.draw();
  }
}

export default SceneObject;