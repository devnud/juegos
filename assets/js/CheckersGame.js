// CheckersGame.js
export default class CheckersGame {
  constructor(container) {
    this.container = container;
    // El tablero es una matriz 8x8 con celdas nulas o con objeto { color, king }
    this.boardState = Array.from({ length: 8 }, () => Array(8).fill(null));
    this.currentPlayer = 'black'; 
    this.selectedPiece = null;     
    this.capturingChain = false;   
    this.moveHistory = [];         // Pila para guardar snapshots de estado
    this.init();
  }
  
  init() {
    // Inicializa el estado del tablero
    this.boardState = Array.from({ length: 8 }, () => Array(8).fill(null));
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if ((row + col) % 2 === 1) {
          if (row < 3) {
            this.boardState[row][col] = { color: "black", king: false };
          } else if (row > 4) {
            this.boardState[row][col] = { color: "white", king: false };
          }
        }
      }
    }
    this.selectedPiece = null;
    this.capturingChain = false;
    this.moveHistory = [];
    this.renderBoard();
    this.saveState(); // Guarda el estado inicial
  }
  
  // Renderiza el tablero a partir de boardState
  renderBoard() {
    this.container.innerHTML = "";
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.row = row;
        cell.dataset.col = col;
        cell.style.backgroundColor = (row + col) % 2 === 1 ? "#777" : "#fff";
        cell.addEventListener("click", (e) => this.handleCellClick(e));
        this.container.appendChild(cell);
        const piece = this.boardState[row][col];
        if (piece) {
          this.placePiece(cell, piece.color, piece.king);
        }
      }
    }
  }
  
  // Guarda un snapshot del estado actual para poder deshacer
  saveState() {
    const snapshot = {
      boardState: JSON.parse(JSON.stringify(this.boardState)),
      currentPlayer: this.currentPlayer,
      selectedPiece: this.selectedPiece ? { ...this.selectedPiece } : null,
      capturingChain: this.capturingChain
    };
    this.moveHistory.push(snapshot);
  }
  
  // Deshace el último movimiento
  undoMove() {
    if (this.moveHistory.length > 1) { // Siempre se guarda el estado inicial
      this.moveHistory.pop(); // Elimina el estado actual
      const lastState = this.moveHistory[this.moveHistory.length - 1];
      this.boardState = lastState.boardState;
      this.currentPlayer = lastState.currentPlayer;
      this.selectedPiece = lastState.selectedPiece;
      this.capturingChain = lastState.capturingChain;
      this.renderBoard();
    } else {
      console.log("No hay movimientos para deshacer");
    }
  }
  
  placePiece(cell, color, king = false) {
    const piece = document.createElement("div");
    piece.classList.add("piece", color);
    if (king) {
      piece.classList.add("king");
    }
    cell.appendChild(piece);
  }
  
  handleCellClick(e) {
    const row = parseInt(e.currentTarget.dataset.row);
    const col = parseInt(e.currentTarget.dataset.col);
    const cellState = this.boardState[row][col];
    
    if (this.selectedPiece) {
      // Si se hace clic en otra pieza del jugador activo, cambia la selección
      if (cellState && cellState.color === this.currentPlayer) {
        this.selectedPiece = { row, col, piece: cellState };
        return;
      }
      // Obtiene movimientos válidos para la pieza seleccionada
      let validMoves = this.getValidMoves(this.selectedPiece.row, this.selectedPiece.col);
      // Si hay captura disponible, filtra para capturas obligatorias
      if (this.anyCaptureAvailable()) {
        validMoves = validMoves.filter(move => move.capture);
      }
      const chosenMove = validMoves.find(move => move.toRow === row && move.toCol === col);
      if (chosenMove) {
        // Guarda el estado antes de ejecutar el movimiento
        this.saveState();
        this.executeMove(this.selectedPiece.row, this.selectedPiece.col, row, col, chosenMove.capture, chosenMove.captured);
        if (chosenMove.capture) {
          const furtherCaptures = this.getValidMoves(row, col).filter(m => m.capture);
          if (furtherCaptures.length > 0) {
            this.selectedPiece = { row, col, piece: this.boardState[row][col] };
            this.capturingChain = true;
            this.renderBoard();
            return;
          }
        }
        this.selectedPiece = null;
        this.capturingChain = false;
        this.currentPlayer = this.currentPlayer === "black" ? "white" : "black";
        this.renderBoard();
      } else {
        console.log("Movimiento no válido");
      }
    } else {
      if (cellState && cellState.color === this.currentPlayer) {
        this.selectedPiece = { row, col, piece: cellState };
      }
    }
  }
  
  // Devuelve movimientos válidos para la pieza en (row, col)
  // Cada movimiento: { toRow, toCol, capture: boolean, captured: {row, col} o null }
  getValidMoves(row, col) {
    const piece = this.boardState[row][col];
    if (!piece) return [];
    let moves = [];
    let directions = [];
    if (piece.king) {
      directions = [[1, -1], [1, 1], [-1, -1], [-1, 1]];
    } else {
      directions = piece.color === "black" ? [[1, -1], [1, 1]] : [[-1, -1], [-1, 1]];
    }
    for (let [dr, dc] of directions) {
      let newRow = row + dr, newCol = col + dc;
      if (this.inBounds(newRow, newCol) && this.boardState[newRow][newCol] === null) {
        moves.push({ toRow: newRow, toCol: newCol, capture: false, captured: null });
      }
      let captureRow = row + 2 * dr, captureCol = col + 2 * dc;
      if (this.inBounds(newRow, newCol) && this.inBounds(captureRow, captureCol)) {
        const adjacent = this.boardState[newRow][newCol];
        if (adjacent && adjacent.color !== piece.color && this.boardState[captureRow][captureCol] === null) {
          moves.push({ toRow: captureRow, toCol: captureCol, capture: true, captured: { row: newRow, col: newCol } });
        }
      }
    }
    return moves;
  }
  
  inBounds(row, col) {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
  }
  
  anyCaptureAvailable() {
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = this.boardState[row][col];
        if (piece && piece.color === this.currentPlayer) {
          const moves = this.getValidMoves(row, col);
          if (moves.some(move => move.capture)) {
            return true;
          }
        }
      }
    }
    return false;
  }
  
  executeMove(fromRow, fromCol, toRow, toCol, captureMove, captured) {
    const piece = this.boardState[fromRow][fromCol];
    this.boardState[toRow][toCol] = piece;
    this.boardState[fromRow][fromCol] = null;
    if (captureMove && captured) {
      this.removePiece(captured.row, captured.col);
    }
    // Promoción: si la pieza llega a la última fila y no es rey, se corona
    if (!piece.king) {
      if ((piece.color === "black" && toRow === 7) || (piece.color === "white" && toRow === 0)) {
        piece.king = true;
      }
    }
  }
  
  removePiece(row, col) {
    this.boardState[row][col] = null;
  }
  
  resetGame() {
    this.init();
  }
}
