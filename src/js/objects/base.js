'use strict';

class BaseModel {

  constructor() {
    this._mesh = null;
  }

  animate() {
    if (this._mesh) {
      // this._mesh.rotation.y += 0.01;
    }
    return this;
  }

  getSize() {
    if (this._mesh) {
      // calculate size
      var box = new THREE.Box3().setFromObject(this._mesh);
      console.log(box.min, box.max, box.getSize());
    }
  }

  getMesh() {
    return this._mesh;
  }
}

export default BaseModel;