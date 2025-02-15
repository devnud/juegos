// TetrisGame.js
export default class TetrisGame {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.boardWidth = 10;  // Número de columnas
    this.boardHeight = 20; // Número de filas
    this.cellSize = canvas.width / this.boardWidth; // Tamaño de cada celda (asumiendo canvas proporcional)
    this.resetGame();
    this.startGame();
    this.initControls();
  }
  
  resetGame() {
    this.board = this.createBoard(this.boardWidth, this.boardHeight);
    this.gameOver = false;
    this.currentPiece = this.getRandomPiece();
  }
  
  createBoard(width, height) {
    const board = [];
    for (let y = 0; y < height; y++) {
      board[y] = new Array(width).fill(0);
    }
    return board;
  }
  
  getRandomPiece() {
    // Para simplificar, usamos la pieza "O" (cuadrado 2x2)
    const shape = [
      [1, 1],
      [1, 1]
    ];
    return {
      shape,
      // Coloca la pieza en el centro superior
      x: Math.floor((this.boardWidth - shape[0].length) / 2),
      y: 0
    };
  }
  
  startGame() {
    this.interval = setInterval(() => this.gameLoop(), 500);
  }
  
  gameLoop() {
    if (this.gameOver) {
      clearInterval(this.interval);
      alert("Game Over");
      return;
    }
    this.update();
    this.draw();
  }
  
  update() {
    // Mueve la pieza actual hacia abajo
    this.currentPiece.y++;
    // Si hay colisión, retrocede la pieza y colócala en el tablero
    if (this.collides()) {
      this.currentPiece.y--;
      this.placePiece();
      // Si la pieza se coloca en la parte superior, finaliza el juego
      if (this.currentPiece.y === 0) {
        this.gameOver = true;
      }
      this.currentPiece = this.getRandomPiece();
    }
  }
  
  collides() {
    const { shape, x, y } = this.currentPiece;
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col]) {
          const boardX = x + col;
          const boardY = y + row;
          // Colisión si sale del fondo o si la celda del tablero ya está ocupada
          if (boardY >= this.boardHeight || this.board[boardY][boardX]) {
            return true;
          }
        }
      }
    }
    return false;
  }
  
  placePiece() {
    const { shape, x, y } = this.currentPiece;
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col]) {
          this.board[y + row][x + col] = 1;
        }
      }
    }
    // Aquí se podrían implementar la eliminación de líneas completas.
  }
  
  draw() {
    // Limpia el canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Dibuja el tablero: celdas ocupadas se pintan de azul
    for (let y = 0; y < this.boardHeight; y++) {
      for (let x = 0; x < this.boardWidth; x++) {
        if (this.board[y][x]) {
          this.drawCell(x, y, "blue");
        }
      }
    }
    
    // Dibuja la pieza actual en rojo
    const { shape, x, y } = this.currentPiece;
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col]) {
          this.drawCell(x + col, y + row, "red");
        }
      }
    }
  }
  
  drawCell(x, y, color) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(
      x * this.cellSize,
      y * this.cellSize,
      this.cellSize,
      this.cellSize
    );
    // Dibuja un borde para separar las celdas
    this.ctx.strokeStyle = "#333";
    this.ctx.strokeRect(
      x * this.cellSize,
      y * this.cellSize,
      this.cellSize,
      this.cellSize
    );
  }
  
  initControls() {
    document.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "ArrowLeft":
          this.currentPiece.x--;
          if (this.collides()) this.currentPiece.x++;
          break;
        case "ArrowRight":
          this.currentPiece.x++;
          if (this.collides()) this.currentPiece.x--;
          break;
        case "ArrowDown":
          // Permite acelerar el movimiento
          this.update();
          break;
        // Para la pieza "O", la rotación no es necesaria. Se pueden agregar controles para otras piezas.
      }
    });
  }
  
  // Reinicia el juego (se puede llamar desde un botón)
  reset() {
    clearInterval(this.interval);
    this.resetGame();
    this.startGame();
  }
}
