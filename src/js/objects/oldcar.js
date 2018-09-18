'use strict';
import BaseModel from './base';
import CMath from '../utils/math';

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



  getMesh() {
    return this._mesh;
  }
}

export default OldCar;