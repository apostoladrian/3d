'use strict';

import BaseModel from './base';
import CMath from '../utils/math';

class ContainerMesh extends BaseModel {
  constructor(childObject, weight) {
    super();

    this._childObject = childObject;
    this._box = new THREE.Box3().setFromObject(this._childObject);
    let { x, y, z } = this._box.getSize();


    this._weight = weight;

    this._material =  new THREE.MeshBasicMaterial({
      wireframe: true,
      transparent: true,
      opacity: 1
    });

    this._mesh = new Physijs.BoxMesh(new THREE.BoxGeometry(x, y, z), this._material, this._weight);
    this._mesh.add(this._childObject);
    this._mesh.rotation.z = CMath.degreesToRads(45);
    
  }

  getMesh() {
    return this._mesh;
  }
}

export default ContainerMesh;