const audio = new Audio();

const playBtn = document.getElementById("play");
const stopBtn = document.getElementById("stop");
const fileInput = document.getElementById("fileInput");
const nowPlaying = document.getElementById("nowPlaying");

const progressBar = document.getElementById("progressBar");
const progressFill = document.getElementById("progressFill");
const timeText = document.getElementById("timeText");

const mainView = document.getElementById("mainView");
const settingsView = document.getElementById("settingsView");

const settingsBtn = document.querySelector(".settings-btn");
const closeBtn = document.querySelector(".close-btn");

const volumeBar = document.getElementById("volumeBar");
const volumeFill = document.getElementById("volumeFill");
const volumeText = document.getElementById("volumeText");

const speedSelect = document.getElementById("speedSelect");

/* LOAD SAVED SETTINGS */
audio.volume = Number(localStorage.getItem("parrot_volume") ?? 1);
speedSelect.value = localStorage.getItem("parrot_speed") ?? "2";
updateVolumeUI();

/* FILE */
fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if (!file) return;
  audio.src = URL.createObjectURL(file);
  nowPlaying.textContent = file.name;
});

/* PLAY / STOP */
playBtn.onclick = () => audio.paused ? audio.play() : audio.pause();
stopBtn.onclick = () => {
  audio.pause();
  audio.currentTime = 0;
};

/* PROGRESS */
audio.ontimeupdate = () => {
  if (!audio.duration) return;
  const percent = (audio.currentTime / audio.duration) * 100;
  progressFill.style.width = percent + "%";
  timeText.textContent =
    format(audio.currentTime) + " / " + format(audio.duration);
};

progressBar.onclick = e => {
  const rect = progressBar.getBoundingClientRect();
  const percent = (e.clientX - rect.left) / rect.width;
  audio.currentTime = percent * audio.duration;
};

/* SETTINGS TOGGLE */
settingsBtn.onclick = () => {
  mainView.classList.add("hidden");
  settingsView.classList.remove("hidden");
};

closeBtn.onclick = () => {
  settingsView.classList.add("hidden");
  mainView.classList.remove("hidden");
};

/* VOLUME */
volumeBar.onmousedown = e => {
  document.onmousemove = ev => {
    const rect = volumeBar.getBoundingClientRect();
    let percent = 1 - (ev.clientY - rect.top) / rect.height;
    percent = Math.min(1, Math.max(0, percent));
    audio.volume = percent;
    localStorage.setItem("parrot_volume", percent);
    updateVolumeUI();
  };
  document.onmouseup = () => document.onmousemove = null;
};

function updateVolumeUI() {
  volumeFill.style.height = (audio.volume * 100) + "%";
  volumeText.textContent = Math.round(audio.volume * 100) + "% vol.";
}

/* SPEED */
speedSelect.onchange = () => {
  localStorage.setItem("parrot_speed", speedSelect.value);
};

/* KEYBOARD */
document.addEventListener("keydown", e => {
  if (e.code === "Space" || e.key === "j") {
    e.preventDefault();
    audio.paused ? audio.play() : audio.pause();
  }
  if (e.key === "l") {
    audio.currentTime = 0;
  }
  if (e.key === "k") {
    audio.playbackRate = Number(speedSelect.value);
  }
});

document.addEventListener("keyup", e => {
  if (e.key === "k") audio.playbackRate = 1;
});

/* UTIL */
function format(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}
