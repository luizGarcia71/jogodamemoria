const grid = document.querySelector('.grid');
const spanPlayer = document.querySelector('.player');
const spanMode = document.querySelector('.mode');
const timer = document.querySelector('.timer');
const livesContainer = document.querySelector('.lives');

const characters = [
  'beth','jerry','jessica','morty','pessoa-passaro',
  'pickle-rick','rick','summer','meeseeks','scroopy',
];

const createElement = (tag, className) => {
  const element = document.createElement(tag);
  element.className = className;
  return element;
};

let firstCard = '';
let secondCard = '';
let lockBoard = false;

let mode = localStorage.getItem('gameMode') || 'normal';
let timeLeft = 60;
let loop;

/* ===== SISTEMA DE VIDAS ===== */
const maxLivesByMode = { hard: 3 };
let lives = 0;

function renderHearts() {
  livesContainer.innerHTML = '';

  if (mode !== 'hard') {
    livesContainer.style.display = 'none';
    return;
  }

  livesContainer.style.display = 'flex';

  for (let i = 0; i < maxLivesByMode.hard; i++) {
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
  if (mode !== 'hard') return;

  lives--;
  renderHearts();

  if (lives <= 0) {
    gameOver(`💔 Você perdeu todas as vidas, ${spanPlayer.textContent}!`);
  }
}

function gameOver(message) {
  clearInterval(loop);

  if (confirm(`${message}\n\nDeseja jogar novamente?`)) {
    location.reload();
  } else {
    window.location = '../index.html';
  }
}

/* ===== FIM DE JOGO ===== */
const checkEndGame = () => {
  const disabledCards = document.querySelectorAll('.disabled-card');

  if (disabledCards.length === 20) {
    clearInterval(loop);

    if (confirm(`🎉 Parabéns, ${spanPlayer.textContent}!\nDeseja jogar novamente?`)) {
      location.reload();
    } else {
      window.location = '../index.html';
    }
  }
};

const endByTimeout = () => {
  clearInterval(loop);

  if (confirm(`⏰ O tempo acabou, ${spanPlayer.textContent}!\nDeseja jogar novamente?`)) {
    location.reload();
  } else {
    window.location = '../index.html';
  }
};

/* ===== LÓGICA DAS CARTAS ===== */
const resetCards = () => {
  firstCard = '';
  secondCard = '';
};

const checkCards = () => {
  const firstCharacter = firstCard.getAttribute('data-character');
  const secondCharacter = secondCard.getAttribute('data-character');

  if (firstCharacter === secondCharacter) {
    firstCard.firstChild.classList.add('disabled-card');
    secondCard.firstChild.classList.add('disabled-card');

    resetCards();
    lockBoard = false;

    if (mode === 'frenetic') {
      timeLeft = Math.min(timeLeft + 5, 60);
      timer.innerHTML = timeLeft;
    }

    checkEndGame();

  } else {
    setTimeout(() => {
      firstCard.classList.remove('reveal-card');
      secondCard.classList.remove('reveal-card');

      resetCards();
      lockBoard = false;

      if (mode === 'hard') loseLife();

    }, 500);
  }
};

const revealCard = (event) => {
  if (lockBoard) return;

  const card = event.currentTarget;

  if (card.classList.contains('reveal-card')) return;
  if (card === firstCard) return;

  card.classList.add('reveal-card');

  if (!firstCard) {
    firstCard = card;
  } else {
    secondCard = card;
    lockBoard = true;
    checkCards();
  }
};

/* ===== CRIAÇÃO DAS CARTAS ===== */
const createCard = (character) => {
  const card = createElement('div', 'card');
  const front = createElement('div', 'face front');
  const back = createElement('div', 'face back');

  front.style.backgroundImage = `url('../images/${character}.png')`;

  card.appendChild(front);
  card.appendChild(back);

  card.addEventListener('pointerup', revealCard);

  card.setAttribute('data-character', character);
  return card;
};

/* ===== EMBARALHAR ===== */
const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

/* ===== LOAD GAME ===== */
const loadGame = () => {
  const duplicateCharacters = [...characters, ...characters];
  shuffle(duplicateCharacters);

  const fragment = document.createDocumentFragment();

  duplicateCharacters.forEach((character) => {
    fragment.appendChild(createCard(character));
  });

  grid.appendChild(fragment);
};

/* ===== TIMERS ===== */
const startNormalTimer = () => {
  timer.innerHTML = 0;
  loop = setInterval(() => {
    timer.innerHTML++;
  }, 1000);
};

const startCountdownTimer = (startTime) => {
  timeLeft = startTime;
  timer.innerHTML = timeLeft;

  loop = setInterval(() => {
    timeLeft--;
    timer.innerHTML = timeLeft;

    if (timeLeft <= 0) endByTimeout();

  }, 1000);
};

const startGameByMode = () => {
  switch (mode) {
    case 'normal':
    case 'hard':
      startNormalTimer();
      break;
    case 'timeattack':
      startCountdownTimer(60);
      break;
    case 'frenetic':
      startCountdownTimer(30);
      break;
  }
};

/* ===== PREVIEW DAS CARTAS ===== */
const previewCards = (duration = 100) => {
  const cards = document.querySelectorAll('.card');

  lockBoard = true;

  cards.forEach(card => card.classList.add('reveal-card'));

  setTimeout(() => {
    cards.forEach(card => card.classList.remove('reveal-card'));
    lockBoard = false;
    startGameByMode();
  }, duration);
};

/* ===== INIT ===== */
window.onload = () => {
  spanPlayer.textContent = localStorage.getItem('player');
  mode = localStorage.getItem('gameMode') || 'normal';
  spanMode.textContent = mode;

  lives = mode === 'hard' ? maxLivesByMode.hard : 0;

  renderHearts();
  loadGame();

  let previewTime = 1500;

  if (mode === 'hard') previewTime = 2000;
  if (mode === 'frenetic') previewTime = 1500;
  if (mode === 'timeattack') previewTime = 2500;

  previewCards(previewTime);
};
