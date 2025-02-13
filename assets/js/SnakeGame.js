// SnakeGame.js
export default class SnakeGame {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext("2d");
      this.gridSize = 20;
      this.resetGame();
      this.initControls();
      this.startGame();
    }
    
    resetGame() {
      this.snake = [{ x: 10, y: 10 }];
      this.direction = { x: 0, y: 0 };
      this.food = this.randomFood();
      this.gameOver = false;
    }
    
    randomFood() {
      return {
        x: Math.floor(Math.random() * this.gridSize),
        y: Math.floor(Math.random() * this.gridSize)
      };
    }
    
    initControls() {
      document.addEventListener("keydown", (e) => {
        switch (e.key) {
          case "ArrowUp":
            if (this.direction.y === 0) this.direction = { x: 0, y: -1 };
            break;
          case "ArrowDown":
            if (this.direction.y === 0) this.direction = { x: 0, y: 1 };
            break;
          case "ArrowLeft":
            if (this.direction.x === 0) this.direction = { x: -1, y: 0 };
            break;
          case "ArrowRight":
            if (this.direction.x === 0) this.direction = { x: 1, y: 0 };
            break;
        }
      });
    }
    
    startGame() {
      this.interval = setInterval(() => this.gameLoop(), 200);
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
      if (
        head.x < 0 || head.x >= this.gridSize ||
        head.y < 0 || head.y >= this.gridSize ||
        this.snake.some(segment => segment.x === head.x && segment.y === head.y)
      ) {
        this.gameOver = true;
        return;
      }
      this.snake.unshift(head);
      if (head.x === this.food.x && head.y === this.food.y) {
        this.food = this.randomFood();
      } else {
        this.snake.pop();
      }
    }
    
    draw() {
      const cellSize = this.canvas.width / this.gridSize;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.fillStyle = "red";
      this.ctx.fillRect(this.food.x * cellSize, this.food.y * cellSize, cellSize, cellSize);
      this.ctx.fillStyle = "lime";
      for (let segment of this.snake) {
        this.ctx.fillRect(segment.x * cellSize, segment.y * cellSize, cellSize, cellSize);
      }
    }
    
    reset() {
      this.resetGame();
      clearInterval(this.interval);
      this.startGame();
    }
  }
  