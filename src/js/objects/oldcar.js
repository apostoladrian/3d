'use strict';
import BaseModel from './base';

const path = 'external_objects/old_car2/';
const defaultModelPath = 'scene.gltf';
const correctionScale = 0.04;


class PonyCar extends BaseModel {
  constructor(pathModel, pathTexture, pathBumpMap) {
    super();

    this._pathModel = pathModel || defaultModelPath;
    
    this.loadObject = this.loadObject.bind(this);
    this.animate = this.animate.bind(this);
    this.getMesh = this.getMesh.bind(this);

  }

  loadObject() {
    return new Promise((resolve, reject) => {
      let loader = new THREE.GLTFLoader();
      loader.load(path + defaultModelPath, object => {
          this._mesh = object.scene;
          if (this._mesh.traverse) {
            this._mesh.traverse(child => {
              child.castShadow = true;
            });
          }
          this._mesh.castShadow = true;
          this._mesh.scale.set(correctionScale, correctionScale, correctionScale);
          resolve();
        });
    });
  }

  animate() {
    
  }

  getMesh() {
    return this._mesh;
  }
}

export default PonyCar;