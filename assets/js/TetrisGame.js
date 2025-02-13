// TetrisGame.js
export default class TetrisGame {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext("2d");
      this.boardWidth = 10;
      this.boardHeight = 20;
      this.resetGame();
      this.startGame();
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
      // Usamos la pieza "O" como ejemplo
      return {
        shape: [[1, 1], [1, 1]],
        x: Math.floor((this.boardWidth - 2) / 2),
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
      this.currentPiece.y += 1;
      if (this.currentPiece.y + this.currentPiece.shape.length > this.boardHeight) {
        this.placePiece();
        this.currentPiece = this.getRandomPiece();
      }
    }
    
    placePiece() {
      // Implementación básica sin colisiones ni eliminación de líneas.
    }
    
    draw() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      const cellWidth = this.canvas.width / this.boardWidth;
      const cellHeight = this.canvas.height / this.boardHeight;
      this.ctx.strokeStyle = "#333";
      for (let y = 0; y < this.boardHeight; y++) {
        for (let x = 0; x < this.boardWidth; x++) {
          this.ctx.strokeRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
        }
      }
      this.ctx.fillStyle = "blue";
      for (let y = 0; y < this.currentPiece.shape.length; y++) {
        for (let x = 0; x < this.currentPiece.shape[y].length; x++) {
          if (this.currentPiece.shape[y][x]) {
            this.ctx.fillRect(
              (this.currentPiece.x + x) * cellWidth,
              (this.currentPiece.y + y) * cellHeight,
              cellWidth,
              cellHeight
            );
          }
        }
      }
    }
    
    reset() {
      this.resetGame();
      clearInterval(this.interval);
      this.startGame();
    }
  }
  