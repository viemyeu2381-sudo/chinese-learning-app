import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { subDays, format } from 'date-fns';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { Flame, BookOpen, Trophy, Clock } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export function HomePage() {
  const learnedWordIds = useAppStore((s) => s.learnedWordIds);
  const stats = useAppStore((s) => s.stats);
  const activeHskLevel = useAppStore((s) => s.activeHskLevel);

  const chartData = Array.from({ length: 7 }, (_, i) => {
    const d = subDays(new Date(), 6 - i);
    const key = format(d, 'yyyy-MM-dd');
    const dayShort = format(d, 'dd/MM');
    return {
      name: dayShort,
      minutes: stats.daily[key]?.minutes ?? 0,
      cards: stats.daily[key]?.cards ?? 0,
    };
  });

  return (
    <div className="space-y-6 pt-2">
      <header>
        <motion.p
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-rose-400"
        >
          Hanzi Flow
        </motion.p>
        <h1 className="mt-1 font-hanzi text-3xl font-bold text-slate-900 dark:text-white">
          加油 học mỗi ngày
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Bộ lọc hiện tại: HSK {activeHskLevel}
        </p>
      </header>

      <div className="grid grid-cols-2 gap-3">
        {[
          {
            label: 'Từ đã nhớ',
            value: learnedWordIds.length,
            icon: BookOpen,
            tint: 'from-blue-500/20 to-indigo-500/10',
          },
          {
            label: 'Streak',
            value: stats.streak,
            suffix: ' ngày',
            icon: Flame,
            tint: 'from-orange-500/25 to-amber-500/10',
          },
          {
            label: 'Tổng phút học',
            value: Math.round(stats.studyMinutes),
            icon: Clock,
            tint: 'from-emerald-500/20 to-teal-500/10',
          },
          {
            label: 'Thẻ (7 ngày)',
            value: chartData.reduce((a, b) => a + b.cards, 0),
            icon: Trophy,
            tint: 'from-rose-500/20 to-pink-500/10',
          },
        ].map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`rounded-3xl bg-gradient-to-br ${card.tint} border border-slate-200/80 dark:border-slate-700/80 p-4`}
          >
            <card.icon className="h-5 w-5 text-slate-600 dark:text-slate-300 mb-2" />
            <p className="text-2xl font-black text-slate-900 dark:text-white">
              {card.value}
              {card.suffix ?? ''}
            </p>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{card.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 p-4 shadow-card dark:shadow-card-dark">
        <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-3">Phút học 7 ngày</h2>
        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="fillMin" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#f43f5e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-600" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 10 }} stroke="#94a3b8" allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: 'none',
                  background: 'rgba(15,23,42,0.92)',
                  color: '#fff',
                }}
              />
              <Area
                type="monotone"
                dataKey="minutes"
                stroke="#f43f5e"
                fill="url(#fillMin)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Link
          to="/learn"
          className="flex items-center justify-center rounded-2xl bg-brand-600 dark:bg-rose-600 py-3.5 text-sm font-bold text-white shadow-lg active:scale-[0.99]"
        >
          Bắt đầu học
        </Link>
        <Link
          to="/games"
          className="flex items-center justify-center rounded-2xl border-2 border-slate-200 dark:border-slate-600 py-3.5 text-sm font-bold text-slate-800 dark:text-slate-100"
        >
          Chơi game ôn tập
        </Link>
      </div>
    </div>
  );
}
