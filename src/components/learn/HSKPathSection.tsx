import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, BookOpen, CheckCircle2 } from 'lucide-react';
import { hskLessons } from '../../data/hsk-path';
import { useAppStore } from '../../store/useAppStore';
import { vocabulary } from '../../data/vocabulary';

export function HSKPathSection() {
  const [openLevel, setOpenLevel] = useState<number>(1);
  const activeHskLevel = useAppStore((s) => s.activeHskLevel);
  const setActiveHskLevel = useAppStore((s) => s.setActiveHskLevel);
  const setActiveWordFilter = useAppStore((s) => s.setActiveWordFilter);
  const learnedWordIds = useAppStore((s) => s.learnedWordIds);
  const learned = new Set(learnedWordIds);

  const selectLesson = (level: number, wordIds: string[]) => {
    setActiveHskLevel(level);
    setActiveWordFilter(wordIds.length ? wordIds : null);
  };

  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Chọn cấp độ và bài để lọc flashcard & game. Đang chọn:{' '}
        <span className="font-semibold text-brand-600 dark:text-rose-400">HSK {activeHskLevel}</span>
      </p>

      {[1, 2, 3, 4, 5, 6].map((level) => {
        const lessons = hskLessons[level] ?? [];
        const isOpen = openLevel === level;

        return (
          <div
            key={level}
            className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 overflow-hidden shadow-sm"
          >
            <button
              type="button"
              onClick={() => setOpenLevel(isOpen ? 0 : level)}
              className="flex w-full items-center justify-between px-4 py-3 text-left"
            >
              <span className="font-bold text-slate-800 dark:text-slate-100">
                HSK {level}
                {level === 1 && (
                  <span className="ml-2 text-xs font-normal text-emerald-600 dark:text-emerald-400">
                    (có dữ liệu mẫu)
                  </span>
                )}
              </span>
              <ChevronDown
                className={`h-5 w-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
              />
            </button>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-slate-100 dark:border-slate-700"
                >
                  <div className="divide-y divide-slate-100 dark:divide-slate-700">
                    {lessons.map((lesson) => {
                      const total = lesson.wordIds.length;
                      const done = lesson.wordIds.filter((id) => learned.has(id)).length;
                      const progress = total ? Math.round((done / total) * 100) : 0;

                      return (
                        <button
                          key={lesson.id}
                          type="button"
                          onClick={() => selectLesson(level, lesson.wordIds)}
                          className="flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                        >
                          <BookOpen className="h-5 w-5 shrink-0 text-brand-500 dark:text-rose-400 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm">
                              {lesson.title}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                              {lesson.description}
                            </p>
                            {total > 0 && (
                              <div className="mt-2 flex items-center gap-2">
                                <div className="h-1.5 flex-1 rounded-full bg-slate-200 dark:bg-slate-600 overflow-hidden">
                                  <div
                                    className="h-full rounded-full bg-emerald-500 transition-all"
                                    style={{ width: `${progress}%` }}
                                  />
                                </div>
                                <span className="text-[10px] font-medium text-slate-400">
                                  {done}/{total}
                                </span>
                              </div>
                            )}
                          </div>
                          {total > 0 && progress === 100 && (
                            <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveHskLevel(level);
                      const allIds = vocabulary.filter((w) => w.hsk === level).map((w) => w.id);
                      setActiveWordFilter(allIds.length ? allIds : null);
                    }}
                    className="w-full py-2.5 text-xs font-semibold text-brand-600 dark:text-rose-400 bg-slate-50 dark:bg-slate-900/50"
                  >
                    Học toàn bộ HSK {level} (theo từ điển cục bộ)
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
