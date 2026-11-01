/**
 * Block Match 2048 - Arcade Tile Merge Puzzle
 * Modular game for QuickFun
 */

export default {
  title: "Block Match",
  author: "QuickFun Arcade",

  canvas: null,
  ctx: null,
  api: null,
  animId: null,

  grid: [],
  size: 4,
  score: 0,
  gameOver: false,

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
      let moved = false;
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') moved = this.move('up');
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') moved = this.move('down');
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') moved = this.move('left');
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') moved = this.move('right');

      if (moved) {
        this.addRandomTile();
        this.api.playSound('beep');
        if (this.checkGameOver()) {
          this.gameOver = true;
          this.api.playSound('hit');
          this.api.saveHighScore('block-match', this.score);
        }
        this.draw();
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
    this.grid = Array(this.size).fill(null).map(() => Array(this.size).fill(0));
    this.addRandomTile();
    this.addRandomTile();
    this.draw();
  },

  addRandomTile() {
    const emptyCells = [];
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.grid[r][c] === 0) emptyCells.push({ r, c });
      }
    }
    if (emptyCells.length > 0) {
      const cell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      this.grid[cell.r][cell.c] = Math.random() < 0.85 ? 2 : 4;
    }
  },

  move(dir) {
    if (this.gameOver) return false;
    let rotated = false;
    let moved = false;

    // Normalize direction to left
    if (dir === 'right') {
      this.grid = this.grid.map(row => row.reverse());
      rotated = true;
    } else if (dir === 'up') {
      this.transpose();
      rotated = true;
    } else if (dir === 'down') {
      this.transpose();
      this.grid = this.grid.map(row => row.reverse());
      rotated = true;
    }

    // Slide and merge rows left
    for (let r = 0; r < this.size; r++) {
      const row = this.grid[r].filter(val => val !== 0);
      const newRow = [];

      for (let i = 0; i < row.length; i++) {
        if (i < row.length - 1 && row[i] === row[i + 1]) {
          const merged = row[i] * 2;
          newRow.push(merged);
          this.score += merged;
          this.api.playSound('point');
          i++;
        } else {
          newRow.push(row[i]);
        }
      }

      while (newRow.length < this.size) {
        newRow.push(0);
      }

      if (JSON.stringify(this.grid[r]) !== JSON.stringify(newRow)) {
        moved = true;
      }
      this.grid[r] = newRow;
    }

    // Revert normalization
    if (dir === 'right') {
      this.grid = this.grid.map(row => row.reverse());
    } else if (dir === 'up') {
      this.transpose();
    } else if (dir === 'down') {
      this.grid = this.grid.map(row => row.reverse());
      this.transpose();
    }

    return moved;
  },

  transpose() {
    const res = Array(this.size).fill(null).map(() => Array(this.size).fill(0));
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        res[c][r] = this.grid[r][c];
      }
    }
    this.grid = res;
  },

  checkGameOver() {
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.grid[r][c] === 0) return false;
        if (r < this.size - 1 && this.grid[r][c] === this.grid[r + 1][c]) return false;
        if (c < this.size - 1 && this.grid[r][c] === this.grid[r][c + 1]) return false;
      }
    }
    return true;
  },

  getTileColor(val) {
    const map = {
      2: '#475569',
      4: '#64748b',
      8: '#a855f7',
      16: '#9333ea',
      32: '#38bdf8',
      64: '#0284c7',
      128: '#f43f5e',
      256: '#e11d48',
      512: '#f59e0b',
      1024: '#d97706',
      2048: '#10b981'
    };
    return map[val] || '#059669';
  },

  draw() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Dark purple gradient
    const grad = ctx.createLinearGradient(0, 0, 0, this.canvas.height);
    grad.addColorStop(0, '#17092b');
    grad.addColorStop(1, '#2c0c4d');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Board container
    const boardSize = 360;
    const boardX = (this.canvas.width - boardSize) / 2;
    const boardY = 60;
    const pad = 12;
    const cellSize = (boardSize - pad * 5) / 4;

    ctx.fillStyle = '#0f051d';
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(boardX, boardY, boardSize, boardSize, 14) : ctx.rect(boardX, boardY, boardSize, boardSize);
    ctx.fill();

    // Render cells
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        const val = this.grid[r][c];
        const x = boardX + pad + c * (cellSize + pad);
        const y = boardY + pad + r * (cellSize + pad);

        ctx.fillStyle = val === 0 ? 'rgba(255, 255, 255, 0.05)' : this.getTileColor(val);
        ctx.beginPath();
        ctx.roundRect ? ctx.roundRect(x, y, cellSize, cellSize, 8) : ctx.rect(x, y, cellSize, cellSize);
        ctx.fill();

        if (val > 0) {
          ctx.fillStyle = '#ffffff';
          ctx.font = `800 ${val > 512 ? 22 : 28}px "Space Grotesk", sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(val, x + cellSize / 2, y + cellSize / 2);
        }
      }
    }

    // HUD Header
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#fff';
    ctx.font = '700 18px "Space Grotesk", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`Score: ${this.score}`, 30, 36);

    ctx.font = '600 13px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#c084fc';
    ctx.fillText(`Arrow Keys or WASD to Slide & Merge`, 220, 36);

    // Game Over
    if (this.gameOver) {
      ctx.fillStyle = 'rgba(15, 6, 28, 0.88)';
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      ctx.textAlign = 'center';
      ctx.font = '800 36px "Space Grotesk", sans-serif';
      ctx.fillStyle = '#f43f5e';
      ctx.fillText('NO MORE MOVES!', this.canvas.width / 2, 180);

      ctx.font = '600 18px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(`Score: ${this.score}`, this.canvas.width / 2, 225);

      const best = this.api.getHighScore('block-match');
      ctx.font = '500 15px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#c084fc';
      ctx.fillText(`High Score: ${best}`, this.canvas.width / 2, 255);

      ctx.font = '700 16px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#38bdf8';
      ctx.fillText('Press SPACE or Click to Play Again', this.canvas.width / 2, 300);
    }
  },

  destroy() {
    window.removeEventListener('keydown', this.handleKeyDown);
    if (this.canvas) this.canvas.removeEventListener('click', this.handleCanvasClick);
  }
};
