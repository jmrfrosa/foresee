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

    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.scene.background = new THREE.Color(0xbbbbbb);

    this.boxes  = [];
    
    this.animate = this.animate.bind(this);
    this.onResize = this.onResize.bind(this);
    window.addEventListener('resize', this.onResize, false);
    
    domNode.append(this.renderer.domElement);
  }
  
  init() {
    this.camera.position.set(0,12,0);
    this.camera.lookAt(this.scene.position);
    this.scene.add(this.camera);
    
    const ambientLight = new THREE.AmbientLight(0xbbbbbb, 0.1);
    this.scene.add(ambientLight);
    const spotlight = new THREE.SpotLight(0xffffff, 0.9);
    spotlight.position.set(15, 15, 15);
    spotlight.lookAt(this.scene.position);
    spotlight.castShadow = true;
    this.scene.add(spotlight);

    this.addBox(1, 1, 1).position.set(-5, 0, 0);
    this.addBox(1, 1, 1).position.set(5, 0, 0);
    this.renderer.setSize(wWidth, wHeight);
    
    this.animate();
  }
  
  addBox(width = 1, height = 1, depth = 1) {
    const boxGeometry = new THREE.BoxGeometry(width, height, depth);
    const boxMaterial = new THREE.MeshPhongMaterial({
      color: randomColor(),
      dithering: true
    });
    
    const box = new THREE.Mesh(boxGeometry, boxMaterial);
    this.scene.add(box);
    this.boxes.push(box);

    return box;
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
    
    // Simple camera orbiting code
    const orbitSpeed = Date.now() * 0.0005; 
    this.camera.position.x = 12 * Math.cos(orbitSpeed);
    this.camera.position.z = 12 * Math.sin(orbitSpeed);
    this.camera.lookAt(this.scene.position);

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