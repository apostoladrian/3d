'use strict';

import Floor from "./objects/old/floor";
import Cottage from "./objects/old/cottage";

import TextureLoader from './texture-loader';
import MaterialLoader from './material-loader';
// import OldCar from "./objects/old/oldcar";
import OldCar from './objects/custom/oldcar';
import Stump from './objects/custom/stump';
import Sun from "./lights/sun";

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

    this.debug = {
      textureLoader: TextureLoader,
      materialLoader: MaterialLoader
    };

    this._objects = [];

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

  setupInteraction() {
    if (DEBUG) {
      this._controls = new THREE.OrbitControls(this._camera);
      this._controls.enableKeys = false;
    }

    // get keyboard events
    window.onkeydown = this.keyboardListener;
    window.onkeyup = this.keyboardListener;
  }

  keyboardListener(ev) {
    this._keysDown[ev.keyCode] = ev.type === 'keydown';
    // console.log(`setting ${ev.keyCode} to ${this._keysDown[ev.keyCode]}`);
    //ev.preventDefault();
  }

  processKeys() {
    for (let key in this._keysDown) {
      // console.log(`processing ${key} with value ${this._keysDown[key]}`);
      // console.log(typeof key);
      if (!this._keysDown[key]) continue;
      switch (key) {
        case '38': // arrow up
          this._car.increaseSpeed();
          break;
        case '40': // arrow down
          this._car.decreaseSpeed();
          break;
        case '37': // arrow left
          this._car.turnLeft();
          break;
        case '39': // arrow right
          this._car.turnRight();
          break;
      }
    }
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

  setupLights() {
    // lights
    this._light = new THREE.AmbientLight(0xffffff, 1);
    this._scene.add(this._light);

    // let pointLight = new THREE.PointLight(0xffffff, 2, 600);
    // pointLight.position.y = 100;
    // this._scene.add(pointLight);

    // let spotLight = new THREE.SpotLight(0xffffff, 2, 400);
    // spotLight.angle = CMath.degreesToRads(30);
    // spotLight.position.set(50, 200, -50);
    // spotLight.castShadow = true;
    // spotLight.penumbra = 0.25;
    // spotLight.shadow.mapSize.width = 1024;
    // spotLight.shadow.mapSize.height = 1024;
    // // spotLight.target = THREE.Vector3(0, 0, 0);
    // this._scene.add(spotLight);

    let light = new Sun();
    this._objects.push(light);
    this._dirLight = light.getMesh();
    this._scene.add(this._dirLight);

    if (DEBUG) {
      this._scene.add(new THREE.CameraHelper(this._dirLight.shadow.camera));
    }

    // var helper = new THREE.DirectionalLightHelper(this._dirLight, 5);
    // this._scene.add(helper);

    // let spotLightHelper = new THREE.SpotLightHelper(spotLight);
    // this._scene.add(spotLightHelper);
  }

  setupCamera() {
    // create and add camera to scene
    this._camera = new THREE.PerspectiveCamera(40, this._windowSize.width / this._windowSize.height, 1, 5000);
    this._camera.position.z = 80;
    this._camera.position.x = 80;
    this._camera.position.y = 70;
    this._camera.lookAt(0, 0, 0);
  }

  startRender() {
    requestAnimationFrame(this.render);
  }

  addObjects() {
    // floor
    let floor = new Floor(10000, 10000);
    this._objects.push(floor);
    this._scene.add(floor.getMesh());


    let startX = -480;
    let startY = 0;
    let startZ = -480;
    let roadWidth = 40;
    let cottage = new Cottage();
    cottage.loadObject().then(() => {
      this._objects.push(cottage);
      this._scene.add(cottage.getMesh());
      cottage.getMesh().position.set(startX, startY, startZ);



      // add a cottage
      for (let i = 0; i < 25; i++) {
        for (let j = 0; j < 15; j++) {
          if (Math.random() > .5) continue;
          let _x = startX + i * (24.5 + roadWidth);
          let _y = startY;
          let _z = startZ + j * (52 + roadWidth);
          let c2 = cottage.getMesh().clone();
          this._scene.add(c2);
          c2.position.set(_x, _y, _z);

        }
      }

    });

    // add a ponycar
    let ponycar = new OldCar();
    this._car = ponycar;
    ponycar.loadObject().then(() => {
      this._objects.push(ponycar);
      ponycar.getMesh().position.set(0, 0, 0);

      this._cameraGroup = new THREE.Group();
      this._cameraGroup.add(this._car.getMesh());
      this._cameraGroup.add(this._camera);
      this._camera.lookAt(0, 0, 0);
      this._scene.add(this._cameraGroup);

      ponycar.setParentGroup(this._cameraGroup);

    });

    // add a stump
    let stump = new Stump();
    stump.loadObject().then(() => {
      this._objects.push(stump);
      this._scene.add(stump.getMesh());
    });

    this._stump = stump;

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