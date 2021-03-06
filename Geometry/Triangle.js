import {gl} from "../main.js";
import {Geometry, ATTR_POSITION_NAME, ATTR_NORMAL_NAME, ATTR_UV_NAME} from "./Geometry.js";

class Triangle extends Geometry {
  constructor(gl_program, vertices) {
    super(gl_program);
    this.drawMode = gl.TRIANGLES;
    this.indexed = false;
    this.count = 3;

    this.createVAO(vertices);
  }

  createVAO(vertices) {
    this.gl_vao =  gl.createVertexArray();

    // Buffer vertices
    if (vertices !== undefined && vertices != null) {
      let attribLoc = gl.getAttribLocation(this.shaderProgram.gl_program, ATTR_POSITION_NAME);
      
      if (attribLoc != -1) {
        this.bufferAttrib(
          attribLoc,
          gl.ARRAY_BUFFER,
          vertices,
          gl.STATIC_DRAW,
          3,
          gl.FLOAT,
          false
        );
      }
    } else {
      throw Error("Position data could not be buffered!");
    }

    // let nBuffer = gl.createBuffer();

    // // Buffer normals
    // if (normals !== undefined && normals != null) {
    //   gl.bindVertexArray(this.gl_vao);
    //   gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
    //   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
    //   gl.enableVertexAttribArray(ATTR_LOC_NORMAL);
    //   gl.vertexAttribPointer(
    //     ATTR_LOC_NORMAL, // Attribute location
    //     3,                 // Number of elements per attribute
    //     gl.FLOAT,     // Type of elements
    //     gl.FALSE,     // Normalized data
    //     0,                 // Size of one vertex
    //     0                  // Offset from the beginning of one vertex to attribute
    //   );
    //   gl.bindVertexArray(null);
    //   gl.bindBuffer(gl.ARRAY_BUFFER, null);
    // } else {
    //   throw Error("Normals data could not be buffered!");
    // }

    // let iBuffer = gl.createBuffer();

    // if (indices !== undefined && indices != null) {
    //   gl.bindVertexArray(this.gl_vao);
    //   gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
    //   gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    //   gl.bindVertexArray(null);
    //   gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    //   this.count = indices.length;
    // } else {
    //   throw Error("Index data could not be buffered!");
    // }
  }
}

export default Triangle;