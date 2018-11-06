import {gl} from "../main.js";

class Geometry {
  constructor(shaderProgram) {
    this.shaderProgram = shaderProgram;
    this.gl_vao = null;
    this.gl_textures = [];
    this.count = null;
    this.indexed = null;
  }

  setVAO() {
    gl.bindVertexArray(this.gl_vao);
  }

  unsetVAO() {
    gl.bindVertexArray(null);    
  }

  bindTextures() {
    if (this.gl_textures.length) {
      for (var i = 0; i < this.gl_textures.length; i++) {
        gl.activeTexture(gl.TEXTURE0 + i);
        gl.bindTexture(gl.TEXTURE_2D, this.gl_textures[i]);
      }
    }
  }

  unbindTextures() {
    if (this.gl_textures.length) {
      for (var i = 0; i < this.gl_textures.length; i++) {
        gl.activeTexture(gl.TEXTURE0 + i);
        gl.bindTexture(gl.TEXTURE_2D, null);
      }
    }
  }

  bufferAttrib(attribLoc, bufferType, data, drawMode, elemNum, elemType, normalized) {
    var buffer = gl.createBuffer();

    gl.bindVertexArray(this.gl_vao);
    gl.bindBuffer(bufferType, buffer);
    gl.bufferData(bufferType, new Float32Array(data), drawMode);
    gl.enableVertexAttribArray(attribLoc);
    gl.vertexAttribPointer(
      attribLoc,  // Attribute location
      elemNum,    // Number of elements per attribute
      elemType,   // Type of elements
      normalized, // Normalized data
      0,          // Size of one vertex
      0           // Offset from the beginning of one vertex to attribute
    );
    gl.bindVertexArray(null);
    gl.bindBuffer(bufferType, null);
  }

  bufferIndices(bufferType, indices, drawMode) {
    var buffer = gl.createBuffer();

    gl.bindVertexArray(this.gl_vao);
    gl.bindBuffer(bufferType, buffer);
    gl.bufferData(bufferType, new Uint16Array(indices), drawMode);
    gl.bindVertexArray(null);
    gl.bindBuffer(bufferType, null);

    this.count = indices.length;
  }

  createTexture(textureData, flipY, unit) {
    var texture = gl.createTexture();

    if (flipY) {
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    }
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(
      gl.TEXTURE_2D,     // target
      0,                 // level of detail
      gl.RGBA,           // internal format
      gl.RGBA,           // format
      gl.UNSIGNED_BYTE,  // type
      textureData        // source
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.bindTexture(gl.TEXTURE_2D, null);

    this.gl_textures.push(texture);
  }
}

export default Geometry;