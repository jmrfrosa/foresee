import * as THREE from 'three';
import { randomColor } from './helpers';

const wWidth = window.innerWidth;
const wHeight = window.innerHeight - 54;
const beatMagDom = document.getElementById("beat-mag");
const trebleMagDom = document.getElementById("treble-mag");

class World {
  constructor(domNode, sound) {
    this.sound = sound;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, wWidth/wHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true
    });
    
    this.planes = [];
    this.boxes  = [];
    
    this.animate = this.animate.bind(this);
    this.onResize = this.onResize.bind(this);
    window.addEventListener('resize', this.onResize, false);
    
    domNode.append(this.renderer.domElement);
  }
  
  init() {
    this.camera.position.set(0,0,100);
    this.camera.lookAt(this.scene.position);
    this.scene.add(this.camera);
    
    this.addBox(20, 20);
    this.addBox(10, 10);
    this.addPlane();
    this.renderer.setSize(wWidth, wHeight);
    
    this.animate();
  }
  
  addBox(width = 1, height = 1) {
    const boxGeometry = new THREE.BoxGeometry(width, height);
    const boxMaterial = new THREE.MeshBasicMaterial({
      color: randomColor(),
      wireframe: true
    });
    
    const box = new THREE.Mesh(boxGeometry, boxMaterial);
    this.scene.add(box);
    this.boxes.push(box);

    return box;
  }
  
  addPlane() {
    const planeGeometry = new THREE.PlaneGeometry(800, 800, 20, 20);
    const planeMaterial = new THREE.MeshLambertMaterial({
      color: randomColor(),
      side: THREE.DoubleSide,
      wireframe: true
    });
    
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.set(0,30,0);
    
    this.scene.add(plane);
    this.planes.push(plane);

    return plane;
  }
  
  animate() {
    requestAnimationFrame(this.animate);

    const { beatMagnitude, trebleMagnitude } = this.sound.process();

    beatMagDom.textContent = beatMagnitude;
    trebleMagDom.textContent = trebleMagnitude;

    const beatBox = this.boxes[0];
    beatBox.scale.set(beatMagnitude, beatMagnitude, beatMagnitude);

    // beatBox.geometry.vertices.forEach(vertex => {
    //   vertex.normalize();
    //   vertex.multiplyScalar(beatMagnitude);
    // });

    // beatBox.geometry.verticesNeedUpdate = true;
    // beatBox.geometry.normalsNeedUpdate = true;
    // beatBox.geometry.computeVertexNormals();
    // beatBox.geometry.computeFaceNormals();


    const trebleBox = this.boxes[1];
    trebleBox.scale.set(trebleMagnitude, trebleMagnitude, trebleMagnitude);

    // trebleBox.geometry.vertices.forEach(vertex => {
    //   vertex.normalize();
    //   vertex.multiplyScalar(0.01 * trebleMagnitude);
    // });

    // trebleBox.geometry.verticesNeedUpdate = true;
    // trebleBox.geometry.normalsNeedUpdate = true;
    // trebleBox.geometry.computeVertexNormals();
    // trebleBox.geometry.computeFaceNormals();

    // this.boxes.forEach(box => {
    //   box.rotation.x += 0.01 * trebleMagnitude;
    //   box.rotation.y += 0.05 * trebleMagnitude;
    // })
    
    // this.planes.forEach(plane => {
    //   plane.rotation.x += 0.01 * beatMagnitude;
    //   plane.rotation.y += 0.1 * -beatMagnitude;
    // })
    
    this.renderer.render(this.scene, this.camera);
  }
  
  onResize() {
    const newWidth = window.innerWidth;
    const newHeight = window.innerHeight - 54;
    this.camera.aspect = newWidth / newHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(newWidth, newHeight);
  }
}

export default World;