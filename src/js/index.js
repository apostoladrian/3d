'use strict';


import Game from './game2';
import './threejs/indexThree';

Physijs.scripts.worker = '/physijs_worker.js';
Physijs.scripts.ammo = '/ammo.js';

let game = new Game('webgl-container');
window.app = {
  game: game
}