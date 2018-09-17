'use strict';

class Interaction {
  constructor(camera) {
    this._camera = camera;

    this.checkKey = this.checkKey.bind(this);
    this.setEvents();
  }

  setEvents() {
    window.onkeydown = this.checkKey;
  }

  checkKey(ev) {
    // console.log(ev);
    let left = 37;
    let up = 38;
    let down = 40;
    let right = 39;
    let increment = 2;

    ev = ev || window.event;

    switch(ev.keyCode) {
      case up: this._camera.position.z -= increment; break;
      case down: this._camera.position.z += increment; break;
      case right: this._camera.position.x += increment; break;
      case left: this._camera.position.x -= increment; break;
    }
  }


}

export default Interaction;