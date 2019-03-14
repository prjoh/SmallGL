import {gl} from "../main.js";
import Camera from "./Camera.js"
import Transform from "./Transform.js";
import Utils from "./Utils.js";

function getViewMatrix(viewMat, rightVec, upVec, screenNormal, position) {
  viewMat[0] = rightVec[0];
  viewMat[1] = rightVec[1];
  viewMat[2] = rightVec[2];
  viewMat[3] = 0.0;
  viewMat[4] = upVec[0];
  viewMat[5] = upVec[1];
  viewMat[6] = upVec[2];
  viewMat[7] = 0.0;
  viewMat[8] = screenNormal[0];
  viewMat[9] = screenNormal[1];
  viewMat[10] = screenNormal[2];
  viewMat[11] = 0.0;
  viewMat[12] = -position[0];
  viewMat[14] = -position[1];
  viewMat[14] = -position[2];
  viewMat[15] = 1.0;
}

class OffAxisCamera extends Camera {
  constructor(left, right, bottom, top, near, far, position, viewAt) {
    //let nearClipDistanceOffset = -0.01;
    
    let pa = [left, bottom, 0.0];   // position bottom left
    let pb = [right, bottom, 0.0];  // position bottom right
    let pc = [left, top, 0.0];      // position top left
    
    let rightVec = vec3.create();
    vec3.sub(rightVec, pb, pa);
    vec3.normalize(rightVec, rightVec);

    let upVec = vec3.create();
    vec3.sub(upVec, pc, pa);
    vec3.normalize(upVec, upVec);

    let screenNormal = vec3.create();
    vec3.cross(screenNormal, rightVec, upVec);
    vec3.normalize(screenNormal, screenNormal);
    
    console.log("Screen normal: " + screenNormal);

    let va = vec3.create();     // vector bottom left
    vec3.sub(va, pa, position);
    
    let vb = vec3.create();     // vector bottom right
    vec3.sub(vb, pb, position);
    
    let vc = vec3.create();     // vector top left
    vec3.sub(vc, pc, position);
    
    let d = vec3.dot(screenNormal, position);  // THIS SHOULD BE NEGATIVE??? distance from the eye to the plane of the screen
    let n = near;                              // distance from eye to near clip plane
    let l = vec3.dot(rightVec, va)*n/d;        // distance from eye to left screen edge
    let r = vec3.dot(rightVec, vb)*n/d;        // distance from eye to right screen edge
    let b = vec3.dot(upVec, va)*n/d;           // distance from eye to bottom screen edge
    let t = vec3.dot(upVec, vc)*n/d;           // distance from eye to top screen edge
    let f = far;                               // distance from eye to far clip plane

    this.position = position;
    this.viewAt = viewAt;
    this.up = upVec;

    this.viewMat = new Float32Array(16);        // View Matrix
    this.projectionMat = new Float32Array(16);  // Off axis projection

    getViewMatrix(this.viewMat, rightVec, upVec, screenNormal, position);
    mat4.frustum(this.projectionMat, l, r, b, t, n, f);
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

export default OffAxisCamera;