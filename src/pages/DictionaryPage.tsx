import { DictionarySearch } from '../components/dictionary/DictionarySearch';

export function DictionaryPage() {
  return (
    <div className="space-y-4 pt-2">
      <h1 className="text-xl font-bold text-slate-900 dark:text-white">Tra từ</h1>
      <DictionarySearch />
    </div>
  );
}
