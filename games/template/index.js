/**
 * GAME TEMPLATE / BOILERPLATE
 * 
 * Copy this file to: games/my-game-name/index.js
 * and register it in: scripts/games.config.js
 */

export default {
  title: "My Custom Game",
  
  // Internal state variables
  container: null,
  api: null,
  canvas: null,
  ctx: null,
  score: 0,
  
  /**
   * Called when the player launches this game.
   * @param {HTMLElement} container - The DOM element where your game should render
   * @param {Object} api - Helper methods:
   *   - api.getPlayerName(): string
   *   - api.setPlayerName(name): void
   *   - api.promptPlayerName(callback): void
   *   - api.getHighScore(gameId): number
   *   - api.saveHighScore(gameId, score): boolean (returns true if new record)
   *   - api.playSound('beep' | 'coin' | 'hit' | 'highScore'): void
   */
  init(container, api) {
    this.container = container;
    this.api = api;
    this.container.innerHTML = '';

    // 1. Create your canvas or custom HTML
    this.canvas = document.createElement('canvas');
    this.canvas.width = 640;
    this.canvas.height = 440;
    this.ctx = this.canvas.getContext('2d');
    this.container.appendChild(this.canvas);

    // 2. Initial state
    this.score = 0;

    // 3. Render initial frame
    this.render();

    console.log(`Initialized with player: ${this.api.getPlayerName()}`);
  },

  render() {
    if (!this.ctx) return;
    const ctx = this.ctx;

    // Background
    ctx.fillStyle = '#111827';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Text instructions
    ctx.fillStyle = '#38ef7d';
    ctx.font = '700 24px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Your Custom Game Starts Here!', this.canvas.width / 2, 180);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '16px sans-serif';
    ctx.fillText(`Current Player: ${this.api.getPlayerName()}`, this.canvas.width / 2, 220);
    ctx.fillText('Replace games/template/index.js logic with your game!', this.canvas.width / 2, 260);
  },

  /**
   * Called when the player closes or switches away from this game.
   * Clean up event listeners, timers, intervals, and requestAnimationFrames here!
   */
  destroy() {
    console.log('Game destroyed and resources cleaned up.');
  }
};
