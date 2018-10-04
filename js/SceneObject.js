import {gl} from "./main.js";
import Transform from "./Transform.js"

class SceneObject {
  constructor(id, geometry, drawMode) {
    this.identifier = id;
    this.geometry = geometry;
    this.drawMode = drawMode;
    this.parentObject = null;
    this.children = [];
    this.transform = new Transform(); // Model Matrix
    this.worldMat = mat4.create();
  }

  destroy() {
    // Unbind gl resources
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    
    // Delete gl resources
    // gl.deleteTexture(that.gl_texture);
    // gl.deleteBuffer(that.gl_vertBuffer);
    // gl.deleteBuffer(that.gl_normBuffer);
    // gl.deleteBuffer(that.gl_uvBuffer);
    // gl.deleteBuffer(that.gl_ibo);
    // gl.deleteVertexArray(that.gl_vao);
  }

  draw() {
    var shaderProgram = this.geometry.shaderProgram;
    var vao = this.geometry.gl_vao;
    var texture = this.geometry.gl_texture;
    var count = this.geometry.count;

    shaderProgram.set();

    gl.bindVertexArray(vao);

    if (texture) {
      gl.bindTexture(gl.TEXTURE_2D, texture);
    }

    if (this.geometry.indexed) {
      gl.drawElements(this.drawMode, count, gl.UNSIGNED_SHORT, 0);
    } else {
      gl.drawArrays(this.drawMode, 0, count);
    }

    shaderProgram.unset();
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
}

export default SceneObject;