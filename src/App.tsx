import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';

const HomePage = lazy(() => import('./pages/HomePage').then((m) => ({ default: m.HomePage })));
const LearnPage = lazy(() => import('./pages/LearnPage').then((m) => ({ default: m.LearnPage })));
const GamePage = lazy(() => import('./pages/GamePage').then((m) => ({ default: m.GamePage })));
const DictionaryPage = lazy(() =>
  import('./pages/DictionaryPage').then((m) => ({ default: m.DictionaryPage }))
);
const ProfilePage = lazy(() => import('./pages/ProfilePage').then((m) => ({ default: m.ProfilePage })));

function PageFallback() {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 text-sm text-slate-500">
      Đang tải...
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route
          path="/"
          element={
            <Suspense fallback={<PageFallback />}>
              <HomePage />
            </Suspense>
          }
        />
        <Route
          path="/learn"
          element={
            <Suspense fallback={<PageFallback />}>
              <LearnPage />
            </Suspense>
          }
        />
        <Route
          path="/games"
          element={
            <Suspense fallback={<PageFallback />}>
              <GamePage />
            </Suspense>
          }
        />
        <Route
          path="/dictionary"
          element={
            <Suspense fallback={<PageFallback />}>
              <DictionaryPage />
            </Suspense>
          }
        />
        <Route
          path="/profile"
          element={
            <Suspense fallback={<PageFallback />}>
              <ProfilePage />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  );
}
