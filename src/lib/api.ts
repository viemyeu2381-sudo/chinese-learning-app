import type { VocabularyItem } from '../types/vocabulary';
import { vocabulary as localVocabulary } from '../data/vocabulary';

/**
 * Production: cần VITE_API_URL nếu muốn đồng bộ từ API.
 * Development: nếu không set biến này, gọi `/api/vocabulary` qua proxy Vite (backend :3001).
 */
export async function fetchVocabularyRemote(): Promise<VocabularyItem[] | null> {
  const explicit = (import.meta.env.VITE_API_URL as string | undefined)?.trim();
  if (!import.meta.env.DEV && !explicit) return null;

  const url =
    explicit && explicit.length > 0
      ? `${explicit.replace(/\/$/, '')}/api/vocabulary`
      : '/api/vocabulary';

  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export function getLocalVocabulary(): VocabularyItem[] {
  return localVocabulary;
}
