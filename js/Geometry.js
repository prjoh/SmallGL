import {gl} from "./main.js";

class Geometry {
  constructor(shaderProgram) {
    this.shaderProgram = shaderProgram;
    this.gl_vao = null;
    this.gl_texture = null;
    this.count = null;
    this.indexed = null;
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
}

export default Geometry;