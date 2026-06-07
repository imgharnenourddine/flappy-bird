import { useEffect } from "react";
import { useGameInteraction } from "./useGameInteraction";

/* ========================================
   useInputHandler Hook
   Binds keyboard input to the shared game action.
   ======================================== */

/**
 * Custom hook that maps keyboard events to the primary game action.
 * - Space / ArrowUp / Enter → flap (playing), start (idle), or restart (gameOver)
 *
 * Click and touch inputs are wired up separately in the GamePage,
 * but they all funnel through the same `useGameInteraction` callback.
 */
export const useInputHandler = (): void => {
  const handleAction = useGameInteraction();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["Space", "ArrowUp", "Enter"].includes(e.code)) {
        e.preventDefault();
        handleAction();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleAction]);
};
