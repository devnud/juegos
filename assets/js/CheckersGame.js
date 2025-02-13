// CheckersGame.js
export default class CheckersGame {
  constructor(container) {
    this.container = container;
    // El tablero se representa como una matriz 8x8: cada celda es null o un objeto { color, king }
    this.boardState = Array.from({ length: 8 }, () => Array(8).fill(null));
    this.currentPlayer = 'black'; // Jugador que inicia
    this.selectedPiece = null;    // Objeto: { row, col, piece }
    this.capturingChain = false;  // Indica si se continúa una cadena de captura
    this.lastMove = null;         // Almacena la última jugada (para poder deshacerla)
    this.init();
  }

  // Inicializa el tablero y coloca las piezas
  init() {
    // Configura el estado del tablero
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
    this.lastMove = null; // Al inicio, no hay movimiento para deshacer
    this.renderBoard();
  }

  // Renderiza el tablero en el DOM según boardState
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

  // Coloca una pieza en el DOM
  placePiece(cell, color, king = false) {
    const piece = document.createElement("div");
    piece.classList.add("piece", color);
    if (king) piece.classList.add("king");
    cell.appendChild(piece);
  }

  // Maneja el clic en una celda
  handleCellClick(e) {
    const row = parseInt(e.currentTarget.dataset.row);
    const col = parseInt(e.currentTarget.dataset.col);
    const cellState = this.boardState[row][col];

    if (this.selectedPiece) {
      // Si se hace clic en otra pieza del mismo jugador, cambia la selección
      if (cellState && cellState.color === this.currentPlayer) {
        this.selectedPiece = { row, col, piece: cellState };
        return;
      }
      let validMoves = this.getValidMoves(this.selectedPiece.row, this.selectedPiece.col);
      if (this.anyCaptureAvailable()) {
        validMoves = validMoves.filter(move => move.capture);
      }
      const chosenMove = validMoves.find(move => move.toRow === row && move.toCol === col);
      if (chosenMove) {
        // Guarda la información del último movimiento para deshacerlo
        // Se clona el objeto de la pieza para recordar su estado previo (por ejemplo, si no era rey)
        this.lastMove = {
          fromRow: this.selectedPiece.row,
          fromCol: this.selectedPiece.col,
          toRow: row,
          toCol: col,
          movedPiece: JSON.parse(JSON.stringify(this.boardState[this.selectedPiece.row][this.selectedPiece.col])),
          captured: chosenMove.capture ? { 
            row: chosenMove.captured.row, 
            col: chosenMove.captured.col, 
            piece: JSON.parse(JSON.stringify(this.boardState[chosenMove.captured.row][chosenMove.captured.col]))
          } : null,
          mover: this.boardState[this.selectedPiece.row][this.selectedPiece.col].color
        };

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
        // Cambia el turno después de mover
        this.currentPlayer = this.currentPlayer === 'black' ? 'white' : 'black';
        this.renderBoard();
      } else {
        console.log("Movimiento no válido");
      }
    } else {
      // Selecciona la pieza si pertenece al jugador actual
      if (cellState && cellState.color === this.currentPlayer) {
        this.selectedPiece = { row, col, piece: cellState };
      }
    }
  }

  // Devuelve los movimientos válidos para la pieza en (row, col)
  // Cada movimiento es un objeto: { toRow, toCol, capture: boolean, captured: {row, col} o null }
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
          if (moves.some(move => move.capture)) return true;
        }
      }
    }
    return false;
  }

  // Ejecuta el movimiento y actualiza el estado del tablero
  executeMove(fromRow, fromCol, toRow, toCol, captureMove, captured) {
    const piece = this.boardState[fromRow][fromCol];
    // Mueve la pieza
    this.boardState[toRow][toCol] = piece;
    this.boardState[fromRow][fromCol] = null;
    // Si es una captura, elimina la pieza capturada
    if (captureMove && captured) {
      this.removePiece(captured.row, captured.col);
    }
    // Promoción: si la pieza alcanza la última fila y no es rey, se corona
    if (!piece.king) {
      if ((piece.color === "black" && toRow === 7) || (piece.color === "white" && toRow === 0)) {
        piece.king = true;
      }
    }
  }

  removePiece(row, col) {
    this.boardState[row][col] = null;
  }

  // Función undo: revierte únicamente el último movimiento de la última ficha movida
  undoMove() {
    if (this.lastMove) {
      const lm = this.lastMove;
      // Restaura la pieza movida a su posición original
      const movedPiece = this.boardState[lm.toRow][lm.toCol];
      this.boardState[lm.fromRow][lm.fromCol] = movedPiece;
      this.boardState[lm.toRow][lm.toCol] = null;
      // Si en el movimiento se capturó una pieza, la restaura
      if (lm.captured) {
        this.boardState[lm.captured.row][lm.captured.col] = lm.captured.piece;
      }
      // Si la pieza fue promovida en ese movimiento pero antes no era rey, revertir la promoción
      if (movedPiece.king && !lm.movedPiece.king) {
        movedPiece.king = false;
      }
      // Restaura el turno al jugador que hizo el movimiento
      this.currentPlayer = lm.mover;
      // Limpia el último movimiento
      this.lastMove = null;
      this.renderBoard();
    } else {
      console.log("No hay movimiento para deshacer");
    }
  }

  resetGame() {
    this.init();
  }
}
