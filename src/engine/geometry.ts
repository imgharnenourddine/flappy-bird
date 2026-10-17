import { GROUND, PIPE } from "../constants/game";
import type { Bird, PipePair } from "../types/game";

export interface Rect { x: number; y: number; width: number; height: number }

/** Include the actual body/cap strokes in collision geometry. */
export const pipeRects = (pipe: PipePair): Rect[] => {
  const bottom = pipe.topHeight + PIPE.gap;
  return [
    { x: pipe.x - 1, y: 0, width: PIPE.width + 2, height: pipe.topHeight + 1 },
    { x: pipe.x - PIPE.capOverhang - 1, y: pipe.topHeight - PIPE.capHeight - 1,
      width: PIPE.width + 2 * PIPE.capOverhang + 2, height: PIPE.capHeight + 2 },
    { x: pipe.x - 1, y: bottom - 1, width: PIPE.width + 2, height: GROUND.y - bottom + 1 },
    { x: pipe.x - PIPE.capOverhang - 1, y: bottom - 1,
      width: PIPE.width + 2 * PIPE.capOverhang + 2, height: PIPE.capHeight + 2 },
  ];
};

export const birdVerticalBounds = (bird: Bird) => {
  const angle = bird.rotation * Math.PI / 180;
  const radius = Math.hypot((bird.width / 2 + 0.75) * Math.sin(angle),
    (bird.height / 2 + 0.75) * Math.cos(angle));
  const center = bird.y + bird.height / 2;
  return { top: center - radius, bottom: center + radius };
};

/** Rotate/normalize a rectangle into the bird body's unit-circle space.
 * Wings, eye and beak remain decorative, as in the original body hitbox. */
export const birdHitsRect = (bird: Bird, rect: Rect): boolean => {
  const cx = bird.x + bird.width / 2, cy = bird.y + bird.height / 2;
  if (cx >= rect.x && cx <= rect.x + rect.width && cy >= rect.y && cy <= rect.y + rect.height) return true;
  const angle = bird.rotation * Math.PI / 180;
  const c = Math.cos(angle), s = Math.sin(angle);
  const points = [[rect.x, rect.y], [rect.x + rect.width, rect.y],
    [rect.x + rect.width, rect.y + rect.height], [rect.x, rect.y + rect.height]]
    .map(([x, y]) => ({ x: ((x - cx) * c + (y - cy) * s) / (bird.width / 2 + 0.75),
      y: (-(x - cx) * s + (y - cy) * c) / (bird.height / 2 + 0.75) }));
  return points.some((a, i) => {
    const b = points[(i + 1) % points.length];
    const dx = b.x - a.x, dy = b.y - a.y;
    const length = dx * dx + dy * dy;
    const t = length ? Math.max(0, Math.min(1, -(a.x * dx + a.y * dy) / length)) : 0;
    return Math.hypot(a.x + t * dx, a.y + t * dy) <= 1;
  });
};
