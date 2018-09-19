'use strict';
import glTFLoader from './glTFLoader';
import CMath from '../utils/math';

class Car extends glTFLoader {
  constructor(options) {
    super(options);

    this.speedFriction = this.speedFriction.bind(this);
    this._speed = options.speed || 0.1;
    this._maxSpeed = options.maxSpeed || 1;
    this._minSpeed = options.minSpeed || -0.2;
    this._speedFriction = options.speedFriction || 0.01;
    this._rotation = options.rotation || 0;
    this._speedIncrement = options.speedIncremenet || 0.15;
    this._rotationSpeed = options.rotationSpeed || 1.5;
  }

  increaseSpeed() {
    this._speed = Math.min(this._maxSpeed, this._speed + this._speedIncrement);
  }

  decreaseSpeed() {
    this._speed = Math.max(this._minSpeed, this._speed - this._speedIncrement);
  }

  turnLeft() {
    this._rotation += CMath.degreesToRads(this._rotationSpeed * this._speed);
  }

  turnRight() {
    this._rotation -= CMath.degreesToRads(this._rotationSpeed * this._speed);
  }

  speedFriction() {
    if (this._speed > 0) {
      this._speed = Math.max(0, this._speed - this._speedFriction);
    } else {
      this._speed = Math.min(0, this._speed + this._speedFriction);
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

export default Car;