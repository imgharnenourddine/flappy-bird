import { useState, useEffect, useCallback } from "react";
import { soundEngine } from "../engine/sound";

/* ========================================
   SoundToggle Component
   Floating button that mutes / unmutes the game.
   Also responds to the "M" keyboard shortcut.
   ======================================== */

const SoundToggle = () => {
  const [enabled, setEnabled] = useState<boolean>(soundEngine.isEnabled());

  /** Flip the engine state and mirror it locally */
  const toggle = useCallback(() => {
    setEnabled(soundEngine.toggle());
  }, []);

  /* "M" key shortcut — keeps the control accessible without the mouse */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "KeyM") {
        e.preventDefault();
        toggle();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggle]);

  /** Toggle on click without triggering the underlying game interaction */
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      toggle();
      /* Drop focus so a subsequent Space press controls the bird, not the button */
      e.currentTarget.blur();
    },
    [toggle]
  );

  return (
    <button
      type="button"
      onClick={handleClick}
      onTouchStart={(e) => e.stopPropagation()}
      className="absolute top-2 right-2 z-20 flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 bg-black/40 text-lg transition-colors hover:bg-black/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
      aria-label={enabled ? "Mute sound" : "Unmute sound"}
      aria-pressed={!enabled}
      title={enabled ? "Mute (M)" : "Unmute (M)"}
    >
      <span aria-hidden="true">{enabled ? "🔊" : "🔇"}</span>
    </button>
  );
};

export default SoundToggle;
