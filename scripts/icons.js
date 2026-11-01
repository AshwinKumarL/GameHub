/**
 * QuickFun - Modern Cyber & Esports Vector Icons
 * Unique art style utilizing sleek geometric paths, purple & neon blue gradients, and zero emojis.
 */

export const icons = {
  // --- CATEGORY ICONS ---
  all: `
    <svg class="cyber-svg-icon" viewBox="0 0 24 24" width="22" height="22" fill="none">
      <defs>
        <linearGradient id="grad-all" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#00f0ff" />
          <stop offset="100%" stop-color="#b026ff" />
        </linearGradient>
      </defs>
      <path d="M12 2L4 7v10l8 5 8-5V7l-8-5z" stroke="url(#grad-all)" stroke-width="1.8" stroke-linejoin="round"/>
      <path d="M12 6L7 9.5v5l5 3 5-3v-5L12 6z" fill="url(#grad-all)" fill-opacity="0.25" stroke="url(#grad-all)" stroke-width="1.2"/>
      <circle cx="12" cy="12" r="2.2" fill="#00f0ff"/>
    </svg>
  `,

  action: `
    <svg class="cyber-svg-icon" viewBox="0 0 24 24" width="22" height="22" fill="none">
      <defs>
        <linearGradient id="grad-action" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#00f0ff" />
          <stop offset="100%" stop-color="#d946ef" />
        </linearGradient>
      </defs>
      <!-- Crosshair / Plasma Reticle -->
      <circle cx="12" cy="12" r="8" stroke="url(#grad-action)" stroke-width="1.8"/>
      <circle cx="12" cy="12" r="3" stroke="#00f0ff" stroke-width="1.5"/>
      <circle cx="12" cy="12" r="1.2" fill="#00f0ff"/>
      <path d="M12 2v4M12 18v4M2 12h4M18 12h4" stroke="url(#grad-action)" stroke-width="2" stroke-linecap="round"/>
      <path d="M6 6l2 2M16 16l2 2M18 6l-2 2M8 16l-2 2" stroke="#00f0ff" stroke-width="1.2" stroke-linecap="round"/>
    </svg>
  `,

  arcade: `
    <svg class="cyber-svg-icon" viewBox="0 0 24 24" width="22" height="22" fill="none">
      <defs>
        <linearGradient id="grad-arcade" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#b026ff" />
          <stop offset="100%" stop-color="#00f0ff" />
        </linearGradient>
      </defs>
      <!-- Futuristic Arcade Stick & Buttons -->
      <rect x="3" y="12" width="18" height="9" rx="3" stroke="url(#grad-arcade)" stroke-width="1.8" fill="url(#grad-arcade)" fill-opacity="0.15"/>
      <path d="M8 12V6" stroke="#00f0ff" stroke-width="2.2" stroke-linecap="round"/>
      <circle cx="8" cy="5" r="3" fill="#00f0ff" filter="drop-shadow(0 0 4px #00f0ff)"/>
      <circle cx="14" cy="16.5" r="1.5" fill="#d946ef"/>
      <circle cx="18" cy="15" r="1.5" fill="#00f0ff"/>
    </svg>
  `,

  racing: `
    <svg class="cyber-svg-icon" viewBox="0 0 24 24" width="22" height="22" fill="none">
      <defs>
        <linearGradient id="grad-racing" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#00f0ff" />
          <stop offset="100%" stop-color="#f59e0b" />
        </linearGradient>
      </defs>
      <!-- High Speed Gauge / Tachometer -->
      <path d="M4 17a9 9 0 1 1 16 0" stroke="url(#grad-racing)" stroke-width="2" stroke-linecap="round"/>
      <path d="M12 14l5-6" stroke="#00f0ff" stroke-width="2.2" stroke-linecap="round"/>
      <circle cx="12" cy="14" r="2" fill="#f59e0b"/>
      <path d="M6 13l2-1M9 7l1 2M15 7l-1 2M18 13l-2-1" stroke="#b026ff" stroke-width="1.5" stroke-linecap="round"/>
    </svg>
  `,

  puzzle: `
    <svg class="cyber-svg-icon" viewBox="0 0 24 24" width="22" height="22" fill="none">
      <defs>
        <linearGradient id="grad-puzzle" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#00f0ff" />
          <stop offset="100%" stop-color="#b026ff" />
        </linearGradient>
      </defs>
      <!-- Isometric Cyber Matrix / Quantum Cube -->
      <path d="M12 2l8 4.6v9.2L12 20.4l-8-4.6V6.6L12 2z" stroke="url(#grad-puzzle)" stroke-width="1.8" stroke-linejoin="round"/>
      <path d="M12 2v9.2M20 6.6L12 11.2 4 6.6M12 11.2v9.2" stroke="url(#grad-puzzle)" stroke-width="1.5"/>
      <circle cx="12" cy="11.2" r="2" fill="#00f0ff"/>
    </svg>
  `,

  // --- GAME SPECIFIC EMBLEMS ---
  'space-blaster': `
    <svg class="cyber-game-icon" viewBox="0 0 48 48" width="100%" height="100%" fill="none">
      <defs>
        <linearGradient id="blaster-glow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#00f0ff"/>
          <stop offset="100%" stop-color="#b026ff"/>
        </linearGradient>
      </defs>
      <!-- Sci-Fi Interceptor Starfighter -->
      <polygon points="24,6 36,36 24,30 12,36" fill="url(#blaster-glow)" fill-opacity="0.25" stroke="url(#blaster-glow)" stroke-width="2.5" stroke-linejoin="round"/>
      <polygon points="24,14 30,32 24,28 18,32" fill="#00f0ff" fill-opacity="0.8"/>
      <!-- Dual Plasma Wings -->
      <path d="M8 32l-4 6 10-2M40 32l4 6-10-2" stroke="#00f0ff" stroke-width="2" stroke-linecap="round"/>
      <!-- Plasma Lasers -->
      <line x1="16" y1="20" x2="16" y2="6" stroke="#00f0ff" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="32" y1="20" x2="32" y2="6" stroke="#00f0ff" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="24" y1="36" x2="24" y2="44" stroke="#ff2a85" stroke-width="3" stroke-linecap="round"/>
    </svg>
  `,

  'neon-dodge': `
    <svg class="cyber-game-icon" viewBox="0 0 48 48" width="100%" height="100%" fill="none">
      <defs>
        <linearGradient id="dodge-glow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#00f0ff"/>
          <stop offset="100%" stop-color="#a855f7"/>
        </linearGradient>
      </defs>
      <!-- Cyber Lightning Hazard Core -->
      <circle cx="24" cy="24" r="18" stroke="url(#dodge-glow)" stroke-width="2.5" stroke-dasharray="4 3"/>
      <circle cx="24" cy="24" r="9" fill="url(#dodge-glow)" fill-opacity="0.3" stroke="#00f0ff" stroke-width="2"/>
      <polygon points="26,10 17,25 24,25 22,38 31,23 24,23" fill="#00f0ff" filter="drop-shadow(0 0 6px #00f0ff)"/>
    </svg>
  `,

  'speed-drifter': `
    <svg class="cyber-game-icon" viewBox="0 0 48 48" width="100%" height="100%" fill="none">
      <defs>
        <linearGradient id="drifter-glow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#f59e0b"/>
          <stop offset="50%" stop-color="#ec4899"/>
          <stop offset="100%" stop-color="#00f0ff"/>
        </linearGradient>
      </defs>
      <!-- Cyber Supercar / Drift Chassis -->
      <path d="M8 30l6-16h20l6 16-6 4H14l-6-4z" fill="url(#drifter-glow)" fill-opacity="0.25" stroke="url(#drifter-glow)" stroke-width="2.5" stroke-linejoin="round"/>
      <path d="M16 18l3-6h10l3 6" stroke="#00f0ff" stroke-width="2"/>
      <!-- Headlights & Neon Drift Trails -->
      <circle cx="12" cy="30" r="3" fill="#00f0ff"/>
      <circle cx="36" cy="30" r="3" fill="#00f0ff"/>
      <path d="M4 38h40M8 42h32" stroke="#ec4899" stroke-width="2" stroke-linecap="round" stroke-dasharray="6 4"/>
    </svg>
  `,

  'cyber-runner': `
    <svg class="cyber-game-icon" viewBox="0 0 48 48" width="100%" height="100%" fill="none">
      <defs>
        <linearGradient id="runner-glow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#00f0ff"/>
          <stop offset="100%" stop-color="#d946ef"/>
        </linearGradient>
      </defs>
      <!-- Cyber Shinobi / Parkour Sprinter -->
      <circle cx="30" cy="11" r="5" stroke="url(#runner-glow)" stroke-width="2.5" fill="#00f0ff" fill-opacity="0.5"/>
      <path d="M14 26l8-6 6 5 8-4" stroke="url(#runner-glow)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M22 20v9l-7 11M22 29l7 7 9-3" stroke="#00f0ff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      <!-- Cyber Energy Blade trail -->
      <path d="M6 18l12 4" stroke="#d946ef" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `,

  'brick-breaker': `
    <svg class="cyber-game-icon" viewBox="0 0 48 48" width="100%" height="100%" fill="none">
      <defs>
        <linearGradient id="brick-glow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#a855f7"/>
          <stop offset="100%" stop-color="#00f0ff"/>
        </linearGradient>
      </defs>
      <!-- Neon Grid Bricks -->
      <rect x="8" y="10" width="9" height="5" rx="1.5" fill="#00f0ff" fill-opacity="0.7"/>
      <rect x="20" y="10" width="9" height="5" rx="1.5" fill="#b026ff" fill-opacity="0.8"/>
      <rect x="32" y="10" width="9" height="5" rx="1.5" fill="#00f0ff" fill-opacity="0.7"/>
      <rect x="14" y="18" width="9" height="5" rx="1.5" fill="#b026ff" fill-opacity="0.8"/>
      <rect x="26" y="18" width="9" height="5" rx="1.5" fill="#00f0ff" fill-opacity="0.7"/>
      <!-- Bouncing Plasma Orb -->
      <circle cx="24" cy="28" r="3.5" fill="#00f0ff" filter="drop-shadow(0 0 5px #00f0ff)"/>
      <line x1="20" y1="33" x2="24" y2="28" stroke="#00f0ff" stroke-width="1.5" stroke-dasharray="2 2"/>
      <!-- Cyber Deflector Paddle -->
      <rect x="12" y="37" width="24" height="5" rx="2.5" fill="url(#brick-glow)" stroke="#00f0ff" stroke-width="1.8"/>
    </svg>
  `,

  'snake-strike': `
    <svg class="cyber-game-icon" viewBox="0 0 48 48" width="100%" height="100%" fill="none">
      <defs>
        <linearGradient id="snake-glow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#00f0ff"/>
          <stop offset="100%" stop-color="#34d399"/>
        </linearGradient>
      </defs>
      <!-- Neon Cybernetic Serpent -->
      <path d="M10 36h14a6 6 0 0 0 6-6v-6a6 6 0 0 1 6-6h2" stroke="url(#snake-glow)" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="39" cy="18" r="4.5" fill="#00f0ff" stroke="#34d399" stroke-width="2"/>
      <circle cx="40" cy="17" r="1.2" fill="#0d041a"/>
      <!-- Energy Fruit Node -->
      <circle cx="16" cy="18" r="3.5" fill="#ec4899" filter="drop-shadow(0 0 6px #ec4899)"/>
    </svg>
  `,

  'gravity-jump': `
    <svg class="cyber-game-icon" viewBox="0 0 48 48" width="100%" height="100%" fill="none">
      <defs>
        <linearGradient id="jump-glow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#00f0ff"/>
          <stop offset="100%" stop-color="#facc15"/>
        </linearGradient>
      </defs>
      <!-- Anti-Grav Thruster Rocket -->
      <path d="M24 8c-6 5-8 14-8 18h16c0-4-2-13-8-18z" fill="url(#jump-glow)" fill-opacity="0.3" stroke="url(#jump-glow)" stroke-width="2.5"/>
      <circle cx="24" cy="18" r="2.5" fill="#00f0ff"/>
      <path d="M16 26l-6 4v3l6-2M32 26l6 4v3l-6-2" stroke="#00f0ff" stroke-width="2"/>
      <!-- Plasma Blast Trails -->
      <path d="M20 28l-2 8 6-3 6 3-2-8" fill="#facc15"/>
      <!-- Jump Platforms -->
      <line x1="10" y1="42" x2="38" y2="42" stroke="#b026ff" stroke-width="3" stroke-linecap="round"/>
    </svg>
  `,

  'block-match': `
    <svg class="cyber-game-icon" viewBox="0 0 48 48" width="100%" height="100%" fill="none">
      <defs>
        <linearGradient id="match-glow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#00f0ff"/>
          <stop offset="100%" stop-color="#818cf8"/>
        </linearGradient>
      </defs>
      <!-- Quantum 2048 Matrix -->
      <rect x="8" y="8" width="32" height="32" rx="6" stroke="url(#match-glow)" stroke-width="2.5" fill="url(#match-glow)" fill-opacity="0.15"/>
      <rect x="12" y="12" width="10" height="10" rx="3" fill="#00f0ff" fill-opacity="0.8"/>
      <rect x="26" y="12" width="10" height="10" rx="3" fill="#818cf8" fill-opacity="0.4"/>
      <rect x="12" y="26" width="10" height="10" rx="3" fill="#818cf8" fill-opacity="0.4"/>
      <rect x="26" y="26" width="10" height="10" rx="3" fill="#b026ff" fill-opacity="0.8"/>
    </svg>
  `,

  // --- UI ICONS ---
  player: `
    <svg class="cyber-svg-icon" viewBox="0 0 24 24" width="18" height="18" fill="none">
      <defs>
        <linearGradient id="grad-player" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#00f0ff"/>
          <stop offset="100%" stop-color="#b026ff"/>
        </linearGradient>
      </defs>
      <!-- Cyber Helmet / Visor HUD -->
      <path d="M12 2a8 8 0 0 0-8 8v5a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4v-5a8 8 0 0 0-8-8z" stroke="url(#grad-player)" stroke-width="1.8" stroke-linejoin="round"/>
      <rect x="7" y="9" width="10" height="4" rx="2" fill="#00f0ff" filter="drop-shadow(0 0 4px #00f0ff)"/>
      <line x1="12" y1="19" x2="12" y2="22" stroke="url(#grad-player)" stroke-width="2"/>
    </svg>
  `,

  add: `
    <svg class="cyber-svg-icon" viewBox="0 0 24 24" width="18" height="18" fill="none">
      <circle cx="12" cy="12" r="9" stroke="#00f0ff" stroke-width="1.8"/>
      <path d="M12 7v10M7 12h10" stroke="#00f0ff" stroke-width="2.2" stroke-linecap="round"/>
    </svg>
  `,

  trophy: `
    <svg class="cyber-svg-icon" viewBox="0 0 24 24" width="16" height="16" fill="none">
      <path d="M6 3h12v5a6 6 0 0 1-12 0V3z" stroke="#00f0ff" stroke-width="1.8" fill="#00f0ff" fill-opacity="0.2"/>
      <path d="M6 5H3a2 2 0 0 0-2 2v1a4 4 0 0 0 4 4h1M18 5h3a2 2 0 0 1 2 2v1a4 4 0 0 1-4 4h-1" stroke="#00f0ff" stroke-width="1.5"/>
      <path d="M12 14v4M8 21h8" stroke="#b026ff" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `,

  controller: `
    <svg class="cyber-svg-icon" viewBox="0 0 24 24" width="18" height="18" fill="none">
      <rect x="2" y="6" width="20" height="13" rx="5" stroke="#00f0ff" stroke-width="1.8" fill="#b026ff" fill-opacity="0.15"/>
      <path d="M6 12.5h4M8 10.5v4" stroke="#00f0ff" stroke-width="2" stroke-linecap="round"/>
      <circle cx="15.5" cy="11.5" r="1.2" fill="#d946ef"/>
      <circle cx="18" cy="13.5" r="1.2" fill="#00f0ff"/>
    </svg>
  `,

  search: `
    <svg class="cyber-svg-icon" viewBox="0 0 24 24" width="18" height="18" fill="none">
      <circle cx="11" cy="11" r="7" stroke="#00f0ff" stroke-width="2"/>
      <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="#b026ff" stroke-width="2.5" stroke-linecap="round"/>
    </svg>
  `,

  radar: `
    <svg class="cyber-svg-icon" viewBox="0 0 24 24" width="48" height="48" fill="none">
      <circle cx="12" cy="12" r="10" stroke="#00f0ff" stroke-width="1.5" stroke-dasharray="4 2"/>
      <circle cx="12" cy="12" r="6" stroke="#b026ff" stroke-width="1.5"/>
      <circle cx="12" cy="12" r="2" fill="#00f0ff"/>
      <line x1="12" y1="12" x2="19" y2="6" stroke="#00f0ff" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `
};

export function getIcon(id) {
  return icons[id] || icons.controller;
}
