import {gl} from "../main.js";

class ShaderProgram {
  constructor(shaderName, vshSrc, fshSrc) {
    this.gl_program = this.createShaderProgram(shaderName, vshSrc, fshSrc);
  }

  createShaderProgram(shaderName, vshSrc, fshSrc) {
    let shaderProgram = null;

    let gl_vsh = gl.createShader(gl.VERTEX_SHADER);
    let gl_fsh = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(gl_vsh, vshSrc);
    gl.shaderSource(gl_fsh, fshSrc);

    gl.compileShader(gl_vsh);
    
    if (!gl.getShaderParameter(gl_vsh, gl.COMPILE_STATUS)) {
      console.error('Error when compiling vertex shader: ' + shaderName, gl.getShaderInfoLog(gl_vsh));
      return;
    }

    gl.compileShader(gl_fsh);

    if (!gl.getShaderParameter(gl_fsh, gl.COMPILE_STATUS)) {
      console.error('Error when compiling fragment shader: ' + shaderName, gl.getShaderInfoLog(gl_fsh));
      return;
    }

    shaderProgram = gl.createProgram();

    gl.attachShader(shaderProgram, gl_vsh);
    gl.attachShader(shaderProgram, gl_fsh);
    
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      console.error('Program could not be linked.', gl.getProgramInfoLog(shaderProgram));
      return;
    }

    gl.validateProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.VALIDATE_STATUS)) {
      console.error('Program could not be validated.', gl.getProgramInfoLog(shaderProgram));
    }

    // detach and delete shader
    gl.detachShader(shaderProgram, gl_vsh);
    gl.deleteShader(gl_vsh);
    gl.detachShader(shaderProgram, gl_fsh);
    gl.deleteShader(gl_fsh);

    return shaderProgram;
  }

  deleteShaderProgram() {
    gl.deleteProgram(this.gl_program);
  }

  set() {
    gl.useProgram(this.gl_program);
  }

  unset() {
    gl.useProgram(null);
  }

  setInt(name, data) {
    this.set();
    gl.uniform1i(
      gl.getUniformLocation(this.gl_program, name),
      data
    );
    this.unset();
  }

  setFloat(name, data) {
    this.set();
    gl.uniform1f(
      gl.getUniformLocation(this.gl_program, name),
      data
    );
    this.unset();
  }

  setVec3f(name, data) {
    this.set();
    gl.uniform3f(
      gl.getUniformLocation(this.gl_program, name),
      data[0], data[1], data[2]
    );
    this.unset();
  }

  setVec4f(name, data) {
    this.set();
    gl.uniform4f(
      gl.getUniformLocation(this.gl_program, name),
      data[0], data[1], data[2], data[3]
    );
    this.unset();
  }

  setMat3fv(name, data) {
    this.set();
    gl.uniformMatrix3fv(
      gl.getUniformLocation(this.gl_program, name),
      false,
      data
    );
    this.unset(); 
  }

  setMat4fv(name, data) {
    this.set();
    gl.uniformMatrix4fv(
      gl.getUniformLocation(this.gl_program, name),
      false,
      data
    );
    this.unset();    
  }
}

export default ShaderProgram;