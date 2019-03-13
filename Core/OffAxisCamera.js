import {gl} from "../main.js";
import {MOUSE_SENSITIVITY} from "../Program.js"
import Transform from "./Transform.js";
import Utils from "./Utils.js";

class OffAxisCamera {
  //constructor(fov, aspect, near, far, position, viewAt, up) {
  constructor(left, right, bottom, top, near, far, position, viewAt, up) {
    let nearClipDistanceOffset = -0.01;
    let pa = [left, bottom, 0.0];
    let pb = [right, bottom, 0.0];
    let pc = [left, top, 0.0];
    let rightVec = vec3.create();
    vec3.sub(rightVec, pb, pa);
    vec3.normalize(rightVec, rightVec);
    let upVec = vec3.create();
    vec3.sub(upVec, pc, pa);
    vec3.normalize(upVec, upVec);
    let screenNormal = vec3.create();
    vec3.cross(screenNormal, rightVec, upVec);
    vec3.normalize(screenNormal, screenNormal);
    let eyePosition = position;
    let va = vec3.create();
    vec3.sub(va, pa, eyePosition);
    let vb = vec3.create();
    vec3.sub(vb, pb, eyePosition);
    let vc = vec3.create();
    vec3.sub(vc, pc, eyePosition);
    let d = vec3.dot(screenNormal, eyePosition);
    let n = near;
    let l = vec3.dot(rightVec, va)*n/d;
    let r = vec3.dot(rightVec, vb)*n/d;
    let b = vec3.dot(upVec, va)*n/d;
    let t = vec3.dot(upVec, vc)*n/d;
    let f = far;

    this.position = eyePosition;
    this.viewAt = [0.0, 0.0, 0.0];
    this.up = upVec;
    // this.device = null;
    // this.eye = null;
    // this.left = position[0] + left;
    // this.right = position[0] + right;
    // this.bottom = position[1] + bottom;
    // this.top = position[1] + top;
    // this.near = near; //distance
    // this.far = 10.0;

    // this.fov = fov;
    // this.near = near;
    // this.far = far;
    // this.position = position;
    // this.viewAt = viewAt;
    // this.up = up;
    // this.pitch = 0.0;
    // this.yaw = -90.0;
    this.projectionMat = new Float32Array(16); // Perspective projection matrix
    this.viewMat = new Float32Array(16);       // View Matrix
    //this.transform = new Transform();          // Camera Model Matrix

    this.viewMat[0] = rightVec[0];
    this.viewMat[1] = rightVec[1];
    this.viewMat[2] = rightVec[2];
    this.viewMat[3] = 0.0;
    this.viewMat[4] = upVec[0];
    this.viewMat[5] = upVec[1];
    this.viewMat[6] = upVec[2];
    this.viewMat[7] = 0.0;
    this.viewMat[8] = screenNormal[0];
    this.viewMat[9] = screenNormal[1];
    this.viewMat[10] = screenNormal[2];
    this.viewMat[11] = 0.0;
    this.viewMat[12] = -eyePosition[0];
    this.viewMat[14] = -eyePosition[1];
    this.viewMat[14] = -eyePosition[2];
    this.viewMat[15] = 1.0;
    //mat4.lookAt(this.viewMat, this.position, -eyePosition, this.up);
    //mat4.perspective(this.projectionMat, fov, aspect, near, far);
    mat4.frustum(this.projectionMat, l, r, b, t, n, f);
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

  update(pos) {
    var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;

    this.position = pos;
    //vec3.add(this.viewAt, this.position, this.getViewDirection());

    // var left = pos[0] + this.left;
    // var right = pos[0] + this.right;
    // var bottom = 0 + this.bottom;
    // var top = 0 + this.top;
    // this.near = pos[2]-0.05;

    mat4.lookAt(this.viewMat, this.position, this.viewAt, this.up);
    //mat4.perspective(this.projectionMat, this.fov, aspect, this.near, this.far);
    //mat4.frustum(this.projectionMat, left, right, bottom, top, this.near, this.far);
  }

  //updateRotation(x, lastX, y, lastY) {
  //updateRotation(x, y) {
  updateRotation(lastPosition, position) {
    var xOffset = MOUSE_SENSITIVITY * (position[0]-lastPosition[0]);
    var yOffset = MOUSE_SENSITIVITY * (lastPosition[1]-position[1]);

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
    var viewDir = [-x, y, z];
    
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