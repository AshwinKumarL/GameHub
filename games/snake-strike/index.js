/**
 * Snake Strike - Neon Retro Arcade
 * Modular game for QuickFun
 */

export default {
  title: "Snake Strike",
  author: "QuickFun Arcade",

  canvas: null,
  ctx: null,
  api: null,
  animId: null,
  gameLoopActive: false,

  gridSize: 20,
  snake: [],
  dir: { x: 1, y: 0 },
  nextDir: { x: 1, y: 0 },
  food: { x: 15, y: 11 },
  score: 0,
  gameOver: false,
  lastStep: 0,
  stepInterval: 95,

  init(container, api) {
    this.api = api;
    this.container = container;
    this.container.innerHTML = '';

    this.canvas = document.createElement('canvas');
    this.canvas.width = 680;
    this.canvas.height = 460;
    this.ctx = this.canvas.getContext('2d');
    this.container.appendChild(this.canvas);

    this.handleKeyDown = (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if ((e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') && this.dir.y === 0) {
        this.nextDir = { x: 0, y: -1 };
      } else if ((e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') && this.dir.y === 0) {
        this.nextDir = { x: 0, y: 1 };
      } else if ((e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') && this.dir.x === 0) {
        this.nextDir = { x: -1, y: 0 };
      } else if ((e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') && this.dir.x === 0) {
        this.nextDir = { x: 1, y: 0 };
      }

      if (this.gameOver && (e.key === ' ' || e.key === 'Enter')) {
        this.restart();
      }
    };

    this.handleCanvasClick = () => {
      if (this.gameOver) {
        this.restart();
      }
    };

    window.addEventListener('keydown', this.handleKeyDown);
    this.canvas.addEventListener('click', this.handleCanvasClick);

    this.restart();
  },

  restart() {
    this.score = 0;
    this.gameOver = false;
    this.dir = { x: 1, y: 0 };
    this.nextDir = { x: 1, y: 0 };
    this.stepInterval = 95;

    const startX = 10;
    const startY = 11;
    this.snake = [
      { x: startX, y: startY },
      { x: startX - 1, y: startY },
      { x: startX - 2, y: startY },
      { x: startX - 3, y: startY }
    ];

    this.spawnFood();

    if (!this.gameLoopActive) {
      this.gameLoopActive = true;
      this.lastStep = performance.now();
      this.loop(performance.now());
    }
  },

  spawnFood() {
    const cols = Math.floor(this.canvas.width / this.gridSize);
    const rows = Math.floor(this.canvas.height / this.gridSize);
    let valid = false;
    while (!valid) {
      this.food = {
        x: Math.floor(Math.random() * (cols - 2)) + 1,
        y: Math.floor(Math.random() * (rows - 3)) + 2
      };
      valid = !this.snake.some(seg => seg.x === this.food.x && seg.y === this.food.y);
    }
  },

  loop(timestamp) {
    if (!this.gameLoopActive) return;

    if (timestamp - this.lastStep > this.stepInterval) {
      this.step();
      this.lastStep = timestamp;
    }

    this.draw();

    if (!this.gameOver) {
      this.animId = requestAnimationFrame((t) => this.loop(t));
    } else {
      this.gameLoopActive = false;
    }
  },

  step() {
    if (this.gameOver) return;

    this.dir = this.nextDir;
    const head = { x: this.snake[0].x + this.dir.x, y: this.snake[0].y + this.dir.y };

    const cols = Math.floor(this.canvas.width / this.gridSize);
    const rows = Math.floor(this.canvas.height / this.gridSize);

    // Wall collision
    if (head.x < 0 || head.x >= cols || head.y < 2 || head.y >= rows) {
      this.endGame();
      return;
    }

    // Self collision
    if (this.snake.some(seg => seg.x === head.x && seg.y === head.y)) {
      this.endGame();
      return;
    }

    this.snake.unshift(head);

    // Food collision
    if (head.x === this.food.x && head.y === this.food.y) {
      this.score += 10;
      this.api.playSound('point');
      this.spawnFood();
      if (this.stepInterval > 50) {
        this.stepInterval -= 1;
      }
    } else {
      this.snake.pop();
    }
  },

  endGame() {
    this.gameOver = true;
    this.api.playSound('hit');
    this.api.saveHighScore('snake-strike', this.score);
  },

  draw() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Grid backdrop
    ctx.fillStyle = '#0f0722';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Grid lines
    ctx.strokeStyle = 'rgba(168, 85, 247, 0.08)';
    ctx.lineWidth = 1;
    for (let x = 0; x < this.canvas.width; x += this.gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 40);
      ctx.lineTo(x, this.canvas.height);
      ctx.stroke();
    }
    for (let y = 40; y < this.canvas.height; y += this.gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(this.canvas.width, y);
      ctx.stroke();
    }

    // Draw Food
    const fx = this.food.x * this.gridSize;
    const fy = this.food.y * this.gridSize;
    ctx.fillStyle = '#f43f5e';
    ctx.shadowColor = '#f43f5e';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(fx + this.gridSize / 2, fy + this.gridSize / 2, this.gridSize / 2 - 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Draw Snake
    this.snake.forEach((seg, idx) => {
      const sx = seg.x * this.gridSize;
      const sy = seg.y * this.gridSize;

      if (idx === 0) {
        ctx.fillStyle = '#38bdf8';
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 14;
      } else {
        ctx.fillStyle = '#c084fc';
        ctx.shadowColor = '#a855f7';
        ctx.shadowBlur = 6;
      }

      ctx.beginPath();
      ctx.roundRect ? ctx.roundRect(sx + 2, sy + 2, this.gridSize - 4, this.gridSize - 4, 4) : ctx.rect(sx + 2, sy + 2, this.gridSize - 4, this.gridSize - 4);
      ctx.fill();
    });
    ctx.shadowBlur = 0;

    // HUD Header
    ctx.fillStyle = 'rgba(23, 11, 46, 0.9)';
    ctx.fillRect(0, 0, this.canvas.width, 40);
    ctx.fillStyle = '#fff';
    ctx.font = '700 16px "Space Grotesk", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`Score: ${this.score}`, 20, 26);

    ctx.font = '600 13px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#c084fc';
    ctx.fillText(`Length: ${this.snake.length} • Arrow Keys / WASD to Turn`, 220, 26);

    // Game Over
    if (this.gameOver) {
      ctx.fillStyle = 'rgba(15, 6, 28, 0.88)';
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      ctx.textAlign = 'center';
      ctx.font = '800 36px "Space Grotesk", sans-serif';
      ctx.fillStyle = '#f43f5e';
      ctx.fillText('GAME OVER', this.canvas.width / 2, 170);

      ctx.font = '600 18px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(`Final Score: ${this.score}`, this.canvas.width / 2, 215);

      const best = this.api.getHighScore('snake-strike');
      ctx.font = '500 15px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#c084fc';
      ctx.fillText(`Personal Best: ${best}`, this.canvas.width / 2, 245);

      ctx.font = '700 16px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#38bdf8';
      ctx.fillText('Press SPACE or Click to Play Again', this.canvas.width / 2, 290);
    }
  },

  destroy() {
    this.gameLoopActive = false;
    if (this.animId) cancelAnimationFrame(this.animId);
    window.removeEventListener('keydown', this.handleKeyDown);
    if (this.canvas) this.canvas.removeEventListener('click', this.handleCanvasClick);
  }
};
