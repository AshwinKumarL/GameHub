/**
 * Space Blaster 2088 - Action Space Shoot 'em up
 * Modular game for QuickFun
 */

export default {
  title: "Space Blaster 2088",
  author: "QuickFun Arcade",
  
  canvas: null,
  ctx: null,
  api: null,
  animId: null,
  gameLoopActive: false,

  player: { x: 300, y: 380, width: 34, height: 38, speed: 6 },
  lasers: [],
  enemies: [],
  particles: [],
  stars: [],
  score: 0,
  gameOver: false,
  keys: {},
  lastShot: 0,

  init(container, api) {
    this.api = api;
    this.container = container;
    this.container.innerHTML = '';

    this.canvas = document.createElement('canvas');
    this.canvas.width = 680;
    this.canvas.height = 460;
    this.ctx = this.canvas.getContext('2d');
    this.container.appendChild(this.canvas);

    // Init background stars
    this.stars = [];
    for (let i = 0; i < 60; i++) {
      this.stars.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 2 + 0.5,
        speed: Math.random() * 2 + 0.5
      });
    }

    this.handleKeyDown = (e) => {
      this.keys[e.key] = true;
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }
      if (this.gameOver && (e.key === ' ' || e.key === 'Enter')) {
        this.restart();
      }
    };

    this.handleKeyUp = (e) => {
      this.keys[e.key] = false;
    };

    this.handleCanvasClick = (e) => {
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
    this.gameOver = false;
    this.player.x = this.canvas.width / 2 - 17;
    this.player.y = this.canvas.height - 70;
    this.lasers = [];
    this.enemies = [];
    this.particles = [];
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

    // Movement
    if ((this.keys['ArrowLeft'] || this.keys['a'] || this.keys['A']) && this.player.x > 10) {
      this.player.x -= this.player.speed;
    }
    if ((this.keys['ArrowRight'] || this.keys['d'] || this.keys['D']) && this.player.x < this.canvas.width - this.player.width - 10) {
      this.player.x += this.player.speed;
    }
    if ((this.keys['ArrowUp'] || this.keys['w'] || this.keys['W']) && this.player.y > 100) {
      this.player.y -= this.player.speed;
    }
    if ((this.keys['ArrowDown'] || this.keys['s'] || this.keys['S']) && this.player.y < this.canvas.height - this.player.height - 10) {
      this.player.y += this.player.speed;
    }

    // Shooting
    const now = Date.now();
    if ((this.keys[' '] || this.keys['x'] || this.keys['X']) && now - this.lastShot > 180) {
      this.lasers.push({
        x: this.player.x + this.player.width / 2 - 2,
        y: this.player.y - 6,
        width: 4,
        height: 12,
        speed: 9
      });
      this.lastShot = now;
      this.api.playSound('beep');
    }

    // Update lasers
    for (let i = this.lasers.length - 1; i >= 0; i--) {
      const laser = this.lasers[i];
      laser.y -= laser.speed;
      if (laser.y < -20) {
        this.lasers.splice(i, 1);
      }
    }

    // Update stars
    for (const star of this.stars) {
      star.y += star.speed;
      if (star.y > this.canvas.height) {
        star.y = 0;
        star.x = Math.random() * this.canvas.width;
      }
    }

    // Spawn enemies
    this.spawnTimer++;
    if (this.spawnTimer % 35 === 0) {
      this.enemies.push({
        x: Math.random() * (this.canvas.width - 40) + 10,
        y: -30,
        width: 32,
        height: 28,
        speed: 2 + Math.random() * 2 + Math.min(this.score / 500, 3),
        hp: 1,
        color: ['#f43f5e', '#ec4899', '#a855f7', '#fb923c'][Math.floor(Math.random() * 4)]
      });
    }

    // Update enemies
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i];
      enemy.y += enemy.speed;

      // Laser collision
      for (let j = this.lasers.length - 1; j >= 0; j--) {
        const laser = this.lasers[j];
        if (
          laser.x < enemy.x + enemy.width &&
          laser.x + laser.width > enemy.x &&
          laser.y < enemy.y + enemy.height &&
          laser.y + laser.height > enemy.y
        ) {
          // Hit enemy
          this.lasers.splice(j, 1);
          this.spawnExplosion(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, enemy.color);
          this.enemies.splice(i, 1);
          this.score += 25;
          this.api.playSound('coin');
          break;
        }
      }

      // Check player collision
      if (
        this.player.x < enemy.x + enemy.width &&
        this.player.x + this.player.width > enemy.x &&
        this.player.y < enemy.y + enemy.height &&
        this.player.y + this.player.height > enemy.y
      ) {
        this.gameOver = true;
        this.spawnExplosion(this.player.x + 15, this.player.y + 15, '#38bdf8');
        this.api.playSound('hit');
        this.api.saveHighScore('space-blaster', Math.floor(this.score));
        return;
      }

      // Enemy reached bottom
      if (enemy.y > this.canvas.height) {
        this.enemies.splice(i, 1);
      }
    }

    // Update particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.04;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  },

  spawnExplosion(x, y, color) {
    for (let i = 0; i < 16; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4 + 1;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color,
        size: Math.random() * 3 + 2,
        life: 1
      });
    }
  },

  draw() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Deep space gradient
    const grad = ctx.createLinearGradient(0, 0, 0, this.canvas.height);
    grad.addColorStop(0, '#0c071e');
    grad.addColorStop(1, '#1b0933');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Stars
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    for (const star of this.stars) {
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();
    }

    // Lasers
    ctx.fillStyle = '#38bdf8';
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 10;
    for (const laser of this.lasers) {
      ctx.fillRect(laser.x, laser.y, laser.width, laser.height);
    }
    ctx.shadowBlur = 0;

    // Particles
    for (const p of this.particles) {
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Enemies (Alien fighters)
    for (const enemy of this.enemies) {
      ctx.fillStyle = enemy.color;
      ctx.shadowColor = enemy.color;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.moveTo(enemy.x + enemy.width / 2, enemy.y + enemy.height);
      ctx.lineTo(enemy.x, enemy.y);
      ctx.lineTo(enemy.x + enemy.width / 2, enemy.y + 8);
      ctx.lineTo(enemy.x + enemy.width, enemy.y);
      ctx.closePath();
      ctx.fill();
    }
    ctx.shadowBlur = 0;

    // Player Starship
    if (!this.gameOver) {
      const px = this.player.x;
      const py = this.player.y;
      const pw = this.player.width;
      const ph = this.player.height;

      // Thruster flame
      ctx.fillStyle = '#fb923c';
      ctx.shadowColor = '#f97316';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.moveTo(px + pw / 2 - 4, py + ph);
      ctx.lineTo(px + pw / 2, py + ph + 10 + Math.random() * 8);
      ctx.lineTo(px + pw / 2 + 4, py + ph);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Ship hull
      ctx.fillStyle = '#e0e7ff';
      ctx.beginPath();
      ctx.moveTo(px + pw / 2, py);
      ctx.lineTo(px, py + ph);
      ctx.lineTo(px + pw / 2, py + ph - 8);
      ctx.lineTo(px + pw, py + ph);
      ctx.closePath();
      ctx.fill();

      // Cockpit
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(px + pw / 2, py + ph / 2, 5, 0, Math.PI * 2);
      ctx.fill();
    }

    // In-game HUD
    ctx.fillStyle = '#fff';
    ctx.font = '700 16px "Space Grotesk", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`Score: ${this.score}`, 20, 32);

    ctx.font = '600 13px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#c084fc';
    ctx.fillText(`Controls: Arrow keys / WASD to fly • SPACE to shoot`, 20, 52);

    // Game Over Overlay
    if (this.gameOver) {
      ctx.fillStyle = 'rgba(15, 6, 28, 0.88)';
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      ctx.textAlign = 'center';
      ctx.font = '800 36px "Space Grotesk", sans-serif';
      ctx.fillStyle = '#f43f5e';
      ctx.fillText('MISSION FAILED', this.canvas.width / 2, 170);

      ctx.font = '600 18px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(`Final Score: ${this.score}`, this.canvas.width / 2, 215);

      const best = this.api.getHighScore('space-blaster');
      ctx.font = '500 15px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#c084fc';
      ctx.fillText(`High Score: ${best}`, this.canvas.width / 2, 245);

      ctx.font = '700 16px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#38bdf8';
      ctx.fillText('Press SPACE or Click to Launch Again', this.canvas.width / 2, 290);
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
