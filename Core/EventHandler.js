import {gl} from "../main.js";

var mouseInput = {
  xPos: null,
  yPos: null,
  lastX: null,
  lastY: null
};

var keyboardInput = {
  w: false,
  a: false,
  s: false,
  d: false
};

function initEventHandling() {
  mouseInput["lastX"] = gl.canvas.clientWidth / 2;
  mouseInput["lastY"] = gl.canvas.clientHeight / 2;

  gl.canvas.addEventListener('click', initEventHandlers);
}

function initEventHandlers() {
  gl.canvas.removeEventListener('click', initEventHandlers);

  document.addEventListener('keydown', onKeydownHandler, true);
  document.addEventListener('keyup', onKeyupHandler, true);

  var pointerLockSupport = 'pointerLockElement' in document ||
                           'mozPointerLockElement' in document ||
                           'webkitPointerLockElement' in document;

  if (pointerLockSupport) {
    document.addEventListener('pointerlockchange', initPointerLock);
    document.addEventListener('mozpointerlockchange', initPointerLock);
    document.addEventListener('webkitpointerlockchange', initPointerLock);

    gl.canvas.requestPointerLock = gl.canvas.requestPointerLock || gl.canvas.mozRequestPointerLock || gl.canvas.webkitRequestPointerLock;
    gl.canvas.requestPointerLock();
  } else {
    console.log("Your browser does not support pointer lock. You can still translate with WASD keys.")
  }
}

function initPointerLock(evt) {
  document.addEventListener('pointerlockchange', exitPointerLock);
  document.addEventListener('mozpointerlockchange', exitPointerLock);
  document.addEventListener('webkitpointerlockchange', exitPointerLock);
  document.addEventListener('mousemove', mouseMoveHandler);
}

function exitPointerLock(evt) {
  document.removeEventListener('pointerlockchange', exitPointerLock);
  document.removeEventListener('mozpointerlockchange', exitPointerLock);
  document.removeEventListener('webkitpointerlockchange', exitPointerLock);
  document.removeEventListener('mousemove', mouseMoveHandler);

  removeInteractionHandlers();
}

function removeInteractionHandlers() {
  document.removeEventListener('keydown', onKeydownHandler, true);
  document.removeEventListener('keyup', onKeyupHandler, true);
  gl.canvas.addEventListener('click', initEventHandlers);

  mouseInput["xPos"] = null;
  mouseInput["yPos"] = null;
  keyboardInput["w"] = false;
  keyboardInput["a"] = false;
  keyboardInput["s"] = false;
  keyboardInput["d"] = false;
}

function mouseMoveHandler(evt) {
  //mouseInput["xPos"] = evt.clientX - gl.canvas.getBoundingClientRect().left;
  //mouseInput["yPos"] = evt.clientY - gl.canvas.getBoundingClientRect().top;
  mouseInput["xPos"] = evt.movementX;
  mouseInput["yPos"] = evt.movementY;
}

function onKeydownHandler(evt) {
  var key = evt.key || evt.keyCode;

  if (key === 'Escape' || key === 'Esc' || key === 27) {
    removeInteractionHandlers();
  }

  if (key === 'KeyW' || key === 'w' || key === 87) {
    keyboardInput["w"] = true;
  }

  if (key === 'KeyA' || key === 'a' || key === 65) {
    keyboardInput["a"] = true;
  }

  if (key === 'KeyS' || key === 's' || key === 83) {
    keyboardInput["s"] = true;
  }

  if (key === 'KeyD' || key === 'd' || key === 68) {
    keyboardInput["d"] = true;
  }
}

function onKeyupHandler(evt) {
  var key = evt.key || evt.keyCode;

  if (key === 'KeyW' || key === 'w' || key === 87) {
    keyboardInput["w"] = false;
  }

  if (key === 'KeyA' || key === 'a' || key === 65) {
    keyboardInput["a"] = false;
  }

  if (key === 'KeyS' || key === 's' || key === 83) {
    keyboardInput["s"] = false;
  }

  if (key === 'KeyD' || key === 'd' || key === 68) {
    keyboardInput["d"] = false;
  }
}

function getMouseX() {
  return mouseInput["xPos"];
}

function getMouseY() {
  return mouseInput["yPos"];
}

function setMouseX(val) {
  mouseInput["xPos"] = val;
}

function setMouseY(val) {
  mouseInput["yPos"] = val;
}

function getLastX() {
  return mouseInput["lastX"];
}

function getLastY() {
  return mouseInput["lastY"];
}

function setLastX(val) {
  mouseInput["lastX"] = val;
}

function setLastY(val) {
  mouseInput["lastY"] = val;
}

function getKeyW() {
  return keyboardInput["w"];
}

function getKeyA() {
  return keyboardInput["a"];
}

function getKeyS() {
  return keyboardInput["s"];
}

function getKeyD() {
  return keyboardInput["d"];
}

export default {
  initEventHandling,
  getMouseX,
  getMouseY,
  setMouseX,
  setMouseY,
  getLastX,
  getLastY,
  setLastX,
  setLastY,
  getKeyW,
  getKeyA,
  getKeyS,
  getKeyD
};