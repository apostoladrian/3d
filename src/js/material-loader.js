'use strict';

class MaterialLoader {
  constructor() {
    this._materials = {};
  }

  getMaterial(name, options) {
    if (this._materials[name]) {
      return this._materials[name];
    } else {
      const m = new THREE.MeshPhongMaterial(options);
      this._materials[name] = m;
      return m;
    }
  }
}

const instance = new MaterialLoader();
Object.freeze(instance);

export default instance;