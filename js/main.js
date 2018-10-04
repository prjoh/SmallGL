import Program from "./Program.js";

const DEFAULT_WEBGL_2 = true;
const RENDER_HD_DPI = true;

var gl = null;
var webglVersion = null;
var program = null;

function initWebGL() {
  getWebGLContext();
  console.log('Initialized ' + webglVersion);

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);
  gl.frontFace(gl.CCW);
  gl.cullFace(gl.BACK);

  program = new Program();

  program.init(runProgram);
}

function getWebGLContext() {
  var canvas = document.getElementById('canvas');

  if (DEFAULT_WEBGL_2) {
  	var webgl2Supported = (typeof WebGL2RenderingContext !== 'undefined');

  	if (webgl2Supported) {
      gl = canvas.getContext('webgl2');

      if (gl) {
      	webglVersion = 'WebGL 2';
      }
  	}

  	if (!gl) {
      console.log('WebGL2 not supported, falling back on WebGl.');

      gl = canvas.getContext('webgl');

      if (gl) {
      	webglVersion = 'WebGL';
      }
  	}
  } else {
    gl = canvas.getContext('webgl');

    if (gl) {
      webglVersion = 'WebGL';
    }
  }

  if (!gl) {
    throw new Error('WebGL initialization failed.');
  }
}

function runProgram() {
  resizeCanvas(gl.canvas);

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  if(program.run) {
    program.update();
    program.render();

    requestAnimationFrame(runProgram);
  } else {
    // cleanup
  }
}

function resizeCanvas(canvas) {
  var displayWidth, displayHeight;

  if (RENDER_HD_DPI) {
    var cssToRealPixels = window.devicePixelRatio || 1;

    // Lookup the size the browser is displaying the canvas in CSS pixels
    // and compute a size needed to make our drawingbuffer match it in
    // device pixels.
    displayWidth  = Math.floor(canvas.clientWidth  * cssToRealPixels);
    displayHeight = Math.floor(canvas.clientHeight * cssToRealPixels);

  } else {
    // Lookup the size the browser is displaying the canvas.
    displayWidth  = canvas.clientWidth;
    displayHeight = canvas.clientHeight;
  }

  // Check if the canvas is not the same size.
  if (canvas.width  !== displayWidth ||
      canvas.height !== displayHeight) {

    // Make the canvas the same size
    canvas.width  = displayWidth;
    canvas.height = displayHeight;
  }
}

(document.body.onload=initWebGL())

export {gl as gl};