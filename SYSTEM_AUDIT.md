# QuickFun - System Architecture & Game Loading Audit

## 1. Workspace File System Structure

```text
Project Game/
├── index.html                      # Main single-page application entry point
├── README.md                       # High-level project summary
├── SYSTEM_AUDIT.md                 # This system audit documentation
│
├── assets/                         # Static graphical assets
│   └── images/
│       ├── quickfun-logo-v3.png    # Primary clean transparent PNG logo (navbar & loading splash)
│       ├── quickfun-logo-v2-clean.png
│       ├── quickfun-logo-v2.jpg
│       ├── quickfun-logo-clean.png
│       └── quickfun-logo.jpg
│
├── styles/                         # CSS design system (Vanilla CSS)
│   ├── main.css                    # Theme, navbar, desktop collapsible sidebar, catalog grid
│   └── game-stage.css              # Game player viewport overlay, HUD, & loading splash screen
│
├── scripts/                        # Core application runtime
│   ├── game-hub.js                 # Main orchestrator (catalog rendering, sidebar, game launcher)
│   ├── games.config.js             # Declarative game registry (catalog metadata & paths)
│   ├── game-api.js                 # Bridge API passed into each game (scores, audio, player alias)
│   └── icons.js                    # Inline SVG icon library for categories and games
│
└── games/                          # Modular game directory (each game is an ES module)
    ├── template/                   # Boilerplate template for creating new games
    │   └── index.js
    ├── space-blaster/index.js      # Arcade Galaxy Shoot 'em up
    ├── neon-dodge/index.js         # Arcade Reflex Orb Dodger
    ├── speed-drifter/index.js      # Highway Traffic Racer
    ├── cyber-runner/index.js       # Action Platformer / Endless Runner
    ├── brick-breaker/index.js      # Classic Neon Breakout
    ├── snake-strike/index.js       # Retro Neon Snake
    ├── gravity-jump/index.js       # Bouncy Platformer
    └── block-match/index.js        # Puzzle Match Title
```

---

## 2. How Games Are Loaded (Step-by-Step Architecture)

The QuickFun platform uses a **Dynamic ES Module & Stage Injection Architecture**. Games are decoupled from the main platform shell and are dynamically imported into the viewport on demand.

```
+-----------------------------------------------------------------------------------+
| 1. REGISTRY: scripts/games.config.js                                              |
|    Declares game metadata, category, and entry point path                         |
+-----------------------------------------------------------------------------------+
                                        |
                                        v
+-----------------------------------------------------------------------------------+
| 2. HUB ORCHESTRATOR: scripts/game-hub.js                                         |
|    Renders catalog cards in the catalog grid & listens for click events           |
+-----------------------------------------------------------------------------------+
                                        |  (User clicks a game tile)
                                        v
+-----------------------------------------------------------------------------------+
| 3. STAGE HUD & LOADING SCREEN:                                                    |
|    - Mounts loading splash screen with QuickFun logo & animated progress bar       |
|    - Updates Stage HUD: Title, Genre, Best Score, Player Alias                    |
+-----------------------------------------------------------------------------------+
                                        |
                                        v
+-----------------------------------------------------------------------------------+
| 4. DYNAMIC IMPORT:                                                                |
|    const module = await import(game.path);                                        |
|    const gameInstance = module.default;                                           |
+-----------------------------------------------------------------------------------+
                                        |
                                        v
+-----------------------------------------------------------------------------------+
| 5. INITIALIZATION & EXECUTION:                                                    |
|    gameInstance.init(stageContainer, gameAPI);                                    |
|    - Game creates its own <canvas> inside stageContainer                          |
|    - Interacts with gameAPI for highscores, sounds, and player alias              |
+-----------------------------------------------------------------------------------+
                                        |  (User closes or escapes stage)
                                        v
+-----------------------------------------------------------------------------------+
| 6. TEARDOWN & CLEANUP:                                                            |
|    gameInstance.destroy();                                                        |
|    - Cancels requestAnimationFrames, removes listeners, clears canvas            |
+-----------------------------------------------------------------------------------+
```

---

## 3. Core Subsystems

### A. The Game Registry (`scripts/games.config.js`)
All titles available in the arcade are declared as configuration objects:
```javascript
{
  id: 'space-blaster',
  status: 'ready',
  title: 'Space Blaster 2088',
  genre: 'Shoot \'em up',
  category: 'action',             // Used for sidebar filtering
  badge: 'HOT',
  iconKey: 'space-blaster',
  accentColor: '#00f0ff',
  bgGradient: 'linear-gradient(...)',
  description: 'Retro arcade galaxy combat! Shoot alien fleets...',
  path: '../games/space-blaster/index.js' // Relative path to ES Module
}
```

### B. The Game Module Contract (`games/template/index.js`)
Each game file is an isolated ES module exporting a default object with two lifecycle functions:
```javascript
export default {
  title: "Game Title",
  
  // 1. Mount & Run
  init(container, api) {
    // container: HTML element where game canvas or DOM mounts
    // api: platform helper methods (high score, player name, audio)
    const canvas = document.createElement('canvas');
    container.appendChild(canvas);
  },

  // 2. Clean Up
  destroy() {
    // Called when the user closes or exits the game stage.
    // Cancel requestAnimationFrame loops, clear intervals, remove listeners.
  }
};
```

### C. The Platform Bridge API (`scripts/game-api.js`)
Passed as the second argument to `gameInstance.init(container, api)`:
- **High Scores**: `api.getHighScore(gameId)` and `api.saveHighScore(gameId, score)` (automatically stored in `localStorage`).
- **Player Callsign**: `api.getPlayerName()` and `api.promptPlayerName(callback)` (syncs with the top bar HUD).
- **Zero-Asset Audio**: `api.playSound('beep' | 'coin' | 'hit' | 'highScore')` uses the browser's built-in `AudioContext` synthesizer (no external MP3/WAV files required).

### D. The Game Stage & Loader (`scripts/game-hub.js`)
Inside `launchGame(game)`:
1. Opens the `#game-stage-overlay` modal and populates the HUD (title, genre, best score, alias).
2. Displays the cyber loading screen with the QuickFun logo (`quickfun-logo-v3.png`) and progress bar.
3. Loads the JS file asynchronously via dynamic `import(game.path)`.
4. Executes `gameInstance.init(this.stageContainer, gameAPI)`.
5. On modal close, `closeStage()` calls `gameInstance.destroy()` to ensure clean memory teardown.

---

## 4. How to Add a New Game

1. **Create the game file**:
   Copy `games/template/index.js` to a new folder, e.g. `games/my-game/index.js`.
2. **Implement game logic**:
   Write your game loop inside `init(container, api)` and cleanup logic in `destroy()`.
3. **Register the game**:
   Add an entry with its metadata and path to the `gamesConfig` array in `scripts/games.config.js`.

The game immediately appears in the catalog, filters by category, and runs in the stage viewport.
