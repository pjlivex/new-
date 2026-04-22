// Space Invaders Game Script

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('start-btn');
const fullscreenBtn = document.getElementById('fullscreen-btn');
const scoreDisplay = document.getElementById('score');
const livesDisplay = document.getElementById('lives');
const leaderboardList = document.getElementById('leaderboard-list');

let player = {x: 180, y: 350, width: 40, height: 20};
let aliens = [];
let bullets = [];
let alienBullets = [];
let score = 0;
let lives = 3;
let gameRunning = false;
let direction = 1;
let playerName = '';

const ALIEN_ROWS = 4;
const ALIEN_COLS = 8;
const ALIEN_WIDTH = 30;
const ALIEN_HEIGHT = 20;

// Create aliens
function createAliens() {
  aliens = [];
  for (let row = 0; row < ALIEN_ROWS; row++) {
    for (let col = 0; col < ALIEN_COLS; col++) {
      aliens.push({
        x: col * 40 + 20,
        y: row * 30 + 50,
        width: ALIEN_WIDTH,
        height: ALIEN_HEIGHT,
        alive: true
      });
    }
  }
}

// Draw
function draw() {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw aliens
  ctx.fillStyle = '#00ff00';
  aliens.forEach(alien => {
    if (alien.alive) {
      ctx.fillRect(alien.x, alien.y, alien.width, alien.height);
    }
  });

  // Draw player
  ctx.fillStyle = '#00ffff';
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // Draw bullets
  ctx.fillStyle = '#ffff00';
  bullets.forEach(bullet => {
    ctx.fillRect(bullet.x, bullet.y, 2, 10);
  });

  // Draw alien bullets
  ctx.fillStyle = '#ff0000';
  alienBullets.forEach(bullet => {
    ctx.fillRect(bullet.x, bullet.y, 2, 10);
  });
}

// Update
function update() {
  if (!gameRunning) return;

  // Move aliens
  let edge = false;
  aliens.forEach(alien => {
    if (alien.alive) {
      alien.x += direction * 2;
      if (alien.x <= 0 || alien.x + alien.width >= canvas.width) {
        edge = true;
      }
    }
  });
  if (edge) {
    direction = -direction;
    aliens.forEach(alien => {
      if (alien.alive) alien.y += 10;
    });
  }

  // Move bullets
  bullets.forEach((bullet, index) => {
    bullet.y -= 5;
    if (bullet.y < 0) {
      bullets.splice(index, 1);
    }
  });

  // Move alien bullets
  alienBullets.forEach((bullet, index) => {
    bullet.y += 3;
    if (bullet.y > canvas.height) {
      alienBullets.splice(index, 1);
    }
  });

  // Bullet collision with aliens
  bullets.forEach((bullet, bIndex) => {
    aliens.forEach((alien, aIndex) => {
      if (alien.alive &&
          bullet.x >= alien.x && bullet.x <= alien.x + alien.width &&
          bullet.y >= alien.y && bullet.y <= alien.y + alien.height) {
        alien.alive = false;
        bullets.splice(bIndex, 1);
        score += 10;
        scoreDisplay.textContent = `Score: ${score}`;
      }
    });
  });

  // Alien bullets collision with player
  alienBullets.forEach((bullet, index) => {
    if (bullet.x >= player.x && bullet.x <= player.x + player.width &&
        bullet.y >= player.y && bullet.y <= player.y + player.height) {
      lives--;
      livesDisplay.textContent = `Lives: ${lives}`;
      alienBullets.splice(index, 1);
      if (lives <= 0) {
        gameOver();
      }
    }
  });

  // Alien shoot
  if (Math.random() < 0.01) {
    const aliveAliens = aliens.filter(a => a.alive);
    if (aliveAliens.length > 0) {
      const shooter = aliveAliens[Math.floor(Math.random() * aliveAliens.length)];
      alienBullets.push({x: shooter.x + shooter.width / 2, y: shooter.y + shooter.height});
    }
  }

  // Check win
  if (aliens.every(a => !a.alive)) {
    gameWin();
  }

  // Check lose
  if (aliens.some(a => a.alive && a.y + a.height >= player.y)) {
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

// Game win
function gameWin() {
  gameRunning = false;
  saveScore();
  displayLeaderboard();
  alert(`You Win! Score: ${score}`);
}

// Save score
function saveScore() {
  const leaderboard = JSON.parse(localStorage.getItem('space-invaders-leaderboard')) || [];
  leaderboard.push({name: playerName, score: score});
  leaderboard.sort((a, b) => b.score - a.score);
  localStorage.setItem('space-invaders-leaderboard', JSON.stringify(leaderboard.slice(0, 10)));
}

// Display leaderboard
function displayLeaderboard() {
  const leaderboard = JSON.parse(localStorage.getItem('space-invaders-leaderboard')) || [];
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
  createAliens();
  bullets = [];
  alienBullets = [];
  score = 0;
  lives = 3;
  direction = 1;
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
      player.x -= 5;
      break;
    case 'ArrowRight':
      player.x += 5;
      break;
    case ' ':
      e.preventDefault();
      bullets.push({x: player.x + player.width / 2, y: player.y});
      break;
  }
  player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));
});

// Initialize
displayLeaderboard();
gameLoop();