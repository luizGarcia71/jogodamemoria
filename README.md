🧠 Jogo da Memória Temático

Este projeto apresenta o desenvolvimento de um jogo da memória digital voltado para dispositivos móveis e navegadores modernos. Construído com HTML5, CSS3 e JavaScript (ES6+), o jogo combina usabilidade, animações modernas e princípios de design centrado no usuário para oferecer uma experiência acessível, leve e interativa.

📱 Sobre o Projeto

O objetivo do jogo é modernizar o clássico jogo da memória, incorporando:

Animações visuais e efeitos sonoros

Interface responsiva

Experiência fluida em dispositivos móveis

Múltiplos personagens e cartas dinâmicas

Contagem de tempo para medir o desempenho do jogador

O jogo foi desenvolvido com foco em acessibilidade, desempenho e experiência lúdica, podendo ser utilizado como ferramenta de lazer e também de estimulação cognitiva.

🧩 Funcionalidades Principais
✔️ Criação dinâmica de cartas

As cartas são geradas via JavaScript.

10 personagens são duplicados, formando 20 cartas.

Embaralhamento realizado com Math.random() a cada nova partida.

✔️ Mecânica de jogo completa

Virar cartas com animação 3D (flip).

Comparação automática de pares.

Bloqueio de interação enquanto cartas são verificadas.

Marca de cartas finalizadas com .disabled-card.

✔️ Timer integrado

Contagem de tempo usando setInterval()

Exibição do tempo ao fim da partida.

O tempo funciona como pontuação principal.

✔️ Persistência de dados

Nome do jogador armazenado com localStorage.

✔️ Responsividade total

Layout com CSS Grid

Ajuste automático em diferentes telas via media queries

Jogável em celular, tablet ou desktop.

✔️ Animações modernas

Cartas usam CSS 3D Transforms

Efeito de virada usando rotateY(180deg)

Transições suaves (transition: transform 0.4s ease)

🛠 Tecnologias Utilizadas

HTML5 — estrutura da interface

CSS3 — layout, responsividade e animações

JavaScript (ES6+) — lógica do jogo, timer e manipulação do DOM

LocalStorage — persistência do nome do jogador

CSS Grid & Media Queries — responsividade
