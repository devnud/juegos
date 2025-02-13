// main.js
import TicTacToe from "./TicTacToe.js";
import CheckersGame from "./CheckersGame.js";
// Importa otros módulos si es necesario

document.addEventListener("DOMContentLoaded", () => {
  const ticTacToeContainer = document.getElementById("tres-en-raya-container");
  if (ticTacToeContainer) {
    window.ticTacToeGame = new TicTacToe(ticTacToeContainer);
  }
  
  const checkersContainer = document.getElementById("damas-container");
  if (checkersContainer) {
    window.checkersGame = new CheckersGame(checkersContainer);
  }
});

// Funciones globales para reiniciar y deshacer en Damas
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

// Asignamos las funciones al objeto global (window)
window.resetCheckers = resetCheckers;
window.undoCheckers = undoCheckers;

