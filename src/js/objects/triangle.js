'use strict';

class Triangle {
  constructor(width, height, depth) {
    this._w = width;
    this._h = height;
    this._d = depth;

    this.createGeometry();
    this.createMaterial();
    this.createMesh();
  }

  createGeometry() {
    this._geo = new THREE.Geometry();
    this._geo.vertices.push( new THREE.Vector3(0, this._h, 0));
    this._geo.vertices.push( new THREE.Vector3(-this._w, -this._w, 0));
    this._geo.vertices.push( new THREE.Vector3(this._w, -this._w, 0));

    this._geo.faces.push(new THREE.Face3(0, 1, 2));
    
  }

  createMaterial() {
    this._mat = new THREE.MeshBasicMaterial({
      vertexColors: THREE.VertexColors,
      side: THREE.DoubleSide
    });

    this._geo.faces[0].vertexColors[0] = new THREE.Color(0xff0000);
    this._geo.faces[0].vertexColors[1] = new THREE.Color(0x00ff00);
    this._geo.faces[0].vertexColors[2] = new THREE.Color(0x0000ff);

  }

  createMesh() {
    this._mesh = new THREE.Mesh(this._geo, this._mat);
  }



  getGeometry() {
    return this._mesh;
  }
}

export default Triangle;