import {gl} from "../main.js";
import {ATTR_POSITION_NAME, ATTR_NORMAL_NAME, ATTR_UV_NAME} from "../Program.js"
import Geometry from "./Geometry.js";

class Plane extends Geometry {
  constructor(gl_program, center, width, height, resolution) {
    super(gl_program);
    this.indexed = true;

    //let triangles = (2*width)*(2*height);
    let y = center[1];
    let vertices = [];

    for (let z = 0; z <= height; z++) {
      for (let x = 0; x <= width; x++) {
        vertices.push(x, y, z);
      }
    }

    let indices = [];

    for (let j = 0; j < height; j++) {
      for (let i = 0; i < width; i++) {
        let row = j * (width+1);
        indices.push(i+row, i+(width+1)+row, i+(width+2)+row);
        indices.push(i+row, i+(width+2)+row, i+1+row);
      }
    }

    this.count = indices.length;

    this.createVAO(vertices, indices);
  }

  createVAO(vertices, indices) {
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

    // Buffer indices
    if (indices !== undefined && indices != null) {
      this.bufferIndices(
        gl.ELEMENT_ARRAY_BUFFER,
        indices,
        gl.STATIC_DRAW
      );
    } else {
      throw Error("Index data could not be buffered!");
    }
  }
}

export default Plane;