import { useEffect, useRef, useState, useMemo } from 'react';
import HanziWriter from 'hanzi-writer';
import type { HanziWriterInstance } from 'hanzi-writer';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Eraser, Sparkles } from 'lucide-react';
import type { VocabularyItem } from '../../types/vocabulary';
import { useWorkingSet } from '../../hooks/useLearningDeck';
import { speakChinese } from '../../lib/speech';

function firstChar(hanzi: string): string {
  const it = hanzi[Symbol.iterator]().next();
  return it.done ? hanzi : it.value;
}

export function StrokePractice() {
  const words = useWorkingSet();
  const singleCharWords = useMemo(
    () => words.filter((w) => [...w.hanzi].length === 1),
    [words]
  );
  const pool = singleCharWords.length ? singleCharWords : words;
  const [idx, setIdx] = useState(0);
  const word = pool[idx % pool.length];
  const char = word ? firstChar(word.hanzi) : '学';

  const mountRef = useRef<HTMLDivElement>(null);
  const writerRef = useRef<HanziWriterInstance | null>(null);
  const [status, setStatus] = useState<'idle' | 'quiz' | 'done'>('idle');
  const [mistakes, setMistakes] = useState<number | null>(null);
  const [accuracyLabel, setAccuracyLabel] = useState<string | null>(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;
    el.innerHTML = '';
    setStatus('idle');
    setMistakes(null);
    setAccuracyLabel(null);

    const w = HanziWriter.create(el, char, {
      width: Math.min(280, typeof window !== 'undefined' ? window.innerWidth - 64 : 260),
      height: Math.min(280, typeof window !== 'undefined' ? window.innerWidth - 64 : 260),
      padding: 5,
      showOutline: true,
      strokeColor: '#e11d48',
      outlineColor: '#cbd5e1',
      drawingColor: '#334155',
      radicalColor: '#0ea5e9',
    });
    writerRef.current = w;
    requestAnimationFrame(() => w.animateCharacter());

    return () => {
      el.innerHTML = '';
      writerRef.current = null;
    };
  }, [char]);

  const startQuiz = () => {
    const w = writerRef.current;
    if (!w) return;
    setStatus('quiz');
    setMistakes(null);
    setAccuracyLabel(null);
    w.cancelQuiz();
    w.quiz({
      showHintAfterMisses: 2,
      highlightOnComplete: true,
      onComplete: ({ totalMistakes }) => {
        setMistakes(totalMistakes);
        setStatus('done');
        if (totalMistakes === 0) setAccuracyLabel('Rất tốt — nét đúng thứ tự!');
        else if (totalMistakes <= 2) setAccuracyLabel('Khá ổn — ôn thêm vài lần.');
        else setAccuracyLabel('Cần luyện thêm — xem animation gợi ý.');
      },
    });
  };

  const showAnimate = () => {
    writerRef.current?.cancelQuiz();
    setStatus('idle');
    setMistakes(null);
    setAccuracyLabel(null);
    writerRef.current?.animateCharacter();
  };

  const nextWord = () => {
    setIdx((i) => i + 1);
  };

  if (!word) {
    return (
      <p className="text-center text-slate-500 text-sm py-8">Không có từ trong bộ lọc hiện tại.</p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Luyện nét</p>
          <p className="font-hanzi text-2xl font-semibold text-slate-800 dark:text-slate-100">{char}</p>
          <p className="text-sm text-brand-600 dark:text-rose-300">{word.pinyin}</p>
        </div>
        <button
          type="button"
          onClick={() => speakChinese(char)}
          className="rounded-2xl bg-slate-100 dark:bg-slate-700 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200"
        >
          Nghe
        </button>
      </div>

      <div className="mx-auto flex justify-center rounded-3xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800/50 p-4 shadow-inner">
        <div ref={mountRef} className="hanzi-writer-target min-h-[200px] min-w-[200px]" />
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        <button
          type="button"
          onClick={showAnimate}
          className="inline-flex items-center gap-2 rounded-2xl bg-slate-100 dark:bg-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-800 dark:text-slate-100 active:scale-[0.98]"
        >
          <Play className="h-4 w-4" />
          Xem thứ tự nét
        </button>
        <button
          type="button"
          onClick={startQuiz}
          disabled={status === 'quiz'}
          className="inline-flex items-center gap-2 rounded-2xl bg-brand-600 dark:bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg disabled:opacity-50 active:scale-[0.98]"
        >
          <Sparkles className="h-4 w-4" />
          Vẽ lại
        </button>
        <button
          type="button"
          onClick={() => {
            writerRef.current?.cancelQuiz();
            mountRef.current && (mountRef.current.innerHTML = '');
            const el = mountRef.current;
            if (el) {
              const w = HanziWriter.create(el, char, {
                width: Math.min(280, window.innerWidth - 64),
                height: Math.min(280, window.innerWidth - 64),
                padding: 5,
                showOutline: true,
                strokeColor: '#e11d48',
                outlineColor: '#cbd5e1',
                drawingColor: '#334155',
              });
              writerRef.current = w;
              requestAnimationFrame(() => w.animateCharacter());
            }
            setStatus('idle');
            setMistakes(null);
            setAccuracyLabel(null);
          }}
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 dark:border-slate-600 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 active:scale-[0.98]"
        >
          <Eraser className="h-4 w-4" />
          Xóa & xem lại
        </button>
      </div>

      <AnimatePresence>
        {(status === 'done' || accuracyLabel) && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 p-4 text-center text-sm"
          >
            {mistakes !== null && (
              <p className="font-semibold text-slate-800 dark:text-slate-100">
                Số lỗi nét: {mistakes}
              </p>
            )}
            {accuracyLabel && <p className="mt-1 text-slate-600 dark:text-slate-400">{accuracyLabel}</p>}
            <p className="mt-2 text-xs text-slate-400">
              Hanzi Writer so khớp thứ tự & hình dạng nét cơ bản.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={nextWord}
        className="w-full rounded-2xl border border-dashed border-slate-300 dark:border-slate-600 py-3 text-sm font-semibold text-slate-600 dark:text-slate-300"
      >
        Từ tiếp theo
      </button>
    </div>
  );
}
