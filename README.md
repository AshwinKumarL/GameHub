# QuickFun - Free Online Browser Games Arcade

A vibrant, Poki-style web gaming portal featuring modern purple crystal aesthetics, a dynamic Bento grid, and instant client-side game loading.

---

## 🌟 Features

- **Poki-Style Bento Grid**: High-impact, variably sized game cards with lively hover physics and zero placeholder slots.
- **Vibrant Purple Crystal Theme**: High-energy geometric faceted crystal background with glowing neon lavender and magenta accents.
- **Dynamic Database Registry**: Games added to `scripts/games.config.js` or via the in-app "➕ Add Game" tool appear immediately on the grid.
- **No Logins or Cloud Dependencies**: 100% browser-based with zero sign-ups; local high scores and player aliases are saved via `localStorage`.
- **Pre-installed Games**:
  - 🚀 **Space Blaster 2088**: Action shoot 'em up with lasers, starfields, and particle explosions.
  - ⚡ **Neon Dodge**: High-octane cyber reflex hazard dodger.
  - 🏎️ **Speed Drifter**: Highway traffic racing with nitro boosts.
  - 🏃 **Cyber Runner**: Endless rooftop runner with double jumps and sliding.
  - 🧱 **Brick Breaker Neon**: Breakout-style arcade with paddle bouncing.
  - 🐍 **Snake Strike**: Neon arcade serpent with speed boosts and energy fruit combos.
  - 🚀 **Gravity Jump**: Vertical bouncy trampoline jumper.
  - 🧩 **Block Match**: 2048-style strategic tile merge puzzle.

---

## 🚀 How to Add a Game to the Database

### Method A: Edit `scripts/games.config.js`
Simply add your game object to `gamesConfig`:

```javascript
{
  id: 'my-game',
  status: 'ready',
  title: 'My Custom Game',
  genre: 'Arcade',
  category: 'action', // 'action' | 'arcade' | 'racing' | 'puzzle'
  badge: 'NEW',
  size: 'large',      // 'large' | 'medium'
  icon: '🎯',
  bgGradient: 'linear-gradient(135deg, #2e0854 0%, #6b21a8 100%)',
  description: 'Description of my awesome game',
  path: '../games/my-game/index.js'
}
```
*It shows up immediately on the grid as soon as it is in the database!*

### Method B: In-App "➕ Add Game" Button
Click the **"➕ Add Game"** button on the top right of the QuickFun navigation bar, fill in the title, genre, and path, and click **"Add to Database Now"**.

---

## 🛠️ Running Locally

The local server is running at:
```bash
npx -y serve -l 3000
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.
