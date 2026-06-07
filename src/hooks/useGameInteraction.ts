import { useCallback } from "react";
import { useGameStore } from "../store/useGameStore";
import { soundEngine } from "../engine/sound";

/* ========================================
   useGameInteraction Hook
   Single source of truth for the primary
   game action, shared by every input source
   (keyboard, click, touch).
   ======================================== */

/**
 * Returns a stable callback that dispatches the correct game action
 * based on the current status:
 * - **idle**     → start the game
 * - **playing**  → flap (with a zero-latency "flap" sound)
 * - **gameOver** → reset to idle
 */
export const useGameInteraction = (): (() => void) => {
  const status = useGameStore((s) => s.status);
  const startGame = useGameStore((s) => s.startGame);
  const flap = useGameStore((s) => s.flap);
  const reset = useGameStore((s) => s.reset);

  return useCallback(() => {
    switch (status) {
      case "idle":
        startGame();
        break;
      case "playing":
        soundEngine.play("flap");
        flap();
        break;
      case "gameOver":
        reset();
        break;
    }
  }, [status, startGame, flap, reset]);
};
