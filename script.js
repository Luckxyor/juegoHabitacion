const sequence = [
  "ventana",
  "cama",
  "sillaymesa",
  "armario",
  "sillon",
  "libros",
  "alfombra",
  "dibujos",
  "juguetes"
];

const centralExtensions = {
  ventana: "jpeg",
  cama: "jpeg",
  sillaymesa: "jpeg",
  armario: "jpeg",
  sillon: "jpeg",
  libros: "jpeg",
  alfombra: "jpeg",
  dibujos: "jpeg",
  juguetes: "png"
};

const centralImage = document.querySelector("#central-image");
const centralFrame = document.querySelector("#central-frame");
const audioButton = document.querySelector("#audio-button");
const topOptions = document.querySelector("#top-options");
const bottomOptions = document.querySelector("#bottom-options");
const progressDots = document.querySelector("#progress-dots");

let currentIndex = 0;
let audioReady = false;
let currentAudio = null;

function playFeedbackSound(isCorrect) {
  const feedbackAudio = new Audio(
    `audios/${isCorrect ? "Correcta.mp3" : "Incorrecto.mp3"}`
  );
  feedbackAudio.play().catch(() => {});
}

function createOption(name) {
  const button = document.createElement("button");
  const image = document.createElement("img");

  button.className = "option";
  button.type = "button";
  button.dataset.name = name;
  button.setAttribute("aria-label", `Elegir ${name}`);
  button.disabled = true;

  image.src = `img/opciones/${name}.jpeg`;
  image.alt = "";
  image.draggable = false;

  button.append(image);
  button.addEventListener("click", () => chooseOption(button, name));
  return button;
}

function renderOptions() {
  const shuffledOptions = [...sequence];

  for (let index = shuffledOptions.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffledOptions[index], shuffledOptions[randomIndex]] = [
      shuffledOptions[randomIndex],
      shuffledOptions[index]
    ];
  }

  shuffledOptions.forEach((name, index) => {
    const option = createOption(name);
    (index < 5 ? topOptions : bottomOptions).append(option);
  });
}

function renderProgress() {
  sequence.forEach((_, index) => {
    const dot = document.createElement("span");
    dot.className = "progress-dot";
    dot.dataset.index = index;
    progressDots.append(dot);
  });
  updateProgress();
}

function updateProgress() {
  document.querySelectorAll(".progress-dot").forEach((dot, index) => {
    dot.classList.toggle("is-done", index < currentIndex);
    dot.classList.toggle("is-current", index === currentIndex);
  });
}

function playCurrentAudio() {
  if (currentIndex >= sequence.length) return;

  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }

  currentAudio = new Audio(`audios/${sequence[currentIndex]}.ogg`);
  audioReady = true;
  audioButton.classList.add("is-playing");
  document.querySelectorAll(".option").forEach((option) => {
    option.disabled = option.classList.contains("is-solved");
  });

  currentAudio.addEventListener("ended", () => {
    audioButton.classList.remove("is-playing");
  });
  currentAudio.play().catch(() => {
    audioButton.classList.remove("is-playing");
  });
}

function chooseOption(button, name) {
  if (!audioReady || currentIndex >= sequence.length) return;

  button.classList.remove("is-wrong", "is-correct");
  void button.offsetWidth;

  if (name !== sequence[currentIndex]) {
    playFeedbackSound(false);
    button.classList.add("is-wrong");
    return;
  }

  playFeedbackSound(true);
  document.querySelectorAll(".option").forEach((option) => {
    option.classList.remove("is-wrong");
  });
  button.classList.add("is-correct", "is-solved");
  centralFrame.classList.remove("is-correct");
  void centralFrame.offsetWidth;
  centralFrame.classList.add("is-correct");
  centralImage.src = `img/imgCentral/${name}.${centralExtensions[name]}`;
  centralImage.alt = `Habitación con ${name}`;
  currentIndex += 1;
  audioReady = false;
  updateProgress();

  document.querySelectorAll(".option").forEach((option) => {
    option.disabled = true;
  });
}

audioButton.addEventListener("click", playCurrentAudio);
renderOptions();
renderProgress();