import {gl} from "../main.js";
import {Geometry, ATTR_POSITION_NAME, ATTR_NORMAL_NAME, ATTR_UV_NAME} from "./Geometry.js";

class WireframePlane extends Geometry {
  constructor(gl_program, center, width, height/*, resolution*/) {
    super(gl_program);
    this.drawMode = gl.LINE_STRIP;
    this.indexed = true;

    let y = center[1];
    let vertices = [];

    for (let z = 0; z <= height; z++) {
      for (let x = 0; x <= width; x++) {
        vertices.push(x, y, z);
      }
    }

    let indices = [];

    for (let j = 0; j < height; j++) {  // rows
      for (let i = 0; i < width; i++) { // columns
        let rowIndex = j * (width+1);   // index of first point in a row: multiply row with number of points per row
        let colIndex = i + rowIndex;         // column point index

        if (j % 2 == 0) {
          indices.push(colIndex, colIndex+(width+1), colIndex+(width+2), colIndex);

          if (i+1 == width) { // Add downline at the end of row
            indices.push(colIndex+1, colIndex+(width+2));
          }
        } else {
          let bwColIndexDown = 2*width + rowIndex + 1;
          let bwColIndexUp = width + rowIndex - 1;
          indices.push(bwColIndexDown - i, bwColIndexUp - i);
        }
      }

      if (j+1 == height && j % 2 != 0) { // Finish bottom of wireframe
        for (let i = 0; i < width+1; i++) {
          let lastRowIndex = (j+1) * (width+1);
          indices.push(lastRowIndex + i);
        }
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

export default WireframePlane;