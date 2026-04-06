import { lazy, Suspense, useState } from 'react';
import { motion } from 'framer-motion';

const FlashcardSession = lazy(() =>
  import('../components/flashcards/FlashcardSession').then((m) => ({ default: m.FlashcardSession }))
);
const StrokePractice = lazy(() =>
  import('../components/stroke/StrokePractice').then((m) => ({ default: m.StrokePractice }))
);
const HSKPathSection = lazy(() =>
  import('../components/learn/HSKPathSection').then((m) => ({ default: m.HSKPathSection }))
);

type Tab = 'cards' | 'stroke' | 'hsk';

const tabs: { id: Tab; label: string }[] = [
  { id: 'cards', label: 'Flashcard' },
  { id: 'stroke', label: 'Viết nét' },
  { id: 'hsk', label: 'HSK' },
];

export function LearnPage() {
  const [tab, setTab] = useState<Tab>('cards');

  return (
    <div className="space-y-5 pt-2">
      <h1 className="text-xl font-bold text-slate-900 dark:text-white">Học</h1>
      <div className="flex rounded-2xl bg-slate-100 dark:bg-slate-800/90 p-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`relative flex-1 rounded-xl py-2.5 text-xs font-bold transition-colors ${
              tab === t.id
                ? 'text-slate-900 dark:text-white'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            {tab === t.id && (
              <motion.span
                layoutId="learn-tab"
                className="absolute inset-0 rounded-xl bg-white dark:bg-slate-700 shadow-sm"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{t.label}</span>
          </button>
        ))}
      </div>

      <motion.div
        key={tab}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <Suspense fallback={<p className="text-sm text-slate-500">Đang tải nội dung...</p>}>
          {tab === 'cards' && <FlashcardSession />}
          {tab === 'stroke' && <StrokePractice />}
          {tab === 'hsk' && <HSKPathSection />}
        </Suspense>
      </motion.div>
    </div>
  );
}
