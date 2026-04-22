// Breakout Game Script

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('start-btn');
const fullscreenBtn = document.getElementById('fullscreen-btn');
const scoreDisplay = document.getElementById('score');
const livesDisplay = document.getElementById('lives');
const leaderboardList = document.getElementById('leaderboard-list');

let paddle = {x: 200, y: 300, width: 80, height: 10};
let ball = {x: 240, y: 280, dx: 3, dy: -3, radius: 8};
let bricks = [];
let score = 0;
let lives = 3;
let gameRunning = false;
let playerName = '';

const BRICK_ROWS = 5;
const BRICK_COLS = 8;
const BRICK_WIDTH = 50;
const BRICK_HEIGHT = 20;
const BRICK_PADDING = 5;

// Create bricks
function createBricks() {
  bricks = [];
  for (let row = 0; row < BRICK_ROWS; row++) {
    for (let col = 0; col < BRICK_COLS; col++) {
      bricks.push({
        x: col * (BRICK_WIDTH + BRICK_PADDING) + BRICK_PADDING,
        y: row * (BRICK_HEIGHT + BRICK_PADDING) + BRICK_PADDING + 50,
        width: BRICK_WIDTH,
        height: BRICK_HEIGHT,
        visible: true
      });
    }
  }
}

// Draw
function draw() {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw bricks
  ctx.fillStyle = '#ff0000';
  bricks.forEach(brick => {
    if (brick.visible) {
      ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
    }
  });

  // Draw paddle
  ctx.fillStyle = '#00ff00';
  ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);

  // Draw ball
  ctx.fillStyle = '#ffff00';
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fill();
}

// Update
function update() {
  if (!gameRunning) return;

  // Move ball
  ball.x += ball.dx;
  ball.y += ball.dy;

  // Ball collision with walls
  if (ball.x - ball.radius <= 0 || ball.x + ball.radius >= canvas.width) {
    ball.dx = -ball.dx;
  }
  if (ball.y - ball.radius <= 0) {
    ball.dy = -ball.dy;
  }

  // Ball collision with paddle
  if (ball.y + ball.radius >= paddle.y && ball.x >= paddle.x && ball.x <= paddle.x + paddle.width) {
    ball.dy = -ball.dy;
  }

  // Ball below paddle
  if (ball.y > canvas.height) {
    lives--;
    livesDisplay.textContent = `Lives: ${lives}`;
    if (lives <= 0) {
      gameOver();
      return;
    }
    resetBall();
  }

  // Ball collision with bricks
  bricks.forEach(brick => {
    if (brick.visible &&
        ball.x >= brick.x && ball.x <= brick.x + brick.width &&
        ball.y >= brick.y && ball.y <= brick.y + brick.height) {
      brick.visible = false;
      ball.dy = -ball.dy;
      score += 10;
      scoreDisplay.textContent = `Score: ${score}`;
    }
  });

  // Check win
  if (bricks.every(brick => !brick.visible)) {
    gameWin();
  }
}

// Reset ball
function resetBall() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.dx = 3;
  ball.dy = -3;
}

// Game over
function gameOver() {
  gameRunning = false;
  saveScore();
  displayLeaderboard();
  alert(`Game Over! Score: ${score}`);
}

// Game win
function gameWin() {
  gameRunning = false;
  saveScore();
  displayLeaderboard();
  alert(`You Win! Score: ${score}`);
}

// Save score
function saveScore() {
  const leaderboard = JSON.parse(localStorage.getItem('breakout-leaderboard')) || [];
  leaderboard.push({name: playerName, score: score});
  leaderboard.sort((a, b) => b.score - a.score);
  localStorage.setItem('breakout-leaderboard', JSON.stringify(leaderboard.slice(0, 10)));
}

// Display leaderboard
function displayLeaderboard() {
  const leaderboard = JSON.parse(localStorage.getItem('breakout-leaderboard')) || [];
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
  requestAnimationFrame(gameLoop);
}

// Start game
startBtn.addEventListener('click', function() {
  playerName = prompt('Enter your name:');
  if (!playerName) return;
  createBricks();
  resetBall();
  score = 0;
  lives = 3;
  scoreDisplay.textContent = 'Score: 0';
  livesDisplay.textContent = 'Lives: 3';
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
    case 'ArrowLeft':
      paddle.x -= 10;
      break;
    case 'ArrowRight':
      paddle.x += 10;
      break;
  }
  paddle.x = Math.max(0, Math.min(canvas.width - paddle.width, paddle.x));
});

// Initialize
displayLeaderboard();
gameLoop();