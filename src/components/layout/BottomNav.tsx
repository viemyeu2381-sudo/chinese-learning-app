import { NavLink } from 'react-router-dom';
import { Home, GraduationCap, Gamepad2, BookMarked, User } from 'lucide-react';
import { motion } from 'framer-motion';

const items = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/learn', icon: GraduationCap, label: 'Learn' },
  { to: '/games', icon: Gamepad2, label: 'Game' },
  { to: '/dictionary', icon: BookMarked, label: 'Dictionary' },
  { to: '/profile', icon: User, label: 'Profile' },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 pb-safe border-t border-slate-200/80 dark:border-slate-700/80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-lg items-stretch justify-around px-1 pt-1">
        {items.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `relative flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-semibold transition-colors ${
                isActive
                  ? 'text-brand-600 dark:text-rose-400'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute -top-0.5 h-1 w-8 rounded-full bg-brand-500 dark:bg-rose-500"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 2} />
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
