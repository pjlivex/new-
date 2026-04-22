// Snake Game Script

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('start-btn');
const fullscreenBtn = document.getElementById('fullscreen-btn');
const scoreDisplay = document.getElementById('score');
const leaderboardList = document.getElementById('leaderboard-list');

let snake = [{x: 200, y: 200}];
let direction = {x: 0, y: 0};
let food = {};
let score = 0;
let gameRunning = false;
let playerName = '';

const gridSize = 20;
const tileCount = canvas.width / gridSize;

// Generate random food
function randomFood() {
  food = {
    x: Math.floor(Math.random() * tileCount) * gridSize,
    y: Math.floor(Math.random() * tileCount) * gridSize
  };
}

// Draw game
function draw() {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw snake
  ctx.fillStyle = '#00ff00';
  snake.forEach(segment => {
    ctx.fillRect(segment.x, segment.y, gridSize - 2, gridSize - 2);
  });

  // Draw food
  ctx.fillStyle = '#ff0000';
  ctx.fillRect(food.x, food.y, gridSize - 2, gridSize - 2);
}

// Update game
function update() {
  if (!gameRunning) return;

  const head = {x: snake[0].x + direction.x, y: snake[0].y + direction.y};

  // Check wall collision
  if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
    gameOver();
    return;
  }

  // Check self collision
  if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
    gameOver();
    return;
  }

  snake.unshift(head);

  // Check food
  if (head.x === food.x && head.y === food.y) {
    score += 10;
    scoreDisplay.textContent = `Score: ${score}`;
    randomFood();
  } else {
    snake.pop();
  }
}

// Game over
function gameOver() {
  gameRunning = false;
  saveScore();
  displayLeaderboard();
  alert(`Game Over! Score: ${score}`);
}

// Save score
function saveScore() {
  const leaderboard = JSON.parse(localStorage.getItem('snake-leaderboard')) || [];
  leaderboard.push({name: playerName, score: score});
  leaderboard.sort((a, b) => b.score - a.score);
  localStorage.setItem('snake-leaderboard', JSON.stringify(leaderboard.slice(0, 10)));
}

// Display leaderboard
function displayLeaderboard() {
  const leaderboard = JSON.parse(localStorage.getItem('snake-leaderboard')) || [];
  leaderboardList.innerHTML = '';
  leaderboard.forEach((entry, index) => {
    const li = document.createElement('li');
    li.textContent = `${index + 1}. ${entry.name}: ${entry.score}`;
    leaderboardList.appendChild(li);
  });
}

// Game loop
function gameLoop() {
  update();
  draw();
  setTimeout(gameLoop, 100);
}

// Start game
startBtn.addEventListener('click', function() {
  playerName = prompt('Enter your name:');
  if (!playerName) return;
  snake = [{x: 200, y: 200}];
  direction = {x: gridSize, y: 0};
  score = 0;
  scoreDisplay.textContent = 'Score: 0';
  randomFood();
  gameRunning = true;
});

// Fullscreen
fullscreenBtn.addEventListener('click', function() {
  if (canvas.requestFullscreen) {
    canvas.requestFullscreen();
  }
});

// Controls
document.addEventListener('keydown', function(e) {
  if (!gameRunning) return;
  switch (e.key) {
    case 'ArrowUp':
      if (direction.y === 0) direction = {x: 0, y: -gridSize};
      break;
    case 'ArrowDown':
      if (direction.y === 0) direction = {x: 0, y: gridSize};
      break;
    case 'ArrowLeft':
      if (direction.x === 0) direction = {x: -gridSize, y: 0};
      break;
    case 'ArrowRight':
      if (direction.x === 0) direction = {x: gridSize, y: 0};
      break;
  }
});

// Initialize
displayLeaderboard();
gameLoop();