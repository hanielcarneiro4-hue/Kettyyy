(() => {
  'use strict';

  const screens = [...document.querySelectorAll('.screen')];
  const byId = id => document.getElementById(id);
  const answerForm = byId('answerForm'), answerInput = byId('answerInput'), feedbackEl = byId('answerFeedback');
  const letterModal = byId('letterModal'), openLetter = byId('openLetter'), closeLetter = byId('closeLetter'), closeLetterTop = byId('closeLetterTop'), letterBackdrop = byId('letterBackdrop'), letterContinue = byId('letterContinue');
  const gift = byId('giftBox'), giftButton = byId('giftButton');
  const startFinal = byId('startFinal'), suspense = byId('suspense'), fim = byId('fim');
  const music = byId('bgMusic'), playMusic = byId('playMusic'), replay = byId('replay');
  const creditsContent = byId('creditsContent'), creditsRoll = byId('creditsRoll');
  let screenName = 'intro', letterRead = false, finalTimers = [], musicReady = false;

  const languages = [
    ['Português','Eu te amo'],['Inglês','I love you'],['Espanhol','Te amo'],['Francês','Je t’aime'],['Italiano','Ti amo'],['Alemão','Ich liebe dich'],['Holandês','Ik hou van je'],['Sueco','Jag älskar dig'],['Norueguês','Jeg elsker deg'],['Dinamarquês','Jeg elsker dig'],['Finlandês','Rakastan sinua'],['Islandês','Ég elska þig'],['Russo','Я тебя люблю'],['Ucraniano','Я тебе кохаю'],['Polonês','Kocham cię'],['Tcheco','Miluji tě'],['Eslovaco','Ľúbim ťa'],['Húngaro','Szeretlek'],['Romeno','Te iubesc'],['Grego','Σ’ αγαπώ'],['Turco','Seni seviyorum'],['Árabe','أحبك'],['Hebraico','אני אוהב אותך'],['Persa','دوستت دارم'],['Hindi','मैं तुमसे प्यार करता हूँ'],['Bengali','আমি তোমাকে ভালোবাসি'],['Chinês','我爱你'],['Japonês','愛してる'],['Coreano','사랑해'],['Vietnamita','Anh yêu em'],['Tailandês','ฉันรักคุณ'],['Indonésio','Aku cinta kamu'],['Filipino','Mahal kita'],['Esperanto','Mi amas vin'],['Latim','Te amo']
  ];

  function show(name) {
    screenName = name;
    screens.forEach(s => s.classList.toggle('is-active', s.dataset.screen === name));
    if(name !== 'credits') window.scrollTo(0,0);
  }

  function normalize(v) { return v.trim().toLocaleLowerCase('pt-BR').normalize('NFD').replace(/[\u0300-\u036f]/g,''); }
  function setFeedback(text, good=false) {
    feedbackEl.textContent = text; feedbackEl.className = 'feedback' + (good ? ' success' : ' shake');
    if(!good) setTimeout(() => feedbackEl.classList.remove('shake'), 500);
  }
  function clearTimers(){ finalTimers.forEach(clearTimeout); finalTimers=[]; }

  answerForm.addEventListener('submit', e => {
    e.preventDefault();
    const v = normalize(answerInput.value);
    if(v === 'ketelin azevedo'){
      setFeedback('Resposta desbloqueada. ♥', true);
      setTimeout(() => show('check'), 420);
    } else if(v === 'ketelin') setFeedback('“Ketelin”... especifique qual. 👀');
    else if(v.includes('ketelin') && v.includes('morena')) setFeedback('TA DOIDAAAAAAAAAA. CAI FORA. 😂');
    else setFeedback('ERRADÍSSIMO. ♥ Tenta de novo.');
  });

  byId('checkContinue').addEventListener('click', () => show('letter'));

  function openLetterModal(){
    letterModal.classList.add('open'); letterModal.setAttribute('aria-hidden','false'); letterRead=true;
    openLetter.classList.add('hidden'); letterContinue.classList.remove('hidden');
  }
  function closeLetterModal(){ letterModal.classList.remove('open'); letterModal.setAttribute('aria-hidden','true'); }
  openLetter.addEventListener('click', openLetterModal); closeLetter.addEventListener('click', closeLetterModal); closeLetterTop.addEventListener('click', closeLetterModal); letterBackdrop.addEventListener('click', closeLetterModal);
  document.addEventListener('keydown', e => { if(e.key==='Escape' && letterModal.classList.contains('open')) closeLetterModal(); });
  letterContinue.addEventListener('click', () => { closeLetterModal(); show('photos'); });
  document.querySelectorAll('[data-next]').forEach(b => b.addEventListener('click', () => show(b.dataset.next)));

  function openGift(){ gift.classList.add('opened'); giftButton.disabled=true; giftButton.textContent='ABERTA ♥'; setTimeout(()=>show('surprise-open'),650); }
  gift.addEventListener('click', openGift); giftButton.addEventListener('click', openGift);

  function musicPathOk(){ return music.getAttribute('src') === './dont-stop-til-you-get-enough.mp3' || music.src.endsWith('/dont-stop-til-you-get-enough.mp3'); }
  async function startMusic(){
    if(!musicPathOk()) music.src='./dont-stop-til-you-get-enough.mp3';
    music.volume=.76;
    music.loop=false;
    try{ await music.play(); musicReady=true; playMusic.classList.add('hidden'); return true; }
    catch(err){ playMusic.classList.remove('hidden'); return false; }
  }
  playMusic.addEventListener('click', async () => { const ok=await startMusic(); if(ok) playMusic.classList.add('hidden'); });
  music.addEventListener('error',()=>playMusic.classList.remove('hidden'));

  function buildCredits(){
    creditsContent.innerHTML = '';
    const add = (tag, cls, text) => { const el=document.createElement(tag); if(cls) el.className=cls; el.textContent=text; creditsContent.appendChild(el); return el; };
    add('p','smallcaps','UMA PRODUÇÃO PARTICULAR');
    add('h2','big','A LOVE STORY');
    add('p','starring','starring');
    add('p','big','HANIEL & KETELIN');
    add('p','starring','written, designed and assembled with a lot of love by Haniel');
    add('p','starring','Special thanks to Ketelin — por ser exatamente quem você é. ♥');
    add('h3','', 'E agora... em vários idiomas:');
    const list=document.createElement('div'); list.className='language-list';
    languages.forEach(([lang,phrase])=>{ const row=document.createElement('div'); row.className='language-line'; const small=document.createElement('small'); small.textContent=lang; row.appendChild(small); row.appendChild(document.createTextNode(phrase)); list.appendChild(row); });
    creditsContent.appendChild(list);
    add('p','final-message','eu te amaria de qualquer maneira.');
    add('div','the-end','FIM');
  }
  buildCredits();

  async function launchFinal(){
    clearTimers(); show('finale'); suspense.style.opacity='1'; fim.classList.remove('show'); playMusic.classList.add('hidden');
    await startMusic();
    finalTimers.push(setTimeout(()=>{
      suspense.style.opacity='0';
      finalTimers.push(setTimeout(()=>{
        fim.classList.add('show');
        finalTimers.push(setTimeout(()=>startCredits(),2600));
      },1200));
    },4300));
  }
  function startCredits(){
    show('credits');
    requestAnimationFrame(() => {
      const viewport = document.querySelector('.credits-viewport').clientHeight;
      const contentHeight = creditsContent.scrollHeight;
      const start = viewport * .9;
      const end = contentHeight + viewport * .9;
      const distance = start + end;
      creditsRoll.style.transition='none';
      creditsRoll.style.transform=`translateY(${start}px)`;
      const duration=Math.max(50, distance/34);
      requestAnimationFrame(()=>{
        creditsRoll.style.transition=`transform ${duration}s linear`;
        creditsRoll.style.transform=`translateY(-${end}px)`;
      });
    });
  }
  startFinal.addEventListener('click', launchFinal);

  replay.addEventListener('click',()=>{
    clearTimers(); music.pause(); music.currentTime=0; musicReady=false;
    letterRead=false; openLetter.classList.remove('hidden'); letterContinue.classList.add('hidden'); closeLetterModal();
    gift.classList.remove('opened'); giftButton.disabled=false; giftButton.textContent='ABRIR? 👀';
    answerInput.value=''; feedbackEl.textContent=''; feedbackEl.className='feedback'; suspense.style.opacity='1'; fim.classList.remove('show'); playMusic.classList.add('hidden');
    creditsRoll.style.transition='none'; creditsRoll.style.transform='translateY(0)'; show('intro');
  });

  // Corações/pétalas leves: decorativos e suaves.
  const petals=byId('petals');
  for(let i=0;i<18;i++){
    const p=document.createElement('span'); p.className='petal'; p.textContent=i%4===0?'♥':'✦'; p.style.left=`${Math.random()*100}%`; p.style.fontSize=`${8+Math.random()*12}px`; p.style.setProperty('--drift',`${-70+Math.random()*140}px`); p.style.animationDuration=`${12+Math.random()*12}s`; p.style.animationDelay=`${-Math.random()*16}s`; petals.appendChild(p);
  }
})();
