import Program1 from "./Programs/Demo_01/Program.js";
import Program2 from "./Programs/Demo_02/Program.js";
import Program3 from "./Programs/Perlin_Noise/Program.js";

const DEFAULT_WEBGL_2 = true;
const RENDER_HD_DPI = true;
const FPS = 60;
const FRAME_TIME = 1000/FPS;

let select = document.getElementById('program-select');
let gl = null;
let webglVersion = null;
let program = null;

document.body.onload = function initWebGL() {
  getWebGLContext();
  console.log('Initialized ' + webglVersion);

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);
  gl.frontFace(gl.CCW);   // We are in right-handed coordinate system
  gl.cullFace(gl.BACK);

  let fullscreenButton = document.getElementById('fullscreen-button');
  fullscreenButton.addEventListener("click", activateFullscreen);

  let programName = select.options[select.selectedIndex].innerHTML;

  program = getProgram(programName);

  program.init(runProgram);
}

select.onchange = function changeProgram() {
  if(program != null) {
    program.kill();

    //gl.canvas.width = 1;
    //gl.canvas.height = 1;
  }

  let programName = select.options[select.selectedIndex].innerHTML;

  console.log("Changing to program " + programName);

  program = getProgram(programName);

  program.init(runProgram);
}

function getProgram(programName) {
  let program = null;

  switch(programName) {
    case 'Demo_01':
      program = new Program1();
      break;
    case 'Demo_02':
      program = new Program2();
      break;
    case 'Perlin_Noise':
      program = new Program3();
      break;
    default:
      program = new Program1();
  }

  return program;
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
      /* console.log('WebGL2 not supported, falling back on WebGL.');

      gl = canvas.getContext('webgl');

      if (gl) {
      	webglVersion = 'WebGL';
      }*/
      console.log('WebGL2 not supported. Program will probably crash.');
      alert('Browser does not support WebGL 2.0.\nSupported browsers are: Firefox, Chrome');
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


export {
  gl,
  webglVersion
};