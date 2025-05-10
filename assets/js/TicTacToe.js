// TicTacToe.js
export default class TicTacToe {
  constructor(container) {
    this.container = container;
    this.currentPlayer = "X";
    this.boardState = Array(9).fill("");
    this.init();
  }
  
  // Inicializa el tablero creando 9 celdas
  init() {
    this.container.innerHTML = "";
    for (let i = 0; i < 9; i++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.index = i;
      cell.addEventListener("click", () => this.handleClick(i));
      this.container.appendChild(cell);
    }
  }
  
  // Maneja el clic en cada celda
  handleClick(index) {
    if (this.boardState[index] !== "") return;
    
    // Actualiza el estado y la visualización de la celda
    this.boardState[index] = this.currentPlayer;
    this.container.querySelector(`[data-index="${index}"]`).textContent = this.currentPlayer;
    
    // Comprueba si hay ganador y obtiene el patrón ganador si existe
    const winningPattern = this.checkWinner();
    if (winningPattern) {
      // Marca las celdas ganadoras agregando la clase "winner"
      winningPattern.forEach(idx => {
        const cell = this.container.querySelector(`[data-index="${idx}"]`);
        if (cell) cell.classList.add("winner");
      });
      
      // Espera 500ms para que se actualice el DOM y se vean las celdas marcadas
      setTimeout(() => {
        alert(`${this.currentPlayer} ganó!`);
        this.resetGame();
      }, 500);
    } else {
      // Cambia de jugador
      this.currentPlayer = this.currentPlayer === "X" ? "O" : "X";
    }
  }
  
  // Comprueba si existe un ganador y retorna el patrón ganador o null
  checkWinner() {
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],  // Filas
      [0, 3, 6], [1, 4, 7], [2, 5, 8],  // Columnas
      [0, 4, 8], [2, 4, 6]              // Diagonales
    ];
    for (let pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (
        this.boardState[a] &&
        this.boardState[a] === this.boardState[b] &&
        this.boardState[a] === this.boardState[c]
      ) {
        return pattern;
      }
    }
    return null;
  }
  
  // Reinicia el juego
  resetGame() {
    this.boardState = Array(9).fill("");
    this.currentPlayer = "X";
    this.init();
  }
}
