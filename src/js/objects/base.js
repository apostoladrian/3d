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
}

export default BaseModel;