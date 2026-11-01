/**
 * QuickFun - Games Database & Registry
 * 
 * Every game listed here is automatically rendered to the QuickFun Bento grid.
 * To add a new game:
 * Simply add a new game object with its module path in this list!
 */

export const gamesConfig = [
  {
    id: 'space-blaster',
    status: 'ready',
    title: 'Space Blaster 2088',
    genre: 'Shoot \'em up',
    category: 'action',
    badge: 'HOT',
    size: 'large',
    iconKey: 'space-blaster',
    accentColor: '#00f0ff',
    bgGradient: 'linear-gradient(135deg, #0a061e 0%, #170d38 50%, #0d1e3d 100%)',
    description: 'Retro arcade galaxy combat! Shoot alien fleets, dodge incoming plasma, and rack up combos.',
    path: '../games/space-blaster/index.js'
  },
  {
    id: 'neon-dodge',
    status: 'ready',
    title: 'Neon Dodge',
    genre: 'Arcade Reflex',
    category: 'arcade',
    badge: 'POPULAR',
    size: 'large',
    iconKey: 'neon-dodge',
    accentColor: '#00f0ff',
    bgGradient: 'linear-gradient(135deg, #051428 0%, #150936 60%, #032738 100%)',
    description: 'Dodge supersonic hazard orbs in a high-octane cyber ring with dynamic pilot alias.',
    path: '../games/neon-dodge/index.js'
  },
  {
    id: 'speed-drifter',
    status: 'ready',
    title: 'Speed Drifter',
    genre: 'Highway Racing',
    category: 'racing',
    badge: 'NITRO',
    size: 'large',
    iconKey: 'speed-drifter',
    accentColor: '#00f0ff',
    bgGradient: 'linear-gradient(135deg, #220835 0%, #4c1175 50%, #0b3452 100%)',
    description: 'High-speed highway traffic weaver! Hit nitro bursts, draft behind speedsters, and set records.',
    path: '../games/speed-drifter/index.js'
  },
  {
    id: 'cyber-runner',
    status: 'ready',
    title: 'Cyber Runner',
    genre: 'Action Jumper',
    category: 'action',
    badge: 'TOP RATED',
    size: 'large',
    iconKey: 'cyber-runner',
    accentColor: '#d946ef',
    bgGradient: 'linear-gradient(135deg, #1b072e 0%, #5b1065 50%, #101c4a 100%)',
    description: 'Endless rooftop runner! Double jump over laser spikes and slide beneath security drones.',
    path: '../games/cyber-runner/index.js'
  },
  {
    id: 'brick-breaker',
    status: 'ready',
    title: 'Brick Breaker Neon',
    genre: 'Classic Breakout',
    category: 'arcade',
    badge: 'CLASSIC',
    size: 'medium',
    iconKey: 'brick-breaker',
    accentColor: '#b026ff',
    bgGradient: 'linear-gradient(135deg, #140626 0%, #35085e 50%, #0a223a 100%)',
    description: 'Shatter vibrant neon brick formations with precision paddle rebounds and power combos.',
    path: '../games/brick-breaker/index.js'
  },
  {
    id: 'snake-strike',
    status: 'ready',
    title: 'Snake Strike',
    genre: 'Retro Arcade',
    category: 'arcade',
    badge: 'TRENDING',
    size: 'medium',
    iconKey: 'snake-strike',
    accentColor: '#00f0ff',
    bgGradient: 'linear-gradient(135deg, #071922 0%, #170d38 60%, #04383c 100%)',
    description: 'Hyper-responsive neon serpent action. Eat energy fruits and accelerate through the grid.',
    path: '../games/snake-strike/index.js'
  },
  {
    id: 'gravity-jump',
    status: 'ready',
    title: 'Gravity Jump',
    genre: 'Bouncy Platformer',
    category: 'action',
    badge: 'BOOST',
    size: 'medium',
    iconKey: 'gravity-jump',
    accentColor: '#00f0ff',
    bgGradient: 'linear-gradient(135deg, #1c0630 0%, #3e0648 50%, #0d284e 100%)',
    description: 'Bounce to astronomical heights across floating trampolines and spring-loaded platforms.',
    path: '../games/gravity-jump/index.js'
  },
  {
    id: 'block-match',
    status: 'ready',
    title: 'Block Match',
    genre: 'Puzzle & Logic',
    category: 'puzzle',
    badge: 'BRAIN',
    size: 'medium',
    iconKey: 'block-match',
    accentColor: '#00f0ff',
    bgGradient: 'linear-gradient(135deg, #0b1126 0%, #290c3d 50%, #121f52 100%)',
    description: 'Strategic tile merger! Slide, fuse numbers together, and reach the legendary 2048 crown.',
    path: '../games/block-match/index.js'
  }
];

/**
 * Category Definitions for Category Tiles & Filters
 */
export const categoriesConfig = [
  { id: 'all', name: 'All Games', iconKey: 'all', count: 8 },
  { id: 'action', name: 'Action Games', iconKey: 'action', count: 3, bannerColor: '#00f0ff' },
  { id: 'arcade', name: 'Arcade Classics', iconKey: 'arcade', count: 3, bannerColor: '#b026ff' },
  { id: 'racing', name: 'Racing Games', iconKey: 'racing', count: 1, bannerColor: '#00f0ff' },
  { id: 'puzzle', name: 'Puzzle Games', iconKey: 'puzzle', count: 1, bannerColor: '#d946ef' }
];

