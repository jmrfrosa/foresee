import World from './lib/World';
import Sound from './lib/Sound';

const domNode = document.getElementById("main-canvas");
const playBtn = document.getElementById("play-btn");
const audioPicker = document.getElementById("audio-file");
const audioControl = document.getElementById("audio-control");

const webSocket = new WebSocket(`ws://${window.location.host.split(':')[0]}:443/`);
const peerConnection = new RTCPeerConnection();

webSocket.onmessage = e => {
  console.log("Receiving local socket message", e);
  const msg = JSON.parse(e.data);
  if (msg.sdp) {
    peerConnection.setRemoteDescription(new RTCSessionDescription(msg.sdp))
    .then(() => {
      return peerConnection.signalingState == "stable" || peerConnection.createAnswer()
        .then(answer => peerConnection.setLocalDescription(answer))
        .then(() => webSocket.send(JSON.stringify({ sdp: peerConnection.localDescription })));
    })
    .catch(error => console.log(error));
  }
  else if (msg.candidate) {
    peerConnection.addIceCandidate(new RTCIceCandidate(msg.candidate))
      .catch(error => console.log(error));
  }
}

peerConnection.ontrack = e => {
  console.log("Track received!", e);

  const rStream = e.streams[0];

  console.log("Loading audio control with stream", audioControl);
  audioControl.srcObject = rStream;
  audioControl.load();

  sound = new Sound(audioControl, rStream);
  world = new World(domNode, sound);
  console.log("Initializing world", world);

  console.log("Enabling play");
  playBtn.disabled = false;
}

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