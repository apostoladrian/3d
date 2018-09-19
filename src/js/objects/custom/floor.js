'use strict';

import BaseModel from '../base';
import CMath from '../../utils/math';
import mat from '../../materials/brown';

class Floor extends BaseModel {
  constructor(width, length, wCount, lCount) {
    super();

    this._width = width;
    this._length = length;
    this._wCount = wCount;
    this._lCount = lCount;
    this._wVertices = wCount + 1;
    this._lVertices = lCount + 1;

    this.loadObject();
  }

  loadObject() {
    this._mat = mat;
    this._geo = new THREE.PlaneBufferGeometry(this._width, this._length, this._wCount, this._lCount);
    this.generateTerrain(10);


    this._mesh = new THREE.Mesh(this._geo, this._mat);
    this._mesh.receiveShadow = true;

    this._mesh.rotation.x = -CMath.degreesToRads(90);
  }

  generateTerrain(noBumps) {
    let pos = this._geo.getAttribute('position');
    let pa = pos.array;
    for (let iterator = 0; iterator < noBumps; iterator++) {
      let i = Math.round(Math.random() * this._wCount);
      let j = Math.round(Math.random() * this._lCount);
      // increase the height of that coordinate
      let index = this.verticeCoordToIndex(i, j);
      pa[index+2] = Math.random() * 10;
      console.log(`changed ${i}:${j} at index ${index} to ${pa[index+2]}`);
    }
    console.log(pa);
    pos.needsUpdate = true;
    this._geo.computeVertexNormals();
  }

  verticeIndexToCoord(index) {
    let i = Math.floor(index / this._wVertices);
    let j = index % this._wVertices;

    return [i, j];
  }

  verticeCoordToIndex(i, j) {
    let index = i * this._wVertices + j;
    return index * 3;
  }

  getMesh() {
    return this._mesh;
  }
}

export default Floor;