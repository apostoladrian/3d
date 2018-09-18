'use strict';

import Floor from "./objects/floor";
import Box from './objects/box';
import Cottage from "./objects/cottage";

import TextureLoader from './texture-loader';
import MaterialLoader from './material-loader';
import PonyCar from "./objects/oldcar";


class Game {
  constructor(containerID) {
    // container
    this._container = document.getElementById(containerID || 'webgl-container');

    // window size
    this._windowSize = {
      width: window.innerWidth - 5,
      height: window.innerHeight - 5
    }

    this.debug = {
      textureLoader: TextureLoader,
      materialLoader: MaterialLoader
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

    console.log(this._renderer.capabilities);


    var axesHelper = new THREE.AxesHelper(50);
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

    this._dirLight = new THREE.DirectionalLight(0xffffff, 1.5, 400);
    this._dirLight.position.set(400, 600, -600);
    this._dirLight.castShadow = true;
    this._dirLight.shadow.mapSize.width = Math.pow(2, 12);
    this._dirLight.shadow.mapSize.height = Math.pow(2, 12);
    this._dirLight.shadow.camera.near = 1;
    this._dirLight.shadow.camera.far = 1500;
    this._dirLight.shadow.camera.left = -300;
    this._dirLight.shadow.camera.bottom = -300;
    this._dirLight.shadow.camera.right = 300;
    this._dirLight.shadow.camera.top = 300;
    this._scene.add(this._dirLight);

    this._scene.add(new THREE.CameraHelper(this._dirLight.shadow.camera));

    // var helper = new THREE.DirectionalLightHelper(this._dirLight, 5);
    // this._scene.add(helper);

    // let spotLightHelper = new THREE.SpotLightHelper(spotLight);
    // this._scene.add(spotLightHelper);
  }

  setupCamera() {
    // create and add camera to scene
    this._camera = new THREE.PerspectiveCamera(40, this._windowSize.width / this._windowSize.height, 1, 5000);
    this._camera.position.z = 800;
    this._camera.position.x = 800;
    this._camera.position.y = 700;
    this._scene.add(this._camera);
  }

  startRender() {
    requestAnimationFrame(this.render);
  }

  addObjects() {
    this._objects = [];


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
    let ponycar = new PonyCar();
    ponycar.loadObject().then( () => {
      this._objects.push(ponycar);
      this._scene.add(ponycar.getMesh());
      ponycar.getMesh().position.set(0, 0, 0);


      this._dirLight.target = ponycar.getMesh();
    });

  }

  animateObjects() {
    for (let i = 0; i < this._objects.length; i++) {
      this._objects[i].animate();
    }
    this._dirLight.position.z += 0.2;
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