import { useMemo } from 'react';
import type { VocabularyItem } from '../types/vocabulary';
import { useAppStore } from '../store/useAppStore';

export function useWorkingSet(): VocabularyItem[] {
  const mergedVocabulary = useAppStore((s) => s.mergedVocabulary);
  const activeHskLevel = useAppStore((s) => s.activeHskLevel);
  const activeWordFilter = useAppStore((s) => s.activeWordFilter);

  return useMemo(() => {
    let list = mergedVocabulary.filter((w) => w.hsk === activeHskLevel);
    if (activeWordFilter?.length) {
      const set = new Set(activeWordFilter);
      list = list.filter((w) => set.has(w.id));
    }
    return list;
  }, [mergedVocabulary, activeHskLevel, activeWordFilter]);
}

export function useDueQueue(): VocabularyItem[] {
  const words = useWorkingSet();
  const srsById = useAppStore((s) => s.srsById);

  return useMemo(() => {
    const now = Date.now();
    const sorted = [...words].sort((a, b) => {
      const na = srsById[a.id]?.nextReview ?? 0;
      const nb = srsById[b.id]?.nextReview ?? 0;
      return na - nb;
    });
    const due = sorted.filter((w) => {
      const st = srsById[w.id];
      return !st || st.nextReview <= now;
    });
    return due.length > 0 ? due : sorted;
  }, [words, srsById]);
}
