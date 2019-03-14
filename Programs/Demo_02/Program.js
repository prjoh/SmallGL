import {gl} from "../../main.js";
import EventHandler from "../../Core/EventHandler.js";
import Utils from "../../Core/Utils.js";
import PerspectiveCamera from "../../Core/PerspectiveCamera.js";
import ResourceLoader from "../../Core/ResourceLoader.js";
import ShaderProgram from "../../Core/ShaderProgram.js";
import SceneObject from "../../Core/SceneObject.js";
import {ExternalGeometry, Triangle, Cube, Line, Plane} from "../../Geometry/Geometries.js";
import {triangleVertices, cubeVertices, cubeIndices, cubeUV} from "./ProgramData.js";

/* Camera settings */
const FOV = 75;
const NEAR = 0.1;
const FAR = 1000;
const EYE = [2.0, 2.0, 15.0];
const CENTER = [3.0, 0.0, 0.0];
const UP = [0.0, 1.0, 0.0];
const CAMERA_SPEED = 0.05;
const MOUSE_SENSITIVITY = 0.1;

/* Object data */
let axisColor = [0, 255, 0, 1.0];
let lightColor = [1.0, 1.0, 1.0, 1.0];
let planeColor = [0.45, 0.45, 0.45, 1.0];
let triangleColor  = [Math.random(), Math.random(), Math.random(), 1.0];
let triangle2Color = [Math.random(), Math.random(), Math.random(), 1.0];

let angle = 0;
let lightMov = -25;


class Program {
  constructor() {
    this.camera = new PerspectiveCamera(
      Utils.toRadians(FOV),
      gl.canvas.clientWidth / gl.canvas.clientHeight,
      NEAR,
      FAR,
      EYE,
      CENTER,
      UP,
      true,
      MOUSE_SENSITIVITY);
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
    let shaderPrograms = {};

    Object.keys(shaderObjects).forEach(key => {
      let shaderProgram = new ShaderProgram(key, shaderObjects[key].vshSrc, shaderObjects[key].fshSrc);

      shaderPrograms[key] = shaderProgram;
    });

    let suzanne = new SceneObject(
      "suzanne",
      new ExternalGeometry(
        shaderPrograms["phong"],
        modelObjects["dragon"]
      ), 
      gl.TRIANGLES
    );
    let triangle = new SceneObject(
      "triangle_01",
      new Triangle(
        shaderPrograms["basic"],
        triangleVertices
      ),
      gl.TRIANGLES
    );
    let triangle2 = new SceneObject(
      "triangle_02",
      new Triangle(
        shaderPrograms["basic"],
        triangleVertices
      ),
      gl.TRIANGLES
    );
    let cube = new SceneObject(
      "cube",
      new Cube(
        shaderPrograms["phong-tex"],
        cubeVertices,
        Utils.computeNormals(cubeVertices, cubeIndices),
        cubeIndices,
        cubeUV,
        textureObjects,
        ["crate"]
      ),
      gl.TRIANGLES
    );
    let light = new SceneObject(
      "light",
      new Cube(
        shaderPrograms["basic"],
        cubeVertices,
        Utils.computeNormals(cubeVertices, cubeIndices),
        cubeIndices,
        cubeUV
      ),
      gl.TRIANGLES
    );
    let container = new SceneObject(
      "container",
      new Cube(
        shaderPrograms["phong-tex-spec"],
        cubeVertices,
        Utils.computeNormals(cubeVertices, cubeIndices),
        cubeIndices,
        cubeUV,
        textureObjects,
        ["container", "container_specular"]
      ),
      gl.TRIANGLES
    );
    let xAxis = new SceneObject(
      "xAxis",
      new Line(
        shaderPrograms["basic"],
        [0, 0, 0],
        [25, 0, 0]
      ),
      gl.LINES
    );
    let yAxis = new SceneObject(
      "yAxis",
      new Line(
        shaderPrograms["basic"],
        [0, 0, 0],
        [0, 25, 0]
      ),
      gl.LINES
    );
    let zAxis = new SceneObject(
      "zAxis",
      new Line(
        shaderPrograms["basic"],
        [0, 0, 0],
        [0, 0, 25]
      ),
      gl.LINES
    );
    let plane = new SceneObject(
      "plane",
      new Plane(
        shaderPrograms["basic"],
        [0, 0, 0],  // center of plane
        60,         // width: 1 unit on xAxis (world coordinates)
        30,         // height: 1 unit on yAxis (world coordinates)
        25          // resolution: number of triangles in w*h
      ),
      gl.TRIANGLES
    );

    triangle2.setParent(triangle);

    // Add objects to scene
    this.scene.push(triangle);
    this.scene.push(triangle2);
    this.scene.push(suzanne);
    this.scene.push(cube);
    this.scene.push(light);
    this.scene.push(container);
    this.scene.push(xAxis);
    this.scene.push(yAxis);
    this.scene.push(zAxis);
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

  update() {
    this.handleEvents();
    this.camera.update();

    // Perform transforms
    for (let i = 0; i < this.scene.length; i++) {
      let object = this.scene[i];

      angle = angle - 0.1;
      lightMov = lightMov + 0.001;

      if (object.identifier == "suzanne") {
        object.transform.rotate([0, -0.5*angle, 0]);
        object.transform.translate([1, 0, 5]);
        object.transform.scale([0.3, 0.3, 0.3]);
      }
      if (object.identifier == "cube") {
        object.transform.rotate([-100, 0, 0]);
        object.transform.translate([7, 2, -5]);
      }
      if (object.identifier == "light") {
        //object.transform.rotate([-120, -angle, 0]);
        object.transform.translate([3.5, 1.0, 11.0 * Math.sin(lightMov)]);
        object.transform.scale([0.1, 0.1, 0.1]);
      }
      if (object.identifier == "container") {
        object.transform.rotate([0, 0, 0]);
        object.transform.translate([10, 1.0, 0]);
      }      
      if (object.identifier == "triangle_01") {
        object.transform.rotate([0, 0, angle]);
        object.transform.translate([-1, 5, 0]);
      }
      if (object.identifier == "triangle_02") {
        object.transform.rotate([0, 0, angle]);
        object.transform.translate([0, 5, 0]);
      }
      if (object.identifier == "plane") {
        object.transform.translate([-30, 0, -15]);
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

  handleEvents() {
    let mouseX = EventHandler.getMouseX();
    let mouseY = EventHandler.getMouseY();

    if (mouseX != null && mouseY != null) {
      // let x = 4 * (mouseX / gl.canvas.width * 2 - 1);
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

      shaderProgram.setMat4fv("u_modelViewProjMat", modelViewProjMat);
      shaderProgram.setMat4fv("u_modelViewMat", worldViewMatrix);
      shaderProgram.setMat4fv("u_viewProjMat", this.camera.getViewProjectionMatrix());
      shaderProgram.setMat4fv("u_modelMat", /*modelMat*/ worldMatrix);
      shaderProgram.setMat3fv("u_normalMat", normalMatrix);
      shaderProgram.setMat4fv("u_viewMat", this.camera.viewMat);

      shaderProgram.setVec3f("u_material.ambient", [1.0, 0.5, 0.31]);
      shaderProgram.setFloat("u_material.shininess", 32.0);
      shaderProgram.setVec3f("u_light.position", [3.5, 1.0, 11.0 * Math.sin(lightMov)]);
      shaderProgram.setVec3f("u_light.ambient", [0.2, 0.2, 0.2]);
      shaderProgram.setVec3f("u_light.diffuse", [0.5, 0.5, 0.5]);
      shaderProgram.setVec3f("u_light.specular", [1.0, 1.0, 1.0]);
      shaderProgram.setVec3f("u_eyePosition", this.camera.position);

      if (object.identifier.endsWith("Axis") == true) {
        shaderProgram.setVec4f("u_color", axisColor);        
      }
      if (object.identifier == "plane") {
        shaderProgram.setVec4f("u_color", planeColor);
      }  
      if (object.identifier == "light") {
        shaderProgram.setVec4f("u_color", lightColor);
      }      
      if (object.identifier == "triangle_01") {
        shaderProgram.setVec3f("u_material.diffuse", [1.0, 0.5, 0.31]);
        shaderProgram.setVec4f("u_color", triangleColor);
      }
      if (object.identifier == "triangle_02") {
        shaderProgram.setVec3f("u_material.diffuse", [1.0, 0.5, 0.31]);
        shaderProgram.setVec4f("u_color", triangle2Color);
      }
      if (object.identifier == "container") {
        shaderProgram.setInt("u_material.diffuse", 0);
      }
      if (object.identifier == "suzanne"/* || object.identifier == "container"*/) {
        shaderProgram.setVec3f("u_material.ambient", [0.2, 0.4, 0.3]);
        shaderProgram.setVec3f("u_material.diffuse", [0.3, 1.0, 0.4]);
        shaderProgram.setVec3f("u_material.specular", [1.0, 0.5, 0.5]);
      }
      if (object.identifier == "container") {
        shaderProgram.setInt("u_material.specular", 1);        
      }

      object.draw();
    }
  }
}

export default Program;
export {
  MOUSE_SENSITIVITY
}