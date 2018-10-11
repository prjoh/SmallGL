import {gl} from "./main.js";
import Geometry from "./Geometry.js";
import {ATTR_POSITION_NAME, ATTR_NORMAL_NAME, ATTR_UV_NAME} from "./Program.js"

class ExternalGeometry extends Geometry {
  constructor(gl_program, meshData, textureData, textureNames) {
    super(gl_program);
    this.indexed = true;
    
    if (textureData) {
      this.createVAO(meshData, true);

      for (var i = 0; i < textureNames.length; i++) {
        this.createTexture(textureData[textureNames[i]], true, i);
      }
    } else {
      this.createVAO(meshData, false);      
    }
  }

  createVAO(meshData, setTexture) {
    this.gl_vao =  gl.createVertexArray();
 
    // Buffer vertices
    var vertices = meshData.json.meshes[0].vertices;

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

    // Buffer normals
    var normals = meshData.json.meshes[0].normals;

    if (normals !== undefined && normals != null) {
      var attribLoc = gl.getAttribLocation(this.shaderProgram.gl_program, ATTR_NORMAL_NAME);
      
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
      var texCoords = meshData.json.meshes[0].texturecoords[0];

      if (texCoords !== undefined && texCoords != null) {
        var attribLoc = gl.getAttribLocation(this.shaderProgram.gl_program, ATTR_UV_NAME);
        
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
    var indices = [].concat.apply([], meshData.json.meshes[0].faces);

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

  // createTexture(textureData) {
  //   this.gl_texture = gl.createTexture();

  //   gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  //   // gl.activeTexture(gl.TEXTURE0);
  //   gl.bindTexture(gl.TEXTURE_2D, this.gl_texture);
  //   gl.texImage2D(
  //     gl.TEXTURE_2D,     // target
  //     0,                      // level of detail
  //     gl.RGBA,           // internal format
  //     // 1024,                        // width
  //     // 1024,                        // height
  //     // 0,                      // border
  //     gl.RGBA,           // format
  //     gl.UNSIGNED_BYTE,  // type
  //     textureData             // source
  //   );
  //   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  //   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  //   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  //   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  //   gl.bindTexture(gl.TEXTURE_2D, null);
  //   //FROM WEBGL2FUND
  //   // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  //   // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  // }
}

export default ExternalGeometry;