import Utils from "./Utils.js";
import Camera from "./Camera.js";
import ResourceLoader from "./ResourceLoader.js";
import ShaderProgram from "./ShaderProgram.js";
import SceneObject from "./SceneObject.js";
import {ExternalGeometry, Triangle} from "./Geometries.js";

/* Attribute locations */
const ATTR_LOC_POSITION = 0;
const ATTR_LOC_NORMAL = 1;
const ATTR_LOC_UV = 2;

/* Camera settings */
const FOV = 75;
const NEAR = 0.1;
const FAR = 1000;
const EYE = [0.0, 0.0, 15.0];
const CENTER = [0.0, 0.0, 0.0];
const UP = [0.0, 1.0, 0.0];

/* Object data */
var positions = [
  -1, -1, 0,
  -1, 1, 0,
  1, -1, 0,
];

var objectColors = [
  [Math.random(), Math.random(), Math.random(), 1.0],
  [Math.random(), Math.random(), Math.random(), 1.0]
];

var angle = 0;


class Program {
  constructor(gl) {
    this.gl = gl;
    this.camera = new Camera(
      Utils.toRadians(FOV),
      this.gl.canvas.clientWidth / this.gl.canvas.clientHeight,
      NEAR,
      FAR,
      EYE,
      CENTER,
      UP);
    this.scene = [];
    this.run = false;

    // DEBUG
    console.log(this.camera.getViewMatrix());
    console.log(this.camera.projectionMat);
  }

  init(runProgramCallback) {
    var resourcePromises = ResourceLoader
      .load([
        // Load shader files
        {type: "shader", name: "basic"},
        // Load model files
        {type: "model", name: "dragon"},
        {type: "model", name: "buddha"},
        {type: "model", name: "suzanne"},
        // Load texture files
        {type: "texture", name: "suzanne"},
      ]);

    // Wait for all resource queries to finish
    Promise.resolve(resourcePromises)
      .then(objects => {
        var shaderObjects = {};
        var modelObjects = {};
        var textureObjects = {};

        Object.keys(objects).forEach(key => {
          if (key.charAt(0) == "s") {
            shaderObjects[key.substring(2)] = objects[key];
          } else if (key.charAt(0) == "m"){
            modelObjects[key.substring(2)] = objects[key];
          } else if (key.charAt(0) == "t"){
            textureObjects[key.substring(2)] = objects[key];
          } else {
            throw Error("Invalid resource object passed through loader.");
          }
        });

        this.setupScene(shaderObjects, modelObjects, textureObjects, runProgramCallback);
      })
      .catch(function(err){ console.log(err); });
  }

  setupScene(shaderObjects, modelObjects, textureObjects, runProgramCallback) {
    var shaderPrograms = {};

    Object.keys(shaderObjects).forEach(key => {
      var shaderProgram = new ShaderProgram(this.gl, key, shaderObjects[key].vshSrc, shaderObjects[key].fshSrc);

      shaderPrograms[key] = shaderProgram;
    });

    var dragonMesh = new SceneObject(
      new ExternalGeometry(this.gl, modelObjects["suzanne"]), 
      shaderPrograms["basic"],
      this.gl.TRIANGLES);
    var triangle = new SceneObject(
      new Triangle(this.gl, positions),
      shaderPrograms["basic"],
      this.gl.TRIANGLES);
    var triangle2 = new SceneObject(
      new Triangle(this.gl, positions),
      shaderPrograms["basic"],
      this.gl.TRIANGLES);

    // Scale, Rotate & Translate
    dragonMesh.transform.rotateX(Utils.toRadians(-90));
    dragonMesh.transform.translate([-6, 4, 6]);
    triangle.transform.translate([0, 3, -2]);
    triangle2.transform.translate([0, -3, 2]);

    //triangle2.setParent(triangle);

    // Add objects to scene
    //this.scene.push(dragonMesh);
    this.scene.push(triangle);
    this.scene.push(triangle2);

    // Run render loop
    this.run = true;
    runProgramCallback(this.gl); 
  }

  kill() {
    this.run = false;
  }

  update() {
    var canvas = this.gl.canvas;
    var aspect = canvas.clientWidth / canvas.clientHeight;

    // Perform transforms
    for (var i = 0; i < this.scene.length; i++) {
      var object = this.scene[i];

      angle = angle + Utils.toRadians(-0.5);

      object.transform.rotateZ(angle);
      object.transform.updateModelMatrix();
    }

    //this.scene[0].updateWorldMatrix();
  }

  render() {
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    var viewProjectionMat = this.camera.getViewProjectionMatrix();

    for (var i = 0; i < this.scene.length; i++) {
      var object = this.scene[i];
      var mesh = object.mesh;
      var worldMatrix = this.scene[i].worldMat;

      mesh.shaderProgram.setUniform4f("u_color", objectColors[i]);
      mesh.shaderProgram.setUniformMat4fv("u_viewProjMat", viewProjectionMat);
      mesh.shaderProgram.setUniformMat4fv("u_modelMat", object.transform.modelMat /*worldMatrix*/);

      object.draw();
    }
  }
}

export default Program;
export { 
  ATTR_LOC_POSITION, 
  ATTR_LOC_NORMAL, 
  ATTR_LOC_UV 
}