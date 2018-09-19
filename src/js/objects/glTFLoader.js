'use strict';
import BaseModel from './base';

class glTFLoader extends BaseModel {
  constructor(options) {
    super(options);

    this._path = options.path;
    this._modelFilename = options.modelFilename;
    this._castShadow = options.castShadow || false;
    this._startingPosition = options.startingPosition || null;
    
    // properties
    this._correctionScale = options.correctionScale || 0.1;
    
    this.loadObject = this.loadObject.bind(this);
    this.animate = this.animate.bind(this);
    this.getMesh = this.getMesh.bind(this);
    this.setCorrectionScale = this.setCorrectionScale.bind(this);
  }

  setCorrectionScale(scale) {
    this._correctionScale = scale;
    this._mesh.scale.set(this._correctionScale, this._correctionScale, this._correctionScale);
  }

  loadObject() {
    return new Promise((resolve, reject) => {
      let loader = new THREE.GLTFLoader();
      loader.load(this._path + this._modelFilename, object => {
          this._mesh = object.scene;
          this.setCorrectionScale(this._correctionScale);
          this.setShadow(this._castShadow);
          if (this._startingPosition) {
            this._mesh.position.set(this._startingPosition.x, this._startingPosition.y, this._startingPosition.z)
          }
          resolve();
        });
    });
  }

  animate() {
    return this;
  }



  getMesh() {
    return this._mesh;
  }
}

export default glTFLoader;