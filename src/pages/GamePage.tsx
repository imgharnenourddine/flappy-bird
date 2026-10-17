import { useRef, useCallback } from "react";
import GameCanvas from "../components/GameCanvas";
import StartScreen from "../components/StartScreen";
import GameOverScreen from "../components/GameOverScreen";
import SoundToggle from "../components/SoundToggle";
import { useInputHandler } from "../hooks/useInputHandler";
import { useSoundEffects } from "../hooks/useSoundEffects";
import { useGameInteraction } from "../hooks/useGameInteraction";


/* ========================================
   GamePage
   Main game page that composes canvas and UI overlays.
   The container dynamically scales to fill the viewport
   while maintaining the native 2:3 aspect ratio.
   ======================================== */

const GamePage = () => {
  const containerRef = useRef<HTMLDivElement>(null);


  /**
   * Track whether the last interaction came from a touch event.
   * This prevents the subsequent synthetic click from firing a second action.
   */
  const isTouchRef = useRef(false);

  /* Bind keyboard/touch input handlers */
  useInputHandler();

  /* Reactive sound effects (score, hit, swoosh) */
  useSoundEffects();

  /* Shared action dispatcher used by both touch and click inputs */
  const handleInteraction = useGameInteraction();

  /** Handle touch: act immediately, flag to skip the subsequent click */
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      isTouchRef.current = true;
      handleInteraction();
    },
    [handleInteraction]
  );

  /** Handle click: skip if this click was synthesized from a touch */
  const handleClick = useCallback(() => {
    if (isTouchRef.current) {
      isTouchRef.current = false;
      return;
    }
    handleInteraction();
  }, [handleInteraction]);

  return (
    <div ref={containerRef} className="game-container bg-black">
      <div className="flex flex-col items-center">
        <div
          className="relative overflow-hidden rounded-lg shadow-2xl cursor-pointer"
          style={{ width: "100%", height: "100%", touchAction: "none" }}
          onClick={handleClick}
          onTouchStart={handleTouchStart}
          role="application"
          aria-label="Flappy Bird Game"
        >
          {/* Canvas game rendering */}
          <GameCanvas />

          {/* UI Overlays */}
          <StartScreen />
          <GameOverScreen />

          {/* Sound mute / unmute control */}
          <SoundToggle />
        </div>

        {/* Footer */}
        <footer className="sign mt-3 text-center text-[10px] text-gray-500 tracking-wider">
          Created by{" "}
          <a
            href="https://serkanbayraktar.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            Serkanby
          </a>{" "}
          |{" "}
          <a
            href="https://github.com/Serkanbyx"
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            Github
          </a>
        </footer>
      </div>
    </div>
  );
};

export default GamePage;
