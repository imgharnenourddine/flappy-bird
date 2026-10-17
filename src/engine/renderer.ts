import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  PIPE,
  GROUND,
  COLORS,
  BIRD,
} from "../constants/game";
import type { Bird, PipePair } from "../types/game";

/* ========================================
   Canvas Renderer
   Handles all drawing operations for the game.
   ======================================== */

/* ========================================
   GDG Championship Background
   ======================================== */


/* ========================================
   GDG on Campus Background
   Fullscreen 16:9 pixel-art
   ======================================== */


const gdgBackground = new Image();
gdgBackground.src = "/images/gdg-background-16x9.png";

export const drawBackground = (
  ctx: CanvasRenderingContext2D
): void => {

  if (
    gdgBackground.complete &&
    gdgBackground.naturalWidth > 0
  ) {
    ctx.drawImage(
      gdgBackground,
      0,
      0,
      CANVAS_WIDTH,
      CANVAS_HEIGHT
    );
    return;
  }

  // Fallback while loading
  const gradient = ctx.createLinearGradient(
    0, 0, 0, CANVAS_HEIGHT
  );

  gradient.addColorStop(0, COLORS.skyTop);
  gradient.addColorStop(1, COLORS.skyBottom);

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
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
  /* Pipe body */
  const bodyGradient = ctx.createLinearGradient(x, 0, x + width, 0);
  bodyGradient.addColorStop(0, COLORS.pipeBorder);
  bodyGradient.addColorStop(0.2, COLORS.pipeHighlight);
  bodyGradient.addColorStop(0.4, COLORS.pipeBody);
  bodyGradient.addColorStop(1, COLORS.pipeBorder);
  ctx.fillStyle = bodyGradient;
  ctx.fillRect(x, y, width, height);

  /* Pipe border */
  ctx.strokeStyle = COLORS.pipeBorder;
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, width, height);

  /* Pipe cap */
  const capX = x - PIPE.capOverhang;
  const capWidth = width + PIPE.capOverhang * 2;
  const capY = isTop ? y + height - PIPE.capHeight : y;

  const capGradient = ctx.createLinearGradient(capX, 0, capX + capWidth, 0);
  capGradient.addColorStop(0, COLORS.pipeCapBorder);
  capGradient.addColorStop(0.15, COLORS.pipeHighlight);
  capGradient.addColorStop(0.4, COLORS.pipeCap);
  capGradient.addColorStop(1, COLORS.pipeCapBorder);

  ctx.fillStyle = capGradient;
  ctx.fillRect(capX, capY, capWidth, PIPE.capHeight);
  ctx.strokeStyle = COLORS.pipeCapBorder;
  ctx.lineWidth = 2;
  ctx.strokeRect(capX, capY, capWidth, PIPE.capHeight);
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
  ctx.save();

  /* Translate to bird center for rotation */
  const centerX = bird.x + bird.width / 2;
  const centerY = bird.y + bird.height / 2;
  ctx.translate(centerX, centerY);
  ctx.rotate((bird.rotation * Math.PI) / 180);

  const hw = bird.width / 2;
  const hh = bird.height / 2;

  /* Body (ellipse) */
  ctx.beginPath();
  ctx.ellipse(0, 0, hw, hh, 0, 0, Math.PI * 2);
  ctx.fillStyle = COLORS.birdBody;
  ctx.fill();
  ctx.strokeStyle = "#d4a017";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  /* Wing */
  const wingOffset = Math.sin(flapFrame * 0.5) * 4;
  ctx.beginPath();
  ctx.ellipse(-4, wingOffset, hw * 0.5, hh * 0.6, -0.3, 0, Math.PI * 2);
  ctx.fillStyle = COLORS.birdWing;
  ctx.fill();
  ctx.strokeStyle = "#c4960f";
  ctx.lineWidth = 1;
  ctx.stroke();

  /* Eye */
  ctx.beginPath();
  ctx.arc(hw * 0.45, -hh * 0.2, 5, 0, Math.PI * 2);
  ctx.fillStyle = COLORS.birdEye;
  ctx.fill();
  ctx.strokeStyle = "#333";
  ctx.lineWidth = 1;
  ctx.stroke();

  /* Pupil */
  ctx.beginPath();
  ctx.arc(hw * 0.55, -hh * 0.2, 2.5, 0, Math.PI * 2);
  ctx.fillStyle = COLORS.birdPupil;
  ctx.fill();

  /* Beak */
  ctx.beginPath();
  ctx.moveTo(hw * 0.7, hh * 0.1);
  ctx.lineTo(hw + 8, hh * 0.05);
  ctx.lineTo(hw * 0.7, hh * 0.4);
  ctx.closePath();
  ctx.fillStyle = COLORS.birdBeak;
  ctx.fill();
  ctx.strokeStyle = "#c0392b";
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.restore();
};

/** Draw the current score on screen (HUD) */
export const drawScore = (
  ctx: CanvasRenderingContext2D,
  score: number
): void => {
  const text = String(score);

  ctx.font = '36px "Press Start 2P", monospace';
  ctx.textAlign = "center";

  /* Shadow */
  ctx.fillStyle = COLORS.scoreShadow;
  ctx.fillText(text, CANVAS_WIDTH / 2 + 2, 62);

  /* Main text */
  ctx.fillStyle = COLORS.scoreText;
  ctx.fillText(text, CANVAS_WIDTH / 2, 60);
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
export const clearCanvas = (ctx: CanvasRenderingContext2D): void => {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
};
