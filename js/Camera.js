import Transform from "./Transform.js";

class Camera {
  constructor(fov, aspect, near, far, position, viewAt, up) {
    this.fov = fov;
    this.near = near;
    this.far = far;
    this.position = position;
    this.viewAt = viewAt;
    this.up = up;
    this.projectionMat = new Float32Array(16); // Perspective projection matrix: this could get updated through menu options (e.g. setting for fov)
    this.viewMat = new Float32Array(16); // View Matrix: this gets updated through input?
    this.transform = new Transform(); // Camera Model Matrix

    mat4.perspective(this.projectionMat, fov, aspect, near, far);
  }

  getViewMatrix() {
    mat4.lookAt(this.viewMat, this.position, this.viewAt, this.up);
    return this.viewMat;
  }

  getViewProjectionMatrix() {
    var viewProjection = new Float32Array(16);

    mat4.mul(viewProjection, this.projectionMat, this.getViewMatrix());

    return viewProjection;
  }

  update(aspect) {
    mat4.perspective(this.projectionMat, this.fov, aspect, this.near, this.far);
  }
}

export default Camera;