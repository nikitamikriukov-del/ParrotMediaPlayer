const audio = new Audio();

const playBtn = document.getElementById("playBtn");
const stopBtn = document.getElementById("stopBtn");
const fileInput = document.getElementById("fileInput");
const nowPlaying = document.getElementById("nowPlaying");
const progress = document.getElementById("progress");
const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");
const tracksContainer = document.getElementById("tracksContainer");

/* BUILT-IN TRACKS */
const builtInTracks = [
  {
    name: "Beethoven – Moonlight Sonata",
    file: "audio/Beethoven-Moonlight-Sonata.mp3"
  },
  {
    name: "Never Gonna Give You Up",
    file: "audio/NeverGonnaGiveYouUp-RickAstley.mp3"
  },
  {
    name: "Pirates of the Caribbean – He's a Pirate",
    file: "audio/PiratesOfTheCaribbean-HesAPirate.mp3"
  }
];

/* CREATE BUTTONS */
builtInTracks.forEach(track => {
  const btn = document.createElement("button");
  btn.className = "track-btn";
  btn.textContent = track.name;

  btn.onclick = () => {
    audio.src = track.file;
    audio.load();
    audio.play();
    nowPlaying.textContent = track.name;
  };

  tracksContainer.appendChild(btn);
});

/* FILE INPUT */
fileInput.onchange = e => {
  const file = e.target.files[0];
  if (!file) return;

  audio.src = URL.createObjectURL(file);
  audio.load();
  audio.play();
  nowPlaying.textContent = file.name;
};

/* CONTROLS */
playBtn.onclick = () => {
  audio.paused ? audio.play() : audio.pause();
};

stopBtn.onclick = () => {
  audio.pause();
  audio.currentTime = 0;
};

/* PROGRESS */
audio.ontimeupdate = () => {
  progress.value = (audio.currentTime / audio.duration) * 100 || 0;
  currentTimeEl.textContent = format(audio.currentTime);
  durationEl.textContent = format(audio.duration);
};

progress.oninput = () => {
  audio.currentTime = (progress.value / 100) * audio.duration;
};

function format(sec) {
  if (!sec) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}
