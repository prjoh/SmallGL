class ShaderProgram {
  constructor(gl, shaderName, vshSrc, fshSrc) {
    this.gl = gl;
    this.gl_program = this.createShaderProgram(this.gl, shaderName, vshSrc, fshSrc);
  }

  createShaderProgram(gl, shaderName, vshSrc, fshSrc) {
    var shaderProgram = null;

    var gl_vsh = gl.createShader(gl.VERTEX_SHADER);
    var gl_fsh = gl.createShader(gl.FRAGMENT_SHADER);

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
    this.gl.useProgram(this.gl_program);
  }
}

export default ShaderProgram;