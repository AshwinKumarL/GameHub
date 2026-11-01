/**
 * QuickFun - Main Game Hub Controller
 * Manages Poki-style Bento Grid, dynamic game registry, category filtering, search, and stage runtime.
 */

import { gamesConfig, categoriesConfig } from './games.config.js';
import { icons } from './icons.js';
import { gameAPI } from './game-api.js';

class QuickFunHub {
  constructor() {
    this.games = [...gamesConfig];
    this.categories = categoriesConfig;
    this.activeCategory = 'all';
    this.searchQuery = '';
    this.activeGameInstance = null;
    this.activeGameConfig = null;

    // Load any custom games previously added by the developer to local database
    this.loadCustomDatabaseGames();

    // DOM references
    this.bentoGrid = document.getElementById('games-bento-grid');
    this.topQuickRow = document.getElementById('top-quick-row');
    this.categoryPills = document.querySelectorAll('.cat-pill, .nav-item');
    this.categoryTitle = document.getElementById('active-category-title');
    this.gamesCountBadge = document.getElementById('games-count-badge');
    this.searchInput = document.getElementById('game-search-input');
    this.clearSearchBtn = document.getElementById('clear-search-btn');

    // Header Actions
    this.navPlayerAlias = document.getElementById('nav-player-alias');
    this.userProfileBtn = document.getElementById('user-profile-btn');
    this.devAddGameBtn = document.getElementById('dev-add-game-btn');
    this.logoHomeBtn = document.getElementById('logo-home-btn');

    // Stage Overlay
    this.stageOverlay = document.getElementById('game-stage-overlay');
    this.stageWindow = document.querySelector('.stage-window');
    this.stageContainer = document.getElementById('game-canvas-container');
    this.stageTitle = document.getElementById('stage-game-title');
    this.stageGenre = document.getElementById('stage-game-genre');
    this.stageBestScore = document.getElementById('stage-best-score');
    this.stagePlayerName = document.getElementById('stage-player-name');
    this.stagePlayerPill = document.getElementById('stage-player-pill');
    this.stageCloseBtn = document.getElementById('stage-close-btn');
    this.stageRestartBtn = document.getElementById('stage-restart-btn');
    this.stageFullscreenBtn = document.getElementById('stage-fullscreen-btn');

    // Add Game Modal
    this.addGameModal = document.getElementById('add-game-modal');
    this.closeAddModalBtn = document.getElementById('close-add-modal-btn');
    this.addGameForm = document.getElementById('add-game-form');

    // Desktop Application Collapsible Sidebar
    this.appSidebar = document.getElementById('app-sidebar');
    this.sidebarCollapseBtn = document.getElementById('sidebar-collapse-btn');
    this.mobileSidebarToggle = document.getElementById('mobile-sidebar-toggle');

    this.init();
  }

  init() {
    this.initSidebar();
    this.updateUserAliasDisplay();
    this.setupListeners();
    this.renderTopQuickRow();
    this.render();
  }

  initSidebar() {
    const isCollapsed = localStorage.getItem('quickfun_sidebar_collapsed') === 'true';
    if (isCollapsed) {
      this.setSidebarCollapsed(true, false);
    }
  }

  setSidebarCollapsed(collapsed, save = true) {
    if (this.appSidebar) {
      this.appSidebar.classList.toggle('collapsed', collapsed);
    }
    if (save) {
      localStorage.setItem('quickfun_sidebar_collapsed', collapsed ? 'true' : 'false');
    }
  }

  toggleSidebar() {
    if (!this.appSidebar) return;
    const isCollapsed = this.appSidebar.classList.contains('collapsed');
    this.setSidebarCollapsed(!isCollapsed, true);
  }

  toggleMobileSidebar() {
    if (this.appSidebar) {
      this.appSidebar.classList.toggle('mobile-open');
    }
  }

  loadCustomDatabaseGames() {
    try {
      const stored = localStorage.getItem('quickfun_custom_games');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          // Avoid duplicates
          parsed.forEach(customGame => {
            if (!this.games.some(g => g.id === customGame.id)) {
              this.games.push(customGame);
            }
          });
        }
      }
    } catch (e) {
      console.warn("Could not load custom games:", e);
    }
  }

  saveCustomGame(gameObj) {
    this.games.unshift(gameObj);
    try {
      const customOnly = this.games.filter(g => g.isCustom);
      localStorage.setItem('quickfun_custom_games', JSON.stringify(customOnly));
    } catch (e) {
      console.warn("Could not persist custom game:", e);
    }
    this.render();
    this.renderTopQuickRow();
  }

  updateUserAliasDisplay() {
    const name = gameAPI.getPlayerName();
    if (this.navPlayerAlias) this.navPlayerAlias.textContent = name;
    if (this.stagePlayerName) this.stagePlayerName.textContent = name;
  }

  setupListeners() {
    // Category pills
    this.categoryPills.forEach(pill => {
      pill.addEventListener('click', () => {
        this.categoryPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        this.activeCategory = pill.dataset.category;
        if (this.appSidebar) this.appSidebar.classList.remove('mobile-open');
        this.render();
      });
    });

    // Search input
    if (this.searchInput) {
      this.searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.trim().toLowerCase();
        if (this.clearSearchBtn) {
          this.clearSearchBtn.classList.toggle('hidden', !this.searchQuery);
        }
        this.render();
      });
    }

    if (this.clearSearchBtn) {
      this.clearSearchBtn.addEventListener('click', () => {
        this.searchInput.value = '';
        this.searchQuery = '';
        this.clearSearchBtn.classList.add('hidden');
        this.render();
      });
    }

    // Logo click resets filters
    if (this.logoHomeBtn) {
      this.logoHomeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.activeCategory = 'all';
        this.searchQuery = '';
        if (this.searchInput) this.searchInput.value = '';
        if (this.clearSearchBtn) this.clearSearchBtn.classList.add('hidden');
        this.categoryPills.forEach(p => p.classList.toggle('active', p.dataset.category === 'all'));
        this.render();
      });
    }

    // Desktop Application Sidebar Collapse Listener
    if (this.sidebarCollapseBtn) {
      this.sidebarCollapseBtn.addEventListener('click', () => this.toggleSidebar());
    }

    // Mobile / Tablet Menu Drawer Toggle
    if (this.mobileSidebarToggle) {
      this.mobileSidebarToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleMobileSidebar();
      });
    }

    // Close mobile drawer on outside click
    document.addEventListener('click', (e) => {
      if (this.appSidebar && this.appSidebar.classList.contains('mobile-open')) {
        if (!this.appSidebar.contains(e.target) && (!this.mobileSidebarToggle || !this.mobileSidebarToggle.contains(e.target))) {
          this.appSidebar.classList.remove('mobile-open');
        }
      }
    });

    // User profile nickname prompt
    if (this.userProfileBtn) {
      this.userProfileBtn.addEventListener('click', () => {
        gameAPI.promptPlayerName((saved) => {
          this.updateUserAliasDisplay();
          this.render();
        });
      });
    }

    // Stage player alias prompt
    if (this.stagePlayerPill) {
      this.stagePlayerPill.addEventListener('click', () => {
        gameAPI.promptPlayerName((saved) => {
          this.updateUserAliasDisplay();
          if (this.activeGameInstance && typeof this.activeGameInstance.draw === 'function') {
            this.activeGameInstance.draw();
          }
        });
      });
    }

    // Add game modal toggles
    if (this.devAddGameBtn) {
      this.devAddGameBtn.addEventListener('click', () => {
        this.addGameModal.classList.remove('hidden');
      });
    }

    if (this.closeAddModalBtn) {
      this.closeAddModalBtn.addEventListener('click', () => {
        this.addGameModal.classList.add('hidden');
      });
    }

    if (this.addGameModal) {
      this.addGameModal.addEventListener('click', (e) => {
        if (e.target === this.addGameModal) {
          this.addGameModal.classList.add('hidden');
        }
      });
    }

    // Add game form submission
    if (this.addGameForm) {
      this.addGameForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('new-game-title').value.trim();
        const genre = document.getElementById('new-game-genre').value.trim();
        const category = document.getElementById('new-game-category').value;
        const icon = document.getElementById('new-game-icon').value.trim() || '🎮';
        const badge = document.getElementById('new-game-badge').value.trim() || 'NEW';
        const path = document.getElementById('new-game-path').value.trim();
        const desc = document.getElementById('new-game-desc').value.trim();

        const id = 'custom-' + Date.now();
        const newGame = {
          id,
          status: 'ready',
          title,
          genre,
          category,
          badge,
          size: 'large',
          icon,
          accentColor: '#c084fc',
          bgGradient: 'linear-gradient(135deg, #2e0854 0%, #6b21a8 50%, #4c1d95 100%)',
          description: desc,
          path,
          isCustom: true
        };

        this.saveCustomGame(newGame);
        this.addGameModal.classList.add('hidden');
        this.addGameForm.reset();

        // Launch newly added game immediately!
        this.launchGame(newGame);
      });
    }

    // Stage controls
    if (this.stageCloseBtn) {
      this.stageCloseBtn.addEventListener('click', () => this.closeStage());
    }

    if (this.stageRestartBtn) {
      this.stageRestartBtn.addEventListener('click', () => {
        if (this.activeGameInstance && typeof this.activeGameInstance.restart === 'function') {
          this.activeGameInstance.restart();
        } else if (this.activeGameInstance && typeof this.activeGameInstance.init === 'function') {
          this.activeGameInstance.init(this.stageContainer, gameAPI);
        }
      });
    }

    if (this.stageFullscreenBtn) {
      this.stageFullscreenBtn.addEventListener('click', () => {
        this.stageWindow.classList.toggle('fullscreen');
      });
    }

    // ESC key closes modals or stage
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (!this.stageOverlay.classList.contains('hidden')) {
          this.closeStage();
        } else if (!this.addGameModal.classList.contains('hidden')) {
          this.addGameModal.classList.add('hidden');
        }
      }
    });

    // Score listener
    gameAPI.onScoreUpdate(({ gameId, newHighScore }) => {
      if (this.activeGameConfig && this.activeGameConfig.id === gameId) {
        this.stageBestScore.textContent = newHighScore;
      }
      this.render();
    });
  }

  renderTopQuickRow() {
    if (!this.topQuickRow) return;
    this.topQuickRow.innerHTML = '';

    // Take first 5 games for top mini icons
    const miniGames = this.games.slice(0, 5);
    miniGames.forEach(game => {
      const tile = document.createElement('div');
      tile.className = 'quick-icon-tile';
      tile.title = `Play ${game.title}`;
      const iconMarkup = icons[game.iconKey] || icons[game.id] || icons.controller;
      tile.innerHTML = iconMarkup;
      tile.addEventListener('click', () => this.launchGame(game));
      this.topQuickRow.appendChild(tile);
    });
  }

  render() {
    this.bentoGrid.innerHTML = '';

    // Filter by active category & search query
    let filtered = this.games.filter(game => {
      // Must be a ready game (NO empty slot placeholders!)
      if (game.status !== 'ready') return false;

      // Category match
      if (this.activeCategory !== 'all' && game.category !== this.activeCategory) {
        return false;
      }

      // Search query match
      if (this.searchQuery) {
        const q = this.searchQuery;
        const matchTitle = (game.title || '').toLowerCase().includes(q);
        const matchGenre = (game.genre || '').toLowerCase().includes(q);
        const matchDesc = (game.description || '').toLowerCase().includes(q);
        if (!matchTitle && !matchGenre && !matchDesc) return false;
      }

      return true;
    });

    // Update section title
    if (this.activeCategory === 'all') {
      this.categoryTitle.textContent = this.searchQuery ? `SEARCH: "${this.searchQuery}"` : 'FEATURED ARCADE';
    } else {
      const foundCat = this.categories.find(c => c.id === this.activeCategory);
      this.categoryTitle.textContent = foundCat ? foundCat.name.toUpperCase() : 'GAMES';
    }

    if (this.gamesCountBadge) {
      this.gamesCountBadge.textContent = `${filtered.length}`;
    }

    if (filtered.length === 0) {
      this.bentoGrid.appendChild(this.createEmptyState());
      return;
    }

    // Render catalog tiles (all exact same uniform size)
    filtered.forEach((game, index) => {
      this.bentoGrid.appendChild(this.createGameTile(game, index));
    });
  }

  createGameTile(game, index) {
    const tile = document.createElement('div');
    tile.className = 'game-tile'; // Uniform same size across all catalog cards

    const bestScore = gameAPI.getHighScore(game.id);
    const gradient = game.bgGradient || 'linear-gradient(135deg, #100524 0%, #2b0b4e 60%, #0c1933 100%)';
    const iconMarkup = icons[game.iconKey] || icons[game.id] || icons.controller;

    tile.innerHTML = `
      <div class="tile-artwork" style="background: ${gradient};">
        <span class="tile-top-badge" style="border-color: ${game.accentColor || '#00f0ff'}; color: ${game.accentColor || '#00f0ff'};">
          ${game.badge || 'READY'}
        </span>
        ${bestScore > 0 ? `<span class="tile-score-badge">${icons.trophy} ${bestScore}</span>` : ''}
        
        <div class="tile-icon-emblem">${iconMarkup}</div>

        <div class="tile-play-hover-btn">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="6 3 20 12 6 21 6 3"></polygon>
          </svg>
        </div>
      </div>

      <div class="tile-footer">
        <div>
          <div class="tile-title">${game.title}</div>
          <div class="tile-genre">${game.genre}</div>
        </div>
      </div>
    `;

    tile.addEventListener('click', () => {
      this.launchGame(game);
    });

    return tile;
  }

  createCategoryBannerTile(categoryId, title, desc) {
    const tile = document.createElement('div');
    tile.className = 'category-banner-tile size-medium';
    const bannerIcon = icons[categoryId] || icons.action;

    tile.innerHTML = `
      <div class="cat-banner-icon">${bannerIcon}</div>
      <div class="cat-banner-title">${title}</div>
      <div class="cat-banner-desc">${desc}</div>
    `;

    tile.addEventListener('click', () => {
      this.activeCategory = categoryId;
      this.categoryPills.forEach(p => p.classList.toggle('active', p.dataset.category === categoryId));
      this.render();
    });

    return tile;
  }

  createEmptyState() {
    const box = document.createElement('div');
    box.className = 'empty-results-box';
    box.innerHTML = `
      <div class="empty-icon">${icons.radar}</div>
      <h3>NO TITLES FOUND</h3>
      <p>Scan parameters yielded zero results. Adjust search query or browse another sector.</p>
    `;
    return box;
  }

  async launchGame(game) {
    try {
      this.activeGameConfig = game;
      this.stageTitle.textContent = game.title;
      this.stageGenre.textContent = game.genre;
      this.stageBestScore.textContent = gameAPI.getHighScore(game.id);
      this.stagePlayerName.textContent = gameAPI.getPlayerName();

      // Show high-tech loading splash screen featuring the clean QuickFun logo
      this.stageContainer.innerHTML = `
        <div class="game-loading-screen">
          <div class="loading-logo-wrap">
            <img src="assets/images/quickfun-logo-v3.png" alt="QuickFun" class="loading-logo-img">
          </div>
          <div class="loading-game-title">LAUNCHING <span class="loading-highlight">${game.title.toUpperCase()}</span></div>
          <div class="loading-bar-track">
            <div class="loading-bar-fill"></div>
          </div>
          <div class="loading-status-text">INITIALIZING QUANTUM ENGINES...</div>
        </div>
      `;
      this.stageOverlay.classList.remove('hidden');

      // Dynamically load modular game code & ensure smooth logo splash appearance
      const [module] = await Promise.all([
        import(game.path),
        new Promise(resolve => setTimeout(resolve, 600)) // smooth splash appearance
      ]);
      const gameInstance = module.default;

      if (!gameInstance || typeof gameInstance.init !== 'function') {
        throw new Error("Game module must export default { init(container, api), destroy() }");
      }

      // If user closed the stage during loading, don't mount
      if (this.stageOverlay.classList.contains('hidden') || this.activeGameConfig !== game) {
        return;
      }

      this.stageContainer.innerHTML = '';
      this.activeGameInstance = gameInstance;
      this.activeGameInstance.init(this.stageContainer, gameAPI);

    } catch (err) {
      console.error("Failed to launch game:", err);
      this.stageContainer.innerHTML = `
        <div style="text-align: center; padding: 24px;">
          <div style="font-size: 3rem; margin-bottom: 12px;">⚠️</div>
          <h3 style="color: #f43f5e; margin-bottom: 8px;">Error Launching Game</h3>
          <p style="color: #e9d5ff; font-size: 0.95rem; max-width: 500px; margin: 0 auto 18px;">
            ${err.message || 'Could not initialize game module.'}
          </p>
          <button id="error-stage-close-btn" class="primary-btn" style="max-width: 180px; margin: 0 auto;">Close Stage</button>
        </div>
      `;
      const btn = document.getElementById('error-stage-close-btn');
      if (btn) btn.addEventListener('click', () => this.closeStage());
    }
  }

  closeStage() {
    if (this.activeGameInstance && typeof this.activeGameInstance.destroy === 'function') {
      try {
        this.activeGameInstance.destroy();
      } catch (e) {
        console.error("Error during game destroy:", e);
      }
    }

    this.activeGameInstance = null;
    this.activeGameConfig = null;
    this.stageContainer.innerHTML = '';
    this.stageOverlay.classList.add('hidden');
    this.stageWindow.classList.remove('fullscreen');
  }
}

// Instantiate on load
window.addEventListener('DOMContentLoaded', () => {
  new QuickFunHub();
});
