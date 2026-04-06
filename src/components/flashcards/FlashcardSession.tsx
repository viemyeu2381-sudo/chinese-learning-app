import { useState, useCallback } from 'react';
import { motion, useMotionValue, useTransform, type PanInfo, AnimatePresence } from 'framer-motion';
import { RotateCcw, Volume2, Heart, Check, X } from 'lucide-react';
import type { VocabularyItem } from '../../types/vocabulary';
import { useAppStore } from '../../store/useAppStore';
import { useDueQueue } from '../../hooks/useLearningDeck';
import { speakChinese } from '../../lib/speech';

const SWIPE = 100;

interface CardProps {
  word: VocabularyItem;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
}

function Flashcard({
  word,
  onSwipeLeft,
  onSwipeRight,
  isBookmarked,
  onToggleBookmark,
}: CardProps) {
  const [flipped, setFlipped] = useState(false);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-220, 220], [-14, 14]);
  const hintLeft = useTransform(x, [-SWIPE - 40, -20], [1, 0]);
  const hintRight = useTransform(x, [20, SWIPE + 40], [0, 1]);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x > SWIPE) {
      onSwipeRight();
      return;
    }
    if (info.offset.x < -SWIPE) {
      onSwipeLeft();
      return;
    }
  };

  return (
    <motion.div
      style={{ x, rotate }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.85}
      onDragEnd={handleDragEnd}
      className="relative w-full touch-pan-x"
    >
      <motion.div
        className="absolute -left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-rose-500 px-2 py-1 text-xs font-bold text-white shadow-lg pointer-events-none"
        style={{ opacity: hintLeft }}
      >
        Ôn lại
      </motion.div>
      <motion.div
        className="absolute -right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-emerald-500 px-2 py-1 text-xs font-bold text-white shadow-lg pointer-events-none"
        style={{ opacity: hintRight }}
      >
        Đã nhớ
      </motion.div>

      <motion.div
        role="button"
        tabIndex={0}
        layout
        onClick={() => setFlipped((f) => !f)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setFlipped((f) => !f);
          }
        }}
        className="relative w-full min-h-[320px] rounded-3xl bg-white dark:bg-slate-800 shadow-card dark:shadow-card-dark border border-slate-100 dark:border-slate-700 overflow-hidden perspective-1000 cursor-pointer select-none"
        style={{ perspective: 1200 }}
      >
        <motion.div
          className="relative w-full h-full min-h-[320px]"
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ type: 'spring', stiffness: 280, damping: 24 }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Mặt trước */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 backface-hidden"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <p className="font-hanzi text-7xl sm:text-8xl font-semibold text-slate-900 dark:text-white tracking-wide">
              {word.hanTu}
            </p>
            <p className="text-lg text-brand-600 dark:text-rose-300 font-medium">{word.pinyin}</p>
            <p className="text-xs text-slate-400">Chạm để lật · Vuốt trái/phải</p>
          </div>
          {/* Mặt sau */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 bg-slate-50 dark:bg-slate-800/90"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            <p className="text-xl font-semibold text-center text-slate-800 dark:text-slate-100 px-2">
              {word.nghia}
            </p>
            {word.example && (
              <p className="text-sm text-slate-500 dark:text-slate-400 text-center font-hanzi leading-relaxed">
                {word.example}
              </p>
            )}
          </div>
        </motion.div>
      </motion.div>

      <div className="mt-4 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            speakChinese(word.hanTu);
          }}
          className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 active:scale-95 transition-transform"
          aria-label="Nghe phát âm"
        >
          <Volume2 className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleBookmark();
          }}
          className={`flex h-12 w-12 items-center justify-center rounded-2xl active:scale-95 transition-transform ${
            isBookmarked
              ? 'bg-rose-500 text-white'
              : 'bg-slate-100 dark:bg-slate-700 text-slate-500'
          }`}
          aria-label="Yêu thích"
        >
          <Heart className={`h-5 w-5 ${isBookmarked ? 'fill-current' : ''}`} />
        </button>
      </div>
    </motion.div>
  );
}

export function FlashcardSession() {
  const queue = useDueQueue();
  const gradeCard = useAppStore((s) => s.gradeCard);
  const recordStudy = useAppStore((s) => s.recordStudy);
  const bookmarks = useAppStore((s) => s.bookmarks);
  const toggleBookmark = useAppStore((s) => s.toggleBookmark);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const current = queue[index];
  const done = !current;

  const advance = useCallback(
    (remembered: boolean) => {
      if (!current) return;
      gradeCard(current.id, remembered);
      recordStudy(0.15, 1);
      setDirection(remembered ? 1 : -1);
      setIndex((i) => i + 1);
    },
    [current, gradeCard, recordStudy]
  );

  const restart = () => {
    setIndex(0);
    setDirection(0);
  };

  if (queue.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-200 dark:border-slate-600 p-8 text-center text-slate-500">
        <p className="font-medium text-slate-700 dark:text-slate-300">Chưa có thẻ trong bộ lọc</p>
        <p className="mt-2 text-sm">Chọn HSK / bài học hoặc đợi SRS đến hạn ôn.</p>
      </div>
    );
  }

  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center gap-6 rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/30 border border-emerald-200/60 dark:border-emerald-800/50 p-8 text-center"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-white">
          <Check className="h-8 w-8" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Xong phiên!</h3>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Bạn đã ôn {queue.length} thẻ. Spaced repetition đã cập nhật.
          </p>
        </div>
        <button
          type="button"
          onClick={restart}
          className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-lg active:scale-[0.98]"
        >
          <RotateCcw className="h-4 w-4" />
          Học tiếp
        </button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
        <span>
          Thẻ {index + 1} / {queue.length}
        </span>
        <span>SRS · vuốt để xếp lịch ôn</span>
      </div>

      <div className="flex gap-2 justify-center">
        <button
          type="button"
          onClick={() => advance(false)}
          className="flex flex-1 max-w-[140px] items-center justify-center gap-2 rounded-2xl border-2 border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/30 py-3 text-sm font-semibold text-rose-700 dark:text-rose-300 active:scale-[0.98]"
        >
          <X className="h-4 w-4" />
          Chưa nhớ
        </button>
        <button
          type="button"
          onClick={() => advance(true)}
          className="flex flex-1 max-w-[140px] items-center justify-center gap-2 rounded-2xl border-2 border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 py-3 text-sm font-semibold text-emerald-700 dark:text-emerald-300 active:scale-[0.98]"
        >
          <Check className="h-4 w-4" />
          Đã nhớ
        </button>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={current.id + index}
          initial={{ opacity: 0, scale: 0.94, x: direction * 40 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.9, x: direction * -80 }}
          transition={{ type: 'spring', stiffness: 380, damping: 28 }}
        >
          <Flashcard
            word={current}
            onSwipeLeft={() => advance(false)}
            onSwipeRight={() => advance(true)}
            isBookmarked={bookmarks.includes(current.id)}
            onToggleBookmark={() => toggleBookmark(current.id)}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
