import {gl} from "../main.js";
import {MOUSE_SENSITIVITY} from "../Program.js"
import Transform from "./Transform.js";
import Utils from "./Utils.js";

class Camera {
  constructor(fov, aspect, near, far, position, viewAt, up) {
    this.fov = fov;
    this.near = near;
    this.far = far;
    this.position = position;
    this.viewAt = viewAt;
    this.up = up;
    this.pitch = 0.0;
    this.yaw = -90.0;
    this.projectionMat = new Float32Array(16); // Perspective projection matrix
    this.viewMat = new Float32Array(16);       // View Matrix
    //this.transform = new Transform();          // Camera Model Matrix

    mat4.lookAt(this.viewMat, this.position, this.viewAt, this.up);
    mat4.perspective(this.projectionMat, fov, aspect, near, far);
  }

  // getViewMatrix() {
  //   mat4.lookAt(this.viewMat, this.position, this.viewAt, this.up);
  //   return this.viewMat;
  // }

  getViewProjectionMatrix() {
    var viewProjection = new Float32Array(16);

    mat4.mul(viewProjection, this.projectionMat, this.viewMat);

    return viewProjection;
  }

  getViewDirection() {
    var viewDir = vec3.create();

    vec3.sub(viewDir, this.viewAt, this.position);
    vec3.normalize(viewDir, viewDir);

    return viewDir;
  }

  update() {
    var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;

    mat4.lookAt(this.viewMat, this.position, this.viewAt, this.up);
    mat4.perspective(this.projectionMat, this.fov, aspect, this.near, this.far);
  }

  //updateRotation(x, lastX, y, lastY) {
  updateRotation(x, y) {
    var xOffset = MOUSE_SENSITIVITY * x;
    var yOffset = MOUSE_SENSITIVITY * -y;

    this.yaw = this.yaw + xOffset;
    this.pitch = this.pitch + yOffset;

    if (this.pitch > 89.0) {
      this.pitch = 89.0;
    }
    if (this.pitch < -89.0) {
      this.pitch = -89.0;
    }

    var pitchRad = Utils.toRadians(this.pitch);
    var yawRad = Utils.toRadians(this.yaw);
    var x = Math.cos(pitchRad) * Math.cos(yawRad);
    var y = Math.sin(pitchRad);
    var z = Math.cos(pitchRad) * Math.sin(yawRad);
    var viewDir = [x, y, z];
    
    vec3.add(this.viewAt, this.position, viewDir);
  }

  updatePosition(dir, speed) {
    if (dir == "forward") {
      var viewDir = this.getViewDirection();
      vec3.scaleAndAdd(this.position, this.position, viewDir, speed);
      vec3.scaleAndAdd(this.viewAt, this.viewAt, viewDir, speed);
    }
    if (dir == "backward") {
      var viewDir = this.getViewDirection();
      vec3.scaleAndAdd(this.position, this.position, viewDir, -speed);
      vec3.scaleAndAdd(this.viewAt, this.viewAt, viewDir, -speed);

    }
    if (dir == "left") {
      var viewDir = this.getViewDirection();
      var right = vec3.create();

      vec3.cross(right, viewDir, this.up);
      vec3.normalize(right, right);

      vec3.scaleAndAdd(this.position, this.position, right, -speed);
      vec3.scaleAndAdd(this.viewAt, this.viewAt, right, -speed);
    }
    if (dir == "right") {
      var viewDir = this.getViewDirection();
      var right = vec3.create();

      vec3.cross(right, viewDir, this.up);
      vec3.normalize(right, right);

      vec3.scaleAndAdd(this.position, this.position, right, speed);
      vec3.scaleAndAdd(this.viewAt, this.viewAt, right, speed);
    }
  }
}

export default Camera;