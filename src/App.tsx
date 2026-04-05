import { Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { HomePage } from './pages/HomePage';
import { LearnPage } from './pages/LearnPage';
import { GamePage } from './pages/GamePage';
import { DictionaryPage } from './pages/DictionaryPage';
import { ProfilePage } from './pages/ProfilePage';

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/learn" element={<LearnPage />} />
        <Route path="/games" element={<GamePage />} />
        <Route path="/dictionary" element={<DictionaryPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>
    </Routes>
  );
}
