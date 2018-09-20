'use strict';
import BaseModel from '../base';
import CMath from '../../utils/math';

const path = 'external_objects/old_car2/';
const defaultModelPath = 'scene.gltf';
const correctionScale = 0.04;
const startingSpeed = 0.1;
const speedIncrement = 0.15;
const speedFriction = 0.01;
const maxSpeed = 1;
const minSpeed = -0.2;
const startingRotation = 0;
const rotationSpeed = 1.5;


class OldCar extends BaseModel {
  constructor(pathModel) {
    super();

    this._pathModel = pathModel || defaultModelPath;

    this.loadObject = this.loadObject.bind(this);
    this.animate = this.animate.bind(this);
    this.getMesh = this.getMesh.bind(this);
    this.speedFriction = this.speedFriction.bind(this);
    this.addHeadlights = this.addHeadlights.bind(this);

    this._speed = startingSpeed;
    this._rotation = startingRotation;

    this._parentGroup = null;
  }

  setParentGroup(group) {
    this._parentGroup = group;
  }

  loadObject() {
    return new Promise((resolve, reject) => {
      let loader = new THREE.GLTFLoader();
      loader.load(path + defaultModelPath, object => {
        this._mesh = object.scene;
        if (this._mesh.traverse) {
          this._mesh.traverse(child => {
            child.castShadow = true;
          });
        }
        this._mesh.castShadow = true;
        this._mesh.scale.set(correctionScale, correctionScale, correctionScale);

        this.addHeadlights();
        resolve();
      });
    });
  }

  increaseSpeed() {
    this._speed = Math.min(maxSpeed, this._speed + speedIncrement);
  }

  decreaseSpeed() {
    this._speed = Math.max(minSpeed, this._speed - speedIncrement);
  }

  turnLeft() {
    this._rotation += CMath.degreesToRads(rotationSpeed * this._speed);
  }

  turnRight() {
    this._rotation -= CMath.degreesToRads(rotationSpeed * this._speed);
  }

  speedFriction() {
    if (this._speed > 0) {
      this._speed = Math.max(0, this._speed - speedFriction);
    } else {
      this._speed = Math.min(0, this._speed + speedFriction);
    }
  }

  animate() {
    let obj = this._mesh;
    if (this._parentGroup) {
      obj = this._parentGroup;
    }
    obj.position.z += this._speed * Math.cos(this._rotation);
    obj.position.x += this._speed * Math.sin(this._rotation);
    this._mesh.rotation.y = this._rotation;
    this.speedFriction();
  }

  addHeadlights() {
    let objGroup = new THREE.Group();

    // light 1
    let light1 = new THREE.SpotLight(0xffffff, 6, 100);
    light1.position.set(4.3, 3.6, 12);
    light1.angle = CMath.degreesToRads(20);
    light1.penumbra = 0.3;
    light1.castShadow = true;
    // setup light target
    let t1 = new THREE.Object3D();
    t1.position.set(3.5, 0, 30);
    light1.target = t1;

    objGroup.add(light1);
    objGroup.add(t1);
    
    // light 2
    let light2 = new THREE.SpotLight(0xffffff, 6, 100);
    light2.position.set(-4.3, 3.6, 12);
    light2.angle = CMath.degreesToRads(20);
    light2.penumbra = 0.3;
    light2.castShadow = true;
    // setup light target
    let t2 = new THREE.Object3D();
    t2.position.set(-3.5, 0, 30);
    light2.target = t2;

    objGroup.add(light2);
    objGroup.add(t2);

    objGroup.add(this._mesh);

    this._mesh = objGroup;

    // var spotLightHelper = new THREE.SpotLightHelper(light1);
    // this._parentGroup.add(spotLightHelper);
  }



  getMesh() {
    return this._mesh;
  }
}

export default OldCar;