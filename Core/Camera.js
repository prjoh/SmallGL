import {gl} from "../main.js";
import Transform from "./Transform.js";
import Utils from "./Utils.js";

class Camera {
  constructor() {
    this.fov = null;
    this.near = null;
    this.far = null;
    this.position = null;
    this.viewAt = null;
    this.up = null;
    this.pitch = 0.0;
    this.yaw = -90.0;
    this.projectionMat = new Float32Array(16); // Perspective projection matrix
    this.viewMat = new Float32Array(16);       // View Matrix
  }

  getViewProjectionMatrix() {
    let viewProjection = new Float32Array(16);

    mat4.mul(viewProjection, this.projectionMat, this.viewMat);

    return viewProjection;
  }

  getViewDirection() {
    let viewDir = vec3.create();

    vec3.sub(viewDir, this.viewAt, this.position);
    vec3.normalize(viewDir, viewDir);

    return viewDir;
  }

  update() {
    let aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;

    mat4.lookAt(this.viewMat, this.position, this.viewAt, this.up);
    mat4.perspective(this.projectionMat, this.fov, aspect, this.near, this.far);
  }

  updateRotation(x, y) {
    let xOffset = this.sensitivity * x;
    let yOffset = this.sensitivity * -y;

    this.yaw = this.yaw + xOffset;
    this.pitch = this.pitch + yOffset;

    if (this.pitch > 89.0) {
      this.pitch = 89.0;
    }
    if (this.pitch < -89.0) {
      this.pitch = -89.0;
    }

    let pitchRad = Utils.toRadians(this.pitch);
    let yawRad = Utils.toRadians(this.yaw);
    let newX = Math.cos(pitchRad) * Math.cos(yawRad);
    let newY = Math.sin(pitchRad);
    let newZ = Math.cos(pitchRad) * Math.sin(yawRad);
    let viewDir = [newX, newY, newZ];
    
    vec3.add(this.viewAt, this.position, viewDir);
  }

  updatePosition(dir, speed) {
    if (dir == "forward") {
      let viewDir = this.getViewDirection();
      vec3.scaleAndAdd(this.position, this.position, viewDir, speed);
      vec3.scaleAndAdd(this.viewAt, this.viewAt, viewDir, speed);
    }
    if (dir == "backward") {
      let viewDir = this.getViewDirection();
      vec3.scaleAndAdd(this.position, this.position, viewDir, -speed);
      vec3.scaleAndAdd(this.viewAt, this.viewAt, viewDir, -speed);

    }
    if (dir == "left") {
      let viewDir = this.getViewDirection();
      let right = vec3.create();

      vec3.cross(right, viewDir, this.up);
      vec3.normalize(right, right);

      vec3.scaleAndAdd(this.position, this.position, right, -speed);
      vec3.scaleAndAdd(this.viewAt, this.viewAt, right, -speed);
    }
    if (dir == "right") {
      let viewDir = this.getViewDirection();
      let right = vec3.create();

      vec3.cross(right, viewDir, this.up);
      vec3.normalize(right, right);

      vec3.scaleAndAdd(this.position, this.position, right, speed);
      vec3.scaleAndAdd(this.viewAt, this.viewAt, right, speed);
    }
  }
}

export default Camera;