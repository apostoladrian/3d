'use strict';

import BaseModel from '../base';
import CMath from '../../utils/math';
import mat from '../../materials/brown';
import heightMapPath from '../../external_objects/heightmaps/iasi.png';

class Floor extends BaseModel {
  constructor(width, length, wCount, lCount) {
    super();

    this._width = width;
    this._length = length;
    this._wCount = wCount;
    this._lCount = lCount;
    this._wVertices = wCount + 1;
    this._lVertices = lCount + 1;

    this.addHeightMap = this.addHeightMap.bind(this);
    this.loadObject();

  }

  loadObject() {
    this._mat = mat;
    this._geo = new THREE.PlaneBufferGeometry(this._width, this._length, this._wCount, this._lCount);
    // this.generateTerrain(15);

    this.loadHeightmap(heightMapPath, 10).then(this.addHeightMap);
    

    this._mesh = new THREE.Mesh(this._geo, this._mat);
    this._mesh.receiveShadow = true;

    this._mesh.rotation.x = -CMath.degreesToRads(90);
  }

  loadHeightmap(path = heightMapPath, scale) {
    return new Promise( resolve => {
      let img = new Image();
      img.src = path;
      img.onload = () => {
        if (scale == undefined) scale = 1;
    
    
        let canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        let context = canvas.getContext('2d');
    
        let size = img.width * img.height;
        let data = new Float32Array(size);
    
        context.drawImage(img, 0, 0);
    
        for (var i = 0; i < size; i++) {
          data[i] = 0;
        }
    
        let imgd = context.getImageData(0, 0, img.width, img.height);
        let pix = imgd.data;
        // console.log(pix);
    
        let j = 0;
        for (let i = 0; i < pix.length; i += 4) {
          let all = pix[i];
          let val = all / 256 * scale;
          data[j++] = val;
        }
    
        this._heightMap = data;
        resolve(data);
      };
    });
    
  }

  addHeightMap() {
    let pos = this._geo.getAttribute('position');
    let pa = pos.array;
    console.log(this._heightMap.length);
    console.log(pa.length);
    for (let i=0;i<this._heightMap.length;i++){
      pa[i*3+2] = this._heightMap[i];
    }

    pos.needsUpdate = true;
    this._geo.computeVertexNormals();
  }

  generateTerrain(noBumps) {
    let pos = this._geo.getAttribute('position');
    let pa = pos.array;
    for (let iterator = 0; iterator < noBumps; iterator++) {
      let x = Math.floor(Math.random() * this._wCount);
      let y = Math.floor(Math.random() * this._lCount);
      // increase the height of that coordinate
      this.raiseVertice(pa, x, y, 5, 5);
    }
    pos.needsUpdate = true;
    this._geo.computeVertexNormals();
  }

  raiseVertice(pa, x, y, amplitude, distance) {
    amplitude = amplitude * Math.random();
    this.setVertice(pa, x, y, amplitude);

    //console.log(`raised ${x}:${y} at ${1}`);
    //console.log(`started around: `);

    // calculate vertices around
    for (let i = 0; i < distance; i++) {
      for (let j = 0; j < distance - i; j++) {
        if (i + j > 0) {
          let localAmp = amplitude * this.sFunction((distance - i - j) / distance)
          this.setVertice(pa, x + i, y + j, localAmp);
          this.setVertice(pa, x + i, y - j, localAmp);
          this.setVertice(pa, x - i, y - j, localAmp);
          this.setVertice(pa, x - i, y + j, localAmp);
          //console.log(`raised ${x+i}:${y+j} at ${(distance - i - j) / distance}`);
        }
      }
    }

    //console.log(`finished around: `);
  }

  setVertice(pa, x, y, amplitude) {
    let index = this.verticeCoordToIndex(x, y);
    pa[index + 2] = amplitude;
    //console.log(`raised ${x}:${y} at ${amplitude} with index ${index}`);
  }

  sFunction(x) {
    return 6 * Math.pow(x, 5) - 15 * Math.pow(x, 4) + 10 * Math.pow(x, 3);
  }

  verticeIndexToCoord(index) {
    let i = Math.floor(index / this._wVertices);
    let j = index % this._wVertices;

    return [i, j];
  }

  verticeCoordToIndex(x, y) {
    let index = x * this._wVertices + y;
    return index * 3;
  }

  getMesh() {
    return this._mesh;
  }
}

export default Floor;