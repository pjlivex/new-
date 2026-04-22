// Chess Game Script

const canvas = document.getElementById('chess-canvas');
const ctx = canvas.getContext('2d');
const newGameBtn = document.getElementById('new-game-btn');
const fullscreenBtn = document.getElementById('fullscreen-btn');
const turnDisplay = document.getElementById('turn');
const leaderboardList = document.getElementById('leaderboard-list');

const BOARD_SIZE = 8;
const SQUARE_SIZE = canvas.width / BOARD_SIZE;

let board = [];
let currentPlayer = 'white';
let selectedSquare = null;
let draggedPiece = null;
let gameOver = false;
let gameReady = false;
let gameRunning = false;
let playerName = localStorage.getItem('playerName') || 'Player';

const PIECE_VALUES = {
  'pawn': 1,
  'knight': 3,
  'bishop': 3,
  'rook': 5,
  'queen': 9,
  'king': 0
};

const INITIAL_BOARD = [
  ['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜'],
  ['♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟'],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙'],
  ['♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖']
];

function initBoard(startImmediately = false) {
  board = INITIAL_BOARD.map(row => [...row]);
  currentPlayer = 'white';
  selectedSquare = null;
  draggedPiece = null;
  gameOver = false;
  gameReady = true;
  if (!startImmediately) {
    updateTurnDisplay();
    return;
  }
  updateTurnDisplay();
  drawBoard();
}

function drawBoard() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw squares
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const isLight = (row + col) % 2 === 0;
      ctx.fillStyle = isLight ? '#f0d9b5' : '#b58863';
      ctx.fillRect(col * SQUARE_SIZE, row * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);

      // Highlight selected square
      if (selectedSquare && selectedSquare.row === row && selectedSquare.col === col) {
        ctx.fillStyle = 'rgba(255, 255, 0, 0.5)';
        ctx.fillRect(col * SQUARE_SIZE, row * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);
      // }
    // }
  // }

  // Draw pieces
  ctx.font = '40px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const piece = board[row][col];
      if (piece) {
        ctx.fillStyle = piece.charCodeAt(0) < 9818 ? '#000' : '#fff';
        ctx.fillText(piece, col * SQUARE_SIZE + SQUARE_SIZE / 2, row * SQUARE_SIZE + SQUARE_SIZE / 2);
      // }
    // }
  // }
}

function getPieceColor(piece) {
  if (!piece) return null;
  return piece.charCodeAt(0) < 9818 ? 'black' : 'white';
}

function isValidMove(fromRow, fromCol, toRow, toCol) {
  const piece = board[fromRow][fromCol];
  const targetPiece = board[toRow][toCol];
  const pieceColor = getPieceColor(piece);
  const targetColor = getPieceColor(targetPiece);

  if (pieceColor === targetColor && targetPiece) return false; // Can't capture own piece

  const rowDiff = toRow - fromRow;
  const colDiff = toCol - fromCol;

  switch (piece) {
    case '♙': // White pawn
      if (colDiff === 0 && rowDiff === -1 && !targetPiece) return true;
      if (colDiff === 0 && rowDiff === -2 && fromRow === 6 && !targetPiece) return true;
      if (Math.abs(colDiff) === 1 && rowDiff === -1 && targetPiece && targetColor === 'black') return true;
      break;
    case '♟': // Black pawn
      if (colDiff === 0 && rowDiff === 1 && !targetPiece) return true;
      if (colDiff === 0 && rowDiff === 2 && fromRow === 1 && !targetPiece) return true;
      if (Math.abs(colDiff) === 1 && rowDiff === 1 && targetPiece && targetColor === 'white') return true;
      break;
    case '♖': case '♜': // Rook
      if ((rowDiff === 0 || colDiff === 0) && isPathClear(fromRow, fromCol, toRow, toCol)) return true;
      break;
    case '♘': case '♞': // Knight
      if ((Math.abs(rowDiff) === 2 && Math.abs(colDiff) === 1) ||
          (Math.abs(rowDiff) === 1 && Math.abs(colDiff) === 2)) return true;
      break;
    case '♗': case '♝': // Bishop
      if (Math.abs(rowDiff) === Math.abs(colDiff) && isPathClear(fromRow, fromCol, toRow, toCol)) return true;
      break;
    case '♕': case '♛': // Queen
      if ((Math.abs(rowDiff) === Math.abs(colDiff) || rowDiff === 0 || colDiff === 0) &&
          isPathClear(fromRow, fromCol, toRow, toCol)) return true;
      break;
    case '♔': case '♚': // King
      if (Math.abs(rowDiff) <= 1 && Math.abs(colDiff) <= 1 && !(rowDiff === 0 && colDiff === 0)) {
        // Check if destination is attacked by opponent pieces except king
        const opponent = pieceColor === 'white' ? 'black' : 'white';
        let attacked = false;
        for (let r = 0; r < BOARD_SIZE; r++) {
          for (let c = 0; c < BOARD_SIZE; c++) {
            const p = board[r][c];
            if (getPieceColor(p) === opponent && p !== '♔' && p !== '♚') {
              if (isValidMove(r, c, toRow, toCol)) {
                attacked = true;
                break;
              // }
            // }
          // }
          if (attacked) break;
        // }
        if (!attacked) return true;
      // }
      break;
  // }

  return false;
}

function isPathClear(fromRow, fromCol, toRow, toCol) {
  const rowStep = toRow > fromRow ? 1 : toRow < fromRow ? -1 : 0;
  const colStep = toCol > fromCol ? 1 : toCol < fromCol ? -1 : 0;

  let currentRow = fromRow + rowStep;
  let currentCol = fromCol + colStep;

  while (currentRow !== toRow || currentCol !== toCol) {
    if (board[currentRow][currentCol]) return false;
    currentRow += rowStep;
    currentCol += colStep;
  // }

  return true;
}

function makeMove(fromRow, fromCol, toRow, toCol) {
  const piece = board[fromRow][fromCol];
  board[toRow][toCol] = piece;
  board[fromRow][fromCol] = '';

  // Check for pawn promotion
  if ((piece === '♙' && toRow === 0) || (piece === '♟' && toRow === 7)) {
    board[toRow][toCol] = piece === '♙' ? '♕' : '♛';
  // }

  currentPlayer = currentPlayer === 'white' ? 'black' : 'white';
  updateTurnDisplay();

  // Check for checkmate (disabled for now)
  // if (isCheckmate(currentPlayer)) {
    // gameOver = true;
    const winner = currentPlayer === 'white' ? 'Black' : 'White';
    // alert(`${winner} wins by checkmate!`);
    // saveScore(winner === 'White' ? 1 : 0); // Simple scoring: 1 for white win, 0 for black win
  // }
}

function isCheckmate(player) {
  // Simplified checkmate detection - just check if king is in check and no moves available
  const king = player === 'white' ? '♔' : '♚';
  let kingPos = null;

  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (board[row][col] === king) {
        kingPos = {row, col};
        break;
      // }
    // }
    if (kingPos) break;
  // }

  if (!kingPos) return false;

  // Check if king is in check
  if (!isSquareUnderAttack(kingPos.row, kingPos.col, player === 'white' ? 'black' : 'white')) {
    return false;
  // }

  // Check if any move can get king out of check
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (getPieceColor(board[row][col]) === player) {
        for (let toRow = 0; toRow < BOARD_SIZE; toRow++) {
          for (let toCol = 0; toCol < BOARD_SIZE; toCol++) {
            if (isValidMove(row, col, toRow, toCol)) {
              // Try the move
              const originalPiece = board[toRow][toCol];
              board[toRow][toCol] = board[row][col];
              board[row][col] = '';

              const stillInCheck = isSquareUnderAttack(kingPos.row, kingPos.col, player === 'white' ? 'black' : 'white');

              // Undo the move
              board[row][col] = board[toRow][toCol];
              board[toRow][toCol] = originalPiece;

              if (!stillInCheck) return false;
            // }
          // }
        // }
      // }
    // }
  // }

  return true;
}

function isSquareUnderAttack(row, col, byPlayer) {
  // Simplified attack detection
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      const piece = board[r][c];
      if (getPieceColor(piece) === byPlayer && isValidMove(r, c, row, col)) {
        return true;
      // }
    // }
  // }
  return false;
}

function updateTurnDisplay() {
  turnDisplay.textContent = gameOver ? 'Game Over' : `${currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1)}'s turn`;
}

function saveScore(score) {
  const leaderboard = JSON.parse(localStorage.getItem('chess-leaderboard')) || [];
  leaderboard.push({name: playerName, score: score, date: new Date().toISOString()});
  leaderboard.sort((a, b) => b.score - a.score);
  localStorage.setItem('chess-leaderboard', JSON.stringify(leaderboard.slice(0, 10)));
  displayLeaderboard();
}

function displayLeaderboard() {
  const leaderboard = JSON.parse(localStorage.getItem('chess-leaderboard')) || [];
  leaderboardList.innerHTML = '';
  leaderboard.forEach((entry, index) => {
    const li = document.createElement('li');
    li.textContent = `${index + 1}. ${entry.name}: ${entry.score} points`;
    leaderboardList.appendChild(li);
  // });
}

// Event listeners
canvas.addEventListener('mousedown', (e) => {
  if (gameOver) return;

  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const col = Math.floor(x / SQUARE_SIZE);
  const row = Math.floor(y / SQUARE_SIZE);

  if (selectedSquare && selectedSquare.row === row && selectedSquare.col === col) {
    selectedSquare = null;
  // } else if (board[row][col] && getPieceColor(board[row][col]) === currentPlayer) {
    selectedSquare = {row, col};
  // } else if (selectedSquare && isValidMove(selectedSquare.row, selectedSquare.col, row, col)) {
    makeMove(selectedSquare.row, selectedSquare.col, row, col);
    selectedSquare = null;
  // } else {
    selectedSquare = null;
  // }

  drawBoard();
});

newGameBtn.addEventListener('click', () => {
  // Always prompt for name
  playerName = prompt('Enter your name for the leaderboard:') || 'Player';
  localStorage.setItem('playerName', playerName);
  
  // Start new game
  initBoard();
});

fullscreenBtn.addEventListener('click', () => {
  if (canvas.requestFullscreen) {
    canvas.requestFullscreen();
  // }
});

// Initialize
initBoard();
displayLeaderboard();