# 🐤 Flappy Bird

A modern Flappy Bird clone built with React, TypeScript, and HTML5 Canvas. Navigate through pipes by tapping or pressing space, compete with yourself, and beat your best score!

[![Created by Serkanby](https://img.shields.io/badge/Created%20by-Serkanby-blue?style=flat-square)](https://serkanbayraktar.com/)
[![GitHub](https://img.shields.io/badge/GitHub-Serkanbyx-181717?style=flat-square&logo=github)](https://github.com/Serkanbyx)

## Features

- **Canvas-Based Rendering**: Smooth 60fps gameplay using HTML5 Canvas with custom-drawn bird, pipes, and environment
- **Frame-Rate Independent Physics**: Delta-time based game loop ensures consistent gameplay on 60Hz, 144Hz, or any refresh rate
- **Procedural Sound Effects**: Retro flap, score, hit, and swoosh sounds generated on the fly with the Web Audio API — no audio files needed, with a mute toggle
- **Dynamic Difficulty**: Pipe speed ramps up gradually as your score climbs, capped to keep things playable
- **Zustand State Management**: Lightweight and performant centralized game state with zero boilerplate
- **Score Persistence**: Best score automatically saved and loaded from localStorage
- **Retro Pixel Art Style**: Custom canvas-drawn bird with animated wing flaps, gradient pipes, and scrolling ground
- **Touch & Keyboard Support**: Play with Space, ArrowUp, Enter, click, or tap — works on desktop and mobile
- **Responsive Design**: Fullscreen centered layout that adapts to any screen size
- **Accessible UI**: ARIA labels, keyboard navigation, and semantic HTML for screen readers

## Live Demo

[🎮 View Live Demo](https://flappy-birddddd.netlify.app/)

## Technologies

- **React 19**: UI components, overlays, and game lifecycle management
- **TypeScript 5**: Full type safety across game state, physics, and rendering
- **Vite 6**: Lightning-fast dev server and optimized production builds
- **Zustand 5**: Minimal state management for game state (bird, pipes, score)
- **React Router 7**: Client-side routing with catch-all redirect
- **Tailwind CSS 3**: Utility-first styling for UI overlays and animations
- **HTML5 Canvas**: Core game rendering engine with gradient effects and sprite drawing

## Installation

### Local Development

1. Clone the repository:

```bash
git clone https://github.com/Serkanbyx/flappy-bird.git
cd flappy-bird
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Your browser opens automatically at `http://localhost:3000`

### Build for Production

```bash
npm run build
npm run preview
```

> Want the full construction story? See the step-by-step [Build Guide](docs/build-guide.md).

## Usage

1. Open the game in your browser
2. Press **Space**, **ArrowUp**, **Enter**, or **click/tap** anywhere to start the game
3. Press **Space**, **ArrowUp**, or **click/tap** to make the bird flap its wings
4. Navigate through the gaps between pipes without hitting them or the ground
5. Each pipe pair passed earns **1 point** — pipes speed up as your score grows
6. Toggle sound on/off anytime with the speaker button or the **M** key
7. When game is over, press **Space**, **Enter**, or **click/tap** to restart
8. Your best score is automatically saved and displayed on the start screen

## How It Works?

### Game Loop

The game uses `requestAnimationFrame` for a smooth game loop. A custom `useGameLoop` hook manages the animation cycle and provides delta-time values for frame-rate independent updates:

```typescript
const dt = Math.min(deltaTime, 33.33) / TARGET_FRAME_MS;
```

This normalization ensures all physics constants (tuned for 60fps) work consistently on any monitor — from 60Hz to 144Hz and beyond.

### Bird Physics

The bird is affected by gravity each frame. Flapping applies an upward velocity, and the bird rotates smoothly based on its current velocity:

```typescript
const BIRD = {
  gravity: 0.45,
  flapPower: -7.5,
  maxVelocity: 10,
  maxUpRotation: -25,
  maxDownRotation: 70,
};
```

Rotation uses linear interpolation (lerp) for smooth transitions between upward and downward angles.

### Collision Detection

AABB (Axis-Aligned Bounding Box) collision detection checks the bird against:

- **Top boundary** (ceiling)
- **Bottom boundary** (ground)
- **Pipe pairs** (both top and bottom segments)

### Canvas Rendering

All game visuals are drawn procedurally on an HTML5 Canvas (400×600px):

- **Sky**: Linear gradient from light blue to sky blue
- **Pipes**: Multi-stop gradients with cap overhangs and border strokes
- **Bird**: Ellipse body, animated wing, eye with pupil, and triangular beak
- **Ground**: Gradient fill with scrolling dash pattern
- **Score**: Retro pixel font with shadow effect

## Customization

### Change Bird Physics

Modify `src/constants/game.ts` to adjust the bird's behavior:

```typescript
export const BIRD = {
  gravity: 0.45,      // Increase for faster falling
  flapPower: -7.5,    // More negative = stronger flap
  maxVelocity: 10,    // Maximum falling speed
};
```

### Change Pipe Difficulty

Adjust pipe gap, speed, and spacing for different difficulty levels:

```typescript
export const PIPE = {
  gap: 150,           // Vertical gap between pipes (smaller = harder)
  speed: 2.5,         // Horizontal scroll speed (higher = harder)
  spacing: 220,       // Distance between pipe pairs
};
```

### Change Colors

All game colors are centralized in the `COLORS` constant:

```typescript
export const COLORS = {
  skyTop: "#4dc9f6",
  skyBottom: "#87ceeb",
  birdBody: "#f7dc6f",
  pipeBody: "#73bf2e",
  // ... more colors
};
```

## Features in Detail

### Completed Features

- ✅ Canvas-based 60fps game rendering
- ✅ Frame-rate independent physics (deltaTime)
- ✅ Gravity, flap mechanics, and smooth rotation
- ✅ Procedural pipe generation with random heights
- ✅ AABB collision detection (pipes, ground, ceiling)
- ✅ Score tracking with localStorage persistence
- ✅ Procedural sound effects (flap, score, hit, swoosh) via Web Audio API
- ✅ Mute toggle (button + "M" shortcut)
- ✅ Difficulty progression (pipe speed increases with score)
- ✅ Start screen with floating bird animation
- ✅ Game over screen with score panel and "NEW!" badge
- ✅ Keyboard support (Space, ArrowUp, Enter)
- ✅ Touch and click support for mobile
- ✅ Responsive fullscreen layout
- ✅ Accessible UI with ARIA labels
- ✅ Netlify deployment ready

### Future Features

- [ ] Multiple bird skins / themes
- [ ] Global leaderboard
- [ ] Night mode / day-night cycle

## Contributing

Contributions are welcome! Please read the [Contributing Guide](.github/CONTRIBUTING.md) and the [Code of Conduct](.github/CODE_OF_CONDUCT.md) before getting started. For security concerns, see the [Security Policy](.github/SECURITY.md).

1. Fork the repository
2. Create your feature branch (`git checkout -b feat/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feat/amazing-feature`)
5. Open a Pull Request

### Commit Message Format

- `feat:` — New feature
- `fix:` — Bug fix
- `refactor:` — Code refactoring
- `docs:` — Documentation changes
- `chore:` — Maintenance tasks

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Developer

**Serkan Bayraktar**

- Website: [serkanbayraktar.com](https://serkanbayraktar.com/)
- GitHub: [@Serkanbyx](https://github.com/Serkanbyx)
- Email: [serkanbyx1@gmail.com](mailto:serkanbyx1@gmail.com)

## Acknowledgments

- Inspired by the original **Flappy Bird** game by Dong Nguyen
- Built with [React](https://react.dev/), [Vite](https://vite.dev/), and [Zustand](https://zustand.docs.pmnd.rs/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Deployed on [Netlify](https://www.netlify.com/)

## Contact

- Open an [Issue](https://github.com/Serkanbyx/flappy-bird/issues) for bug reports or feature requests
- Email: [serkanbyx1@gmail.com](mailto:serkanbyx1@gmail.com)
- Website: [serkanbayraktar.com](https://serkanbayraktar.com/)

---

⭐ If you like this project, don't forget to give it a star!
