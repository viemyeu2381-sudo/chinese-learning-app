/** SM-2 rút gọn cho thẻ từ vựng */

export interface SrsState {
  easeFactor: number;
  intervalDays: number;
  repetitions: number;
  /** Unix ms */
  nextReview: number;
}

const MIN_EF = 1.3;
const DEFAULT_EF = 2.5;

export function initialSrs(): SrsState {
  return {
    easeFactor: DEFAULT_EF,
    intervalDays: 0,
    repetitions: 0,
    nextReview: 0,
  };
}

/** remembered: đã nhớ → quality cao; forgot: lặp lại sớm */
export function scheduleReview(prev: SrsState | undefined, remembered: boolean): SrsState {
  const now = Date.now();
  const base = prev ?? initialSrs();

  if (!remembered) {
    return {
      easeFactor: Math.max(MIN_EF, base.easeFactor - 0.2),
      intervalDays: 0,
      repetitions: 0,
      nextReview: now + 10 * 60 * 1000,
    };
  }

  let repetitions = base.repetitions + 1;
  let intervalDays: number;
  if (repetitions === 1) intervalDays = 1;
  else if (repetitions === 2) intervalDays = 3;
  else intervalDays = Math.round(base.intervalDays * base.easeFactor);

  intervalDays = Math.min(Math.max(intervalDays, 1), 365);
  const ef = base.easeFactor + 0.1;

  return {
    easeFactor: Math.min(ef, 2.8),
    intervalDays,
    repetitions,
    nextReview: now + intervalDays * 24 * 60 * 60 * 1000,
  };
}

export function isDue(state: SrsState | undefined): boolean {
  if (!state) return true;
  return state.nextReview <= Date.now();
}
