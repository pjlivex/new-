// Tic Tac Toe Game Script

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('start-btn');
const fullscreenBtn = document.getElementById('fullscreen-btn');
const turnDisplay = document.getElementById('turn');
const leaderboardList = document.getElementById('leaderboard-list');

let board = Array(3).fill().map(() => Array(3).fill(''));
let currentPlayer = 'X';
let playerX = '';
let playerO = '';
let scores = {X: 0, O: 0};

// Draw
function draw() {
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw grid
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(100, 0);
  ctx.lineTo(100, 300);
  ctx.moveTo(200, 0);
  ctx.lineTo(200, 300);
  ctx.moveTo(0, 100);
  ctx.lineTo(300, 100);
  ctx.moveTo(0, 200);
  ctx.lineTo(300, 200);
  ctx.stroke();

  // Draw pieces
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const x = j * 100 + 50;
      const y = i * 100 + 50;
      ctx.font = 'bold 48px Arial';
      ctx.textAlign = 'center';
      ctx.fillStyle = board[i][j] === 'X' ? '#ff0000' : '#0000ff';
      if (board[i][j]) {
        ctx.fillText(board[i][j], x, y + 15);
      }
    }
  }
}

// Check win
function checkWin() {
  // Rows
  for (let i = 0; i < 3; i++) {
    if (board[i][0] && board[i][0] === board[i][1] && board[i][1] === board[i][2]) {
      return board[i][0];
    }
  }
  // Columns
  for (let j = 0; j < 3; j++) {
    if (board[0][j] && board[0][j] === board[1][j] && board[1][j] === board[2][j]) {
      return board[0][j];
    }
  }
  // Diagonals
  if (board[0][0] && board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
    return board[0][0];
  }
  if (board[0][2] && board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
    return board[0][2];
  }
  return null;
}

// Check draw
function checkDraw() {
  return board.flat().every(cell => cell !== '');
}

// Handle click
canvas.addEventListener('click', function(e) {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const col = Math.floor(x / 100);
  const row = Math.floor(y / 100);

  if (board[row][col] === '') {
    board[row][col] = currentPlayer;
    const winner = checkWin();
    if (winner) {
      scores[winner]++;
      saveScore();
      displayLeaderboard();
      alert(`${winner === 'X' ? playerX : playerO} wins!`);
      newGame();
    } else if (checkDraw()) {
      alert('Draw!');
      newGame();
    } else {
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
      turnDisplay.textContent = `Turn: ${currentPlayer} (${currentPlayer === 'X' ? playerX : playerO})`;
    }
    draw();
  }
});

// New game
function newGame() {
  board = Array(3).fill().map(() => Array(3).fill(''));
  currentPlayer = 'X';
  turnDisplay.textContent = `Turn: X (${playerX})`;
  draw();
}

// Save score
function saveScore() {
  const leaderboard = JSON.parse(localStorage.getItem('tic-tac-toe-leaderboard')) || [];
  leaderboard.push({name: playerX, score: scores.X});
  leaderboard.push({name: playerO, score: scores.O});
  leaderboard.sort((a, b) => b.score - a.score);
  localStorage.setItem('tic-tac-toe-leaderboard', JSON.stringify(leaderboard.slice(0, 10)));
}

// Display leaderboard
function displayLeaderboard() {
  const leaderboard = JSON.parse(localStorage.getItem('tic-tac-toe-leaderboard')) || [];
  leaderboardList.innerHTML = '';
  leaderboard.forEach((entry, index) => {
    const li = document.createElement('li');
    li.textContent = `${index + 1}. ${entry.name}: ${entry.score}`;
    leaderboardList.appendChild(li);
  });
}

// Start game
startBtn.addEventListener('click', function() {
  playerX = prompt('Enter name for X:');
  if (!playerX) return;
  playerO = prompt('Enter name for O:');
  if (!playerO) return;
  scores = {X: 0, O: 0};
  newGame();
});

// Fullscreen
fullscreenBtn.addEventListener('click', function() {
  if (canvas.requestFullscreen) {
    canvas.requestFullscreen();
  }
});

// Initialize
displayLeaderboard();
draw();