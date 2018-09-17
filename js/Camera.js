import Transform from "./Transform.js";

class Camera {
  constructor(fov, aspect, near, far ) {
    this.projectionMat = new Float32Array(16);
    this.transform = new Transform();
    //this.viewMat = new Float32Array(16); => mat4.lookAt(that.viewMat, eye, center, up);

    mat4.perspective(this.projectionMat, fov, aspect, near, far);
  }

  setPosition(eyeVector) {
    this.transform.setPosition(eyeVector[0], eyeVector[1], eyeVector[2]);
  }
}

export default Camera;