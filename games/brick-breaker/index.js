/**
 * Brick Breaker Neon - Arcade Breakout
 * Modular game for QuickFun
 */

export default {
  title: "Brick Breaker Neon",
  author: "QuickFun Arcade",

  canvas: null,
  ctx: null,
  api: null,
  animId: null,
  gameLoopActive: false,

  paddle: { x: 280, width: 110, height: 14, speed: 8 },
  ball: { x: 340, y: 380, vx: 4, vy: -5, radius: 8 },
  bricks: [],
  score: 0,
  lives: 3,
  gameOver: false,
  keys: {},

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
      this.keys[e.key] = true;
      if (['ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }
      if (this.gameOver && (e.key === ' ' || e.key === 'Enter')) {
        this.restart();
      }
    };

    this.handleKeyUp = (e) => {
      this.keys[e.key] = false;
    };

    this.handleMouseMove = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      this.paddle.x = Math.max(10, Math.min(this.canvas.width - this.paddle.width - 10, mouseX - this.paddle.width / 2));
    };

    this.handleCanvasClick = () => {
      if (this.gameOver) {
        this.restart();
      }
    };

    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
    this.canvas.addEventListener('mousemove', this.handleMouseMove);
    this.canvas.addEventListener('click', this.handleCanvasClick);

    this.restart();
  },

  restart() {
    this.score = 0;
    this.lives = 3;
    this.gameOver = false;
    this.paddle.x = this.canvas.width / 2 - this.paddle.width / 2;
    this.resetBall();
    this.buildBricks();

    if (!this.gameLoopActive) {
      this.gameLoopActive = true;
      this.loop();
    }
  },

  resetBall() {
    this.ball.x = this.paddle.x + this.paddle.width / 2;
    this.ball.y = this.canvas.height - 65;
    this.ball.vx = (Math.random() > 0.5 ? 4 : -4);
    this.ball.vy = -5.5;
  },

  buildBricks() {
    this.bricks = [];
    const rows = 5;
    const cols = 9;
    const brickW = 64;
    const brickH = 20;
    const padding = 8;
    const offsetTop = 60;
    const offsetLeft = 20;

    const rowColors = ['#f43f5e', '#ec4899', '#a855f7', '#38bdf8', '#34d399'];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        this.bricks.push({
          x: offsetLeft + c * (brickW + padding),
          y: offsetTop + r * (brickH + padding),
          width: brickW,
          height: brickH,
          color: rowColors[r % rowColors.length],
          points: (rows - r) * 10,
          alive: true
        });
      }
    }
  },

  loop() {
    if (!this.gameLoopActive) return;

    this.update();
    this.draw();

    if (!this.gameOver) {
      this.animId = requestAnimationFrame(() => this.loop());
    } else {
      this.gameLoopActive = false;
    }
  },

  update() {
    if (this.gameOver) return;

    // Paddle keyboard movement
    if ((this.keys['ArrowLeft'] || this.keys['a'] || this.keys['A']) && this.paddle.x > 10) {
      this.paddle.x -= this.paddle.speed;
    }
    if ((this.keys['ArrowRight'] || this.keys['d'] || this.keys['D']) && this.paddle.x < this.canvas.width - this.paddle.width - 10) {
      this.paddle.x += this.paddle.speed;
    }

    // Ball movement
    const b = this.ball;
    b.x += b.vx;
    b.y += b.vy;

    // Wall bounces
    if (b.x - b.radius <= 0) {
      b.x = b.radius;
      b.vx = -b.vx;
      this.api.playSound('beep');
    }
    if (b.x + b.radius >= this.canvas.width) {
      b.x = this.canvas.width - b.radius;
      b.vx = -b.vx;
      this.api.playSound('beep');
    }
    if (b.y - b.radius <= 0) {
      b.y = b.radius;
      b.vy = -b.vy;
      this.api.playSound('beep');
    }

    // Paddle bounce
    const p = this.paddle;
    const py = this.canvas.height - 40;
    if (
      b.y + b.radius >= py &&
      b.y - b.radius <= py + p.height &&
      b.x >= p.x &&
      b.x <= p.x + p.width &&
      b.vy > 0
    ) {
      // Angle based on hit position
      const hitPoint = (b.x - (p.x + p.width / 2)) / (p.width / 2);
      const speed = Math.hypot(b.vx, b.vy);
      b.vx = hitPoint * (speed * 0.85);
      b.vy = -Math.abs(Math.sqrt(Math.max(4, speed * speed - b.vx * b.vx)));
      this.api.playSound('beep');
    }

    // Brick collisions
    let aliveCount = 0;
    for (const brick of this.bricks) {
      if (!brick.alive) continue;
      aliveCount++;

      if (
        b.x + b.radius > brick.x &&
        b.x - b.radius < brick.x + brick.width &&
        b.y + b.radius > brick.y &&
        b.y - b.radius < brick.y + brick.height
      ) {
        brick.alive = false;
        b.vy = -b.vy;
        this.score += brick.points;
        this.api.playSound('coin');
        break;
      }
    }

    // Win condition - respawn bricks with higher speed
    if (aliveCount === 0) {
      this.buildBricks();
      this.score += 500;
      this.api.playSound('highScore');
    }

    // Ball fell below floor
    if (b.y - b.radius > this.canvas.height) {
      this.lives--;
      this.api.playSound('hit');
      if (this.lives <= 0) {
        this.gameOver = true;
        this.api.saveHighScore('brick-breaker', this.score);
      } else {
        this.resetBall();
      }
    }
  },

  draw() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Deep purple background
    const grad = ctx.createLinearGradient(0, 0, 0, this.canvas.height);
    grad.addColorStop(0, '#160a2b');
    grad.addColorStop(1, '#2c0c4d');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Bricks
    for (const brick of this.bricks) {
      if (!brick.alive) continue;
      ctx.fillStyle = brick.color;
      ctx.shadowColor = brick.color;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.roundRect ? ctx.roundRect(brick.x, brick.y, brick.width, brick.height, 4) : ctx.rect(brick.x, brick.y, brick.width, brick.height);
      ctx.fill();
    }
    ctx.shadowBlur = 0;

    // Paddle
    const py = this.canvas.height - 40;
    ctx.fillStyle = '#38bdf8';
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(this.paddle.x, py, this.paddle.width, this.paddle.height, 6) : ctx.rect(this.paddle.x, py, this.paddle.width, this.paddle.height);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Ball
    ctx.fillStyle = '#fff';
    ctx.shadowColor = '#c084fc';
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // HUD
    ctx.fillStyle = '#fff';
    ctx.font = '700 16px "Space Grotesk", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`Score: ${this.score}`, 20, 32);

    ctx.fillStyle = '#f43f5e';
    ctx.fillText(`❤️ Lives: ${this.lives}`, 160, 32);

    ctx.font = '600 13px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#c084fc';
    ctx.fillText(`Mouse / Arrow Keys to Move Paddle`, 320, 32);

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

      const best = this.api.getHighScore('brick-breaker');
      ctx.font = '500 15px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#c084fc';
      ctx.fillText(`High Score: ${best}`, this.canvas.width / 2, 245);

      ctx.font = '700 16px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#38bdf8';
      ctx.fillText('Press SPACE or Click to Play Again', this.canvas.width / 2, 290);
    }
  },

  destroy() {
    this.gameLoopActive = false;
    if (this.animId) cancelAnimationFrame(this.animId);
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    if (this.canvas) {
      this.canvas.removeEventListener('mousemove', this.handleMouseMove);
      this.canvas.removeEventListener('click', this.handleCanvasClick);
    }
  }
};
