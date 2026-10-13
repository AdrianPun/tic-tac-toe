// ==========================================================================
// Global State Variables
// ==========================================================================
let board = ['', '', '', '', '', '', '', '', '']; // 9 empty spaces
let currentPlayer = 'X';
let isGameActive = true;
//0-2 = rows, 3-5 = columns, 6-7 = diagonals
let winningCount = [0, 0, 0, 0, 0, 0, 0, 0];
let size = 3

// ==========================================================================
// DOM Elements
// ==========================================================================
const boardElement = document.getElementById('board');
const statusElement = document.getElementById('status-message');
const resetBtn = document.getElementById('reset-btn');

// ==========================================================================
// Initialization
// ==========================================================================

// Listen for the HTML document to fully load before running our JS
document.addEventListener('DOMContentLoaded', initGame);

/**
 * Sets up the initial game board by creating 9 div elements,
 * attaching click listeners to them, and putting them on the screen.
 */
function initGame() {
  // Clear any existing HTML inside the board container
  // This is important for resetting the game
  boardElement.innerHTML = '';

  // Loop 9 times to create the 3x3 grid
  for (let i = 0; i < size**2; i++) {
    // 1. Create a new div element
    const cell = document.createElement('div');
    
    // 2. Add the 'cell' CSS class to it
    cell.classList.add('cell');
    
    // 3. Store the index (0-8) inside the HTML element so we know which one was clicked
    cell.dataset.index = i;
    
    // 4. Attach an event listener: When this cell is clicked, call handleCellClick
    cell.addEventListener('click', handleCellClick);
    
    // 5. Append the cell to the board element in the DOM
    boardElement.appendChild(cell);
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
  if (!checkWin()){
    // 'event.target' refers to the exact HTML element that was clicked
    const clickedCell = event.target;
    
    // Retrieve the index we stored earlier and convert it to a number
    const cellIndex = parseInt(clickedCell.dataset.index);

    // Check if the cell is already filled OR if the game is over.
    // If either is true, exit the function early (do nothing).
    if (board[cellIndex] !== '' || isGameActive === false) {
      return;
    }

    // TODO 1: Update the internal state (the 'board' array) with the current player
    board[cellIndex] = currentPlayer
    // TODO 2: Update the DOM to reflect the internal state! 
    // you may need to update both inner html and css classes of DOM elements
    clickedCell.classList.add(currentPlayer.toLowerCase())
    clickedCell.innerHTML = currentPlayer
    // TODO 3: Check for (and possibly handle) a winner (Call the checkWin() function)
    assignPoint(cellIndex);
    if (checkWin()){
      statusElement.innerHTML = `Player ${currentPlayer} Wins!`
      return
    }
    // TODO 4: Check for (and possibly handle) a tie (Call the checkTie() function)
    if (checkTie()){
      statusElement.innerHTML = `It is a Tie!`
      return
    }
    // TODO 5: Swap the currentPlayer from 'X' to 'O' or 'O' to 'X'
    currentPlayer = currentPlayer === "X" ? "O" : "X"
    // TODO 6: Update the statusElement to show whose turn it is now
    statusElement.innerHTML = `Player ${currentPlayer}'s Turn`
  }
}

//Helps checkWin function
function assignPoint(cellIndex){
  let row = Math.floor(cellIndex / size);
  let col = cellIndex % size;
  let point = currentPlayer === "X" ? 1 : -1;
  winningCount[row] += point;
  winningCount[size + col] += point;
  if (col === row){
    winningCount[size * 2] += point;
  }
  if (row + col === size - 1) {
    winningCount[size * 2 + 1] += point;
  }
  return;
}


/**
 * Checks for a winner.
 * @returns {boolean} true if there is a winner, false otherwise
 */
function checkWin() {
  // TODO
  for (let i = 0; i < 8; i++){
    if (Math.abs(winningCount[i]) == size){
      return true;
    }
  }
}

/**
 * Checks for a tie game.
 * @returns {boolean} true if it's a tie, false otherwise
 */
function checkTie() {
  return !board.includes('')
}

/**
 * Resets all state variables and the DOM to start a new game.
 */
function resetGame() {
  // TODO: reset internal state
  board = ['', '', '', '', '', '', '', '', ''];
  currentPlayer = "X";
  statusElement.innerHTML = `Player ${currentPlayer}'s Turn`;
  winningCount = [0, 0, 0, 0, 0, 0, 0, 0];
  // To clear the DOM easily, just call initGame() again to rebuild the empty cells!
  initGame();
}