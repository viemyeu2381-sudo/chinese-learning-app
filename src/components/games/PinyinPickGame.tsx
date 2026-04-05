import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';
import { useWorkingSet } from '../../hooks/useLearningDeck';
import { shuffle } from '../../lib/shuffle';
import { recordStudyGames } from './studyGames';

export function PinyinPickGame() {
  const words = useWorkingSet();
  const recordStudy = useAppStore((s) => s.recordStudy);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  const current = words[idx % Math.max(words.length, 1)];

  const options = useMemo(() => {
    if (!words.length || !current) return [];
    const pool = shuffle(words.filter((w) => w.id !== current.id).map((w) => w.pinyin));
    const wrong = pool.slice(0, 3);
    return shuffle([current.pinyin, ...wrong]);
  }, [words, current, idx]);

  if (!words.length || !current) {
    return <p className="text-center text-slate-500 py-6">Thêm từ hoặc đổi bộ lọc HSK.</p>;
  }

  const onPick = (opt: string) => {
    if (picked) return;
    setPicked(opt);
    const ok = opt === current.pinyin;
    if (ok) {
      setScore((s) => s + 1);
      recordStudyGames(recordStudy, 1);
    }
    setTimeout(() => {
      setPicked(null);
      setIdx((i) => i + 1);
    }, 600);
  };

  return (
    <div className="space-y-5">
      <div className="flex justify-between text-sm text-slate-500">
        <span>Điểm: {score}</span>
        <span>Chọn pinyin</span>
      </div>
      <motion.div
        key={current.id}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 text-white p-10 text-center shadow-xl"
      >
        <p className="font-hanzi text-7xl font-semibold">{current.hanzi}</p>
      </motion.div>
      <div className="grid gap-2">
        {options.map((opt) => {
          const show = picked !== null;
          const correct = opt === current.pinyin;
          const wrongPick = picked === opt && !correct;
          return (
            <button
              key={opt}
              type="button"
              disabled={show}
              onClick={() => onPick(opt)}
              className={`rounded-2xl border-2 py-3 px-4 text-left text-sm font-medium transition-all ${
                show && correct
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-100'
                  : show && wrongPick
                    ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/40'
                    : 'border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100'
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
