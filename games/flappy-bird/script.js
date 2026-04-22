// Flappy Bird Game Script

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('start-btn');
const fullscreenBtn = document.getElementById('fullscreen-btn');
const scoreDisplay = document.getElementById('score');
const leaderboardList = document.getElementById('leaderboard-list');

let bird = {x: 50, y: 300, dy: 0, radius: 15};
let pipes = [];
let score = 0;
let gameRunning = false;
let playerName = '';

const GRAVITY = 0.5;
const JUMP = -10;
const PIPE_WIDTH = 50;
const PIPE_GAP = 150;

// Create pipe
function createPipe() {
  const topHeight = Math.random() * (canvas.height - PIPE_GAP - 50) + 50;
  pipes.push({
    x: canvas.width,
    topHeight: topHeight,
    bottomY: topHeight + PIPE_GAP,
    passed: false
  });
}

// Draw
function draw() {
  ctx.fillStyle = '#87ceeb';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw pipes
  ctx.fillStyle = '#00ff00';
  pipes.forEach(pipe => {
    ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.topHeight);
    ctx.fillRect(pipe.x, pipe.bottomY, PIPE_WIDTH, canvas.height - pipe.bottomY);
  });

  // Draw bird
  ctx.fillStyle = '#ffff00';
  ctx.beginPath();
  ctx.arc(bird.x, bird.y, bird.radius, 0, Math.PI * 2);
  ctx.fill();

  // Draw ground
  ctx.fillStyle = '#8b4513';
  ctx.fillRect(0, canvas.height - 20, canvas.width, 20);
}

// Update
function update() {
  if (!gameRunning) return;

  // Bird physics
  bird.dy += GRAVITY;
  bird.y += bird.dy;

  // Create pipes
  if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 200) {
    createPipe();
  }

  // Move pipes
  pipes.forEach(pipe => {
    pipe.x -= 2;
  });

  // Remove off-screen pipes
  pipes = pipes.filter(pipe => pipe.x + PIPE_WIDTH > 0);

  // Check pipe passage
  pipes.forEach(pipe => {
    if (!pipe.passed && pipe.x + PIPE_WIDTH < bird.x) {
      pipe.passed = true;
      score++;
      scoreDisplay.textContent = `Score: ${score}`;
    }
  });

  // Collision with pipes
  pipes.forEach(pipe => {
    if (bird.x + bird.radius > pipe.x && bird.x - bird.radius < pipe.x + PIPE_WIDTH) {
      if (bird.y - bird.radius < pipe.topHeight || bird.y + bird.radius > pipe.bottomY) {
        gameOver();
      }
    }
  });

  // Collision with ground
  if (bird.y + bird.radius > canvas.height - 20) {
    gameOver();
  }

  // Collision with top
  if (bird.y - bird.radius < 0) {
    gameOver();
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
  const leaderboard = JSON.parse(localStorage.getItem('flappy-bird-leaderboard')) || [];
  leaderboard.push({name: playerName, score: score});
  leaderboard.sort((a, b) => b.score - a.score);
  localStorage.setItem('flappy-bird-leaderboard', JSON.stringify(leaderboard.slice(0, 10)));
}

// Display leaderboard
function displayLeaderboard() {
  const leaderboard = JSON.parse(localStorage.getItem('flappy-bird-leaderboard')) || [];
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
  bird.y = 300;
  bird.dy = 0;
  pipes = [];
  score = 0;
  scoreDisplay.textContent = 'Score: 0';
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
  if (e.code === 'Space') {
    e.preventDefault();
    if (gameRunning) {
      bird.dy = JUMP;
    }
  }
});

canvas.addEventListener('click', function() {
  if (gameRunning) {
    bird.dy = JUMP;
  }
});

// Initialize
displayLeaderboard();
gameLoop();