class SceneObject {
  constructor(mesh) {
    this.mesh = mesh;
    this.transform = new Transform();
  }

  setPosition(x, y, z) {
    this.transform.setPosition(x, y, z);
  }
}

export default SceneObject;