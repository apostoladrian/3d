'use strict';

import Car from '../car';

class OldCar extends Car {
  constructor() {
    let options = {
      path: 'external_objects/old_car2/',
      modelFilename: 'scene.gltf',
      correctionScale: 0.04,
      castShadow: true
    };
    super(options);
  } 
}

export default OldCar;