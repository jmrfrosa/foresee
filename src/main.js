import World from './lib/World';
import Sound from './lib/Sound';

const domNode = document.getElementById("main-canvas");
const playBtn = document.getElementById("play-btn");
const audioPicker = document.getElementById("audio-file");
const audioControl = document.getElementById("audio-control");

let sound, world;

playBtn.onclick = function() {
  play();
}

audioPicker.onchange = function(e) {
  const file = e.target.files[0];

  console.log("Adding file to audio control", file);
  audioControl.src = URL.createObjectURL(file);
  audioControl.load();

  sound = new Sound(audioControl);
  world = new World(domNode, sound);

  playBtn.disabled = false;
}

function play() {
  world.init();
  audioControl.play();
}