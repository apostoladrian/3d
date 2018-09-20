'use strict';

import Floor from "./objects/custom/floor";

const DEBUG = true;

class Game {
  constructor(containerID) {
    // container
    this._container = document.getElementById(containerID || 'webgl-container');

    this._keysDown = {};

    // window size
    this._windowSize = {
      width: window.innerWidth - 5,
      height: window.innerHeight - 5
    };

    this._objects = {};

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
    this.keyboardListener = this.keyboardListener.bind(this);
    this.processKeys = this.processKeys.bind(this);
  }

  initScene() {
    this._scene = new THREE.Scene();
    if (!DEBUG) {
      this._scene.fog = new THREE.FogExp2(0xefd1b5, 0.003);
    }

    this._renderer = new THREE.WebGLRenderer();

    // set rendered size
    this._renderer.setSize(this._windowSize.width, this._windowSize.height);
    this._renderer.shadowMap.enabled = true;

    if (DEBUG) {
      var axesHelper = new THREE.AxesHelper(50);
      this._scene.add(axesHelper);
    }
    // add the renderer to the DOM
    this._container.appendChild(this._renderer.domElement);
  }

  addStats() {
    // activate stats
    this._stats = new Stats();
    this._stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(this._stats.dom);
  }

  setupCamera() {
    // create and add camera to scene
    this._camera = new THREE.PerspectiveCamera(40, this._windowSize.width / this._windowSize.height, 1, 5000);
    this._camera.position.z = 80;
    this._camera.position.x = 80;
    this._camera.position.y = 70;
    this._camera.lookAt(0, 0, 0);
  }

  setupLights() {
    // lights
    this._light = {};
    this._light.ambient = new THREE.AmbientLight(0xffffff, 1);
    this._scene.add(this._light.ambient);

    this._light.directional = new THREE.DirectionalLight(0xffffff, 1, 300);
    this._light.directional.position.set(0, 1, 0);
    this._scene.add(this._light.directional);
  }

  addObjects() {
    // add the floor
    this._objects.floor = new Floor(200, 200, 255, 255);
    this._scene.add(this._objects.floor.getMesh());
  }

  setupInteraction() {
    if (DEBUG) {
      this._controls = new THREE.OrbitControls(this._camera);
      this._controls.enableKeys = false;
    }

    // get keyboard events
    window.onkeydown = this.keyboardListener;
    window.onkeyup = this.keyboardListener;
  }

  startRender() {
    requestAnimationFrame(this.render);
  }

  keyboardListener(ev) {
    this._keysDown[ev.keyCode] = ev.type === 'keydown';
  }

  processKeys() {
    for (let key in this._keysDown) {
      // console.log(`processing ${key} with value ${this._keysDown[key]}`);
      // console.log(typeof key);
      if (!this._keysDown[key]) continue;
      switch (key) {
        case '38': // arrow up
          break;
        case '40': // arrow down
          break;
        case '37': // arrow left
          break;
        case '39': // arrow right
          break;
      }
    }
  }

  animateObjects() {
    for (let objName in this._objects) {
      this._objects[objName].animate();
    }
  }

  render() {
    if (this._stats) {
      this._stats.begin();
    }

    this.processKeys();
    this.animateObjects();
    this._renderer.render(this._scene, this._camera);

    if (this._stats) {
      this._stats.end();
    }
    requestAnimationFrame(this.render);
  }

}

export default Game;