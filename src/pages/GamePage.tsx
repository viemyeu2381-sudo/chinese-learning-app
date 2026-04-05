import { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Link2, Type, Zap } from 'lucide-react';
import { QuizMcGame } from '../components/games/QuizMcGame';
import { MatchPairsGame } from '../components/games/MatchPairsGame';
import { PinyinPickGame } from '../components/games/PinyinPickGame';
import { TimeAttackGame } from '../components/games/TimeAttackGame';
import type { GameMode } from '../types/vocabulary';

const modes: { id: GameMode; label: string; desc: string; icon: typeof Brain }[] = [
  { id: 'quiz', label: 'Trắc nghiệm', desc: 'Chọn nghĩa đúng', icon: Brain },
  { id: 'match', label: 'Nối cặp', desc: 'Chữ — nghĩa', icon: Link2 },
  { id: 'pinyin', label: 'Pinyin', desc: 'Chọn phiên âm', icon: Type },
  { id: 'speed', label: 'Time attack', desc: '60 giây', icon: Zap },
];

export function GamePage() {
  const [mode, setMode] = useState<GameMode | null>(null);

  if (!mode) {
    return (
      <div className="space-y-5 pt-2">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Game</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Dùng bộ từ theo HSK / bài đang chọn ở mục Learn → HSK.
        </p>
        <div className="grid grid-cols-2 gap-3">
          {modes.map((m, i) => (
            <motion.button
              key={m.id}
              type="button"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setMode(m.id)}
              className="flex flex-col items-start rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 text-left shadow-sm active:scale-[0.98]"
            >
              <m.icon className="h-6 w-6 text-brand-500 dark:text-rose-400 mb-2" />
              <span className="font-bold text-slate-900 dark:text-white text-sm">{m.label}</span>
              <span className="text-xs text-slate-500 mt-0.5">{m.desc}</span>
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 pt-2">
      <button
        type="button"
        onClick={() => setMode(null)}
        className="text-sm font-semibold text-brand-600 dark:text-rose-400"
      >
        ← Chọn game khác
      </button>
      {mode === 'quiz' && <QuizMcGame />}
      {mode === 'match' && <MatchPairsGame />}
      {mode === 'pinyin' && <PinyinPickGame />}
      {mode === 'speed' && <TimeAttackGame />}
    </div>
  );
}
