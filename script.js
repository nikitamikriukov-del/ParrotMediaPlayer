document.addEventListener("DOMContentLoaded", () => {

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

  const openSettings = document.getElementById("openSettings");
  const closeSettings = document.getElementById("closeSettings");

  const volumeBar = document.getElementById("volumeBar");
  const volumeFill = document.getElementById("volumeFill");
  const volumeText = document.getElementById("volumeText");

  const speedSelect = document.getElementById("speedSelect");
  const freeMp3Select = document.getElementById("freeMp3Select");
  const useFreeMp3 = document.getElementById("useFreeMp3");

  const freeTracks = {
    Pirates: "./audio/PiratesOfTheCaribbean-HesAPirate.mp3",
    Moonlight: "./audio/Beethoven-Moonlight-Sonata.mp3",
    Rickroll: "./audio/NeverGonnaGiveYouUp-RickAstley.mp3"
  };

  /* SETTINGS TOGGLE — FIXED */
  openSettings.onclick = () => {
    mainView.classList.add("hidden");
    settingsView.classList.remove("hidden");
  };

  closeSettings.onclick = () => {
    settingsView.classList.add("hidden");
    mainView.classList.remove("hidden");
  };

  /* FILE INPUT */
  fileInput.onchange = () => {
    const file = fileInput.files[0];
    if (!file) return;
    audio.src = URL.createObjectURL(file);
    nowPlaying.textContent = file.name;
    audio.play();
  };

  /* FREE MP3s */
  useFreeMp3.onclick = () => {
    const key = freeMp3Select.value;
    audio.src = freeTracks[key];
    nowPlaying.textContent =
      freeMp3Select.options[freeMp3Select.selectedIndex].text;
    audio.play();
  };

  /* PLAY / STOP */
  playBtn.onclick = () => audio.paused ? audio.play() : audio.pause();
  stopBtn.onclick = () => {
    audio.pause();
    audio.currentTime = 0;
  };

  /* PROGRESS */
  audio.ontimeupdate = () => {
    if (!audio.duration) return;
    progressFill.style.width =
      (audio.currentTime / audio.duration) * 100 + "%";
    timeText.textContent =
      format(audio.currentTime) + " / " + format(audio.duration);
  };

  progressBar.onclick = e => {
    const rect = progressBar.getBoundingClientRect();
    audio.currentTime =
      ((e.clientX - rect.left) / rect.width) * audio.duration;
  };

  /* VOLUME */
  audio.volume = Number(localStorage.getItem("parrot_volume") ?? 1);
  updateVolumeUI();

  volumeBar.onmousedown = () => {
    document.onmousemove = e => {
      const rect = volumeBar.getBoundingClientRect();
      let percent = 1 - (e.clientY - rect.top) / rect.height;
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
  speedSelect.value = localStorage.getItem("parrot_speed") ?? "2";
  speedSelect.onchange = () =>
    localStorage.setItem("parrot_speed", speedSelect.value);

  document.addEventListener("keydown", e => {
    if (e.key === "k") audio.playbackRate = Number(speedSelect.value);
  });

  document.addEventListener("keyup", e => {
    if (e.key === "k") audio.playbackRate = 1;
  });

  function format(sec) {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

});
