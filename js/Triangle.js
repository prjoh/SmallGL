import Geometry from "./Geometry.js";
import {ATTR_LOC_POSITION, ATTR_LOC_NORMAL, ATTR_LOC_UV} from "./Program.js"

class Triangle extends Geometry {
  constructor(gl, vertices) {
    super(gl);
    this.count = 3;
    this.indexed = false;

    this.createVAO(vertices);
  }

  createVAO(vertices) {
    // var vertices = object.json.meshes[0].vertices;
    // var normals = object.json.meshes[0].normals;
    // var indices = [].concat.apply([], object.json.meshes[0].faces);
    var vBuffer = this.gl.createBuffer();

    this.gl_vao =  this.gl.createVertexArray();

    // Buffer vertices
    if (vertices !== undefined && vertices != null) {
      this.gl.bindVertexArray(this.gl_vao);
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vBuffer);
      this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);
      this.gl.enableVertexAttribArray(ATTR_LOC_POSITION);
      this.gl.vertexAttribPointer(
        ATTR_LOC_POSITION, // Attribute location
        3,                 // Number of elements per attribute
        this.gl.FLOAT,     // Type of elements
        this.gl.FALSE,     // Normalized data
        0,                 // Size of one vertex
        0                  // Offset from the beginning of one vertex to attribute
      );
      this.gl.bindVertexArray(null);
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
    } else {
      throw Error("Position data could not be buffered!");
    }

    // var nBuffer = this.gl.createBuffer();

    // // Buffer normals
    // if (normals !== undefined && normals != null) {
    //   this.gl.bindVertexArray(this.gl_vao);
    //   this.gl.bindBuffer(this.gl.ARRAY_BUFFER, nBuffer);
    //   this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(normals), this.gl.STATIC_DRAW);
    //   this.gl.enableVertexAttribArray(ATTR_LOC_NORMAL);
    //   this.gl.vertexAttribPointer(
    //     ATTR_LOC_NORMAL, // Attribute location
    //     3,                 // Number of elements per attribute
    //     this.gl.FLOAT,     // Type of elements
    //     this.gl.FALSE,     // Normalized data
    //     0,                 // Size of one vertex
    //     0                  // Offset from the beginning of one vertex to attribute
    //   );
    //   this.gl.bindVertexArray(null);
    //   this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
    // } else {
    //   throw Error("Normals data could not be buffered!");
    // }

    // var iBuffer = this.gl.createBuffer();

    // if (indices !== undefined && indices != null) {
    //   this.gl.bindVertexArray(this.gl_vao);
    //   this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, iBuffer);
    //   this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), this.gl.STATIC_DRAW);
    //   this.gl.bindVertexArray(null);
    //   this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);

    //   this.count = indices.length;
    // } else {
    //   throw Error("Index data could not be buffered!");
    // }
  }
}

export default Triangle;