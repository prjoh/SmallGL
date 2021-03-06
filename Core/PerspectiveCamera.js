import {gl} from "../main.js";
import Camera from "./Camera.js"
import Transform from "./Transform.js";
import Utils from "./Utils.js";

class PerspectiveCamera extends Camera {
  constructor(fov, aspect, near, far, position, viewAt, up, controllable, sensitivity) {
    super();
    this.fov = fov;
    this.near = near;
    this.far = far;
    this.position = position;
    this.viewAt = viewAt;
    this.up = up;
    this.sensitivity = 1.0;

    if (controllable) {
      this.sensitivity = sensitivity;
    }

    mat4.lookAt(this.viewMat, this.position, this.viewAt, this.up);
    mat4.perspective(this.projectionMat, fov, aspect, near, far);
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

export default PerspectiveCamera;