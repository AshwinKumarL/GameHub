/**
 * Gravity Jump - Vertical Bouncy Platformer
 * Modular game for QuickFun
 */

export default {
  title: "Gravity Jump",
  author: "QuickFun Arcade",

  canvas: null,
  ctx: null,
  api: null,
  animId: null,
  gameLoopActive: false,

  player: { x: 320, y: 350, width: 28, height: 28, vx: 0, vy: 0 },
  platforms: [],
  gravity: 0.45,
  jumpPower: -12.5,
  score: 0,
  maxHeight: 0,
  cameraY: 0,
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

    this.handleCanvasClick = () => {
      if (this.gameOver) {
        this.restart();
      }
    };

    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
    this.canvas.addEventListener('click', this.handleCanvasClick);

    this.restart();
  },

  restart() {
    this.score = 0;
    this.maxHeight = 0;
    this.cameraY = 0;
    this.gameOver = false;
    this.player.x = this.canvas.width / 2 - 14;
    this.player.y = 360;
    this.player.vx = 0;
    this.player.vy = this.jumpPower;

    this.platforms = [];
    // Base platform
    this.platforms.push({ x: this.canvas.width / 2 - 60, y: 400, width: 120, height: 14, type: 'normal' });

    // Generate upward platforms
    for (let i = 1; i < 30; i++) {
      this.platforms.push({
        x: Math.random() * (this.canvas.width - 90) + 10,
        y: 400 - i * 65,
        width: 80,
        height: 14,
        type: Math.random() < 0.25 ? 'spring' : 'normal'
      });
    }

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

    // Movement
    if (this.keys['ArrowLeft'] || this.keys['a'] || this.keys['A']) {
      this.player.vx = -6;
    } else if (this.keys['ArrowRight'] || this.keys['d'] || this.keys['D']) {
      this.player.vx = 6;
    } else {
      this.player.vx *= 0.85;
    }

    this.player.x += this.player.vx;

    // Screen wrap
    if (this.player.x < -this.player.width) this.player.x = this.canvas.width;
    if (this.player.x > this.canvas.width) this.player.x = -this.player.width;

    // Gravity
    this.player.y += this.player.vy;
    this.player.vy += this.gravity;

    // Check platform bounces (only when falling downwards)
    if (this.player.vy > 0) {
      for (const plat of this.platforms) {
        if (
          this.player.x + this.player.width > plat.x &&
          this.player.x < plat.x + plat.width &&
          this.player.y + this.player.height >= plat.y &&
          this.player.y + this.player.height <= plat.y + 16
        ) {
          if (plat.type === 'spring') {
            this.player.vy = this.jumpPower * 1.5;
            this.api.playSound('highScore');
          } else {
            this.player.vy = this.jumpPower;
            this.api.playSound('beep');
          }
          break;
        }
      }
    }

    // Camera scrolling when player rises above middle
    if (this.player.y < 200) {
      const diff = 200 - this.player.y;
      this.player.y = 200;
      this.score += Math.floor(diff);

      for (const plat of this.platforms) {
        plat.y += diff;
      }

      // Remove platforms below screen and generate new above
      for (let i = this.platforms.length - 1; i >= 0; i--) {
        if (this.platforms[i].y > this.canvas.height + 20) {
          this.platforms.splice(i, 1);
          // Spawn new platform near the top
          const topY = Math.min(...this.platforms.map(p => p.y));
          this.platforms.push({
            x: Math.random() * (this.canvas.width - 90) + 10,
            y: topY - (55 + Math.random() * 25),
            width: Math.max(60, 85 - Math.min(this.score / 500, 25)),
            height: 14,
            type: Math.random() < 0.2 ? 'spring' : 'normal'
          });
        }
      }
    }

    // Fell off bottom
    if (this.player.y > this.canvas.height + 50) {
      this.gameOver = true;
      this.api.playSound('hit');
      this.api.saveHighScore('gravity-jump', this.score);
    }
  },

  draw() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Deep purple galaxy background
    const grad = ctx.createLinearGradient(0, 0, 0, this.canvas.height);
    grad.addColorStop(0, '#2e1065');
    grad.addColorStop(0.7, '#1e093d');
    grad.addColorStop(1, '#0f0521');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Platforms
    for (const plat of this.platforms) {
      if (plat.type === 'spring') {
        ctx.fillStyle = '#f43f5e';
        ctx.shadowColor = '#f43f5e';
        ctx.shadowBlur = 10;
      } else {
        ctx.fillStyle = '#38bdf8';
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 8;
      }

      ctx.beginPath();
      ctx.roundRect ? ctx.roundRect(plat.x, plat.y, plat.width, plat.height, 6) : ctx.rect(plat.x, plat.y, plat.width, plat.height);
      ctx.fill();

      // Spring coil indicator
      if (plat.type === 'spring') {
        ctx.fillStyle = '#fde047';
        ctx.fillRect(plat.x + plat.width / 2 - 8, plat.y - 6, 16, 6);
      }
    }
    ctx.shadowBlur = 0;

    // Player Jumper
    const p = this.player;
    ctx.fillStyle = '#facc15';
    ctx.shadowColor = '#facc15';
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.arc(p.x + p.width / 2, p.y + p.height / 2, p.width / 2, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#1e1b4b';
    ctx.beginPath();
    ctx.arc(p.x + p.width / 2 - 4, p.y + p.height / 2 - 2, 2.5, 0, Math.PI * 2);
    ctx.arc(p.x + p.width / 2 + 4, p.y + p.height / 2 - 2, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // HUD
    ctx.fillStyle = '#fff';
    ctx.font = '700 16px "Space Grotesk", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`Height: ${this.score}m`, 20, 32);

    ctx.font = '600 13px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#c084fc';
    ctx.fillText(`Arrow Keys / A & D to Steer • Red springs bounce super high!`, 180, 32);

    // Game Over
    if (this.gameOver) {
      ctx.fillStyle = 'rgba(15, 6, 28, 0.88)';
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      ctx.textAlign = 'center';
      ctx.font = '800 36px "Space Grotesk", sans-serif';
      ctx.fillStyle = '#f43f5e';
      ctx.fillText('FELL INTO THE VOID!', this.canvas.width / 2, 170);

      ctx.font = '600 18px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(`Final Height: ${this.score}m`, this.canvas.width / 2, 215);

      const best = this.api.getHighScore('gravity-jump');
      ctx.font = '500 15px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#c084fc';
      ctx.fillText(`Highest Altitude: ${best}m`, this.canvas.width / 2, 245);

      ctx.font = '700 16px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#38bdf8';
      ctx.fillText('Press SPACE or Click to Jump Again', this.canvas.width / 2, 290);
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
