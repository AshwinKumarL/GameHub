/**
 * GameAPI - Modular Client-Side Helper for In-Game Logic
 * 
 * Provides games with:
 * - Local high score management (localStorage)
 * - In-game player nickname management (no external login/signup)
 * - Web Audio synth sounds (zero external MP3 assets needed)
 * - Stage controls (exit, restart, toast)
 */

class GameAPI {
  constructor() {
    this.storagePrefix = 'nexus_arcade_';
    this.scoreListeners = new Set();
    this.audioCtx = null;
  }

  // ---- In-Game Player Nickname ----
  getPlayerName() {
    return localStorage.getItem(this.storagePrefix + 'player_name') || 'Player 1';
  }

  setPlayerName(newName) {
    const sanitized = (newName || '').trim().slice(0, 16) || 'Player 1';
    localStorage.setItem(this.storagePrefix + 'player_name', sanitized);
    
    // Update Stage HUD badge
    const nameEl = document.getElementById('stage-player-name');
    if (nameEl) nameEl.textContent = sanitized;

    return sanitized;
  }

  promptPlayerName(callback) {
    const modal = document.getElementById('player-name-modal');
    const input = document.getElementById('player-nickname-input');
    const saveBtn = document.getElementById('save-nickname-btn');
    const cancelBtn = document.getElementById('cancel-nickname-btn');

    if (!modal || !input) return;

    input.value = this.getPlayerName();
    modal.classList.remove('hidden');
    input.focus();
    input.select();

    const cleanup = () => {
      saveBtn.onclick = null;
      cancelBtn.onclick = null;
      modal.classList.add('hidden');
    };

    saveBtn.onclick = () => {
      const saved = this.setPlayerName(input.value);
      cleanup();
      if (typeof callback === 'function') callback(saved);
    };

    cancelBtn.onclick = () => {
      cleanup();
      if (typeof callback === 'function') callback(this.getPlayerName());
    };
  }

  // ---- High Score Management (per game) ----
  getHighScore(gameId) {
    const val = localStorage.getItem(`${this.storagePrefix}highscore_${gameId}`);
    return val ? parseInt(val, 10) : 0;
  }

  saveHighScore(gameId, score) {
    const currentHigh = this.getHighScore(gameId);
    if (score > currentHigh) {
      localStorage.setItem(`${this.storagePrefix}highscore_${gameId}`, score.toString());
      
      // Update HUD
      const bestScoreEl = document.getElementById('stage-best-score');
      if (bestScoreEl) bestScoreEl.textContent = score;

      // Play celebration sound
      this.playSound('highScore');

      // Dispatch event
      this.scoreListeners.forEach(fn => fn({ gameId, newHighScore: score, previous: currentHigh }));
      return true; // New record
    }
    return false;
  }

  onScoreUpdate(callback) {
    this.scoreListeners.add(callback);
    return () => this.scoreListeners.delete(callback);
  }

  // ---- Web Audio Synthesizer (Built-in sound effects) ----
  initAudio() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    }
  }

  playSound(type = 'beep') {
    try {
      this.initAudio();
      if (!this.audioCtx) return;

      const ctx = this.audioCtx;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;

      if (type === 'beep') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      } else if (type === 'point' || type === 'coin') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.setValueAtTime(880, now + 0.08); // A5
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      } else if (type === 'hit' || type === 'gameover') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(55, now + 0.35);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === 'highScore') {
        // Arpeggio
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
          const subOsc = ctx.createOscillator();
          const subGain = ctx.createGain();
          subOsc.connect(subGain);
          subGain.connect(ctx.destination);
          subOsc.type = 'triangle';
          subOsc.frequency.setValueAtTime(freq, now + i * 0.08);
          subGain.gain.setValueAtTime(0.1, now + i * 0.08);
          subGain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.2);
          subOsc.start(now + i * 0.08);
          subOsc.stop(now + i * 0.08 + 0.2);
        });
      }
    } catch (e) {
      // Audio autoplay policy fallback
    }
  }
}

export const gameAPI = new GameAPI();
