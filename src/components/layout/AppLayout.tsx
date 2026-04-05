import { Outlet } from 'react-router-dom';
import { BottomNav } from './BottomNav';
import { ThemeSync } from './ThemeSync';

export function AppLayout() {
  return (
    <div className="min-h-[100dvh] flex flex-col">
      <ThemeSync />
      <main className="flex-1 pb-24 pt-safe px-4 max-w-lg mx-auto w-full">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
