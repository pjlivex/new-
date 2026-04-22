// 2048 Game Script

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('start-btn');
const fullscreenBtn = document.getElementById('fullscreen-btn');
const scoreDisplay = document.getElementById('score');
const leaderboardList = document.getElementById('leaderboard-list');

let grid = Array(4).fill().map(() => Array(4).fill(0));
let score = 0;
let playerName = '';

const TILE_SIZE = 80;
const COLORS = {
  0: '#cdc1b4',
  2: '#eee4da',
  4: '#ede0c8',
  8: '#f2b179',
  16: '#f59563',
  32: '#f67c5f',
  64: '#f65e3b',
  128: '#edcf72',
  256: '#edcc61',
  512: '#edc850',
  1024: '#edc53f',
  2048: '#edc22e'
};

// Draw
function draw() {
  ctx.fillStyle = '#bbada0';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      const value = grid[i][j];
      const x = j * TILE_SIZE + 10;
      const y = i * TILE_SIZE + 10;
      ctx.fillStyle = COLORS[value] || '#3c3a32';
      ctx.fillRect(x, y, TILE_SIZE - 20, TILE_SIZE - 20);
      if (value !== 0) {
        ctx.fillStyle = value <= 4 ? '#776e65' : '#f9f6f2';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(value.toString(), x + (TILE_SIZE - 20) / 2, y + (TILE_SIZE - 20) / 2 + 8);
      }
    }
  }
}

// Add random tile
function addRandomTile() {
  const emptyCells = [];
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (grid[i][j] === 0) {
        emptyCells.push({i, j});
      }
    }
  }
  if (emptyCells.length > 0) {
    const {i, j} = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    grid[i][j] = Math.random() < 0.9 ? 2 : 4;
  }
}

// Slide and merge
function slide(row) {
  const filtered = row.filter(val => val !== 0);
  for (let i = 0; i < filtered.length - 1; i++) {
    if (filtered[i] === filtered[i + 1]) {
      filtered[i] *= 2;
      score += filtered[i];
      filtered[i + 1] = 0;
    }
  }
  const newRow = filtered.filter(val => val !== 0);
  while (newRow.length < 4) {
    newRow.push(0);
  }
  return newRow;
}

// Move
function move(direction) {
  let moved = false;
  if (direction === 'left') {
    for (let i = 0; i < 4; i++) {
      const newRow = slide(grid[i]);
      if (JSON.stringify(grid[i]) !== JSON.stringify(newRow)) moved = true;
      grid[i] = newRow;
    }
  } else if (direction === 'right') {
    for (let i = 0; i < 4; i++) {
      const newRow = slide(grid[i].reverse()).reverse();
      if (JSON.stringify(grid[i]) !== JSON.stringify(newRow)) moved = true;
      grid[i] = newRow;
    }
  } else if (direction === 'up') {
    for (let j = 0; j < 4; j++) {
      const col = [grid[0][j], grid[1][j], grid[2][j], grid[3][j]];
      const newCol = slide(col);
      if (JSON.stringify(col) !== JSON.stringify(newCol)) moved = true;
      for (let i = 0; i < 4; i++) {
        grid[i][j] = newCol[i];
      }
    }
  } else if (direction === 'down') {
    for (let j = 0; j < 4; j++) {
      const col = [grid[3][j], grid[2][j], grid[1][j], grid[0][j]];
      const newCol = slide(col);
      if (JSON.stringify(col) !== JSON.stringify(newCol)) moved = true;
      grid[3][j] = newCol[0];
      grid[2][j] = newCol[1];
      grid[1][j] = newCol[2];
      grid[0][j] = newCol[3];
    }
  }

  if (moved) {
    addRandomTile();
    scoreDisplay.textContent = `Score: ${score}`;
    checkWin();
  }
}

// Check win
function checkWin() {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (grid[i][j] === 2048) {
        alert('You Win!');
        saveScore();
        displayLeaderboard();
        return;
      }
    }
  }
}

// Save score
function saveScore() {
  const leaderboard = JSON.parse(localStorage.getItem('2048-leaderboard')) || [];
  leaderboard.push({name: playerName, score: score});
  leaderboard.sort((a, b) => b.score - a.score);
  localStorage.setItem('2048-leaderboard', JSON.stringify(leaderboard.slice(0, 10)));
}

// Display leaderboard
function displayLeaderboard() {
  const leaderboard = JSON.parse(localStorage.getItem('2048-leaderboard')) || [];
  leaderboardList.innerHTML = '';
  leaderboard.forEach((entry, index) => {
    const li = document.createElement('li');
    li.textContent = `${index + 1}. ${entry.name}: ${entry.score}`;
    leaderboardList.appendChild(li);
  });
}

// Start game
startBtn.addEventListener('click', function() {
  playerName = prompt('Enter your name:');
  if (!playerName) return;
  grid = Array(4).fill().map(() => Array(4).fill(0));
  score = 0;
  scoreDisplay.textContent = 'Score: 0';
  addRandomTile();
  addRandomTile();
  draw();
});

// Fullscreen
fullscreenBtn.addEventListener('click', function() {
  if (canvas.requestFullscreen) {
    canvas.requestFullscreen();
  }
});

// Controls
document.addEventListener('keydown', function(e) {
  switch (e.key) {
    case 'ArrowLeft':
      move('left');
      break;
    case 'ArrowRight':
      move('right');
      break;
    case 'ArrowUp':
      move('up');
      break;
    case 'ArrowDown':
      move('down');
      break;
  }
  draw();
});

// Initialize
displayLeaderboard();
draw();