// SnakeGame.js
export default class SnakeGame {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.cellSize = 20; // Tamaño de cada celda
    // Calcula el número de celdas en ancho y alto
    this.gridWidth = canvas.width / this.cellSize;
    this.gridHeight = canvas.height / this.cellSize;
    this.resetGame();
    this.initControls();
    this.startGame();
  }
  
  resetGame() {
    // Inicia la serpiente en el centro del canvas
    this.snake = [{
      x: Math.floor(this.gridWidth / 2),
      y: Math.floor(this.gridHeight / 2)
    }];
    // Dirección inicial hacia la derecha
    this.direction = { x: 1, y: 0 };
    this.placeFood();
    this.gameOver = false;
  }
  
  placeFood() {
    let x, y;
    // Evita colocar la comida donde ya está la serpiente
    do {
      x = Math.floor(Math.random() * this.gridWidth);
      y = Math.floor(Math.random() * this.gridHeight);
    } while (this.snake.some(segment => segment.x === x && segment.y === y));
    this.food = { x, y };
  }
  
  initControls() {
    document.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "ArrowUp":
          if (this.direction.y !== 1) this.direction = { x: 0, y: -1 };
          break;
        case "ArrowDown":
          if (this.direction.y !== -1) this.direction = { x: 0, y: 1 };
          break;
        case "ArrowLeft":
          if (this.direction.x !== 1) this.direction = { x: -1, y: 0 };
          break;
        case "ArrowRight":
          if (this.direction.x !== -1) this.direction = { x: 1, y: 0 };
          break;
      }
    });
  }
  
  startGame() {
    this.interval = setInterval(() => this.gameLoop(), 150);
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
    const head = { ...this.snake[0] };
    head.x += this.direction.x;
    head.y += this.direction.y;
    
    // Lógica wrap-around: si sale de un lado, aparece por el opuesto
    head.x = (head.x + this.gridWidth) % this.gridWidth;
    head.y = (head.y + this.gridHeight) % this.gridHeight;
    
    // Colisión consigo misma
    if (this.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
      this.gameOver = true;
      return;
    }
    
    this.snake.unshift(head);
    
    // Si la serpiente come la comida, genera nueva; sino, elimina la cola
    if (head.x === this.food.x && head.y === this.food.y) {
      this.placeFood();
    } else {
      this.snake.pop();
    }
  }
  
  draw() {
    // Limpia el canvas
    this.ctx.fillStyle = "#000";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Dibuja la comida
    this.ctx.fillStyle = "red";
    this.ctx.fillRect(
      this.food.x * this.cellSize,
      this.food.y * this.cellSize,
      this.cellSize,
      this.cellSize
    );
    
    // Dibuja la serpiente
    this.ctx.fillStyle = "lime";
    for (let segment of this.snake) {
      this.ctx.fillRect(
        segment.x * this.cellSize,
        segment.y * this.cellSize,
        this.cellSize,
        this.cellSize
      );
    }
  }
  
  // Reinicia el juego (llamado desde un botón)
  reset() {
    clearInterval(this.interval);
    this.resetGame();
    this.startGame();
  }
}
