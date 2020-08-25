import World from './lib/World';
import Sound from './lib/Sound';

const domNode = document.getElementById("main-canvas");
const playBtn = document.getElementById("play-btn");
const audioPicker = document.getElementById("audio-file");
const audioControl = document.getElementById("audio-control");

const webSocket = new WebSocket(`ws://${window.location.host.split(':')[0]}:443/`);
const peerConnection = new RTCPeerConnection();

webSocket.onmessage = e => {
  const { type, sender, data } = JSON.parse(e.data);

  switch (type) {
    case 'scan':
      const { login, peers } = data;
      console.log(peers);      
      break;
    case 'sdp':
      console.log("Receiving sdp", data);
      peerConnection.setRemoteDescription(new RTCSessionDescription(data))
        .then(() => {
          return peerConnection.signalingState == "stable" || peerConnection.createAnswer()
            .then(answer => peerConnection.setLocalDescription(answer))
            .then(() => webSocket.send(JSON.stringify({
              type: 'sdp',
              target: sender,
              data: peerConnection.localDescription
            })));
        })
        .catch(error => console.error(error));
      break;
    case 'candidate':
      console.log("Receiving candidate", data);
      peerConnection.addIceCandidate(new RTCIceCandidate(data))
        .catch(error => console.error(error));
      break;
    default:
      break;
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