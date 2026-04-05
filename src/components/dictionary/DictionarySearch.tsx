import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Volume2, Heart } from 'lucide-react';
import { searchVocabulary, vocabulary } from '../../data/vocabulary';
import { speakChinese } from '../../lib/speech';
import { useAppStore } from '../../store/useAppStore';

export function DictionarySearch() {
  const [q, setQ] = useState('');
  const bookmarks = useAppStore((s) => s.bookmarks);
  const toggleBookmark = useAppStore((s) => s.toggleBookmark);

  const results = useMemo(() => {
    if (!q.trim()) return [];
    return searchVocabulary(q).slice(0, 12);
  }, [q]);

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Nhập chữ Hán, pinyin hoặc nghĩa..."
          className="w-full rounded-2xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 py-3.5 pl-12 pr-4 text-sm font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
        />
      </div>

      <p className="text-xs text-slate-500">
        {vocabulary.length} mục mẫu (HSK1). Kết nối API để mở rộng từ điển.
      </p>

      <AnimatePresence mode="popLayout">
        <div className="space-y-2">
          {results.map((w) => (
            <motion.article
              key={w.id}
              layout
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/90 p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-hanzi text-3xl font-semibold text-slate-900 dark:text-white">{w.hanzi}</p>
                  <p className="text-brand-600 dark:text-rose-300 font-medium">{w.pinyin}</p>
                  <p className="mt-1 text-slate-700 dark:text-slate-200">{w.meaning}</p>
                </div>
                <div className="flex flex-col gap-1">
                  <button
                    type="button"
                    onClick={() => speakChinese(w.hanzi)}
                    className="rounded-xl bg-slate-100 dark:bg-slate-700 p-2 text-slate-600 dark:text-slate-200"
                    aria-label="Phát âm"
                  >
                    <Volume2 className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleBookmark(w.id)}
                    className={`rounded-xl p-2 ${
                      bookmarks.includes(w.id)
                        ? 'bg-rose-500 text-white'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-500'
                    }`}
                    aria-label="Lưu từ"
                  >
                    <Heart className={`h-4 w-4 ${bookmarks.includes(w.id) ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>
              {w.example && (
                <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 font-hanzi border-t border-slate-100 dark:border-slate-700 pt-3">
                  {w.example}
                </p>
              )}
              {(w.radical || w.radicalHint) && (
                <div className="mt-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 px-3 py-2 text-xs text-slate-600 dark:text-slate-400">
                  {w.radical && (
                    <p>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">Bộ thủ gợi ý:</span>{' '}
                      <span className="font-hanzi text-base text-brand-600 dark:text-rose-400">{w.radical}</span>
                    </p>
                  )}
                  {w.radicalHint && <p className="mt-1">{w.radicalHint}</p>}
                </div>
              )}
              <p className="mt-2 text-[10px] uppercase tracking-wider text-slate-400">HSK {w.hsk}</p>
            </motion.article>
          ))}
        </div>
      </AnimatePresence>

      {q && results.length === 0 && (
        <p className="text-center text-sm text-slate-500 py-8">Không tìm thấy kết quả.</p>
      )}
    </div>
  );
}
