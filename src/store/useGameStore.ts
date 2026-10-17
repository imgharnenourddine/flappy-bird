import { create } from "zustand";
import {
  BIRD,
  PIPE,
  GROUND,
  CANVAS_WIDTH,
  SCORE,
  TARGET_FRAME_MS,
} from "../constants/game";
import { birdHitsRect, pipeRects, birdVerticalBounds } from "../engine/geometry";
import type { GameState, GameActions, PipePair } from "../types/game";

/* ========================================
   Local Storage Helpers
   ======================================== */

const BEST_SCORE_KEY = "flappyBird_bestScore";

/** Load best score from localStorage */
const loadBestScore = (): number => {
  try {
    const stored = localStorage.getItem(BEST_SCORE_KEY);
    return stored ? parseInt(stored, 10) : 0;
  } catch {
    return 0;
  }
};

/** Save best score to localStorage */
const saveBestScore = (score: number): void => {
  try {
    localStorage.setItem(BEST_SCORE_KEY, String(score));
  } catch {
    /* silently fail if storage is unavailable */
  }
};

/* ========================================
   Initial State Factory
   ======================================== */

const createInitialState = (): GameState => ({
  viewportWidth: CANVAS_WIDTH,
  status: "idle",
  score: 0,
  bestScore: loadBestScore(),
  bird: {
    x: BIRD.x,
    y: BIRD.startY,
    width: BIRD.width,
    height: BIRD.height,
    velocity: 0,
    rotation: 0,
  },
  pipes: [],
  groundOffset: 0,
});

/* ========================================
   Pipe Generation
   ======================================== */

/** Generate a random pipe height within valid bounds */
const generatePipeHeight = (): number => {
  return Math.floor(
    Math.random() * (PIPE.maxHeight - PIPE.minHeight) + PIPE.minHeight
  );
};

/** Create a new pipe pair at the given X position */
const createPipePair = (x: number): PipePair => ({
  x,
  topHeight: generatePipeHeight(),
  passed: false,
});

/* ========================================
   Dynamic Speed Calculation
   ======================================== */

/**
 * Calculate current pipe speed based on score.
 * Every `PIPE.scoreInterval` points, speed increases by `PIPE.speedIncrement`.
 * The increase is subtle per tier but compounds over time.
 */
const getCurrentSpeed = (score: number): number => {
  const tiers = Math.floor(score / PIPE.scoreInterval);
  const dynamicSpeed = PIPE.speed + tiers * PIPE.speedIncrement;
  return Math.min(dynamicSpeed, PIPE.maxSpeed);
};

/* ========================================
   Collision Detection
   ======================================== */

/** Check if the bird collides with any pipe or boundary */
const checkCollision = (state: GameState): boolean => {
  const { bird, pipes } = state;

  const bounds = birdVerticalBounds(bird);
  if (bounds.top <= 0 || bounds.bottom >= GROUND.y) return true;
  for (const pipe of pipes) {
    if (pipeRects(pipe).some((rect) => birdHitsRect(bird, rect))) return true;
  }

  return false;
};

/* ========================================
   Zustand Store
   ======================================== */

export const useGameStore = create<GameState & GameActions>((set, get) => ({
  ...createInitialState(),

  setViewportWidth: (viewportWidth) => {
    if (!Number.isFinite(viewportWidth) || viewportWidth <= 0) return;
    set((state) => {
      const pipes = [...state.pipes];
      // Fill newly exposed space without moving existing obstacles or the bird.
      if (state.status === "playing" && pipes.length) {
        while (pipes[pipes.length - 1].x < viewportWidth + PIPE.spacing) {
          pipes.push(createPipePair(pipes[pipes.length - 1].x + PIPE.spacing));
        }
      }
      return { viewportWidth, pipes };
    });
  },

  /** Transition from idle to playing */
  startGame: () => {
    // Fixed approach time, independent of how far the viewport extends.
    const initialPipes = [createPipePair(BIRD.x + 620)];
    while (initialPipes[initialPipes.length - 1].x < get().viewportWidth + PIPE.spacing) {
      initialPipes.push(createPipePair(initialPipes[initialPipes.length - 1].x + PIPE.spacing));
    }

    set({
      status: "playing",
      score: 0,
      bird: {
        x: BIRD.x,
        y: BIRD.startY,
        width: BIRD.width,
        height: BIRD.height,
        velocity: BIRD.flapPower,
        rotation: BIRD.maxUpRotation,
      },
      pipes: initialPipes,
      groundOffset: 0,
    });
  },

  /** Apply upward velocity to the bird */
  flap: () => {
    const { status } = get();
    if (status !== "playing") return;

    set((state) => ({
      bird: {
        ...state.bird,
        velocity: BIRD.flapPower,
        rotation: BIRD.maxUpRotation,
      },
    }));
  },

  /** Advance game state by one frame, scaled by deltaTime */
  tick: (deltaTime: number) => {
    const state = get();
    if (state.status !== "playing") return;

    /* Delta factor normalizes speed regardless of frame rate.
       All physics constants are tuned for 60fps (~16.67ms).
       On a 144Hz monitor dt ≈ 6.94ms → factor ≈ 0.42,
       so everything moves at the same real-world speed. */
    const dt = Math.min(deltaTime, 33.33) / TARGET_FRAME_MS;

    /* Update bird physics */
    const newVelocity = Math.min(
      state.bird.velocity + BIRD.gravity * dt,
      BIRD.maxVelocity
    );
    const newY = state.bird.y + newVelocity * dt;

    /* Smoothly rotate bird based on velocity */
    const targetRotation =
      newVelocity > 0
        ? Math.min(BIRD.maxDownRotation, newVelocity * 7)
        : BIRD.maxUpRotation;
    const rotationLerp = 1 - Math.pow(0.15, dt);
    const newRotation =
      state.bird.rotation +
      (targetRotation - state.bird.rotation) * rotationLerp;

    const newBird = {
      ...state.bird,
      y: newY,
      velocity: newVelocity,
      rotation: newRotation,
    };

    /* Move pipes and check scoring — speed scales with score */
    let newScore = state.score;
    const currentSpeed = getCurrentSpeed(state.score);
    const pipeMove = currentSpeed * dt;
    let newPipes = state.pipes
      .map((pipe) => {
        const newX = pipe.x - pipeMove;

        /* Score when bird passes a pipe */
        if (!pipe.passed && newX + PIPE.width + PIPE.capOverhang + 1 < state.bird.x) {
          newScore += SCORE.pointsPerPipe;
          return { ...pipe, x: newX, passed: true };
        }

        return { ...pipe, x: newX };
      })
      /* Remove off-screen pipes */
      .filter((pipe) => pipe.x + PIPE.width + PIPE.capOverhang + 1 > 0);

    /* Add new pipes when needed */
    while (newPipes.length && newPipes[newPipes.length - 1].x < state.viewportWidth + PIPE.spacing) {
      newPipes.push(createPipePair(newPipes[newPipes.length - 1].x + PIPE.spacing));
    }

    /* Scroll ground — synced with dynamic pipe speed */
    const newGroundOffset =
      (state.groundOffset + currentSpeed * dt) % state.viewportWidth;

    const newState = {
      bird: newBird,
      pipes: newPipes,
      score: newScore,
      groundOffset: newGroundOffset,
    };

    /* Check collision after state update */
    const tempState = { ...state, ...newState };
    if (checkCollision(tempState)) {
      const bestScore = Math.max(newScore, state.bestScore);
      saveBestScore(bestScore);
      set({
        ...newState,
        status: "gameOver",
        bestScore,
      });
      return;
    }

    set(newState);
  },

  /** Reset to initial idle state */
  reset: () => {
    set({
      ...createInitialState(),
      viewportWidth: get().viewportWidth,
      bestScore: loadBestScore(),
    });
  },
}));
