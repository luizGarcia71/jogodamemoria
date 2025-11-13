const grid = document.querySelector('.grid');
const spanPlayer = document.querySelector('.player');
const spanMode = document.querySelector('.mode');
const timer = document.querySelector('.timer');
const livesContainer = document.querySelector('.lives');

const characters = [
  'beth',
  'jerry',
  'jessica',
  'morty',
  'pessoa-passaro',
  'pickle-rick',
  'rick',
  'summer',
  'meeseeks',
  'scroopy',
];

const createElement = (tag, className) => {
  const element = document.createElement(tag);
  element.className = className;
  return element;
};

let firstCard = '';
let secondCard = '';
let mode = localStorage.getItem('gameMode') || 'normal';
let timeLeft = 60;
let loop;

/* ===== SISTEMA DE VIDAS (apenas modo HARD) ===== */
const maxLivesByMode = { hard: 3 }; // só hard tem vidas
let lives = 0;

function renderHearts() {
  livesContainer.innerHTML = '';
  if (mode !== 'hard') {
    livesContainer.style.display = 'none';
    return;
  }
  livesContainer.style.display = 'flex';
  const total = maxLivesByMode.hard;
  for (let i = 0; i < total; i++) {
    const heart = document.createElement('span');
    heart.className = 'heart' + (i < lives ? '' : ' empty');
    heart.innerHTML = `
      <svg viewBox="0 0 24 24">
        <path d="M12 21s-7.5-4.35-9.5-7.05C.9 10.9 3.3 6 7.5 6c2 0 3.5 1.2 4.5 2.6C13 7.2 14.5 6 16.5 6 20.7 6 23.1 10.9 21.5 13.95 19.5 16.65 12 21 12 21z"/>
      </svg>
    `;
    livesContainer.appendChild(heart);
  }
}

function loseLife() {
  if (mode !== 'hard') return; // só desconta no modo hard
  if (lives > 0) {
    lives--;
    renderHearts();
    if (lives <= 0) {
      gameOver(`💔 Você perdeu todas as vidas, ${spanPlayer.innerHTML}!`);
    }
  }
}

function gameOver(message) {
  clearInterval(loop);

  if (confirm(`${message}\n\nDeseja jogar novamente?`)) {
    location.reload();
  } else {
    window.location = '../index.html'; // VOLTA PARA LOGIN
  }
}

/* ===== JOGO ===== */
const checkEndGame = () => {
  const disabledCards = document.querySelectorAll('.disabled-card');
  if (disabledCards.length === 20) {
    clearInterval(loop);

    if (confirm(`🎉 Parabéns, ${spanPlayer.innerHTML}!\nDeseja jogar novamente?`)) {
      location.reload();
    } else {
      window.location = '../index.html'; // VOLTA PARA LOGIN
    }
  }
};

const endByTimeout = () => {
  clearInterval(loop);

  if (confirm(`⏰ O tempo acabou, ${spanPlayer.innerHTML}!\nDeseja jogar novamente?`)) {
    location.reload();
  } else {
    window.location = '../index.html'; // VOLTA PARA LOGIN
  }
};

const checkCards = () => {
  const firstCharacter = firstCard.getAttribute('data-character');
  const secondCharacter = secondCard.getAttribute('data-character');

  if (firstCharacter === secondCharacter) {
    firstCard.firstChild.classList.add('disabled-card');
    secondCard.firstChild.classList.add('disabled-card');

    firstCard = '';
    secondCard = '';

    if (mode === 'frenetic') {
      timeLeft += 5;
      timer.innerHTML = timeLeft;
    }

    checkEndGame();
  } else {
    setTimeout(() => {
      firstCard.classList.remove('reveal-card');
      secondCard.classList.remove('reveal-card');
      firstCard = '';
      secondCard = '';

      if (mode === 'hard') {
        loseLife();
      }
    }, 500);
  }
};

/* Robust revealCard that works with click, touch and pointer events */
const revealCard = (event) => {
  // determine the card element reliably
  // event.currentTarget will be present when handler attached to card;
  // if handler receives a face element event, try closest('.card')
  let cardEl = null;

  if (event.currentTarget && event.currentTarget.classList && event.currentTarget.classList.contains('card')) {
    cardEl = event.currentTarget;
  } else {
    // fallback
    cardEl = event.target && event.target.closest ? event.target.closest('.card') : null;
  }

  if (!cardEl) return;

  // Prevent default behavior on touch to avoid ghost clicks / scrolling
  if (event.type === 'touchend' || event.type === 'touchstart') {
    event.preventDefault && event.preventDefault();
  }

  // if card already revealed, ignore
  if (cardEl.classList.contains('reveal-card')) return;

  // guard: if both cards are occupied, ignore clicks until they reset
  if (firstCard !== '' && secondCard !== '') return;

  // reveal logic
  cardEl.classList.add('reveal-card');

  if (firstCard === '') {
    firstCard = cardEl;
  } else if (secondCard === '') {
    secondCard = cardEl;
    checkCards();
  }
};

const createCard = (character) => {
  const card = createElement('div', 'card');
  const front = createElement('div', 'face front');
  const back = createElement('div', 'face back');

  front.style.backgroundImage = `url('../images/${character}.png')`;

  card.appendChild(front);
  card.appendChild(back);

  // add multiple listeners to ensure mobile compatibility
  // pointer events cover mouse + touch on modern browsers
  card.addEventListener('pointerup', revealCard);
  // legacy touch for older browsers, passive:false to allow preventDefault
  card.addEventListener('touchend', revealCard, { passive: false });
  // click as a fallback
  card.addEventListener('click', revealCard);

  card.setAttribute('data-character', character);
  return card;
};

const loadGame = () => {
  const duplicateCharacters = [...characters, ...characters];
  const shuffledArray = duplicateCharacters.sort(() => Math.random() - 0.5);
  shuffledArray.forEach((character) => {
    const card = createCard(character);
    grid.appendChild(card);
  });
};

const startNormalTimer = () => {
  timer.innerHTML = 0;
  loop = setInterval(() => {
    timer.innerHTML = +timer.innerHTML + 1;
  }, 1000);
};

const startCountdownTimer = (startTime) => {
  timeLeft = startTime;
  timer.innerHTML = timeLeft;
  loop = setInterval(() => {
    timeLeft--;
    timer.innerHTML = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(loop);
      endByTimeout();
    }
  }, 1000);
};

window.onload = () => {
  spanPlayer.innerHTML = localStorage.getItem('player');
  mode = localStorage.getItem('gameMode') || 'normal';
  spanMode.innerHTML = mode;

  // vidas só existem no modo hard
  if (mode === 'hard') {
    lives = maxLivesByMode.hard;
  } else {
    lives = 0;
  }

  renderHearts();
  loadGame();

  switch (mode) {
    case 'normal':
      startNormalTimer();
      break;
    case 'timeattack':
      startCountdownTimer(60);
      break;
    case 'hard':
      startNormalTimer();
      break;
    case 'frenetic':
      startCountdownTimer(30);
      break;
    default:
      startNormalTimer();
  }
};
