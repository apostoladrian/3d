'use strict';

import BaseModel from '../base';
import red from '../../materials/red';

class Floor extends BaseModel {
  constructor(width, height, depth) {
    super();

    this._width = width;
    this._height = height;
    this._depth = depth;

    this.loadObject();
  }

  loadObject() {
    this._mat = red;
    this._geo = new THREE.BoxBufferGeometry(this._width, this._height, this._depth);
    this._mesh = new THREE.Mesh(this._geo, this._mat);
    this._mesh.castShadow = true;

    this._mesh.position.x += this._width/2;
    this._mesh.position.y += this._height;
    this._mesh.position.z += this._depth/2;
  }

  getMesh() {
    return this._mesh;
  }

  animate() {
    this._mesh.rotation.x += .01;
    this._mesh.rotation.y += .01;
  }
}

export default Floor;