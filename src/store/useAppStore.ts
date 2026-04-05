import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { differenceInCalendarDays, format } from 'date-fns';
import type { VocabularyItem } from '../types/vocabulary';
import { vocabulary as defaultVocabulary } from '../data/vocabulary';
import { scheduleReview, type SrsState } from '../lib/srs';

interface DailyStat {
  minutes: number;
  cards: number;
}

interface AppState {
  theme: 'light' | 'dark';
  setTheme: (t: 'light' | 'dark') => void;
  toggleTheme: () => void;

  /** Từ đã học (ít nhất 1 lần “đã nhớ”) */
  learnedWordIds: string[];
  bookmarks: string[];
  srsById: Record<string, SrsState>;

  stats: {
    studyMinutes: number;
    lastStudyDate: string | null;
    streak: number;
    daily: Record<string, DailyStat>;
  };

  /** Lọc bài học: null = toàn bộ HSK đang chọn */
  activeWordFilter: string[] | null;
  activeHskLevel: number;
  setActiveHskLevel: (n: number) => void;
  setActiveWordFilter: (ids: string[] | null) => void;

  mergedVocabulary: VocabularyItem[];
  setMergedVocabulary: (v: VocabularyItem[]) => void;

  toggleBookmark: (id: string) => void;
  gradeCard: (id: string, remembered: boolean) => void;
  recordStudy: (minutes: number, cards?: number) => void;
}

function todayStr() {
  return format(new Date(), 'yyyy-MM-dd');
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      theme: 'light',
      setTheme: (t) => {
        document.documentElement.classList.toggle('dark', t === 'dark');
        set({ theme: t });
      },
      toggleTheme: () => {
        const next = get().theme === 'dark' ? 'light' : 'dark';
        document.documentElement.classList.toggle('dark', next === 'dark');
        set({ theme: next });
      },

      learnedWordIds: [],
      bookmarks: [],
      srsById: {},

      stats: {
        studyMinutes: 0,
        lastStudyDate: null,
        streak: 0,
        daily: {},
      },

      activeWordFilter: null,
      activeHskLevel: 1,
      setActiveHskLevel: (n) => set({ activeHskLevel: n }),
      setActiveWordFilter: (ids) => set({ activeWordFilter: ids }),

      mergedVocabulary: defaultVocabulary,
      setMergedVocabulary: (v) => set({ mergedVocabulary: v.length ? v : defaultVocabulary }),

      toggleBookmark: (id) =>
        set((s) => ({
          bookmarks: s.bookmarks.includes(id)
            ? s.bookmarks.filter((x) => x !== id)
            : [...s.bookmarks, id],
        })),

      gradeCard: (id, remembered) =>
        set((s) => {
          const nextSrs = scheduleReview(s.srsById[id], remembered);
          const learned = new Set(s.learnedWordIds);
          if (remembered) learned.add(id);
          return {
            srsById: { ...s.srsById, [id]: nextSrs },
            learnedWordIds: Array.from(learned),
          };
        }),

      recordStudy: (minutes, cards = 0) =>
        set((s) => {
          const day = todayStr();
          const daily = { ...s.stats.daily };
          daily[day] = {
            minutes: (daily[day]?.minutes ?? 0) + minutes,
            cards: (daily[day]?.cards ?? 0) + cards,
          };

          let streak = s.stats.streak;
          const last = s.stats.lastStudyDate;

          if (last !== day) {
            if (!last) streak = 1;
            else {
              const gap = differenceInCalendarDays(new Date(day), new Date(last));
              if (gap === 1) streak += 1;
              else streak = 1;
            }
          }

          return {
            stats: {
              ...s.stats,
              studyMinutes: s.stats.studyMinutes + minutes,
              lastStudyDate: day,
              streak,
              daily,
            },
          };
        }),
    }),
    {
      name: 'hanzi-flow-storage',
      partialize: (s) => ({
        theme: s.theme,
        learnedWordIds: s.learnedWordIds,
        bookmarks: s.bookmarks,
        srsById: s.srsById,
        stats: s.stats,
        activeWordFilter: s.activeWordFilter,
        activeHskLevel: s.activeHskLevel,
      }),
    }
  )
);

