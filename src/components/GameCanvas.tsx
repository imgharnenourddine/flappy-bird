import { useRef, useEffect, useCallback } from "react";
import { useGameStore } from "../store/useGameStore";
import { useResponsiveCanvas } from "../hooks/useResponsiveCanvas";
import { useGameLoop } from "../hooks/useGameLoop";
import {
  CANVAS_HEIGHT,
  TARGET_FRAME_MS,
} from "../constants/game";
import {
  clearCanvas,
  drawBackground,
  drawPipes,
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
  const tick = useGameStore((s) => s.tick);
  useResponsiveCanvas(canvasRef);

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

      // Read after tick, avoiding a stale React snapshot one frame behind physics.
      const { status, bird, pipes, score, viewportWidth } = useGameStore.getState();
      const scale = canvas.height / CANVAS_HEIGHT;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.setTransform(scale, 0, 0, scale, 0, 0);
      clearCanvas(ctx, viewportWidth);
      drawBackground(ctx, viewportWidth);
      drawPipes(ctx, pipes);
      if (status === "idle") drawIdleBird(ctx, normalizedFrame);
      else drawBird(ctx, bird, normalizedFrame);
      if (status === "playing") drawScore(ctx, score, viewportWidth);

    },
    []
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

      /* Repaint gameOver too: resizing resets the buffer, assets may finish loading. */
      rafId = requestAnimationFrame(idleLoop);
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
