import Transform from "./Transform.js";

class Camera {
  constructor(fov, aspect, near, far, position, viewAt, up) {
    this.viewAt = viewAt;
    this.up = up;
    this.projectionMat = new Float32Array(16); // Perspective projection matrix: this could get updated through menu options (e.g. setting for fov)
    this.viewMat = new Float32Array(16); // View Matrix: this gets updated through input?
    this.transform = new Transform(); // Camera Model Matrix
    //this.viewMat = new Float32Array(16); => mat4.lookAt(that.viewMat, eye, center, up);

    this.transform.setPosition(position[0], position[1], position[2]);
    mat4.perspective(this.projectionMat, fov, aspect, near, far);
  }

  getViewMatrix() {
    mat4.lookAt(this.viewMat, this.transform.getPosition(), this.viewAt, this.up);
    return this.viewMat;
  }

  updateCamera() {

  }
}

export default Camera;