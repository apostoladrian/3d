'use strict';

import BaseModel from '../base';
import CMath from '../../utils/math';
import mat from '../../materials/brown';

class Floor extends BaseModel {
  constructor(width, length) {
    super();

    this._width = width;
    this._length = length;

    this.loadObject();
  }

  loadObject() {
    this._mat = mat;
    this._geo = new THREE.PlaneBufferGeometry(this._width, this._length);
    this._mesh = new THREE.Mesh(this._geo, this._mat);
    this._mesh.receiveShadow = true;

    this._mesh.rotation.x = -CMath.degreesToRads(90);
  }

  getMesh() {
    return this._mesh;
  }
}

export default Floor;