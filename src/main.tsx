import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import { fetchVocabularyRemote } from './lib/api';
import { useAppStore } from './store/useAppStore';

fetchVocabularyRemote().then((data) => {
  if (!data?.length) return;
  const cur = useAppStore.getState().mergedVocabulary;
  if (data.length >= cur.length) useAppStore.getState().setMergedVocabulary(data);
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
