import {gl} from "./main.js";
import Utils from "./Utils.js";
import Camera from "./Camera.js";
import ResourceLoader from "./ResourceLoader.js";
import ShaderProgram from "./ShaderProgram.js";
import SceneObject from "./SceneObject.js";
import {ExternalGeometry, Triangle, Cube} from "./Geometries.js";

/* Attribute names in shader */
const ATTR_POSITION_NAME = "a_position";
const ATTR_NORMAL_NAME = "a_normal";
const ATTR_UV_NAME = "a_texCoord";

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

var cubeVertices = [
  // Top
  -1.0, 1.0, -1.0,
  -1.0, 1.0, 1.0,
  1.0, 1.0, 1.0,
  1.0, 1.0, -1.0,

  // Left
  -1.0, 1.0, 1.0,
  -1.0, -1.0, 1.0,
  -1.0, -1.0, -1.0,
  -1.0, 1.0, -1.0,

  // Right
  1.0, 1.0, 1.0,
  1.0, -1.0, 1.0,
  1.0, -1.0, -1.0,
  1.0, 1.0, -1.0,

  // Front
  1.0, 1.0, 1.0,
  1.0, -1.0, 1.0,
  -1.0, -1.0, 1.0,
  -1.0, 1.0, 1.0,

  // Back
  1.0, 1.0, -1.0,
  1.0, -1.0, -1.0,
  -1.0, -1.0, -1.0,
  -1.0, 1.0, -1.0,

  // Bottom
  -1.0, -1.0, -1.0,
  -1.0, -1.0, 1.0,
  1.0, -1.0, 1.0,
  1.0, -1.0, -1.0
];

var cubeIndices = [
  // Top
  0, 1, 2,
  0, 2, 3,

  // Left
  5, 4, 6,
  6, 4, 7,

  // Right
  8, 9, 10,
  8, 10, 11,

  // Front
  13, 12, 14,
  15, 14, 12,

  // Back
  16, 17, 18,
  16, 18, 19,

  // Bottom
  21, 20, 22,
  22, 20, 23
];

var cubeUV = [
  // Top
  0, 0,
  0, 1,
  1, 1,
  1, 0,

  // Left
  0, 0,
  1, 0,
  1, 1,
  0, 1,

  // Right
  1, 1,
  0, 1,
  0, 0,
  1, 0,

  // Front
  1, 1,
  1, 0,
  0, 0,
  0, 1,

  // Back
  0, 0,
  0, 1,
  1, 1,
  1, 0,

  // Bottom
  1, 1,
  1, 0,
  0, 0,
  0, 1
];

var objectColors = [
  [Math.random(), Math.random(), Math.random(), 1.0],
  [Math.random(), Math.random(), Math.random(), 1.0],
  [Math.random(), Math.random(), Math.random(), 1.0]
];

var angle = 0;


class Program {
  constructor() {
    this.camera = new Camera(
      Utils.toRadians(FOV),
      gl.canvas.clientWidth / gl.canvas.clientHeight,
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
        {type: "shader", name: "basic-tex"},
        // Load model files
        {type: "model", name: "dragon"},
        {type: "model", name: "buddha"},
        {type: "model", name: "suzanne"},
        // Load texture files
        {type: "texture", name: "suzanne"},
        {type: "texture", name: "crate"},
      ]);

    // Wait for all resource queries to finish
    Promise.resolve(resourcePromises)
      .then(objects => {
        var shaderObjects = {};
        var modelObjects = {};
        var imgUrlObjects = {};

        Object.keys(objects).forEach(key => {
          if (key.charAt(0) == "s") {
            shaderObjects[key.substring(2)] = objects[key];
          } else if (key.charAt(0) == "m"){
            modelObjects[key.substring(2)] = objects[key];
          } else if (key.charAt(0) == "t"){
            imgUrlObjects[key.substring(2)] = objects[key];
          } else {
            throw Error("Invalid resource object passed through loader.");
          }
        });

        console.log(imgUrlObjects);
        ResourceLoader.loadImages(
          imgUrlObjects,
          this,
          this.setupScene,
          [shaderObjects, modelObjects, runProgramCallback]
        );
      })
      .catch(function(err){ console.log(err); });
  }

  setupScene(shaderObjects, modelObjects, textureObjects, runProgramCallback) {
    var shaderPrograms = {};

    Object.keys(shaderObjects).forEach(key => {
      var shaderProgram = new ShaderProgram(key, shaderObjects[key].vshSrc, shaderObjects[key].fshSrc);

      shaderPrograms[key] = shaderProgram;
    });

    var suzanne = new SceneObject(
      "suzanne",
      new ExternalGeometry(
        shaderPrograms["basic-tex"],
        modelObjects["suzanne"],
        textureObjects["suzanne"]
      ), 
      gl.TRIANGLES
    );
    var triangle = new SceneObject(
      "triangle_01",
      new Triangle(
        shaderPrograms["basic"],
        positions
      ),
      gl.TRIANGLES
    );
    // var triangle2 = new SceneObject(
    //   "triangle_02",
    //   new Triangle(
    //     shaderPrograms["basic"],
    //     positions
    //   ),
    //   gl.TRIANGLES
    // );
    var cube = new SceneObject(
      "cube",
      new Cube(
        shaderPrograms["basic-tex"],
        cubeVertices,
        cubeIndices,
        cubeUV,
        textureObjects["crate"]
      ),
      gl.TRIANGLES
    );

    //triangle2.setParent(triangle);

    // Add objects to scene
    this.scene.push(suzanne);
    this.scene.push(triangle);
    //this.scene.push(triangle2);
    this.scene.push(cube);

    // Run render loop
    this.run = true;
    runProgramCallback(gl); 
  }

  kill() {
    this.run = false;
  }

  update() {
    var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;

    this.camera.update(aspect);

    // Perform transforms
    for (var i = 0; i < this.scene.length; i++) {
      var object = this.scene[i];

      angle = angle - 0.5;

      if (object.identifier == "suzanne") {
        object.transform.rotate([-120, angle, 0]);
        object.transform.translate([-1, -1, 5]);
      }
      if (object.identifier == "cube") {
        object.transform.rotate([-120, -angle, 0]);
        object.transform.translate([5, 5, -5]);        
      }
      if (object.identifier == "triangle_01") {
        object.transform.rotate([-120, angle, 0]);
        object.transform.translate([1, 1, 5]);        
      }
    }

    //this.scene[0].updateWorldMatrix();
  }

  render() {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var viewProjectionMat = this.camera.getViewProjectionMatrix();

    for (var i = 0; i < this.scene.length; i++) {
      var object = this.scene[i];
      var modelMat = object.transform.getModelMatrix();
      //var worldMatrix = object.worldMat;
      var shaderProgram = object.geometry.shaderProgram;

      shaderProgram.setUniform4f("u_color", objectColors[i]);
      shaderProgram.setUniformMat4fv("u_viewProjMat", viewProjectionMat);
      shaderProgram.setUniformMat4fv("u_modelMat", modelMat /*worldMatrix*/);

      object.draw();
    }
  }
}

export default Program;
export { 
  ATTR_POSITION_NAME, 
  ATTR_NORMAL_NAME, 
  ATTR_UV_NAME 
}