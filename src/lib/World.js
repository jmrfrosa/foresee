import * as THREE from 'three';
import { randomColor } from './helpers';

const wWidth = window.innerWidth;
const wHeight = window.innerHeight;
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

    // TODO:
    // three.js documentation says we shouldn't be using .scale in the update loop
    // figure out a better way to do it
    const beatBox = this.boxes[0];
    beatBox.scale.set(beatMagnitude, beatMagnitude, beatMagnitude);

    const trebleBox = this.boxes[1];
    trebleBox.scale.set(trebleMagnitude, trebleMagnitude, trebleMagnitude);
    
    this.renderer.render(this.scene, this.camera);
  }
  
  onResize() {
    const newWidth = window.innerWidth;
    const newHeight = window.innerHeight;
    this.camera.aspect = newWidth / newHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(newWidth, newHeight);
  }
}

export default World;