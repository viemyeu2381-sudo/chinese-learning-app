import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';
import { useWorkingSet } from '../../hooks/useLearningDeck';
import { shuffle } from '../../lib/shuffle';
import { recordStudyGames } from './studyGames';

export function QuizMcGame() {
  const words = useWorkingSet();
  const recordStudy = useAppStore((s) => s.recordStudy);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  const current = words[idx % Math.max(words.length, 1)];

  const options = useMemo(() => {
    if (!words.length || !current) return [];
    const pool = shuffle(words.filter((w) => w.id !== current.id).map((w) => w.nghia));
    const wrong = pool.slice(0, 3);
    return shuffle([current.nghia, ...wrong]);
  }, [words, current, idx]);

  if (!words.length || !current) {
    return <p className="text-center text-slate-500 py-6">Thêm từ hoặc đổi bộ lọc HSK.</p>;
  }

  const onPick = (opt: string) => {
    if (picked) return;
    setPicked(opt);
    const ok = opt === current.nghia;
    if (ok) {
      setScore((s) => s + 1);
      recordStudyGames(recordStudy, 1);
    }
    setTimeout(() => {
      setPicked(null);
      setIdx((i) => i + 1);
    }, 650);
  };

  return (
    <div className="space-y-5">
      <div className="flex justify-between text-sm text-slate-500">
        <span>Điểm: {score}</span>
        <span>Trắc nghiệm nghĩa</span>
      </div>
      <motion.div
        key={current.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-8 text-center shadow-card dark:shadow-card-dark"
      >
        <p className="font-hanzi text-6xl font-semibold text-slate-900 dark:text-white">{current.hanTu}</p>
        <p className="mt-2 text-sm text-slate-400">Chọn nghĩa đúng</p>
      </motion.div>
      <div className="grid gap-2">
        {options.map((opt) => {
          const show = picked !== null;
          const correct = opt === current.nghia;
          const wrongPick = picked === opt && !correct;
          return (
            <button
              key={opt}
              type="button"
              disabled={show}
              onClick={() => onPick(opt)}
              className={`rounded-2xl border-2 py-3.5 px-4 text-left text-sm font-semibold transition-all active:scale-[0.99] ${
                show && correct
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200'
                  : show && wrongPick
                    ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200'
                    : 'border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-100'
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
