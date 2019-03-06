import Program from "./Program.js";

const DEFAULT_WEBGL_2 = true;
const RENDER_HD_DPI = true;
const FPS = 60;
const FRAME_TIME = 1000/FPS;

let gl = null;
let webglVersion = null;
let program = null;

function initWebGL() {
  getWebGLContext();
  console.log('Initialized ' + webglVersion);

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);
  gl.frontFace(gl.CCW);
  gl.cullFace(gl.BACK);

  let fullscreenButton = document.getElementById('fullscreen-button');
  fullscreenButton.addEventListener("click", activateFullscreen);

  program = new Program();

  program.init(runProgram);
}

function getWebGLContext() {
  let canvas = document.getElementById('canvas-scene');

  if (DEFAULT_WEBGL_2) {
    let webgl2Supported = (typeof WebGL2RenderingContext !== 'undefined');

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

function activateFullscreen() {
  let canvas = document.getElementById('canvas-scene');

  if(canvas.webkitRequestFullScreen) {
    canvas.webkitRequestFullScreen();
   } else {
    canvas.mozRequestFullScreen();
  }
}

function runProgram() {
  let begin = Date.now();

  resizeCanvas(gl.canvas);

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  if(program.run) {
    program.update();
    program.render();

    let delay = FRAME_TIME - (Date.now() - begin);
    setTimeout(runProgram, delay);
    //requestAnimationFrame(runProgram);
  } else {
    // cleanup
  }
}

function resizeCanvas(canvas) {
  let displayWidth, displayHeight;

  if (RENDER_HD_DPI) {
    let cssToRealPixels = window.devicePixelRatio || 1;

    displayWidth  = Math.floor(canvas.clientWidth  * cssToRealPixels);
    displayHeight = Math.floor(canvas.clientHeight * cssToRealPixels);

  } else {
    displayWidth  = canvas.clientWidth;
    displayHeight = canvas.clientHeight;
  }

  if (canvas.width  !== displayWidth || canvas.height !== displayHeight) {
    canvas.width  = displayWidth;
    canvas.height = displayHeight;
  }
}

(document.body.onload=initWebGL())

export {gl as gl};