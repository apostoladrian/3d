'use strict';

import defaultModelPath from '../objects/cerberus/Cerberus.obj';
import defaultTexturePath from '../objects/cerberus/Cerberus_A.jpg';
import BaseModel from './base';

class Cerberus extends BaseModel {
  constructor(pathModel, pathTexture) {
    super();

    this._pathModel = pathModel || defaultModelPath;
    this._pathTexture = pathTexture || defaultTexturePath;

  }




  loadObject() {
    return new Promise((resolve, reject) => {
      let loader = new THREE.OBJLoader();
      let textureLoader = new THREE.TextureLoader().load(this._pathTexture, texture => {
        this._material = new THREE.MeshBasicMaterial({
          wireframe: false,
          map: texture
        });
        loader.load(this._pathModel, data => {
          this._mesh = data;
          this._mesh.traverse( child => {
            if (child.isMesh) {
              child.material = this._material;
            }
          });
          this._mesh.scale.set(30, 30, 30);
          resolve();
        });

      });
    });
  }

  getMesh() {
    return this._mesh;
  }
}

export default Cerberus;