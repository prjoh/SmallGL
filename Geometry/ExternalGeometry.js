import {gl} from "../main.js";
import {Geometry, ATTR_POSITION_NAME, ATTR_NORMAL_NAME, ATTR_UV_NAME} from "./Geometry.js";

class ExternalGeometry extends Geometry {
  constructor(gl_program, meshData, textureData, textureNames) {
    super(gl_program);
    this.drawMode = gl.TRIANGLES
    this.indexed = true;

    if (textureData) {
      this.createVAO(meshData, true);

      for (let i = 0; i < textureNames.length; i++) {
        this.createTexture(textureData[textureNames[i]], true, i);
      }
    } else {
      this.createVAO(meshData, false);      
    }
  }

  createVAO(meshData, setTexture) {
    this.gl_vao =  gl.createVertexArray();
 
    // Buffer vertices
    let vertices = meshData.json.meshes[0].vertices;

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
    let normals = meshData.json.meshes[0].normals;

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
      let texCoords = meshData.json.meshes[0].texturecoords[0];

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
    let indices = [].concat.apply([], meshData.json.meshes[0].faces);

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

export default ExternalGeometry;