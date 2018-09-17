'use strict';

import Floor from "./objects/floor";
import Box from './objects/box';
import CMath from "./utils/math";


class Game {
  constructor(containerID) {
    // container
    this._container = document.getElementById(containerID || 'webgl-container');

    // window size
    this._windowSize = {
      width: window.innerWidth - 5,
      height: window.innerHeight - 5
    }

    this.bindAll();


    this.initScene();
    this.addStats();
    this.setupCamera();
    this.setupLights();
    this.addObjects();
    this.setupInteraction();
    this.startRender();
  }

  bindAll() {
    this.initScene = this.initScene.bind(this);
    this.addStats = this.addStats.bind(this);
    this.setupLights = this.setupLights.bind(this);
    this.setupCamera = this.setupCamera.bind(this);
    this.startRender = this.startRender.bind(this);
    this.addObjects = this.addObjects.bind(this);
    this.render = this.render.bind(this);
    this.animateObjects = this.animateObjects.bind(this);
    this.setupInteraction = this.setupInteraction.bind(this);
  }

  setupInteraction() {
    // this._interactionEngine = new Interaction(this._camera);
    this._controls = new THREE.OrbitControls(this._camera);
    // this._controls.addEventListener('change', this.render);
  }

  initScene() {
    this._scene = new THREE.Scene();
    this._renderer = new THREE.WebGLRenderer();

    // set rendered size
    this._renderer.setSize(this._windowSize.width, this._windowSize.height);
    this._renderer.shadowMap.enabled = true;


    var axesHelper = new THREE.AxesHelper(20);
    this._scene.add(axesHelper);
    // add the renderer to the DOM
    this._container.appendChild(this._renderer.domElement);
  }

  addStats() {
    // activate stats
    this._stats = new Stats();
    this._stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(this._stats.dom);
  }

  setupLights() {
    // lights
    this._light = new THREE.AmbientLight(0xffffff, .5);
    this._scene.add(this._light);

    // let pointLight = new THREE.PointLight(0xffffff, 2, 600);
    // pointLight.position.y = 100;
    // this._scene.add(pointLight);

    let spotLight = new THREE.SpotLight(0xffffff, 2, 400);
    spotLight.angle = CMath.degreesToRads(30);
    spotLight.position.set(50,200, -50);
    spotLight.castShadow = true;
    spotLight.penumbra = 0.25;
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    // spotLight.target = THREE.Vector3(0, 0, 0);
    this._scene.add(spotLight);

    let spotLightHelper = new THREE.SpotLightHelper(spotLight);
    this._scene.add(spotLightHelper);
  }

  setupCamera() {
    // create and add camera to scene
    this._camera = new THREE.PerspectiveCamera(40, this._windowSize.width / this._windowSize.height, 1, 5000);
    this._camera.position.z = 500;
    this._camera.position.x = 500;
    this._camera.position.y = 200;
    this._scene.add(this._camera);
  }

  startRender() {
    requestAnimationFrame(this.render);
  }

  addObjects() {
    this._objects = [];

    // floor
    let floor = new Floor(1000, 1000);
    this._objects.push(floor);
    this._scene.add(floor.getMesh());

    // box
    let box = new Box(10, 10, 10);
    this._objects.push(box);
    this._scene.add(box.getMesh());
  }

  animateObjects() {
    for (let i = 0; i < this._objects.length; i++) {
      this._objects[i].animate();
    }
  }

  render() {
    if (this._stats) {
      this._stats.begin();
    }


    this.animateObjects();
    this._renderer.render(this._scene, this._camera);

    if (this._stats) {
      this._stats.end();
    }
    requestAnimationFrame(this.render);
  }

}

export default Game;