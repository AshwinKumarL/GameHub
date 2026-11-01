/**
 * Speed Drifter - Fast Highway Racing
 * Modular game for QuickFun
 */

export default {
  title: "Speed Drifter",
  author: "QuickFun Arcade",

  canvas: null,
  ctx: null,
  api: null,
  animId: null,
  gameLoopActive: false,

  player: { x: 340, y: 350, width: 34, height: 60, speed: 6 },
  traffic: [],
  nitroFuel: 100,
  score: 0,
  speedKmh: 120,
  roadOffset: 0,
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
    this.speedKmh = 140;
    this.nitroFuel = 100;
    this.gameOver = false;
    this.player.x = this.canvas.width / 2 - 17;
    this.player.y = 350;
    this.traffic = [];
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

    // Road bounds: 140 to 540
    const roadLeft = 140;
    const roadRight = 540;

    const isNitro = (this.keys['ArrowUp'] || this.keys['w'] || this.keys['W'] || this.keys[' ']) && this.nitroFuel > 0;
    if (isNitro) {
      this.speedKmh = 230;
      this.nitroFuel = Math.max(0, this.nitroFuel - 0.4);
      if (Math.random() < 0.2) this.api.playSound('beep');
    } else {
      this.speedKmh = 140;
      this.nitroFuel = Math.min(100, this.nitroFuel + 0.1);
    }

    const currentSpeed = isNitro ? 11 : 7;
    this.roadOffset = (this.roadOffset + currentSpeed) % 60;

    // Steer
    if ((this.keys['ArrowLeft'] || this.keys['a'] || this.keys['A']) && this.player.x > roadLeft + 10) {
      this.player.x -= this.player.speed * (isNitro ? 1.25 : 1);
    }
    if ((this.keys['ArrowRight'] || this.keys['d'] || this.keys['D']) && this.player.x < roadRight - this.player.width - 10) {
      this.player.x += this.player.speed * (isNitro ? 1.25 : 1);
    }

    // Spawn traffic
    this.spawnTimer++;
    const spawnFreq = isNitro ? 32 : 44;
    if (this.spawnTimer % spawnFreq === 0) {
      const lanes = [roadLeft + 25, roadLeft + 120, roadLeft + 215, roadLeft + 310];
      const laneX = lanes[Math.floor(Math.random() * lanes.length)];
      const colors = ['#f43f5e', '#a855f7', '#10b981', '#f59e0b'];
      this.traffic.push({
        x: laneX,
        y: -90,
        width: 34,
        height: 60,
        speed: 3 + Math.random() * 2,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    // Update traffic
    for (let i = this.traffic.length - 1; i >= 0; i--) {
      const car = this.traffic[i];
      car.y += currentSpeed - car.speed + 3;

      // Crash detection
      const p = this.player;
      if (
        p.x < car.x + car.width &&
        p.x + p.width > car.x &&
        p.y < car.y + car.height &&
        p.y + p.height > car.y
      ) {
        this.gameOver = true;
        this.api.playSound('hit');
        this.api.saveHighScore('speed-drifter', Math.floor(this.score));
        return;
      }

      // Passed car
      if (car.y > this.canvas.height + 60) {
        this.traffic.splice(i, 1);
        this.score += 20;
        this.api.playSound('coin');
      }
    }

    this.score += (currentSpeed / 10) * 0.4;
  },

  draw() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Purple grass roadside
    ctx.fillStyle = '#1c0838';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Highway Asphalt
    const roadLeft = 140;
    const roadWidth = 400;
    ctx.fillStyle = '#0f051d';
    ctx.fillRect(roadLeft, 0, roadWidth, this.canvas.height);

    // Guard rails
    ctx.fillStyle = '#a855f7';
    ctx.fillRect(roadLeft - 6, 0, 6, this.canvas.height);
    ctx.fillRect(roadLeft + roadWidth, 0, 6, this.canvas.height);

    // Lane dashes
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    const laneX1 = roadLeft + 100;
    const laneX2 = roadLeft + 200;
    const laneX3 = roadLeft + 300;

    for (let y = -60 + this.roadOffset; y < this.canvas.height + 60; y += 50) {
      ctx.fillRect(laneX1, y, 4, 25);
      ctx.fillRect(laneX2, y, 4, 25);
      ctx.fillRect(laneX3, y, 4, 25);
    }

    // Traffic cars
    for (const car of this.traffic) {
      ctx.fillStyle = car.color;
      ctx.shadowColor = car.color;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.roundRect ? ctx.roundRect(car.x, car.y, car.width, car.height, 6) : ctx.rect(car.x, car.y, car.width, car.height);
      ctx.fill();

      // Taillights
      ctx.fillStyle = '#f43f5e';
      ctx.fillRect(car.x + 3, car.y + car.height - 4, 6, 4);
      ctx.fillRect(car.x + car.width - 9, car.y + car.height - 4, 6, 4);
    }
    ctx.shadowBlur = 0;

    // Player sports car
    const p = this.player;
    ctx.fillStyle = '#38bdf8';
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(p.x, p.y, p.width, p.height, 6) : ctx.rect(p.x, p.y, p.width, p.height);
    ctx.fill();

    // Windshield
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(p.x + 4, p.y + 16, p.width - 8, 14);

    // Headlights
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(p.x + 4, p.y, 6, 4);
    ctx.fillRect(p.x + p.width - 10, p.y, 6, 4);
    ctx.shadowBlur = 0;

    // HUD
    ctx.fillStyle = '#fff';
    ctx.font = '700 16px "Space Grotesk", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`Score: ${Math.floor(this.score)}`, 20, 32);

    ctx.fillStyle = '#38bdf8';
    ctx.fillText(`⚡ Speed: ${this.speedKmh} km/h`, 20, 56);

    // Nitro gauge
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.fillRect(20, 70, 100, 10);
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(20, 70, this.nitroFuel, 10);
    ctx.font = '600 12px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#c084fc';
    ctx.fillText(`NITRO (Hold UP/SPACE)`, 20, 96);

    // Game Over
    if (this.gameOver) {
      ctx.fillStyle = 'rgba(15, 6, 28, 0.88)';
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      ctx.textAlign = 'center';
      ctx.font = '800 36px "Space Grotesk", sans-serif';
      ctx.fillStyle = '#f43f5e';
      ctx.fillText('CRASHED & TOTALED!', this.canvas.width / 2, 170);

      ctx.font = '600 18px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(`Final Score: ${Math.floor(this.score)} pts`, this.canvas.width / 2, 215);

      const best = this.api.getHighScore('speed-drifter');
      ctx.font = '500 15px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#c084fc';
      ctx.fillText(`High Score: ${best}`, this.canvas.width / 2, 245);

      ctx.font = '700 16px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#38bdf8';
      ctx.fillText('Press SPACE or Click to Race Again', this.canvas.width / 2, 290);
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
