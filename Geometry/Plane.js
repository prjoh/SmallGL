import {gl} from "../main.js";
import {Geometry, ATTR_POSITION_NAME, ATTR_NORMAL_NAME, ATTR_UV_NAME} from "./Geometry.js";
import Utils from "../Core/Utils.js";

class Plane extends Geometry {
  constructor(gl_program, center, width, height/*, resolution*/) {
    super(gl_program);
    this.drawMode = gl.TRIANGLES;
    this.indexed = true;

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

    let normals = Utils.computeNormals(vertices, indices);

    this.count = indices.length;

    this.createVAO(vertices, normals, indices);
  }

  createVAO(vertices, normals, indices) {
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

    // Buffer normals
    if (normals !== undefined && normals != null) {
      let attribLoc = gl.getAttribLocation(this.shaderProgram.gl_program, ATTR_NORMAL_NAME);

      if (attribLoc != -1) {
        this.bufferAttrib(
          attribLoc,
          gl.ARRAY_BUFFER,
          normals,
          gl.STATIC_DRAW,
          3,
          gl.FLOAT,
          false
        );
      }
    } else {
      throw Error("Normals data could not be buffered!");
    }

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