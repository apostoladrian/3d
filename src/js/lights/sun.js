'use strict';

import BaseModel from "../objects/base";
import CMath from "../utils/math";

const rotationSpeed = 0.0001;
const radius = 800;


class Sun extends BaseModel {
  constructor() {
    super();

    this._x = 0;
    this._y = radius;
    this._z = 0;

    this._rotation = 0;
    this._angle = CMath.degreesToRads(75);


    this.init();
  }

  init() {
    this._dirLight = new THREE.DirectionalLight(0xffffff, 1.5, 400);
    this._dirLight.position.set(this._x, this._y, this._z);
    this._dirLight.castShadow = true;
    this._dirLight.shadow.mapSize.width = Math.pow(2, 12);
    this._dirLight.shadow.mapSize.height = Math.pow(2, 12);
    this._dirLight.shadow.camera.near = 1;
    this._dirLight.shadow.camera.far = 1500;
    this._dirLight.shadow.camera.left = -400;
    this._dirLight.shadow.camera.bottom = -400;
    this._dirLight.shadow.camera.right = 400;
    this._dirLight.shadow.camera.top = 400;

    this._mesh = this._dirLight;
  }

  animate() {
    this._rotation += rotationSpeed;
    this._x = radius * Math.sin(this._angle) * Math.cos(this._rotation);
    this._y = radius * Math.sin(this._angle) * Math.sin(this._rotation);
    this._z = radius * Math.cos(this._angle);

    this._dirLight.intensity = Math.max(0, this._y / radius * 2);
    this._dirLight.position.set(this._x, this._y, this._z);
  }


}

export default Sun;