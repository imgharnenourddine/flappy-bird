/* ========================================
   Game Constants
   Centralized configuration for the game engine.
   ======================================== */

/** Canvas dimensions */
export const CANVAS_HEIGHT = 600;
export const CANVAS_WIDTH = CANVAS_HEIGHT * 16 / 9;

/** Target frame time in ms (60fps baseline) */
export const TARGET_FRAME_MS = 1000 / 60;

/** Bird physics */
export const BIRD = {
  /** Starting X position */
  x: 80,
  /** Starting Y position (center of canvas) */
  startY: CANVAS_HEIGHT / 2 - 20,
  /** Bird width in pixels */
  width: 40,
  /** Bird height in pixels */
  height: 30,
  /** Gravity applied each frame */
  gravity: 0.45,
  /** Upward velocity on flap */
  flapPower: -7.5,
  /** Maximum falling speed */
  maxVelocity: 10,
  /** Rotation limits in degrees */
  maxUpRotation: -25,
  maxDownRotation: 70,
} as const;

/** Pipe configuration */
export const PIPE = {
  /** Pipe width in pixels */
  width: 60,
  /** Vertical gap between top and bottom pipes */
  gap: 150,
  /** Base horizontal speed (pixels per frame) */
  speed: 2.5,
  /** Speed increment applied every SCORE_INTERVAL points (subtle ramp-up) */
  speedIncrement: 0.12,
  /** Score interval at which speed increases */
  scoreInterval: 10,
  /** Maximum pipe speed cap to keep the game playable */
  maxSpeed: 5.5,
  /** Distance between consecutive pipe pairs */
  spacing: 220,
  /** Minimum top pipe height */
  minHeight: 60,
  /** Maximum top pipe height */
  maxHeight: CANVAS_HEIGHT - 150 - 100,
  /** Pipe cap height */
  capHeight: 20,
  /** Pipe cap overhang on each side */
  capOverhang: 4,
} as const;

/** Ground configuration */
export const GROUND = {
  /** Ground height in pixels */
  height: CANVAS_HEIGHT * (1 - 849 / 941),
  /** Ground scroll speed (matches pipe speed) */
  speed: PIPE.speed,
  /** Y position of ground top */
  y: CANVAS_HEIGHT * 849 / 941,
} as const;

/** Scoring */
export const SCORE = {
  /** Points per pipe passed */
  pointsPerPipe: 1,
} as const;

/** Colors used for canvas rendering */
export const COLORS = {
  /** Sky gradient */
  skyTop: "#4dc9f6",
  skyBottom: "#87ceeb",
  /** Ground */
  groundTop: "#ded895",
  groundBottom: "#c4b057",
  groundLine: "#5a8a2e",
  /** Pipe */
  pipeBody: "#73bf2e",
  pipeBorder: "#558b2f",
  pipeCap: "#73bf2e",
  pipeCapBorder: "#558b2f",
  pipeHighlight: "#8fd14f",
  /** Bird */
  birdBody: "#f7dc6f",
  birdWing: "#f0b429",
  birdEye: "#ffffff",
  birdPupil: "#000000",
  birdBeak: "#e74c3c",
  /** UI */
  scoreText: "#ffffff",
  scoreShadow: "#000000",
} as const;
