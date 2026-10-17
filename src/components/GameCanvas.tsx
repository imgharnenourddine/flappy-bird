import { useRef, useEffect, useCallback } from "react";
import { useGameStore } from "../store/useGameStore";
import { useGameLoop } from "../hooks/useGameLoop";
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  TARGET_FRAME_MS,
} from "../constants/game";
import {
  clearCanvas,
  drawBackground,
  drawPipes,
  drawGround,
  drawBird,
  drawScore,
  drawIdleBird,
} from "../engine/renderer";

/* ========================================
   GameCanvas Component
   Core canvas element that renders the game.
   Supports responsive sizing with DPR-aware rendering
   for crisp output on all screen densities.
   ======================================== */

const GameCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  /** Accumulated animation time in ms (frame-rate independent) */
  const animTimeRef = useRef(0);

  const status = useGameStore((s) => s.status);
  const bird = useGameStore((s) => s.bird);
  const pipes = useGameStore((s) => s.pipes);
  const groundOffset = useGameStore((s) => s.groundOffset);
  const score = useGameStore((s) => s.score);
  const tick = useGameStore((s) => s.tick);

  /**
   * Synchronize canvas pixel buffer with its CSS display size.
   * Multiplies by devicePixelRatio so rendering stays crisp
   * on high-DPI / Retina displays.
   */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const syncBufferSize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      const bufferWidth = Math.round(rect.width * dpr);
      const bufferHeight = Math.round(rect.height * dpr);

      /* Only update when dimensions actually change to avoid unnecessary context resets */
      if (canvas.width !== bufferWidth || canvas.height !== bufferHeight) {
        canvas.width = bufferWidth;
        canvas.height = bufferHeight;
      }
    };

    syncBufferSize();
    const observer = new ResizeObserver(syncBufferSize);
    observer.observe(canvas);

    return () => observer.disconnect();
  }, []);

  /** Main render function - draws everything to canvas */
  const render = useCallback(
    (deltaTime: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.imageSmoothingEnabled = false;

      /* Accumulate real elapsed time for animations */
      animTimeRef.current += deltaTime;

      /* Convert accumulated ms to a 60fps-equivalent frame count.
         This keeps wing flap speed consistent across all refresh rates. */
      const normalizedFrame = animTimeRef.current / TARGET_FRAME_MS;

      /* Scale rendering context from game coordinates (400×600)
         to the actual pixel buffer size. This single transform handles
         both responsive scaling and DPR correction seamlessly. */
      const scaleX = canvas.width / CANVAS_WIDTH;
      const scaleY = canvas.height / CANVAS_HEIGHT;
      ctx.setTransform(scaleX, 0, 0, scaleY, 0, 0);

      clearCanvas(ctx);
      drawBackground(ctx);
      drawPipes(ctx, pipes);
      drawGround(ctx, groundOffset);

      if (status === "idle") {
        drawIdleBird(ctx, normalizedFrame);
      } else {
        drawBird(ctx, bird, normalizedFrame);
      }

      if (status === "playing") {
        drawScore(ctx, score);
      }
    },
    [status, bird, pipes, groundOffset, score]
  );

  /** Game loop: tick physics with deltaTime then render */
  const gameStep = useCallback(
    (deltaTime: number) => {
      tick(deltaTime);
      render(deltaTime);
    },
    [tick, render]
  );

  /* Use game loop only when playing */
  useGameLoop(gameStep, status === "playing");

  /* Render idle & gameOver states without physics */
  useEffect(() => {
    if (status === "playing") return;

    let lastTime = 0;
    let rafId = 0;

    const idleLoop = (timestamp: number) => {
      if (lastTime === 0) lastTime = timestamp;
      const dt = Math.min(timestamp - lastTime, 33.33);
      lastTime = timestamp;

      render(dt);

      /* Idle keeps animating the floating bird; gameOver renders a single frame */
      if (status === "idle") {
        rafId = requestAnimationFrame(idleLoop);
      }
    };

    rafId = requestAnimationFrame(idleLoop);
    return () => cancelAnimationFrame(rafId);
  }, [status, render]);

  return (
    <canvas
      ref={canvasRef}
      className="block w-full h-full"
    />
  );
};

export default GameCanvas;
