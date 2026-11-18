import './App.css'
import { useState } from 'react';

document.getElementById('root').style.display = 'contents';

/**
 * @returns {boolean} true if there is a winner, false otherwise
 */
function checkWin(winningCount, size) {
  for (let i = 0; i < winningCount.length; i++){
    if (Math.abs(winningCount[i]) == size){
      return true;
    }
  }
  return false;
}

/**
 * @returns {boolean} true if it's a tie, false otherwise
 */
function checkTie(board) {
  return !board.includes('')
}

function copyList(list) {
  const copy = [];
  for (let i = 0; i < list.length; i++) {
    copy.push(list[i]);
  }
  return copy;
}

function makeList(length, value) {
  const list = [];
  for (let i = 0; i < length; i++) {
    list.push(value);
  }
  return list;
}

function App(){
  return(<>
    <TicTacToe></TicTacToe>
  </>)
}

function TicTacToe(){
  const [size, setSize] = useState(3);
  const [board, setBoard] = useState(['', '', '', '', '', '', '', '', '']);
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [isGameActive, setIsGameActive] = useState(true);
  const [winningCount, setWinningCount] = useState([0, 0, 0, 0, 0, 0, 0, 0]);

  function handleCellClick(event) {
    const clickedCell = event.target;
    const cellIndex = parseInt(clickedCell.dataset.index);

    if (board[cellIndex] !== '' || isGameActive === false) {
      return;
    }
    makeMove(copyList(board), copyList(winningCount), cellIndex);
  }

  function makeMove(board, winningCount, cellIndex) {
    board[cellIndex] = currentPlayer

    assignPoint(winningCount, cellIndex);

    setBoard(board);
    setWinningCount(winningCount);

    if (checkWin(winningCount, size)){
      setIsGameActive(false);
      return
    }

    if (checkTie(board)){
      setIsGameActive(false);
      return
    }

    if (currentPlayer === "X") {
      setCurrentPlayer("O");
    } else {
      setCurrentPlayer("X");
    }
  }

  function assignPoint(winningCount, cellIndex){
    let row = Math.floor(cellIndex / size);
    let col = cellIndex % size;
    let point = -1;
    if (currentPlayer === "X") {
      point = 1;
    }
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

  function startGame(size) {
    setSize(size);
    setBoard(makeList(size * size, ''));
    setCurrentPlayer("X");
    setWinningCount(makeList(size * 2 + 2, 0));
    setIsGameActive(true);
  }

  function resetGame() {
    startGame(size);
  }

  function handleSizeChange(event) {
    startGame(parseInt(event.target.value));
  }

  return(
    <div className="container">
      <InfoBar
        currentPlayer={currentPlayer}
        isGameActive={isGameActive}
        winningCount={winningCount}
        size={size}
        resetGame={resetGame}
        handleSizeChange={handleSizeChange}
      ></InfoBar>
      <Board
        board={board}
        size={size}
        handleCellClick={handleCellClick}
      ></Board>
    </div>
  )
}

function InfoBar(props){
  return(<div className="status-panel">
    <TurnText
      currentPlayer={props.currentPlayer}
      isGameActive={props.isGameActive}
      winningCount={props.winningCount}
      size={props.size}
    ></TurnText>
    <Reset resetGame={props.resetGame}></Reset>
    <SizeSlider
      size={props.size}
      handleSizeChange={props.handleSizeChange}
    ></SizeSlider>
  </div>)
}

function TurnText(props){
  if (!props.isGameActive && checkWin(props.winningCount, props.size)) {
    return(<div className="status-message">Player {props.currentPlayer} Wins!</div>)
  }
  if (!props.isGameActive) {
    return(<div className="status-message">It is a Tie!</div>)
  }
  return(<div className="status-message">Player {props.currentPlayer}'s Turn</div>)
}

function Reset(props){
  return(<button className="btn" onClick={props.resetGame}>Restart Game</button>)
}

function SizeSlider(props){
  return(<label className="size-slider">
    Grid size: {props.size} × {props.size}
    <input
      type="range"
      min="3"
      max="8"
      value={props.size}
      onChange={props.handleSizeChange}
    ></input>
  </label>)
}

function Board(props){
  const cells = [];

  for (let i = 0; i < props.size**2; i++) {
    let className = 'cell';
    if (props.board[i] !== '') {
      className = 'cell taken ' + props.board[i].toLowerCase();
    }
    const cell = (
      <div
        key={i}
        className={className}
        data-index={i}
        onClick={props.handleCellClick}
      >
        {props.board[i]}
      </div>
    );
    cells.push(cell);
  }

  const boardStyle = { '--size': props.size };

  return(<div className="board" style={boardStyle}>
    {cells}
  </div>)
}

export default App