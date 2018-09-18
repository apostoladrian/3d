'use strict';

class TextureLoader {
  constructor() {
    this._textures = {};
  }

  loadTexture(name, path) {
    if (this._textures[name]) {
      return Promise.resolve(this._textures[name]);
    } else {
      return new Promise( (resolve, reject) => {
        const t = new THREE.TextureLoader().load(path, texture => {
          this._textures[name] = texture;
          resolve(texture);
        });
      });
    }
  }
}

const instance = new TextureLoader();
Object.freeze(instance);

export default instance;