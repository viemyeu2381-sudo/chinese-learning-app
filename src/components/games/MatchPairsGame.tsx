import { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';
import { useWorkingSet } from '../../hooks/useLearningDeck';
import { shuffle } from '../../lib/shuffle';
import { recordStudyGames } from './studyGames';

type Cell = { id: string; label: string; pairId: string; kind: 'h' | 'm' };

export function MatchPairsGame() {
  const words = useWorkingSet();
  const recordStudy = useAppStore((s) => s.recordStudy);
  const [selected, setSelected] = useState<Cell | null>(null);
  const [matched, setMatched] = useState<Set<string>>(() => new Set());
  const [round, setRound] = useState(0);

  const cells: Cell[] = useMemo(() => {
    const subset = shuffle(words).slice(0, 4);
    const list: Cell[] = [];
    subset.forEach((w) => {
      list.push({ id: `${w.id}-h`, label: w.hanTu, pairId: w.id, kind: 'h' });
      list.push({ id: `${w.id}-m`, label: w.nghia, pairId: w.id, kind: 'm' });
    });
    return shuffle(list);
  }, [words, round]);

  const reset = () => {
    setMatched(new Set());
    setSelected(null);
    setRound((r) => r + 1);
  };

  const onCell = useCallback(
    (cell: Cell) => {
      if (matched.has(cell.pairId)) return;
      if (!selected) {
        setSelected(cell);
        return;
      }
      if (selected.id === cell.id) {
        setSelected(null);
        return;
      }
      if (selected.kind === cell.kind) {
        setSelected(cell);
        return;
      }
      if (selected.pairId === cell.pairId) {
        setMatched((m) => new Set(m).add(cell.pairId));
        recordStudyGames(recordStudy, 1);
        setSelected(null);
        if (matched.size + 1 >= 4) {
          setTimeout(reset, 700);
        }
      } else {
        setSelected(null);
      }
    },
    [selected, matched, recordStudy]
  );

  if (words.length < 4) {
    return (
      <p className="text-center text-slate-500 py-6 text-sm">
        Cần ít nhất 4 từ trong bộ lọc (đổi HSK hoặc “học toàn bộ”).
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between text-sm text-slate-500">
        <span>Nối chữ — nghĩa</span>
        <button type="button" onClick={reset} className="font-semibold text-brand-600 dark:text-rose-400">
          Ván mới
        </button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {cells.map((cell) => {
          const isMatch = matched.has(cell.pairId);
          const isSel = selected?.id === cell.id;
          return (
            <motion.button
              key={cell.id}
              type="button"
              layout
              disabled={isMatch}
              onClick={() => onCell(cell)}
              className={`min-h-[72px] rounded-2xl border-2 px-3 py-3 text-sm font-semibold transition-all active:scale-[0.98] ${
                isMatch
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-200 opacity-80'
                  : isSel
                    ? 'border-brand-500 bg-brand-50 dark:bg-rose-950/30 text-slate-900 dark:text-white'
                    : 'border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100'
              }`}
            >
              <span className={cell.kind === 'h' ? 'font-hanzi text-2xl' : ''}>{cell.label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
