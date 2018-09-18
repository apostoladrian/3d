'use strict';

import defaultModelPath from '../external_objects/farmhouse/farmhouse_obj.obj';
import defaultTexturePath from '../external_objects/farmhouse/Farmhouse Texture.jpg';
import defaultBumpMapPath from '../external_objects/farmhouse/Farmhouse Texture Bump Map .jpg';
import BaseModel from './base';
import CMath from '../utils/math';
import TextureLoader from '../texture-loader';
import MaterialLoader from '../material-loader';

class Cottage extends BaseModel {
  constructor(pathModel, pathTexture, pathBumpMap) {
    super();

    this._pathModel = pathModel || defaultModelPath;
    this._pathTexture = pathTexture || defaultTexturePath;
    this._pathBumpMap = pathBumpMap || defaultBumpMapPath;

    this._animationDirection = 1;
    this._animationSize = Math.random() * 4 - 3;

    this.createPorchLight = this.createPorchLight.bind(this);
    this.loadObject = this.loadObject.bind(this);
    this.animate = this.animate.bind(this);
    this.getMesh = this.getMesh.bind(this);

  }

  loadObject() {
    return new Promise((resolve, reject) => {
      let loader = new THREE.OBJLoader();
      TextureLoader.loadTexture('cottage', this._pathTexture)
        .then(texture => {
          TextureLoader.loadTexture('cottageBump', this._pathBumpMap)
            .then(bumpTexture => {
              this._material = MaterialLoader.getMaterial('cottage', {
                wireframe: false,
                bumpMap: bumpTexture,
                bumpScale: 1,
                map: texture
              });

              loader.load(this._pathModel, data => {
                this._mesh = data;
                this._mesh.material = this._material;
                this._mesh.traverse(child => {
                  if (child.isMesh) {
                    child.material = this._material;
                    child.castShadow = true;
                    child.receiveShadow = true;
                  }
                });
                this._mesh.castShadow = true;
                this._mesh.rotation.y = CMath.degreesToRads(180);
                this.createPorchLight();
                resolve();
              });
            });
        });
    });
  }

  createPorchLight() {
    return;

    this._porchLight = new THREE.PointLight(0xffffff, 5, 15);
    // this._porchLight.angle = CMath.degreesToRads(30);
    this._porchLight.position.set(7, 11, -12);
    // this._porchLight.castShadow = true;
    this._mesh.add(this._porchLight);
    this._porchLight.penumbra = 0.5;
    this._porchLight.shadow.mapSize.width = 256;
    this._porchLight.shadow.mapSize.height = 256;

    // setup light target
    this._lightTarget = new THREE.Object3D();
    this._lightTarget.position.set(4, 0, -15);
    this._mesh.add(this._lightTarget);
    this._porchLight.target = this._lightTarget;


  }

  animate() {
    this._animationSize += 0.03 * this._animationDirection;
    if (this._animationSize > 1 || this._animationSize < -3) {
      this._animationDirection *= -1;
    }
    // console.log(this._animationSize);
    if (this._lightTarget) {
      this._lightTarget.position.z = -12 + this._animationSize;
    }

  }

  getMesh() {
    return this._mesh;
  }
}

export default Cottage;