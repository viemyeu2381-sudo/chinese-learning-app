export function recordStudyGames(
  recordStudy: (minutes: number, cards?: number) => void,
  correctCount: number
) {
  recordStudy(0.08 * correctCount, correctCount);
}
