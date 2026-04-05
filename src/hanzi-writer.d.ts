declare module 'hanzi-writer' {
  interface QuizOptions {
    onComplete?: (summary: { character: string; totalMistakes: number }) => void;
    showHintAfterMisses?: number;
    highlightOnComplete?: boolean;
  }

  interface WriterOptions {
    width?: number;
    height?: number;
    padding?: number;
    showOutline?: boolean;
    strokeAnimationSpeed?: number;
    delayBetweenStrokes?: number;
    strokeColor?: string;
    outlineColor?: string;
    drawingColor?: string;
    radicalColor?: string;
  }

  export interface HanziWriterInstance {
    quiz: (options?: QuizOptions) => void;
    cancelQuiz: () => void;
    hideCharacter: () => void;
    showCharacter: () => void;
    animateCharacter: () => void;
    loopCharacterAnimation?: () => void;
  }

  interface HanziWriterStatic {
    create: (
      element: HTMLElement | string,
      character: string,
      options?: WriterOptions
    ) => HanziWriterInstance;
  }

  const HanziWriter: HanziWriterStatic;
  export default HanziWriter;
}
