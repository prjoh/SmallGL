import Utils from "./Utils.js";
import Camera from "./Camera.js";
import ResourceLoader from "./ResourceLoader.js";
import ShaderProgram from "./ShaderProgram.js";
import Mesh from "./Mesh.js";
import {ExternalGeometry, Triangle} from "./Geometries.js";

/* Attribute locations */
const ATTR_LOC_POSITION = 0;
const ATTR_LOC_NORMAL = 1;
const ATTR_LOC_UV = 2;

/* Camera settings */
const FOV = Utils.toRadians(75);
const NEAR = 0.1;
const FAR = 1000;
const EYE = [0.0, 0.0, 5.0];
const CENTER = [0.0, 0.0, 0.0];
const UP = [0.0, 1.0, 0.0];

/* Object data */
var positions = [
  0, 0, 2,
  0, 0.5, 2,
  0.5, 0, 2,
];

var objectColors = [
  [Math.random(), Math.random(), Math.random(), 1.0],
  [Math.random(), Math.random(), Math.random(), 1.0]
];

class Program {
  constructor(gl) {
    this.gl = gl;
    this.camera = new Camera(
      FOV,
      this.gl.canvas.clientWidth / this.gl.canvas.clientHeight,
      NEAR,
      FAR,
      EYE,
      CENTER,
      UP);
    this.scene = [];
    this.run = false;

    // this.camera.setPosition(EYE[0], EYE[1], EYE[2]); // TEST THIS
    console.log(this.camera.transform.getPosition());
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
        {type: "texture", name: "texture"},
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

    var dragonMesh = new Mesh(
      new ExternalGeometry(this.gl, modelObjects["suzanne"]), 
      shaderPrograms["basic"],
      this.gl.TRIANGLES);
    var triangle = new Mesh(
      new Triangle(this.gl, positions),
      shaderPrograms["basic"],
      this.gl.TRIANGLES);

    dragonMesh.transform.rotate(Utils.toRadians(-90), [1,0,0]);

    this.scene.push(dragonMesh);
    this.scene.push(triangle);

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
    // ...
  }

  render() {
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    // this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    for (var i = 0; i < this.scene.length; i++) {
      // DELETE
      var gl = this.scene[i].geometry.gl;
      var object = this.scene[i];

      object.shaderProgram.set();
      var colorLocation = gl.getUniformLocation(object.shaderProgram.gl_program, "u_color");
      gl.uniform4f(colorLocation, objectColors[i][0], objectColors[i][1], objectColors[i][2], objectColors[i][3]);

      object.transform.rotateZ(Utils.toRadians(-0.5));
      // Why suzanne spins around Y axis??

      var pLocation = gl.getUniformLocation(object.shaderProgram.gl_program, "u_pMat");
      var vLocation = gl.getUniformLocation(object.shaderProgram.gl_program, "u_vMat");
      var mLocation = gl.getUniformLocation(object.shaderProgram.gl_program, "u_mMat");
      gl.uniformMatrix4fv(pLocation, false, this.camera.projectionMat);
      gl.uniformMatrix4fv(vLocation, false, this.camera.getViewMatrix());
      gl.uniformMatrix4fv(mLocation, false, object.transform.modelMat);

      object.draw();
    };
  }
}

export default Program;
export { 
  ATTR_LOC_POSITION, 
  ATTR_LOC_NORMAL, 
  ATTR_LOC_UV 
}