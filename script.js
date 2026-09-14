const screens = [...document.querySelectorAll('.screen')];
const answerForm = document.getElementById('answerForm');
const answerInput = document.getElementById('answerInput');
const answerFeedback = document.getElementById('answerFeedback');
const checkTitle = document.getElementById('checkTitle');
const checkText = document.getElementById('checkText');
const checkMark = document.getElementById('checkMark');
const checkContinue = document.getElementById('checkContinue');
const openLetter = document.getElementById('openLetter');
const closeLetter = document.getElementById('closeLetter');
const closeLetterTop = document.getElementById('closeLetterTop');
const letterBackdrop = document.getElementById('letterBackdrop');
const letterModal = document.getElementById('letterModal');
const letterContinue = document.getElementById('letterContinue');
const giftBox = document.getElementById('giftBox');
const giftButton = document.getElementById('giftButton');
const startCredits = document.getElementById('startCredits');
const finalSuspense = document.getElementById('finalSuspense');
const fimScreen = document.getElementById('fimScreen');
const creditsScreen = document.querySelector('[data-screen="credits"]');
const bgMusic = document.getElementById('bgMusic');
const replaySite = document.getElementById('replaySite');
const fallingLetters = document.getElementById('fallingLetters');
const particleField = document.getElementById('particleField');
const languages = document.getElementById('languages');

let currentScreen = 'intro';
let letterWasOpened = false;
let giftWasOpened = false;
let finalTimer = null;

const LOVE_LANGUAGES = [
  ['Português', 'Eu te amo'], ['Inglês', 'I love you'], ['Espanhol', 'Te amo'], ['Francês', "Je t’aime"],
  ['Italiano', 'Ti amo'], ['Alemão', 'Ich liebe dich'], ['Holandês', 'Ik hou van je'], ['Sueco', 'Jag älskar dig'],
  ['Norueguês', 'Jeg elsker deg'], ['Dinamarquês', 'Jeg elsker dig'], ['Finlandês', 'Rakastan sinua'], ['Islandês', 'Ég elska þig'],
  ['Russo', 'Я тебя люблю'], ['Ucraniano', 'Я тебе кохаю'], ['Polonês', 'Kocham cię'], ['Tcheco', 'Miluji tě'],
  ['Eslovaco', 'Ľúbim ťa'], ['Húngaro', 'Szeretlek'], ['Romeno', 'Te iubesc'], ['Grego', 'Σ’ αγαπώ'],
  ['Turco', 'Seni seviyorum'], ['Árabe', 'أحبك'], ['Hebraico', 'אני אוהב אותך'], ['Persa', 'دوستت دارم'],
  ['Hindi', 'मैं तुमसे प्यार करता हूँ'], ['Bengali', 'আমি তোমাকে ভালোবাসি'], ['Chinês', '我爱你'], ['Japonês', '愛してる'],
  ['Coreano', '사랑해'], ['Vietnamita', 'Anh yêu em'], ['Tailandês', 'ฉันรักคุณ'], ['Indonésio', 'Aku cinta kamu'],
  ['Filipino', 'Mahal kita'], ['Esperanto', 'Mi amas vin'], ['Latim', 'Te amo']
];

function showScreen(name){
  currentScreen = name;
  screens.forEach(screen => screen.classList.toggle('active', screen.dataset.screen === name));
  if(name !== 'credits') document.body.classList.remove('letter-open-lock');
  window.scrollTo(0, 0);
}

function flashFeedback(text, type = 'error'){
  answerFeedback.textContent = text;
  answerFeedback.className = `answer-feedback show ${type === 'error' ? 'shake' : ''}`;
  if(type === 'error') setTimeout(() => answerFeedback.classList.remove('shake'), 500);
}

function normalize(value){
  return value.trim().toLocaleLowerCase('pt-BR').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

answerForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const value = normalize(answerInput.value);

  if(value === 'ketelin azevedo'){
    flashFeedback('Resposta desbloqueada. ♥', 'success');
    answerInput.blur();
    setTimeout(() => {
      checkTitle.textContent = 'RESPOSTA CORRETA!';
      checkText.textContent = 'Você realmente me conhece... ♥';
      checkMark.textContent = '✓';
      showScreen('check');
    }, 620);
    return;
  }

  if(value === 'ketelin'){
    flashFeedback('“Ketelin”... especifique qual. 👀');
  }else if(value.includes('ketelin') && value.includes('morena')){
    flashFeedback('TA DOIDAAAAAAAAAA. CAI FORA. 🚨');
  }else{
    flashFeedback('ERRADÍSSIMO. ❌ Tente novamente.');
  }
  answerInput.select();
});

checkContinue.addEventListener('click', () => showScreen('letter'));

function openLetterModal(){
  letterModal.classList.add('open');
  letterModal.setAttribute('aria-hidden','false');
  document.body.classList.add('letter-open-lock');
  letterWasOpened = true;
  openLetter.classList.add('hidden');
  letterContinue.classList.remove('hidden');
  setTimeout(() => closeLetter.focus(), 100);
}
function closeLetterModal(){
  letterModal.classList.remove('open');
  letterModal.setAttribute('aria-hidden','true');
  document.body.classList.remove('letter-open-lock');
  if(letterWasOpened) letterContinue.classList.remove('hidden');
  openLetter.classList.toggle('hidden', letterWasOpened);
}
openLetter.addEventListener('click', openLetterModal);
closeLetter.addEventListener('click', closeLetterModal);
closeLetterTop.addEventListener('click', closeLetterModal);
letterBackdrop.addEventListener('click', closeLetterModal);
document.addEventListener('keydown', (event) => {
  if(event.key === 'Escape' && letterModal.classList.contains('open')) closeLetterModal();
});
letterContinue.addEventListener('click', () => { closeLetterModal(); showScreen('photos'); });

document.querySelectorAll('[data-next]').forEach(btn => btn.addEventListener('click', () => showScreen(btn.dataset.next)));

function openGift(){
  giftWasOpened = true;
  giftBox.classList.add('opened');
  giftButton.textContent = 'SURPRESA ABERTA ♥';
  giftButton.disabled = true;
  setTimeout(() => showScreen('surprise-open'), 650);
}
giftBox.addEventListener('click', openGift);
giftButton.addEventListener('click', openGift);

startCredits.addEventListener('click', () => {
  showScreen('finale');
  finalSuspense.classList.remove('fade-out');
  fimScreen.classList.remove('show');
  clearTimeout(finalTimer);

  // O navegador geralmente libera o áudio porque esta sequência começou por uma interação do usuário.
  bgMusic.currentTime = 0;
  bgMusic.volume = 0;
  bgMusic.play().then(() => {
    let volume = 0;
    const fade = setInterval(() => {
      volume = Math.min(1, volume + .08);
      bgMusic.volume = volume;
      if(volume >= 1) clearInterval(fade);
    }, 100);
  }).catch(() => {
    // Se o navegador bloquear autoplay, o arquivo continua sendo encontrado na raiz;
    // a tentativa é refeita no próximo gesto do usuário.
  });

  finalTimer = setTimeout(() => {
    finalSuspense.style.opacity = '0';
    setTimeout(() => {
      fimScreen.classList.add('show');
      finalTimer = setTimeout(() => startCreditsRoll(), 2600);
    }, 1400);
  }, 3600);
});

function startCreditsRoll(){
  showScreen('credits');
  creditsScreen.classList.remove('playing');
  requestAnimationFrame(() => creditsScreen.classList.add('playing'));
}

replaySite.addEventListener('click', () => {
  clearTimeout(finalTimer);
  bgMusic.pause();
  bgMusic.currentTime = 0;
  bgMusic.volume = 1;
  creditsScreen.classList.remove('playing');
  finalSuspense.style.opacity = '';
  fimScreen.classList.remove('show');
  letterWasOpened = false;
  giftWasOpened = false;
  openLetter.classList.remove('hidden');
  letterContinue.classList.add('hidden');
  giftButton.disabled = false;
  giftButton.textContent = 'ABRIR? 👀';
  giftBox.classList.remove('opened');
  answerInput.value = '';
  answerFeedback.className = 'answer-feedback';
  showScreen('intro');
});

// Letras caindo na abertura.
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVXYWZ♥♡✦✧';
for(let i=0;i<42;i++){
  const span = document.createElement('span');
  span.textContent = alphabet[Math.floor(Math.random() * alphabet.length)];
  span.style.left = `${Math.random()*100}%`;
  span.style.setProperty('--dur', `${7 + Math.random()*8}s`);
  span.style.setProperty('--delay', `${-Math.random()*9}s`);
  span.style.setProperty('--r', `${-35 + Math.random()*70}deg`);
  span.style.opacity = (0.18 + Math.random()*.55).toFixed(2);
  fallingLetters.appendChild(span);
}

// Pequenos corações/pontinhos flutuantes.
for(let i=0;i<24;i++){
  const p = document.createElement('span');
  p.className = 'particle';
  p.textContent = Math.random() > .65 ? '♥' : '✦';
  p.style.left = `${Math.random()*100}%`;
  p.style.bottom = `${-10 - Math.random()*50}px`;
  p.style.setProperty('--dx', `${-80 + Math.random()*160}px`);
  p.style.animationDuration = `${12 + Math.random()*16}s`;
  p.style.animationDelay = `${-Math.random()*15}s`;
  particleField.appendChild(p);
}

LOVE_LANGUAGES.forEach(([language, phrase]) => {
  const row = document.createElement('div');
  row.className = 'language-line';
  row.innerHTML = `<span>${language}</span>${phrase}`;
  languages.appendChild(row);
});

// Clique no fundo da experiência também pode reativar o áudio caso o browser tenha bloqueado a primeira tentativa.
document.addEventListener('pointerdown', () => {
  if(currentScreen === 'credits' && bgMusic.paused){
    bgMusic.play().catch(()=>{});
  }
}, {passive:true});
