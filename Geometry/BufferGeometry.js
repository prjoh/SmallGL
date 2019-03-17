import {gl} from "../main.js";
import {Geometry, ATTR_POSITION_NAME, ATTR_NORMAL_NAME, ATTR_UV_NAME} from "./Geometry.js";

class BufferGeometry extends Geometry {
  constructor(gl_program, drawMode, vertices, indices, normals, uvCoord, textureData, textureNames) {
    super(gl_program);
    this.drawMode = drawMode;
    this.indexed = true;
    this.count = indices.length;

    if (textureData) {
      this.createVAO(vertices, normals, indices, uvCoord, true);

      for (let i = 0; i < textureNames.length; i++) {
        this.createTexture(textureData[textureNames[i]], false, i);
      }
    } else {
      this.createVAO(vertices, normals, indices, null, false);      
    }
  }

  createVAO(vertices, normals, indices, texCoords, setTexture) {
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

    if (setTexture) {
      // Buffer uv
      if (texCoords !== undefined && texCoords != null) {
        let attribLoc = gl.getAttribLocation(this.shaderProgram.gl_program, ATTR_UV_NAME);
        
        if (attribLoc != -1) {
          this.bufferAttrib(
            attribLoc,
            gl.ARRAY_BUFFER,
            texCoords,
            gl.STATIC_DRAW,
            2,
            gl.FLOAT,
            false
          );
        }
      } else {
        throw Error("UV data could not be buffered!");
      }
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

export default BufferGeometry;