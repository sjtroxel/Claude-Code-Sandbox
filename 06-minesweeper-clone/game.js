// ============================================================
// MINESWEEPER — Windows 95 Edition
// Difficulty levels, Win95 menus, retro smiley behavior
// ============================================================

// ===== Difficulty Presets =====
const DIFFICULTIES = {
  beginner:     { rows: 9,  cols: 9,  mines: 10 },
  intermediate: { rows: 16, cols: 16, mines: 40 },
  expert:       { rows: 16, cols: 30, mines: 99 },
};

// ===== Current Settings =====
let currentDifficulty = 'beginner';
let rows = 9;
let cols = 9;
let mineCount = 10;

// ===== Game State =====
let board = [];
let gameOver = false;
let gameStarted = false;
let flagCount = 0;
let revealedCount = 0;
let timerInterval = null;
let seconds = 0;

// ===== DOM References =====
const boardEl = document.getElementById('board');
const mineCounterEl = document.getElementById('mine-counter');
const timerEl = document.getElementById('timer');
const resetBtn = document.getElementById('reset-btn');
const statusEl = document.getElementById('status');

// Menu elements
const gameMenu = document.getElementById('game-menu');
const helpMenu = document.getElementById('help-menu');

// Dialog elements
const customDialog = document.getElementById('custom-dialog');
const aboutDialog = document.getElementById('about-dialog');
const customRowsInput = document.getElementById('custom-rows');
const customColsInput = document.getElementById('custom-cols');
const customMinesInput = document.getElementById('custom-mines');

// ===== Initialization =====

function init() {
  board = [];
  gameOver = false;
  gameStarted = false;
  flagCount = 0;
  revealedCount = 0;
  seconds = 0;
  clearInterval(timerInterval);
  timerInterval = null;

  // Update CSS grid dimensions
  boardEl.style.setProperty('--rows', rows);
  boardEl.style.setProperty('--cols', cols);

  // Reset UI
  resetBtn.textContent = '🙂';
  timerEl.textContent = '000';
  updateMineCounter();
  statusEl.textContent = 'Click any cell to start!';
  boardEl.innerHTML = '';

  // Build board data
  for (let r = 0; r < rows; r++) {
    board[r] = [];
    for (let c = 0; c < cols; c++) {
      board[r][c] = {
        mine: false,
        revealed: false,
        flagged: false,
        adjacentMines: 0,
      };
    }
  }

  // Build DOM cells
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.row = r;
      cell.dataset.col = c;

      cell.addEventListener('click', () => handleLeftClick(r, c));
      cell.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        handleRightClick(r, c);
      });

      // Smiley goes 😮 on mousedown over unrevealed cells (classic behavior)
      cell.addEventListener('mousedown', (e) => {
        if (e.button === 0 && !gameOver) {
          const data = board[r][c];
          if (!data.revealed && !data.flagged) {
            resetBtn.textContent = '😮';
          }
        }
      });
      cell.addEventListener('mouseup', () => {
        if (!gameOver) resetBtn.textContent = '🙂';
      });
      cell.addEventListener('mouseleave', () => {
        if (!gameOver) resetBtn.textContent = '🙂';
      });

      boardEl.appendChild(cell);
    }
  }

  // Update difficulty checkmarks
  updateDifficultyChecks();
}

// Place mines AFTER the first click so you never die on turn one
function placeMines(safeRow, safeCol) {
  let placed = 0;
  const totalCells = rows * cols;
  const maxAttempts = totalCells * 10;
  let attempts = 0;

  while (placed < mineCount && attempts < maxAttempts) {
    attempts++;
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);

    // Skip the safe cell and its 3x3 neighborhood
    if (Math.abs(r - safeRow) <= 1 && Math.abs(c - safeCol) <= 1) continue;
    if (board[r][c].mine) continue;

    board[r][c].mine = true;
    placed++;
  }

  // If we couldn't place all mines with the safe zone (very dense board),
  // place remaining mines anywhere that isn't the clicked cell or already mined
  while (placed < mineCount) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);
    if (r === safeRow && c === safeCol) continue;
    if (board[r][c].mine) continue;
    board[r][c].mine = true;
    placed++;
  }

  // Calculate adjacency counts
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!board[r][c].mine) {
        board[r][c].adjacentMines = countAdjacentMines(r, c);
      }
    }
  }
}

// ===== Helpers =====

function getNeighbors(r, c) {
  const neighbors = [];
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
        neighbors.push([nr, nc]);
      }
    }
  }
  return neighbors;
}

function countAdjacentMines(r, c) {
  return getNeighbors(r, c).filter(([nr, nc]) => board[nr][nc].mine).length;
}

function getCellEl(r, c) {
  return boardEl.children[r * cols + c];
}

function formatNumber(n, digits = 3) {
  const clamped = Math.min(Math.max(n, -99), 999);
  if (clamped < 0) {
    return '-' + String(Math.abs(clamped)).padStart(digits - 1, '0');
  }
  return String(clamped).padStart(digits, '0');
}

function updateMineCounter() {
  const remaining = mineCount - flagCount;
  mineCounterEl.textContent = formatNumber(remaining);
}

function startTimer() {
  if (timerInterval) return;
  timerInterval = setInterval(() => {
    seconds++;
    if (seconds > 999) seconds = 999;
    timerEl.textContent = formatNumber(seconds);
  }, 1000);
}

// ===== Click Handlers =====

function handleLeftClick(r, c) {
  if (gameOver) return;

  const cell = board[r][c];
  if (cell.revealed || cell.flagged) return;

  // First click: place mines and start timer
  if (!gameStarted) {
    gameStarted = true;
    placeMines(r, c);
    startTimer();
    statusEl.textContent = '';
  }

  // Hit a mine
  if (cell.mine) {
    cell.revealed = true;
    revealAllMines(r, c);
    endGame(false);
    return;
  }

  // Reveal the cell (flood-fill if empty)
  reveal(r, c);
  checkWin();
}

function handleRightClick(r, c) {
  if (gameOver) return;

  const cell = board[r][c];
  if (cell.revealed) return;

  cell.flagged = !cell.flagged;
  flagCount += cell.flagged ? 1 : -1;

  const cellEl = getCellEl(r, c);
  if (cell.flagged) {
    cellEl.classList.add('flagged');
    cellEl.textContent = '🚩';
  } else {
    cellEl.classList.remove('flagged');
    cellEl.textContent = '';
  }

  updateMineCounter();
}

// ===== Reveal Logic =====

function reveal(r, c) {
  const cell = board[r][c];
  if (cell.revealed || cell.flagged || cell.mine) return;

  cell.revealed = true;
  revealedCount++;

  const cellEl = getCellEl(r, c);
  cellEl.classList.add('revealed');

  if (cell.adjacentMines > 0) {
    cellEl.textContent = cell.adjacentMines;
    cellEl.dataset.number = cell.adjacentMines;
  } else {
    // Empty cell — flood-fill neighbors
    for (const [nr, nc] of getNeighbors(r, c)) {
      reveal(nr, nc);
    }
  }
}

function revealAllMines(clickedRow, clickedCol) {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = board[r][c];
      const cellEl = getCellEl(r, c);

      if (cell.mine) {
        cellEl.classList.add('revealed');
        if (r === clickedRow && c === clickedCol) {
          cellEl.textContent = '💥';
          cellEl.classList.add('exploded');
        } else if (!cell.flagged) {
          cellEl.textContent = '💣';
        }
      } else if (cell.flagged) {
        cellEl.textContent = '❌';
        cellEl.classList.add('wrong-flag');
      }
    }
  }
}

// ===== Win / Lose =====

function checkWin() {
  const totalSafe = rows * cols - mineCount;
  if (revealedCount === totalSafe) {
    endGame(true);
  }
}

function endGame(won) {
  gameOver = true;
  clearInterval(timerInterval);

  if (won) {
    resetBtn.textContent = '😎';
    statusEl.textContent = `You win! Time: ${seconds}s`;

    // Auto-flag all mines
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (board[r][c].mine && !board[r][c].flagged) {
          board[r][c].flagged = true;
          flagCount++;
          const cellEl = getCellEl(r, c);
          cellEl.classList.add('flagged');
          cellEl.textContent = '🚩';
        }
      }
    }
    updateMineCounter();
  } else {
    resetBtn.textContent = '😵';
    statusEl.textContent = 'Game over! Click 😵 to try again.';
  }
}

// ===== Difficulty System =====

function setDifficulty(name) {
  const preset = DIFFICULTIES[name];
  if (!preset) return;

  currentDifficulty = name;
  rows = preset.rows;
  cols = preset.cols;
  mineCount = preset.mines;
  init();
}

function setCustomDifficulty(r, c, m) {
  // Clamp values
  r = Math.min(Math.max(r, 9), 24);
  c = Math.min(Math.max(c, 9), 30);
  const maxMines = (r * c) - 9; // Leave room for safe first-click area
  m = Math.min(Math.max(m, 10), maxMines);

  currentDifficulty = 'custom';
  rows = r;
  cols = c;
  mineCount = m;
  init();
}

function updateDifficultyChecks() {
  document.getElementById('check-beginner').textContent = currentDifficulty === 'beginner' ? '✓' : '';
  document.getElementById('check-intermediate').textContent = currentDifficulty === 'intermediate' ? '✓' : '';
  document.getElementById('check-expert').textContent = currentDifficulty === 'expert' ? '✓' : '';
  document.getElementById('check-custom').textContent = currentDifficulty === 'custom' ? '✓' : '';
}

// ===== Menu System =====

function closeAllMenus() {
  document.querySelectorAll('.menu-item').forEach((item) => {
    item.classList.remove('active');
  });
}

function toggleMenu(menuItem) {
  const wasActive = menuItem.classList.contains('active');
  closeAllMenus();
  if (!wasActive) {
    menuItem.classList.add('active');
  }
}

// Click on menu labels to open/close
gameMenu.querySelector('.menu-label').addEventListener('click', (e) => {
  e.stopPropagation();
  toggleMenu(gameMenu);
});

helpMenu.querySelector('.menu-label').addEventListener('click', (e) => {
  e.stopPropagation();
  toggleMenu(helpMenu);
});

// Hover to switch between open menus
gameMenu.addEventListener('mouseenter', () => {
  if (helpMenu.classList.contains('active')) {
    closeAllMenus();
    gameMenu.classList.add('active');
  }
});

helpMenu.addEventListener('mouseenter', () => {
  if (gameMenu.classList.contains('active')) {
    closeAllMenus();
    helpMenu.classList.add('active');
  }
});

// Close menus when clicking elsewhere
document.addEventListener('click', (e) => {
  if (!e.target.closest('.menu-item')) {
    closeAllMenus();
  }
});

// Handle menu option clicks
document.querySelectorAll('.menu-option').forEach((option) => {
  option.addEventListener('click', (e) => {
    e.stopPropagation();
    const action = option.dataset.action;
    closeAllMenus();
    handleMenuAction(action);
  });
});

function handleMenuAction(action) {
  switch (action) {
    case 'new':
      init();
      break;
    case 'beginner':
      setDifficulty('beginner');
      break;
    case 'intermediate':
      setDifficulty('intermediate');
      break;
    case 'expert':
      setDifficulty('expert');
      break;
    case 'custom':
      openCustomDialog();
      break;
    case 'exit':
      // Classic Win95 — try to close, show message if we can't
      if (window.close) window.close();
      statusEl.textContent = 'Thanks for playing!';
      break;
    case 'about':
      openAboutDialog();
      break;
  }
}

// ===== Custom Difficulty Dialog =====

function openCustomDialog() {
  customRowsInput.value = rows;
  customColsInput.value = cols;
  customMinesInput.value = mineCount;
  customDialog.classList.add('visible');
}

function closeCustomDialog() {
  customDialog.classList.remove('visible');
}

function submitCustomDialog() {
  const r = parseInt(customRowsInput.value, 10);
  const c = parseInt(customColsInput.value, 10);
  const m = parseInt(customMinesInput.value, 10);

  if (isNaN(r) || isNaN(c) || isNaN(m)) return;

  closeCustomDialog();
  setCustomDifficulty(r, c, m);
}

document.getElementById('dialog-ok').addEventListener('click', submitCustomDialog);
document.getElementById('dialog-cancel').addEventListener('click', closeCustomDialog);
document.getElementById('dialog-close').addEventListener('click', closeCustomDialog);

// Close dialog on overlay click
customDialog.addEventListener('click', (e) => {
  if (e.target === customDialog) closeCustomDialog();
});

// Enter key submits the custom dialog
customDialog.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') submitCustomDialog();
  if (e.key === 'Escape') closeCustomDialog();
});

// ===== About Dialog =====

function openAboutDialog() {
  aboutDialog.classList.add('visible');
}

function closeAboutDialog() {
  aboutDialog.classList.remove('visible');
}

document.getElementById('about-ok').addEventListener('click', closeAboutDialog);
document.getElementById('about-close').addEventListener('click', closeAboutDialog);
aboutDialog.addEventListener('click', (e) => {
  if (e.target === aboutDialog) closeAboutDialog();
});
aboutDialog.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' || e.key === 'Enter') closeAboutDialog();
});

// ===== Keyboard Shortcuts =====

document.addEventListener('keydown', (e) => {
  if (e.key === 'F2') {
    e.preventDefault();
    init();
  }
});

// ===== Smiley Button =====

resetBtn.addEventListener('click', init);

// ===== Prevent context menu on board =====

boardEl.addEventListener('contextmenu', (e) => e.preventDefault());

// ===== Start the game =====
init();
