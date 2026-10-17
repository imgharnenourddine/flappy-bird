import {
  CANVAS_HEIGHT,
  PIPE,
  GROUND,
  COLORS,
  BIRD,
} from "../constants/game";
import { drawChampionshipPipe, drawPixelBird } from "./entityArt";
import type { Bird, PipePair } from "../types/game";

/* ========================================
   Canvas Renderer
   Handles all drawing operations for the game.
   ======================================== */

// Original asset stays untouched. Grass begins at source row 849 of 941.
const gdgBackground = new Image();
gdgBackground.src = "/images/gdg-background-16x9.png";

export const drawBackground = (ctx: CanvasRenderingContext2D, width: number): void => {
  const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
  gradient.addColorStop(0, COLORS.skyTop);
  gradient.addColorStop(1, COLORS.skyBottom);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, CANVAS_HEIGHT);
  if (!gdgBackground.complete || !gdgBackground.naturalWidth) return;
  const scale = Math.max(width / gdgBackground.naturalWidth,
    CANVAS_HEIGHT / gdgBackground.naturalHeight);
  const w = gdgBackground.naturalWidth * scale;
  const h = gdgBackground.naturalHeight * scale;
  // Right focal point retains branding; align the grass with physics even on ultrawide.
  ctx.drawImage(gdgBackground, width - w, GROUND.y - h * 849 / 941, w, h);
};

/** Draw a single pipe (top or bottom) */
const drawPipeSegment = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  isTop: boolean
): void => {
  drawChampionshipPipe(ctx, x, y, width, height, PIPE.capHeight, PIPE.capOverhang, isTop);
};

/** Draw all pipe pairs */
export const drawPipes = (
  ctx: CanvasRenderingContext2D,
  pipes: PipePair[]
): void => {
  for (const pipe of pipes) {
    /* Top pipe - grows downward from 0 */
    drawPipeSegment(ctx, pipe.x, 0, PIPE.width, pipe.topHeight, true);

    /* Bottom pipe - grows upward from gap bottom */
    const bottomY = pipe.topHeight + PIPE.gap;
    const bottomHeight = GROUND.y - bottomY;
    drawPipeSegment(ctx, pipe.x, bottomY, PIPE.width, bottomHeight, false);
  }
};

/** Draw the ground with scrolling texture */
/**
 * Custom GDG background already contains grass and soil.
 * Ground collision remains active in the game store.
 */
export const drawGround = (
  _ctx: CanvasRenderingContext2D,
  _offset: number
): void => {
  // Intentionally empty
};

/** Draw the bird with rotation */
export const drawBird = (
  ctx: CanvasRenderingContext2D,
  bird: Bird,
  flapFrame: number
): void => {
  drawPixelBird(ctx, bird, flapFrame);
};

/** Draw the current score on screen (HUD) */
export const drawScore = (
  ctx: CanvasRenderingContext2D,
  score: number,
  width: number
): void => {
  ctx.save();
  const text = String(score);
  // A local bold numeric font stays legible even before the web font loads.
  ctx.font = "bold 36px monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.lineJoin = "round";
  ctx.lineWidth = 5;
  ctx.strokeStyle = COLORS.scoreShadow;
  ctx.fillStyle = COLORS.scoreText;
  // Below the background logo band, centered in the actual visible world.
  ctx.strokeText(text, width / 2, 100);
  ctx.fillText(text, width / 2, 100);
  ctx.restore();
};

/** Draw idle state bird floating animation */
export const drawIdleBird = (
  ctx: CanvasRenderingContext2D,
  frame: number
): void => {
  const idleBird: Bird = {
    x: BIRD.x,
    y: BIRD.startY + Math.sin(frame * 0.05) * 8,
    width: BIRD.width,
    height: BIRD.height,
    velocity: 0,
    rotation: 0,
  };
  drawBird(ctx, idleBird, frame);
};

/** Clear the entire canvas */
export const clearCanvas = (ctx: CanvasRenderingContext2D, width: number): void => {
  ctx.clearRect(0, 0, width, CANVAS_HEIGHT);
};
