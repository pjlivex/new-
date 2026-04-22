// Pong Game Script

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('start-btn');
const fullscreenBtn = document.getElementById('fullscreen-btn');
const scoreDisplay = document.getElementById('score');
const leaderboardList = document.getElementById('leaderboard-list');

let leftPaddle = {x: 10, y: 150, width: 10, height: 100};
let rightPaddle = {x: 580, y: 150, width: 10, height: 100};
let ball = {x: 300, y: 200, dx: 5, dy: 5, radius: 10};
let leftScore = 0;
let rightScore = 0;
let gameRunning = false;
let playerName = '';

const PADDLE_SPEED = 5;

// Draw
function draw() {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw paddles
  ctx.fillStyle = '#fff';
  ctx.fillRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height);
  ctx.fillRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height);

  // Draw ball
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fill();

  // Draw center line
  ctx.setLineDash([5, 15]);
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.strokeStyle = '#fff';
  ctx.stroke();
  ctx.setLineDash([]);
}

// Update
function update() {
  if (!gameRunning) return;

  // Move ball
  ball.x += ball.dx;
  ball.y += ball.dy;

  // Ball collision with top/bottom
  if (ball.y - ball.radius <= 0 || ball.y + ball.radius >= canvas.height) {
    ball.dy = -ball.dy;
  }

  // Ball collision with paddles
  if (ball.x - ball.radius <= leftPaddle.x + leftPaddle.width &&
      ball.y >= leftPaddle.y && ball.y <= leftPaddle.y + leftPaddle.height) {
    ball.dx = -ball.dx;
  }
  if (ball.x + ball.radius >= rightPaddle.x &&
      ball.y >= rightPaddle.y && ball.y <= rightPaddle.y + rightPaddle.height) {
    ball.dx = -ball.dx;
  }

  // Score
  if (ball.x < 0) {
    rightScore++;
    resetBall();
  }
  if (ball.x > canvas.width) {
    leftScore++;
    resetBall();
  }

  // AI for right paddle
  if (ball.y < rightPaddle.y + rightPaddle.height / 2) {
    rightPaddle.y -= PADDLE_SPEED;
  } else if (ball.y > rightPaddle.y + rightPaddle.height / 2) {
    rightPaddle.y += PADDLE_SPEED;
  }
  rightPaddle.y = Math.max(0, Math.min(canvas.height - rightPaddle.height, rightPaddle.y));

  scoreDisplay.textContent = `${leftScore} - ${rightScore}`;

  // Check win
  if (leftScore >= 5 || rightScore >= 5) {
    gameOver();
  }
}

// Reset ball
function resetBall() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.dx = Math.random() > 0.5 ? 5 : -5;
  ball.dy = Math.random() > 0.5 ? 5 : -5;
}

// Game over
function gameOver() {
  gameRunning = false;
  const winner = leftScore >= 5 ? playerName : 'AI';
  const score = leftScore;
  saveScore(score);
  displayLeaderboard();
  alert(`${winner} wins! Score: ${score}`);
}

// Save score
function saveScore(score) {
  const leaderboard = JSON.parse(localStorage.getItem('pong-leaderboard')) || [];
  leaderboard.push({name: playerName, score: score});
  leaderboard.sort((a, b) => b.score - a.score);
  localStorage.setItem('pong-leaderboard', JSON.stringify(leaderboard.slice(0, 10)));
}

// Display leaderboard
function displayLeaderboard() {
  const leaderboard = JSON.parse(localStorage.getItem('pong-leaderboard')) || [];
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
  leftScore = 0;
  rightScore = 0;
  resetBall();
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
    case 'w':
    case 'W':
      leftPaddle.y -= PADDLE_SPEED;
      break;
    case 's':
    case 'S':
      leftPaddle.y += PADDLE_SPEED;
      break;
  }
  leftPaddle.y = Math.max(0, Math.min(canvas.height - leftPaddle.height, leftPaddle.y));
});

// Initialize
displayLeaderboard();
gameLoop();