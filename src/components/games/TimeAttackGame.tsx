import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Timer } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useWorkingSet } from '../../hooks/useLearningDeck';
import { shuffle } from '../../lib/shuffle';
import { recordStudyGames } from './studyGames';

const DURATION = 60;

export function TimeAttackGame() {
  const words = useWorkingSet();
  const recordStudy = useAppStore((s) => s.recordStudy);
  const [left, setLeft] = useState(DURATION);
  const [running, setRunning] = useState(false);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const scoreRef = useRef(0);
  const [picked, setPicked] = useState<string | null>(null);

  const current = words[idx % Math.max(words.length, 1)];

  const options = useMemo(() => {
    if (!words.length || !current) return [];
    const pool = shuffle(words.filter((w) => w.id !== current.id).map((w) => w.pinyin));
    return shuffle([current.pinyin, ...pool.slice(0, 3)]);
  }, [words, current, idx]);

  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  useEffect(() => {
    if (!running || left <= 0) return;
    const t = setInterval(() => setLeft((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [running, left]);

  const start = () => {
    setLeft(DURATION);
    setScore(0);
    scoreRef.current = 0;
    setIdx(0);
    setPicked(null);
    setRunning(true);
  };

  const stop = useCallback(() => {
    setRunning(false);
    const s = scoreRef.current;
    if (s > 0) recordStudyGames(recordStudy, Math.min(s, 10));
  }, [recordStudy]);

  useEffect(() => {
    if (left <= 0 && running) stop();
  }, [left, running, stop]);

  const onPick = (opt: string) => {
    if (!running || picked || left <= 0 || !current) return;
    setPicked(opt);
    const ok = opt === current.pinyin;
    if (ok) setScore((s) => {
      const n = s + 1;
      scoreRef.current = n;
      return n;
    });
    setTimeout(() => {
      setPicked(null);
      setIdx((i) => i + 1);
    }, 280);
  };

  if (!words.length) {
    return <p className="text-center text-slate-500 py-6">Không có từ.</p>;
  }

  if (!running && left === DURATION) {
    return (
      <div className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-8 text-center space-y-4">
        <Timer className="mx-auto h-12 w-12 text-brand-500" />
        <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">Time attack — {DURATION}s</h3>
        <p className="text-sm text-slate-500">Chọn pinyin đúng càng nhiều càng tốt.</p>
        <button
          type="button"
          onClick={start}
          className="w-full rounded-2xl bg-brand-600 dark:bg-rose-600 py-3 font-semibold text-white"
        >
          Bắt đầu
        </button>
      </div>
    );
  }

  if (!running && left < DURATION) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl bg-slate-900 text-white p-8 text-center space-y-4"
      >
        <p className="text-4xl font-black text-brand-400">{score}</p>
        <p className="text-slate-300">điểm trong {DURATION} giây</p>
        <button
          type="button"
          onClick={start}
          className="w-full rounded-2xl bg-white text-slate-900 py-3 font-semibold"
        >
          Chơi lại
        </button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-2xl bg-slate-900 text-white px-4 py-3">
        <span className="flex items-center gap-2 font-bold">
          <Timer className="h-5 w-5 text-rose-400" />
          {left}s
        </span>
        <span className="font-bold text-rose-400">{score} điểm</span>
      </div>
      {current && (
        <>
          <div className="rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-8 text-center">
            <p className="font-hanzi text-6xl font-semibold">{current.hanzi}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {options.map((opt) => (
              <button
                key={opt}
                type="button"
                disabled={!!picked}
                onClick={() => onPick(opt)}
                className="rounded-2xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 py-3 text-sm font-semibold text-slate-800 dark:text-slate-100 active:scale-[0.98] disabled:opacity-60"
              >
                {opt}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
