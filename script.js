const screens = {
  intro: document.getElementById("screen-intro"),
  correct: document.getElementById("screen-correct"),
  letterClosed: document.getElementById("screen-letter-closed"),
  letterOpen: document.getElementById("screen-letter-open"),
  photos: document.getElementById("screen-photos"),
  surprise: document.getElementById("screen-surprise"),
  cards: document.getElementById("screen-cards"),
  cinema: document.getElementById("screen-cinema"),
  end: document.getElementById("screen-end"),
  credits: document.getElementById("screen-credits"),
  post: document.getElementById("screen-post")
};

let current = screens.intro;
let musicStarted = false;

function show(screen) {
  if (!screen || screen === current) return;
  current.classList.remove("active");
  screen.classList.add("active");
  current = screen;
  window.scrollTo(0, 0);
}

function startMusic() {
  const audio = document.getElementById("bg-music");
  if (musicStarted) return;
  musicStarted = true;
  audio.volume = 0.82;
  audio.play().catch(() => {
    document.getElementById("music-status").textContent =
      "♫ Clique para ativar a música";
  });
}

function normalize(value) {
  return value
    .trim()
    .toLocaleLowerCase("pt-BR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ");
}

// Falling letters on the intro
const falling = document.getElementById("falling-letters");
const letters = "KETELIN♥HANIEL";
for (let i = 0; i < 24; i++) {
  const span = document.createElement("span");
  span.className = "falling-letter";
  span.textContent = letters[Math.floor(Math.random() * letters.length)];
  span.style.left = Math.random() * 100 + "%";
  span.style.animationDelay = (Math.random() * 2.4) + "s";
  span.style.animationDuration = (3.5 + Math.random() * 3.5) + "s";
  falling.appendChild(span);
}

// Ambient hearts
const heartLayer = document.getElementById("hearts-layer");
function spawnHeart() {
  const heart = document.createElement("span");
  heart.className = "heart-float";
  heart.textContent = Math.random() > .25 ? "♡" : "♥";
  heart.style.left = Math.random() * 100 + "%";
  heart.style.animationDuration = (7 + Math.random() * 7) + "s";
  heart.style.fontSize = (12 + Math.random() * 22) + "px";
  heartLayer.appendChild(heart);
  setTimeout(() => heart.remove(), 15000);
}
setInterval(spawnHeart, 900);
for (let i = 0; i < 7; i++) setTimeout(spawnHeart, i * 500);

// Answer validation
document.getElementById("answer-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const input = document.getElementById("answer");
  const feedback = document.getElementById("answer-feedback");
  const value = normalize(input.value);

  feedback.className = "feedback";

  if (value === "ketelin azevedo") {
    feedback.textContent = "Hmmm... essa parece correta. ❤️";
    feedback.classList.add("good");
    startMusic(); // browser interaction permission is established here
    setTimeout(() => show(screens.correct), 900);
    return;
  }

  if (value === "ketelin") {
    feedback.textContent = '“Especifique qual.” 🤨';
  } else if (value === "ketelin morena") {
    feedback.textContent = "TA DOIDAAAAAAAAAA. CAI FORA. 🚨";
  } else if (!value) {
    feedback.textContent = "Digite alguma coisa primeiro, né? 😭";
  } else {
    feedback.textContent = "ERRADÍSSIMO. ❌";
  }

  feedback.classList.add("shake");
  input.focus();
});

// Generic next buttons
document.querySelectorAll("[data-next]").forEach((button) => {
  button.addEventListener("click", () => {
    const target = button.dataset.next;
    if (target === "letter-closed") show(screens.letterClosed);
    if (target === "surprise") show(screens.surprise);
  });
});

// Letter
document.getElementById("open-letter").addEventListener("click", () => {
  show(screens.letterOpen);
});

document.getElementById("close-letter").addEventListener("click", () => {
  show(screens.photos);
});

// Gift
function openGift() {
  const gift = document.getElementById("open-gift");
  gift.animate(
    [
      { transform: "translateX(0) rotate(0)" },
      { transform: "translateX(-8px) rotate(-3deg)" },
      { transform: "translateX(8px) rotate(3deg)" },
      { transform: "translateX(-5px) rotate(-2deg)" },
      { transform: "translateX(0) scale(1.08)", opacity: 0.15 }
    ],
    { duration: 1000, easing: "cubic-bezier(.2,1.4,.4,1)", fill: "forwards" }
  );
  setTimeout(() => show(screens.cards), 850);
}
document.getElementById("gift-trigger").addEventListener("click", openGift);
document.getElementById("open-gift").addEventListener("click", openGift);

// Cinematic ending
document.getElementById("go-cinema").addEventListener("click", () => {
  show(screens.cinema);

  setTimeout(() => {
    show(screens.end);

    setTimeout(() => {
      show(screens.credits);
      startMusic();
    }, 4000);
  }, 5200);
});

// End credits -> post-credit scene
document.getElementById("credits-scroll").addEventListener("animationend", (event) => {
  if (event.animationName !== "creditsRoll") return;
  const audio = document.getElementById("bg-music");
  audio.pause();
  setTimeout(() => show(screens.post), 900);
});

function resetToStart() {
  const audio = document.getElementById("bg-music");
  audio.pause();
  audio.currentTime = 0;
  musicStarted = false;
  document.getElementById("answer").value = "";
  document.getElementById("answer-feedback").textContent = "";
  show(screens.intro);
}

// Replay from credits
document.getElementById("replay").addEventListener("click", () => {
  resetToStart();
});

// Post-credit replay
document.getElementById("post-replay").addEventListener("click", resetToStart);

// If the final video is added later, it can be inserted in the credits area
// without changing the navigation logic.
