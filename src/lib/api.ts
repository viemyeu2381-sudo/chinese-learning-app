import type { VocabularyItem } from '../types/vocabulary';
import { vocabulary as localVocabulary } from '../data/vocabulary';

function normalizeVocabularyItem(item: any): VocabularyItem {
  return {
    ...item,
    hanTu: item.hanTu ?? item.hanzi ?? item.han_tu ?? '',
    pinyin: item.pinyin ?? '',
    hanViet: item.hanViet ?? item.han_viet ?? '',
    nghia: item.nghia ?? item.meaning ?? '',
  } as VocabularyItem;
}

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
    const data = await res.json();
    if (!Array.isArray(data)) return null;
    return data.map(normalizeVocabularyItem);
  } catch {
    return null;
  }
}

export function getLocalVocabulary(): VocabularyItem[] {
  return localVocabulary;
}
