export interface VocabularyItem {
  id: string;
  hanzi: string;
  pinyin: string;
  meaning: string;
  hsk: 1 | 2 | 3 | 4 | 5 | 6;
  lessonId?: string;
  example?: string;
  /** Bộ thủ (ví dụ: 氵) */
  radical?: string;
  radicalHint?: string;
}

export interface HSKLesson {
  id: string;
  title: string;
  description: string;
  wordIds: string[];
}

export type GameMode = 'quiz' | 'match' | 'pinyin' | 'speed';
