/**
 * Neon Dodge - Starter Showcase Game
 * Demonstrates:
 * - Canvas lifecycle (init, start, destroy)
 * - In-game scoring & GameAPI integration
 * - In-game player alias & personal high score
 * - Smooth 60fps responsive rendering
 */

export default {
  title: "Neon Dodge",
  author: "Arcade Core",
  
  canvas: null,
  ctx: null,
  api: null,
  animId: null,
  gameLoopActive: false,

  // Game state
  player: { x: 0, y: 0, size: 18, speed: 6 },
  orbs: [],
  score: 0,
  gameOver: false,
  keys: {},

  init(container, api) {
    this.api = api;
    this.container = container;
    this.container.innerHTML = '';

    // Create Canvas
    this.canvas = document.createElement('canvas');
    this.canvas.width = 680;
    this.canvas.height = 460;
    this.ctx = this.canvas.getContext('2d');
    this.container.appendChild(this.canvas);

    // Setup input listeners
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

    // Canvas click to restart or prompt name on game over
    this.handleCanvasClick = (e) => {
      if (this.gameOver) {
        const rect = this.canvas.getBoundingClientRect();
        const y = e.clientY - rect.top;
        // If clicked on rename button area
        if (y > 310 && y < 350) {
          this.api.promptPlayerName(() => this.draw());
        } else {
          this.restart();
        }
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
    this.player.x = this.canvas.width / 2;
    this.player.y = this.canvas.height / 2;
    this.orbs = [];
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
    if (this.keys['ArrowUp'] || this.keys['w'] || this.keys['W']) this.player.y -= this.player.speed;
    if (this.keys['ArrowDown'] || this.keys['s'] || this.keys['S']) this.player.y += this.player.speed;
    if (this.keys['ArrowLeft'] || this.keys['a'] || this.keys['A']) this.player.x -= this.player.speed;
    if (this.keys['ArrowRight'] || this.keys['d'] || this.keys['D']) this.player.x += this.player.speed;

    // Clamp player within boundaries
    this.player.x = Math.max(this.player.size, Math.min(this.canvas.width - this.player.size, this.player.x));
    this.player.y = Math.max(this.player.size, Math.min(this.canvas.height - this.player.size, this.player.y));

    // Spawn hazard orbs
    this.spawnTimer++;
    if (this.spawnTimer % 20 === 0) {
      const side = Math.floor(Math.random() * 4);
      let ox, oy, vx, vy;
      const speed = 2.5 + Math.min(this.score / 250, 4);

      if (side === 0) { // Top
        ox = Math.random() * this.canvas.width; oy = -10;
        vx = (Math.random() - 0.5) * 3; vy = speed;
      } else if (side === 1) { // Bottom
        ox = Math.random() * this.canvas.width; oy = this.canvas.height + 10;
        vx = (Math.random() - 0.5) * 3; vy = -speed;
      } else if (side === 2) { // Left
        ox = -10; oy = Math.random() * this.canvas.height;
        vx = speed; vy = (Math.random() - 0.5) * 3;
      } else { // Right
        ox = this.canvas.width + 10; oy = Math.random() * this.canvas.height;
        vx = -speed; vy = (Math.random() - 0.5) * 3;
      }

      this.orbs.push({ x: ox, y: oy, vx, vy, radius: 8 + Math.random() * 6 });
    }

    // Update orbs & check collision
    for (let i = this.orbs.length - 1; i >= 0; i--) {
      const orb = this.orbs[i];
      orb.x += orb.vx;
      orb.y += orb.vy;

      // Distance check
      const dx = this.player.x - orb.x;
      const dy = this.player.y - orb.y;
      const dist = Math.hypot(dx, dy);

      if (dist < this.player.size + orb.radius) {
        // Collision!
        this.gameOver = true;
        this.api.playSound('hit');
        this.api.saveHighScore('neon-dodge', Math.floor(this.score));
        return;
      }

      // Remove out of bounds orbs and add score
      if (orb.x < -30 || orb.x > this.canvas.width + 30 || orb.y < -30 || orb.y > this.canvas.height + 30) {
        this.orbs.splice(i, 1);
        this.score += 10;
        if (this.score % 100 === 0) {
          this.api.playSound('point');
        }
      }
    }

    this.score += 0.1;
  },

  draw() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Background Grid
    ctx.fillStyle = '#0c121e';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1;
    const gridSize = 40;
    for (let x = 0; x < this.canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, this.canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < this.canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(this.canvas.width, y);
      ctx.stroke();
    }

    // Hazard Orbs
    for (const orb of this.orbs) {
      ctx.beginPath();
      ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
      ctx.fillStyle = '#ff2a85';
      ctx.shadowColor = '#ff2a85';
      ctx.shadowBlur = 12;
      ctx.fill();
    }

    // Player Ship / Orb
    ctx.beginPath();
    ctx.arc(this.player.x, this.player.y, this.player.size, 0, Math.PI * 2);
    ctx.fillStyle = '#00f2fe';
    ctx.shadowColor = '#00f2fe';
    ctx.shadowBlur = 18;
    ctx.fill();

    // Reset shadow
    ctx.shadowBlur = 0;

    // HUD Inside Canvas
    const playerName = this.api.getPlayerName();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.font = '600 14px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`Pilot: ${playerName}`, 20, 30);

    ctx.font = '700 16px "Space Grotesk", sans-serif';
    ctx.fillStyle = '#00f2fe';
    ctx.fillText(`Score: ${Math.floor(this.score)}`, 20, 55);

    // Game Over Overlay
    if (this.gameOver) {
      ctx.fillStyle = 'rgba(6, 9, 16, 0.85)';
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      ctx.textAlign = 'center';
      ctx.font = '700 36px "Space Grotesk", sans-serif';
      ctx.fillStyle = '#ff2a85';
      ctx.fillText('GAME OVER', this.canvas.width / 2, 170);

      ctx.font = '600 18px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(`Final Score: ${Math.floor(this.score)}`, this.canvas.width / 2, 215);

      const best = this.api.getHighScore('neon-dodge');
      ctx.font = '500 15px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#a0aec0';
      ctx.fillText(`Personal Best: ${best}`, this.canvas.width / 2, 245);

      // Call to action buttons
      ctx.font = '700 16px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#00f2fe';
      ctx.fillText('Press SPACE or Click to Play Again', this.canvas.width / 2, 290);

      // In-game change alias prompt link
      ctx.font = '500 13px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#7f56d9';
      ctx.fillText(`[ Click here to change player nickname: ${playerName} ]`, this.canvas.width / 2, 335);
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
