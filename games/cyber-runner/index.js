/**
 * Cyber Runner - Fast-paced Action Jumper
 * Modular game for QuickFun
 */

export default {
  title: "Cyber Runner",
  author: "QuickFun Arcade",

  canvas: null,
  ctx: null,
  api: null,
  animId: null,
  gameLoopActive: false,

  player: { x: 90, y: 320, width: 34, height: 46, vy: 0, isGrounded: true, jumpsLeft: 2, sliding: false },
  gravity: 0.82,
  speed: 7,
  obstacles: [],
  coins: [],
  particles: [],
  score: 0,
  coinsCollected: 0,
  groundY: 370,
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
      if (['ArrowUp', 'ArrowDown', ' ', 'w', 'W'].includes(e.key)) {
        e.preventDefault();
      }

      if ((e.key === 'ArrowUp' || e.key === ' ' || e.key === 'w' || e.key === 'W') && !this.gameOver) {
        this.jump();
      }

      if ((e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') && !this.gameOver) {
        this.slide(true);
      }

      if (this.gameOver && (e.key === ' ' || e.key === 'Enter')) {
        this.restart();
      }
    };

    this.handleKeyUp = (e) => {
      this.keys[e.key] = false;
      if (['ArrowDown', 's', 'S'].includes(e.key)) {
        this.slide(false);
      }
    };

    this.handleCanvasClick = () => {
      if (this.gameOver) {
        this.restart();
      } else {
        this.jump();
      }
    };

    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
    this.canvas.addEventListener('click', this.handleCanvasClick);

    this.restart();
  },

  jump() {
    if (this.player.jumpsLeft > 0) {
      this.player.vy = -14.5;
      this.player.jumpsLeft--;
      this.player.isGrounded = false;
      this.player.sliding = false;
      this.player.height = 46;
      this.api.playSound('beep');
    }
  },

  slide(isSliding) {
    if (this.player.isGrounded) {
      this.player.sliding = isSliding;
      this.player.height = isSliding ? 24 : 46;
      this.player.y = this.groundY - this.player.height;
    }
  },

  restart() {
    this.score = 0;
    this.coinsCollected = 0;
    this.speed = 7;
    this.gameOver = false;
    this.obstacles = [];
    this.coins = [];
    this.particles = [];
    this.player.y = this.groundY - 46;
    this.player.vy = 0;
    this.player.isGrounded = true;
    this.player.jumpsLeft = 2;
    this.player.sliding = false;
    this.player.height = 46;
    this.spawnTimer = 0;

    if (!this.gameLoopActive) {
      this.gameLoopActive = true;
      this.loop();
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

    this.speed = 7 + Math.min(this.score / 600, 5);

    // Apply physics
    this.player.y += this.player.vy;
    this.player.vy += this.gravity;

    if (this.player.y >= this.groundY - this.player.height) {
      this.player.y = this.groundY - this.player.height;
      this.player.vy = 0;
      this.player.isGrounded = true;
      this.player.jumpsLeft = 2;
    }

    // Spawn obstacles & coins
    this.spawnTimer++;
    if (this.spawnTimer % 65 === 0) {
      const isHighObstacle = Math.random() < 0.35;
      if (isHighObstacle) {
        // High laser drone (must slide under)
        this.obstacles.push({
          x: this.canvas.width + 20,
          y: this.groundY - 70,
          width: 38,
          height: 38,
          type: 'drone'
        });
      } else {
        // Ground spike/barrier (must jump over)
        this.obstacles.push({
          x: this.canvas.width + 20,
          y: this.groundY - 38,
          width: 30,
          height: 38,
          type: 'spike'
        });
      }

      // Spawn floating coins
      if (Math.random() < 0.6) {
        const coinY = isHighObstacle ? this.groundY - 18 : this.groundY - 95;
        this.coins.push({
          x: this.canvas.width + 60,
          y: coinY,
          radius: 11
        });
      }
    }

    // Update obstacles & collision
    for (let i = this.obstacles.length - 1; i >= 0; i--) {
      const obs = this.obstacles[i];
      obs.x -= this.speed;

      // Check collision
      const p = this.player;
      if (
        p.x < obs.x + obs.width &&
        p.x + p.width > obs.x &&
        p.y < obs.y + obs.height &&
        p.y + p.height > obs.y
      ) {
        this.gameOver = true;
        this.api.playSound('hit');
        this.api.saveHighScore('cyber-runner', Math.floor(this.score));
        return;
      }

      if (obs.x < -60) {
        this.obstacles.splice(i, 1);
      }
    }

    // Update coins
    for (let i = this.coins.length - 1; i >= 0; i--) {
      const coin = this.coins[i];
      coin.x -= this.speed;

      // Pickup
      const p = this.player;
      const dx = (p.x + p.width / 2) - coin.x;
      const dy = (p.y + p.height / 2) - coin.y;
      if (Math.hypot(dx, dy) < p.width / 2 + coin.radius + 6) {
        this.coins.splice(i, 1);
        this.coinsCollected++;
        this.score += 50;
        this.api.playSound('coin');
        continue;
      }

      if (coin.x < -20) {
        this.coins.splice(i, 1);
      }
    }

    this.score += 0.25;
  },

  draw() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Cyberpunk Skyline
    const grad = ctx.createLinearGradient(0, 0, 0, this.canvas.height);
    grad.addColorStop(0, '#1a0b2e');
    grad.addColorStop(0.65, '#3b0764');
    grad.addColorStop(1, '#1e0533');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Distant Neon Grid Horizon
    ctx.strokeStyle = 'rgba(192, 132, 252, 0.15)';
    ctx.lineWidth = 1;
    for (let x = 0; x < this.canvas.width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 260);
      ctx.lineTo(x - 30, this.groundY);
      ctx.stroke();
    }

    // Floor Track
    ctx.fillStyle = '#0f051d';
    ctx.fillRect(0, this.groundY, this.canvas.width, this.canvas.height - this.groundY);
    ctx.fillStyle = '#c084fc';
    ctx.fillRect(0, this.groundY, this.canvas.width, 4);

    // Obstacles
    for (const obs of this.obstacles) {
      if (obs.type === 'spike') {
        ctx.fillStyle = '#f43f5e';
        ctx.shadowColor = '#f43f5e';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.moveTo(obs.x + obs.width / 2, obs.y);
        ctx.lineTo(obs.x + obs.width, obs.y + obs.height);
        ctx.lineTo(obs.x, obs.y + obs.height);
        ctx.closePath();
        ctx.fill();
      } else {
        ctx.fillStyle = '#e11d48';
        ctx.shadowColor = '#f43f5e';
        ctx.shadowBlur = 12;
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
        ctx.fillStyle = '#fde047';
        ctx.fillRect(obs.x + 8, obs.y + 12, obs.width - 16, 12);
      }
      ctx.shadowBlur = 0;
    }

    // Collectible Coins
    ctx.shadowBlur = 12;
    ctx.shadowColor = '#facc15';
    for (const coin of this.coins) {
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.arc(coin.x, coin.y, coin.radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ca8a04';
      ctx.beginPath();
      ctx.arc(coin.x, coin.y, coin.radius - 3, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.shadowBlur = 0;

    // Player Hero
    const p = this.player;
    ctx.fillStyle = '#38bdf8';
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 12;

    if (p.sliding) {
      // Sliding dash shape
      ctx.fillRect(p.x, p.y, p.width + 10, p.height);
      ctx.fillStyle = '#fff';
      ctx.fillRect(p.x + p.width - 6, p.y + 4, 8, 8);
    } else {
      // Running / Jumping cyber-ninja
      ctx.fillRect(p.x, p.y, p.width, p.height);
      // Visor
      ctx.fillStyle = '#f43f5e';
      ctx.fillRect(p.x + p.width - 14, p.y + 8, 12, 6);
      // Running scarf trail
      ctx.fillStyle = '#a855f7';
      ctx.fillRect(p.x - 14, p.y + 14, 14, 6);
    }
    ctx.shadowBlur = 0;

    // HUD
    ctx.fillStyle = '#fff';
    ctx.font = '700 16px "Space Grotesk", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`Distance: ${Math.floor(this.score)}m`, 20, 32);

    ctx.fillStyle = '#facc15';
    ctx.fillText(`🟡 Coins: ${this.coinsCollected}`, 20, 55);

    ctx.font = '600 13px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#c084fc';
    ctx.fillText(`UP / SPACE: Jump (Double Jump!) • DOWN: Slide`, 20, 78);

    // Game Over
    if (this.gameOver) {
      ctx.fillStyle = 'rgba(15, 6, 28, 0.88)';
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      ctx.textAlign = 'center';
      ctx.font = '800 36px "Space Grotesk", sans-serif';
      ctx.fillStyle = '#f43f5e';
      ctx.fillText('CRASHED!', this.canvas.width / 2, 170);

      ctx.font = '600 18px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(`Distance: ${Math.floor(this.score)}m  •  Coins: ${this.coinsCollected}`, this.canvas.width / 2, 215);

      const best = this.api.getHighScore('cyber-runner');
      ctx.font = '500 15px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#c084fc';
      ctx.fillText(`Best Record: ${best}m`, this.canvas.width / 2, 245);

      ctx.font = '700 16px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#38bdf8';
      ctx.fillText('Press SPACE or Click to Run Again', this.canvas.width / 2, 290);
    }
  },

  destroy() {
    this.gameLoopActive = false;
    if (this.animId) cancelAnimationFrame(this.animId);
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    if (this.canvas) this.canvas.removeEventListener('click', this.handleCanvasClick);
  }
};
