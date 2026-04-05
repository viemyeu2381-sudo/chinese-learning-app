import { Moon, Sun, Trash2, Sparkles, MessageCircle, Volume2, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import { speakChinese } from '../lib/speech';

export function ProfilePage() {
  const theme = useAppStore((s) => s.theme);
  const toggleTheme = useAppStore((s) => s.toggleTheme);
  const bookmarks = useAppStore((s) => s.bookmarks);
  const mergedVocabulary = useAppStore((s) => s.mergedVocabulary);
  const stats = useAppStore((s) => s.stats);

  const saved = bookmarks
    .map((id) => mergedVocabulary.find((w) => w.id === id))
    .filter((w): w is NonNullable<typeof w> => w != null);

  const resetAll = () => {
    if (!confirm('Xóa toàn bộ tiến độ cục bộ? Không hoàn tác.')) return;
    localStorage.removeItem('hanzi-flow-storage');
    window.location.reload();
  };

  return (
    <div className="space-y-6 pt-2 pb-8">
      <h1 className="text-xl font-bold text-slate-900 dark:text-white">Cá nhân</h1>

      <div className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 flex items-center justify-between">
        <div>
          <p className="font-semibold text-slate-800 dark:text-slate-100">Giao diện</p>
          <p className="text-xs text-slate-500">Light / Dark</p>
        </div>
        <button
          type="button"
          onClick={toggleTheme}
          className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-amber-300"
          aria-label="Đổi theme"
        >
          {theme === 'dark' ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
        </button>
      </div>

      <div className="rounded-3xl border border-dashed border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/40 p-4">
        <p className="text-xs font-bold uppercase text-slate-400 mb-2">Sắp có (optional)</p>
        <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
          <li className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 shrink-0 text-brand-500" />
            AI gợi ý từ cần ôn
          </li>
          <li className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4 shrink-0 text-brand-500" />
            Chat luyện hội thoại
          </li>
        </ul>
      </div>

      <div>
        <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-2 flex items-center gap-2">
          <Heart className="h-4 w-4 text-rose-500 fill-rose-500" />
          Từ đã lưu ({saved.length})
        </h2>
        {saved.length === 0 ? (
          <p className="text-sm text-slate-500 py-4 text-center rounded-2xl bg-slate-100 dark:bg-slate-800/50">
            Chưa có từ yêu thích — thêm từ flashcard hoặc tra từ.
          </p>
        ) : (
          <ul className="space-y-2">
            {saved.map((w) => (
              <motion.li
                layout
                key={w.id}
                className="flex items-center justify-between rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2"
              >
                <div>
                  <span className="font-hanzi text-lg font-semibold">{w.hanzi}</span>
                  <span className="ml-2 text-xs text-slate-500">{w.pinyin}</span>
                  <p className="text-xs text-slate-600 dark:text-slate-300">{w.meaning}</p>
                </div>
                <button
                  type="button"
                  onClick={() => speakChinese(w.hanzi)}
                  className="rounded-xl bg-slate-100 dark:bg-slate-700 p-2"
                  aria-label="Nghe"
                >
                  <Volume2 className="h-4 w-4" />
                </button>
              </motion.li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-2xl bg-slate-100 dark:bg-slate-800/50 px-4 py-3 text-xs text-slate-500 space-y-1">
        <p>Tổng phút: {Math.round(stats.studyMinutes)}</p>
        <p>Streak: {stats.streak} ngày</p>
      </div>

      <button
        type="button"
        onClick={resetAll}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-rose-200 dark:border-rose-900 py-3 text-sm font-semibold text-rose-600 dark:text-rose-400"
      >
        <Trash2 className="h-4 w-4" />
        Xóa dữ liệu cục bộ
      </button>
    </div>
  );
}
