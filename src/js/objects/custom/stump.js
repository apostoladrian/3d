'use strict';

import glTFLoader from '../glTFLoader';

class Stump extends glTFLoader {
  constructor() {
    let options = {
      path: 'external_objects/stump/',
      modelFilename: 'scene.gltf',
      correctionScale: 1.5,
      castShadow: false,
      startingPosition: {
        x: 100, 
        y: -5,
        z: 100
      }
    };
    super(options);
  } 
}

export default Stump;