import Transform from "./Transform.js"

class Mesh {
  constructor(geometry, shaderProgram, drawMode) {
    this.geometry = geometry;
    this.shaderProgram = shaderProgram;
    this.drawMode = drawMode;
  }

  destroyMesh() {
    // Unbind gl resources
    this.gl.bindTexture(this.gl.TEXTURE_2D, null);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
    
    // Delete gl resources
    // this.gl.deleteTexture(that.gl_texture);
    // this.gl.deleteBuffer(that.gl_vertBuffer);
    // this.gl.deleteBuffer(that.gl_normBuffer);
    // this.gl.deleteBuffer(that.gl_uvBuffer);
    // this.gl.deleteBuffer(that.gl_ibo);
    // this.gl.deleteVertexArray(that.gl_vao);
  }

  draw() {
    var gl = this.geometry.gl;
    var vao = this.geometry.gl_vao;
    var count = this.geometry.count;

    this.shaderProgram.set();

    gl.bindVertexArray(vao);

    if (this.geometry.indexed) {
      gl.drawElements(this.drawMode, count, gl.UNSIGNED_SHORT, 0);
    } else {
      gl.drawArrays(this.drawMode, 0, count);
    }

    this.shaderProgram.unset();
  }
}

export default Mesh;