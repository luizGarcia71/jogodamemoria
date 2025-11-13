const input = document.querySelector('.login__input');
const button = document.querySelector('.login__button');
const form = document.querySelector('.login-form');

// 🔹 Ativa o botão apenas quando o nome tiver mais de 3 caracteres
const validateInput = ({ target }) => {
  if (target.value.length > 3) {
    button.removeAttribute('disabled');
    return;
  }

  button.setAttribute('disabled', '');
}

// 🔹 Ao enviar o formulário, salva o nome e o modo de jogo
const handleSubmit = (event) => {
  event.preventDefault();

  const playerName = input.value.trim();
  const selectedMode = document.querySelector('input[name="gameMode"]:checked').value;

  if (playerName === '') {
    alert('Por favor, insira seu nome antes de jogar.');
    return;
  }

  // Salva nome e modo no localStorage
  localStorage.setItem('player', playerName);
  localStorage.setItem('gameMode', selectedMode);

  // Vai para o jogo
  window.location = 'pages/game.html';
}

input.addEventListener('input', validateInput);
form.addEventListener('submit', handleSubmit);
