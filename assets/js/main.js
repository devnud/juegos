import TicTacToe from "./TicTacToe.js";
import CheckersGame from "./CheckersGame.js";
import SnakeGame from "./SnakeGame.js";
import TetrisGame from "./TetrisGame.js";

document.addEventListener("DOMContentLoaded", () => {
  const ticTacToeContainer = document.getElementById("tres-en-raya-container");
  if (ticTacToeContainer) {
    window.ticTacToeGame = new TicTacToe(ticTacToeContainer);
  }
  
  const checkersContainer = document.getElementById("damas-container");
  if (checkersContainer) {
    window.checkersGame = new CheckersGame(checkersContainer);
  }
  
  const snakeCanvas = document.getElementById("serpiente-canvas");
  if (snakeCanvas) {
    window.snakeGame = new SnakeGame(snakeCanvas);
  }
  
  const tetrisCanvas = document.getElementById("tetris-canvas");
  if (tetrisCanvas) {
    window.tetrisGame = new TetrisGame(tetrisCanvas);
  }
});

// Funciones globales para reiniciar juegos
export function resetCheckers() {
  if (window.checkersGame) {
    window.checkersGame.resetGame();
  }
}

export function undoCheckers() {
  if (window.checkersGame) {
    window.checkersGame.undoMove();
  }
}

export function resetSnake() {
  if (window.snakeGame) {
    window.snakeGame.reset();
  }
}

export function resetTetris() {
  if (window.tetrisGame) {
    window.tetrisGame.reset();
  }
}

window.resetCheckers = resetCheckers;
window.undoCheckers = undoCheckers;
window.resetSnake = resetSnake;
window.resetTetris = resetTetris;
