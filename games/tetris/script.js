// Tetris Game Script

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('start-btn');
const fullscreenBtn = document.getElementById('fullscreen-btn');
const scoreDisplay = document.getElementById('score');
const linesDisplay = document.getElementById('lines');
const leaderboardList = document.getElementById('leaderboard-list');

const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;
let board = Array.from({length: ROWS}, () => Array(COLS).fill(0));
let currentPiece = null;
let score = 0;
let lines = 0;
let gameRunning = false;
let dropTimer = 0;
let dropInterval = 1000;
let playerName = '';

const COLORS = ['#000', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffffff'];

const TETROMINOES = [
  [[1, 1, 1, 1]], // I
  [[1, 1], [1, 1]], // O
  [[0, 1, 0], [1, 1, 1]], // T
  [[1, 0, 0], [1, 1, 1]], // J
  [[0, 0, 1], [1, 1, 1]], // L
  [[1, 1, 0], [0, 1, 1]], // S
  [[0, 1, 1], [1, 1, 0]]  // Z
];

// Create piece
function createPiece(type) {
  return {
    shape: TETROMINOES[type],
    color: type + 1,
    x: Math.floor(COLS / 2) - 1,
    y: 0
  };
}

// Draw
function draw() {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw board
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      if (board[y][x]) {
        ctx.fillStyle = COLORS[board[y][x]];
        ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE - 1, BLOCK_SIZE - 1);
      }
    }
  }

  // Draw current piece
  if (currentPiece) {
    ctx.fillStyle = COLORS[currentPiece.color];
    currentPiece.shape.forEach((row, dy) => {
      row.forEach((value, dx) => {
        if (value) {
          ctx.fillRect((currentPiece.x + dx) * BLOCK_SIZE, (currentPiece.y + dy) * BLOCK_SIZE, BLOCK_SIZE - 1, BLOCK_SIZE - 1);
        }
      });
    });
  }
}

// Check collision
function collide(piece, board, dx = 0, dy = 0) {
  return piece.shape.some((row, y) =>
    row.some((value, x) =>
      value && (board[piece.y + y + dy] && board[piece.y + y + dy][piece.x + x + dx]) !== 0
    )
  );
}

// Place piece
function placePiece() {
  currentPiece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value) {
        board[currentPiece.y + y][currentPiece.x + x] = currentPiece.color;
      }
    });
  });
}

// Clear lines
function clearLines() {
  for (let y = ROWS - 1; y >= 0; y--) {
    if (board[y].every(cell => cell !== 0)) {
      board.splice(y, 1);
      board.unshift(Array(COLS).fill(0));
      lines++;
      score += 100;
      y++;
    }
  }
}

// Rotate piece
function rotate(piece) {
  const rotated = piece.shape[0].map((_, i) =>
    piece.shape.map(row => row[i]).reverse()
  );
  const rotatedPiece = {...piece, shape: rotated};
  if (!collide(rotatedPiece, board)) {
    currentPiece = rotatedPiece;
  }
}

// Game over
function gameOver() {
  gameRunning = false;
  saveScore();
  displayLeaderboard();
  alert(`Game Over! Score: ${score}, Lines: ${lines}`);
}

// Save score
function saveScore() {
  const leaderboard = JSON.parse(localStorage.getItem('tetris-leaderboard')) || [];
  leaderboard.push({name: playerName, score: score});
  leaderboard.sort((a, b) => b.score - a.score);
  localStorage.setItem('tetris-leaderboard', JSON.stringify(leaderboard.slice(0, 10)));
}

// Display leaderboard
function displayLeaderboard() {
  const leaderboard = JSON.parse(localStorage.getItem('tetris-leaderboard')) || [];
  leaderboardList.innerHTML = '';
  leaderboard.forEach((entry, index) => {
    const li = document.createElement('li');
    li.textContent = `${index + 1}. ${entry.name}: ${entry.score}`;
    leaderboardList.appendChild(li);
  });
}

// Update
function update() {
  if (!gameRunning) return;

  dropTimer += 16; // ~60fps
  if (dropTimer >= dropInterval) {
    dropTimer = 0;
    currentPiece.y++;
    if (collide(currentPiece, board)) {
      currentPiece.y--;
      placePiece();
      clearLines();
      currentPiece = createPiece(Math.floor(Math.random() * TETROMINOES.length));
      if (collide(currentPiece, board)) {
        gameOver();
        return;
      }
    }
  }

  scoreDisplay.textContent = `Score: ${score}`;
  linesDisplay.textContent = `Lines: ${lines}`;
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
  board = Array.from({length: ROWS}, () => Array(COLS).fill(0));
  currentPiece = createPiece(Math.floor(Math.random() * TETROMINOES.length));
  score = 0;
  lines = 0;
  dropTimer = 0;
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
  if (!gameRunning || !currentPiece) return;
  switch (e.key) {
    case 'ArrowLeft':
      if (!collide(currentPiece, board, -1, 0)) currentPiece.x--;
      break;
    case 'ArrowRight':
      if (!collide(currentPiece, board, 1, 0)) currentPiece.x++;
      break;
    case 'ArrowDown':
      if (!collide(currentPiece, board, 0, 1)) currentPiece.y++;
      break;
    case 'ArrowUp':
      rotate(currentPiece);
      break;
  }
});

// Initialize
displayLeaderboard();
gameLoop();