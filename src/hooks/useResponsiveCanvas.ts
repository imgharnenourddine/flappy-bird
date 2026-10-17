import { useLayoutEffect, type RefObject } from "react";
import { CANVAS_HEIGHT } from "../constants/game";
import { useGameStore } from "../store/useGameStore";

/** Fill the canvas without stretching world coordinates. DPR is buffer-only. */
export const useResponsiveCanvas = (
  canvasRef: RefObject<HTMLCanvasElement | null>
): void => {
  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let resolution: MediaQueryList;
    const sync = () => {
      const { width, height } = canvas.getBoundingClientRect();
      if (!width || !height) return;
      const dpr = window.devicePixelRatio || 1;
      const bufferWidth = Math.round(width * dpr);
      const bufferHeight = Math.round(height * dpr);
      if (canvas.width !== bufferWidth) canvas.width = bufferWidth;
      if (canvas.height !== bufferHeight) canvas.height = bufferHeight;
      useGameStore.getState().setViewportWidth(CANVAS_HEIGHT * width / height);
      resolution?.removeEventListener("change", sync);
      resolution = window.matchMedia(`(resolution: ${dpr}dppx)`);
      resolution.addEventListener("change", sync);
    };
    sync();
    const observer = new ResizeObserver(sync);
    observer.observe(canvas);
    window.addEventListener("resize", sync);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", sync);
      resolution?.removeEventListener("change", sync);
    };
  }, [canvasRef]);
};
