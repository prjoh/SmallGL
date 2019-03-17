import {gl} from "../../main.js";
import EventHandler from "../../Core/EventHandler.js";
import Utils from "../../Core/Utils.js";
import PerspectiveCamera from "../../Core/PerspectiveCamera.js";
import ResourceLoader from "../../Core/ResourceLoader.js";
import ShaderProgram from "../../Core/ShaderProgram.js";
import SceneObject from "../../Core/SceneObject.js";
import {WireframePlane, BufferGeometry} from "../../Geometry/Geometries.js";
//import {triangleVertices, cubeVertices, cubeIndices, cubeUV} from "./ProgramData.js";

/* Camera settings */
const FOV = 75;
const NEAR = 0.1;
const FAR = 1000;
const EYE = [0.0, 10.0, 15.0];
const CENTER = [0.0, 0.0, 0.0];
const UP = [0.0, 1.0, 0.0];
const CAMERA_SPEED = 0.05;
const MOUSE_SENSITIVITY = 0.1;

let planeWidth = 120;
let planeHeight = 60;
let yValues = [];

class Program {
  constructor() {
    this.camera = new PerspectiveCamera(
      Utils.toRadians(FOV),
      gl.canvas.clientplaneWidth / gl.canvas.clientHeight,
      NEAR,
      FAR,
      EYE,
      CENTER,
      UP,
      true,
      MOUSE_SENSITIVITY);
    this.shaderPrograms = {};
    this.scene = [];
    this.run = false;
  }

  init(runProgramCallback) {
    let resourcePromises = ResourceLoader
      .load([
        // Load shader files
        {type: "shader", name: "basic"},
        {type: "shader", name: "basic-tex"},
        {type: "shader", name: "phong"},
        {type: "shader", name: "phong-tex"},
        {type: "shader", name: "phong-tex-spec"},
        // Load model files
        {type: "model", name: "dragon"},
        {type: "model", name: "buddha"},
        {type: "model", name: "suzanne"},
        // Load texture files
        {type: "texture", name: "suzanne"},
        {type: "texture", name: "crate"},
        {type: "texture", name: "container"},
        {type: "texture", name: "container_specular"},
      ]);

    // Wait for all resource queries to finish
    Promise.resolve(resourcePromises)
      .then(objects => {
        let shaderObjects = {};
        let modelObjects = {};
        let imgUrlObjects = {};

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
    Object.keys(shaderObjects).forEach(key => {
      let shaderProgram = new ShaderProgram(key, shaderObjects[key].vshSrc, shaderObjects[key].fshSrc);

      this.shaderPrograms[key] = shaderProgram;
    });

    // Initialize height values for plane
    for (let z = 0; z <= planeHeight; z++) {
      yValues.push([]);
      for (let x = 0; x <= planeWidth; x++) {
        yValues[z].push(Utils.getRndFloat(0.0, 1.0));
      }
    }

    // Create wireframe plane
    let vertices = [];

    for (let z = 0; z <= planeHeight; z++) {
      for (let x = 0; x <= planeWidth; x++) {
        vertices.push(x, yValues[z][x], z);
      }
    }

    let indices = [];

    for (let j = 0; j < planeHeight; j++) {  // rows
      for (let i = 0; i < planeWidth; i++) { // columns
        let rowIndex = j * (planeWidth+1);   // index of first point in a row: multiply row with number of points per row
        let colIndex = i + rowIndex;         // column point index

        if (j % 2 == 0) {
          indices.push(colIndex, colIndex+(planeWidth+1), colIndex+(planeWidth+2), colIndex);

          if (i+1 == planeWidth) { // Add downline at the end of row
            indices.push(colIndex+1, colIndex+(planeWidth+2));
          }
        } else {
          let bwColIndexDown = 2*planeWidth + rowIndex + 1;
          let bwColIndexUp = planeWidth + rowIndex - 1;
          indices.push(bwColIndexDown - i, bwColIndexUp - i);
        }
      }

      if (j+1 == planeHeight && j % 2 != 0) { // Finish bottom of wireframe
        for (let i = 0; i < planeWidth+1; i++) {
          let lastRowIndex = (j+1) * (planeWidth+1);
          indices.push(lastRowIndex + i);
        }
      }
    }

    let plane = new SceneObject(
      "plane",
      new BufferGeometry(
        this.shaderPrograms["basic"],
        gl.LINE_STRIP,
        vertices,
        indices,
        Utils.computeNormals(vertices, indices)
      )
    );

    this.scene.push(plane);


    // Init Event Handling
    EventHandler.initEventHandling();

    // Run render loop
    this.run = true;
    runProgramCallback(gl); 
  }

  kill() {
    this.run = false;

    // Clean up scene resources
    for(let i = 0; i < this.scene.length; i++) {
      this.scene[i].cleanUp();
    }
  }

  handleEvents() {
    let mouseX = EventHandler.getMouseX();
    let mouseY = EventHandler.getMouseY();

    if (mouseX != null && mouseY != null) {
      // let x = 4 * (mouseX / gl.canvas.planeWidth * 2 - 1);
      // let y = 4 * (mouseY / gl.canvas.height * -2 + 1);
      // let z = this.camera.position[2] - 5;    
      // let viewAt = [x, y, z];

      EventHandler.setMouseX(null);
      EventHandler.setMouseY(null);

      this.camera.updateRotation(mouseX, mouseY);
    }

    if (EventHandler.getKeyW()) {
      this.camera.updatePosition("forward", CAMERA_SPEED);
    }
    if (EventHandler.getKeyA()) {
      this.camera.updatePosition("left", CAMERA_SPEED);
    }
    if (EventHandler.getKeyS()) {
      this.camera.updatePosition("backward", CAMERA_SPEED);
    }
    if (EventHandler.getKeyD()) {
      this.camera.updatePosition("right", CAMERA_SPEED);
    }
  }

  update() {
    this.handleEvents();
    this.camera.update();    

    // update yValues
    for (let z = 0; z <= planeHeight; z++) {
      for (let x = 0; x <= planeWidth; x++) {
        yValues[z][x] = Utils.getRndFloat(0.0, 1.0);
      }
    }

    this.scene.pop();

    // Create updated wireframe plane
    let vertices = [];

    for (let z = 0; z <= planeHeight; z++) {
      for (let x = 0; x <= planeWidth; x++) {
        vertices.push(x, yValues[z][x], z);
      }
    }

    let indices = [];

    for (let j = 0; j < planeHeight; j++) {  // rows
      for (let i = 0; i < planeWidth; i++) { // columns
        let rowIndex = j * (planeWidth+1);   // index of first point in a row: multiply row with number of points per row
        let colIndex = i + rowIndex;         // column point index

        if (j % 2 == 0) {
          indices.push(colIndex, colIndex+(planeWidth+1), colIndex+(planeWidth+2), colIndex);

          if (i+1 == planeWidth) { // Add downline at the end of row
            indices.push(colIndex+1, colIndex+(planeWidth+2));
          }
        } else {
          let bwColIndexDown = 2*planeWidth + rowIndex + 1;
          let bwColIndexUp = planeWidth + rowIndex - 1;
          indices.push(bwColIndexDown - i, bwColIndexUp - i);
        }
      }

      if (j+1 == planeHeight && j % 2 != 0) { // Finish bottom of wireframe
        for (let i = 0; i < planeWidth+1; i++) {
          let lastRowIndex = (j+1) * (planeWidth+1);
          indices.push(lastRowIndex + i);
        }
      }
    }

    let plane = new SceneObject(
      "plane",
      new BufferGeometry(
        this.shaderPrograms["basic"],
        gl.LINE_STRIP,
        vertices,
        indices,
        Utils.computeNormals(vertices, indices)
      )
    );

    this.scene.push(plane);

    // Perform transforms
    for (let i = 0; i < this.scene.length; i++) {
      let object = this.scene[i];

      if (object.identifier == "plane") {
        object.transform.translate([-60, 0, -45]);
      }
    }

    // Update world matrices
    for (let i = 0; i < this.scene.length; i++) {
      let object = this.scene[i];

      if (object.parentObject == null) {
        object.updateWorldMatrix();
      }
    }
  }

  render() {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    for (let i = 0; i < this.scene.length; i++) {
      let object = this.scene[i];
      let modelViewProjMat = mat4.create();
      //let modelMat = object.transform.getModelMatrix();
      let worldMatrix = object.worldMat;
      let worldViewMatrix = mat4.create();
      let normalMatrix = mat3.create();
      let shaderProgram = object.geometry.shaderProgram;

      mat4.mul(modelViewProjMat, this.camera.getViewProjectionMatrix(), worldMatrix);
      mat4.mul(worldViewMatrix, this.camera.viewMat, worldMatrix);
      mat3.normalFromMat4(normalMatrix, worldViewMatrix);

      shaderProgram.setMat4fv("u_viewProjMat", this.camera.getViewProjectionMatrix());
      shaderProgram.setMat4fv("u_modelMat", /*modelMat*/ worldMatrix);
      shaderProgram.setVec4f("u_color", [0.2, 1.0, 0.2, 1.0]);
      shaderProgram.setVec4f("u_translate", [1.0, yValues, 1.0, 1.0]);

      object.draw();
    }
  }
}

export default Program;
export {
  MOUSE_SENSITIVITY
}