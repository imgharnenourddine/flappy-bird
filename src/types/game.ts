/* ========================================
   Game Type Definitions
   ======================================== */

/** Represents the bird entity */
export interface Bird {
  x: number;
  y: number;
  width: number;
  height: number;
  velocity: number;
  rotation: number;
}

/** Represents a single pipe pair (top + bottom) */
export interface PipePair {
  x: number;
  topHeight: number;
  passed: boolean;
}

/** Possible game states */
export type GameStatus = "idle" | "playing" | "gameOver";

/** Game store state shape */
export interface GameState {
  /** Current game status */
  status: GameStatus;
  /** Visible world width; height and physics units stay fixed. */
  viewportWidth: number;
  /** Current score */
  score: number;
  /** All-time best score (persisted in localStorage) */
  bestScore: number;
  /** Bird entity state */
  bird: Bird;
  /** Active pipe pairs */
  pipes: PipePair[];
  /** Ground scroll offset */
  groundOffset: number;
}

/** Game store actions */
export interface GameActions {
  /** Start a new game */
  startGame: () => void;
  setViewportWidth: (width: number) => void;
  /** Make the bird flap */
  flap: () => void;
  /** Update game state by one frame (deltaTime in ms) */
  tick: (deltaTime: number) => void;
  /** Reset to idle state */
  reset: () => void;
}
