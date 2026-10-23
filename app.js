// ==========================================================================
// Global State Variables
// ==========================================================================
let board = [
  ['', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', '']
];
let currentPlayer = 'X';
let isGameActive = true;
let smallWinningCount = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0]
];
let bigWinningCount = [0, 0, 0, 0, 0, 0, 0, 0];
let boardPlay = null;
let boardWinners = ['', '', '', '', '', '', '', '', ''];
let size = 3

// ==========================================================================
// DOM Elements
// ==========================================================================
const boardElement = document.getElementById('board');
const statusElement = document.getElementById('status-message');
const resetBtn = document.getElementById('reset-btn');
let smallBoardElements = [];
// ==========================================================================
// Initialization
// ==========================================================================

// Listen for the HTML document to fully load before running our JS
document.addEventListener('DOMContentLoaded', resetGame);

/**
 * Sets up the initial game board by creating 9 div elements,
 * attaching click listeners to them, and putting them on the screen.
 */
function initGame() {
  // Clear any existing HTML inside the board container
  // This is important for resetting the game
  boardElement.innerHTML = '';
  smallBoardElements = [];
  for (let i = 0; i < size**2; i++) {
    const smallBoard = document.createElement('div');
    smallBoard.classList.add('small-board');

    for (let j = 0; j < size**2; j++){
      const cell = document.createElement('div');
      // 2. Add the 'cell' CSS class to it
      cell.classList.add('cell');
      cell.dataset.board = i;
      cell.dataset.cell = j;

      cell.addEventListener('click', handleCellClick);
      smallBoard.appendChild(cell);
    }

    boardElement.appendChild(smallBoard);
    smallBoardElements.push(smallBoard)
  }

  // Attach event listener to the reset button
  resetBtn.addEventListener('click', resetGame);
}

// ==========================================================================
// Game Logic & Event Handling
// ==========================================================================

/**
 * Handles what happens when a user clicks on a cell.
 * @param {Event} event - The click event object
 */
function handleCellClick(event) {
  const clickedCell = event.currentTarget;
  const boardCurrent = parseInt(clickedCell.dataset.board);
  const cellCurrent = parseInt(clickedCell.dataset.cell);

  if (!isGameActive){
    return;
  }
  if (board[boardCurrent][cellCurrent] !== '' || boardWinners[boardCurrent] !== '') {
    return;
  }
  if (boardPlay !== null && boardPlay !== boardCurrent){
    return;
  }

  // TODO 1: Update the internal state (the 'board' array) with the current player
  board[boardCurrent][cellCurrent] = currentPlayer;
  // TODO 2: Update the DOM to reflect the internal state! 
  // you may need to update both inner html and css classes of DOM elements
  clickedCell.classList.add(currentPlayer.toLowerCase());
  clickedCell.innerHTML = currentPlayer;
  // TODO 3: Check for (and possibly handle) a winner (Call the checkWin() function)
  assignPoint(smallWinningCount[boardCurrent], cellCurrent);
  if (checkWin(smallWinningCount[boardCurrent])){
    winSmall(boardCurrent, currentPlayer);

    assignPoint(bigWinningCount, boardCurrent);
    if (checkWin(bigWinningCount)){
      statusElement.innerHTML = `Player ${currentPlayer} Wins!`;
      isGameActive = false;
      updateCSS();
      return;
    }
  } else if (checkTie(board[boardCurrent])) {
    winSmall(boardCurrent, 'T');
  }

  if (!boardWinners.includes('')) {
    statusElement.innerHTML = `It's a Tie!`;
    isGameActive = false;
    updateCSS();
    return;
  }
 
  boardPlay = boardWinners[cellCurrent] === '' ? cellCurrent : null;
 
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  updateHelp();
  updateCSS();
}

//Helps checkWin function
function assignPoint(count, cellIndex){
  let row = Math.floor(cellIndex / size);
  let col = cellIndex % size;
  let point = currentPlayer === "X" ? 1 : -1;
  count[row] += point;
  count[size + col] += point;
  if (col === row){
    count[size * 2] += point;
  }
  if (row + col === size - 1) {
    count[size * 2 + 1] += point;
  }
  return;
}


/**
 * Checks for a winner.
 * @returns {boolean} true if there is a winner, false otherwise
 */
function checkWin(count) {
  // TODO
  for (let i = 0; i < 8; i++){
    if (Math.abs(count[i]) == size){
      return true;
    }
  }
  return false;
}

/**
 * Checks for a tie game.
 * @returns {boolean} true if it's a tie, false otherwise
 */
function checkTie(cells) {
  return !cells.includes('')
}

function winSmall(b, winner) {
  boardWinners[b] = winner;
  const element = smallBoardElements[b];
 
  if (winner === 'T') {
    element.classList.add('tied');
  } else {
    element.classList.add(`won-${winner.toLowerCase()}`);
    element.dataset.winner = currentPlayer;
  }
}

/**
 * Resets all state variables and the DOM to start a new game.
 */
function resetGame() {
  // TODO: reset internal state
  board = [
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '']
  ];
  boardWinners = ['', '', '', '', '', '', '', '', ''];
  smallWinningCount = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0]
  ];
  bigWinningCount = [0, 0, 0, 0, 0, 0, 0, 0];
  boardPlay = null;
  isGameActive = true;
  currentPlayer = "X";
  statusElement.innerHTML = `Player ${currentPlayer}'s Turn`;
  // To clear the DOM easily, just call initGame() again to rebuild the empty cells!
  initGame();
  updateHelp();
  updateCSS();
}

function updateHelp() {
  const hint = boardPlay === null ? 'Play in any open board' : 'Play in the yellow board';
  statusElement.innerHTML = `Player ${currentPlayer}'s Turn <span class="hint">${hint}</span>`;
}

function updateCSS() {
  for (let b = 0; b < smallBoardElements.length; b++) {
    const element = smallBoardElements[b];
    let playable = false;

    if (isGameActive && boardWinners[b] === '') {
      if (boardPlay === null) {
        playable = true;
      } else if (boardPlay === b) {
        playable = true;
      }
    }
    if (playable) {
      element.classList.add('active');
    } else {
      element.classList.remove('active');
    }
  }
}