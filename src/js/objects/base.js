'use strict';

class BaseModel {

  constructor(options) {
    this._parentGroup = null;
    this._mesh = null;
    if (options && options.parentGroup) {
      this.setParentGroup(options.parentGroup);
    }
  }

  setParentGroup(group) {
    this._parentGroup = group;
  }

  animate() {
    return this;
  }

  getSize() {
    if (this._mesh) {
      // calculate size
      var box = new THREE.Box3().setFromObject(this._mesh);
      console.log(box.min, box.max, box.getSize());
    }
  }

  setShadow(castShadow) {
    this._mesh.castShadow = castShadow;
    if (this._mesh.traverse) {
      this._mesh.traverse(child => {
        if (child.isMesh) {
          child.castShadow = castShadow;
        }
      });
    }
  }

  getMesh() {
    return this._mesh;
  }
}

export default BaseModel;