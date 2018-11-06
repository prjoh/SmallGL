import {gl} from "../main.js";
import {ATTR_POSITION_NAME} from "../Program.js"
import Geometry from "./Geometry.js";

class Line extends Geometry {
  constructor(gl_program, p1, p2) {
    super(gl_program);
    this.count = 2;
    this.indexed = false;

    this.createVAO(p1.concat(p2));
  }

  createVAO(vertices) {
    this.gl_vao =  gl.createVertexArray();

    // Buffer vertices
    if (vertices !== undefined && vertices != null) {
      var attribLoc = gl.getAttribLocation(this.shaderProgram.gl_program, ATTR_POSITION_NAME);
      
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
  }
}

export default Line;