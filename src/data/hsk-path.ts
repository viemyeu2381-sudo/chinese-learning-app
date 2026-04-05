import type { HSKLesson } from '../types/vocabulary';

export const hskLessons: Record<number, HSKLesson[]> = {
  1: [
    {
      id: 'hsk1-l1',
      title: 'Bài 1 — Chào hỏi & đại từ',
      description: '你好, 谢谢, 我, 你, 他, 一, 二, 三',
      wordIds: ['h1-001', 'h1-002', 'h1-003', 'h1-004', 'h1-005', 'h1-026', 'h1-027', 'h1-028'],
    },
    {
      id: 'hsk1-l2',
      title: 'Bài 2 — Ăn uống cơ bản',
      description: '她, 我们, 吃, 喝, 水',
      wordIds: ['h1-006', 'h1-007', 'h1-008', 'h1-009', 'h1-010'],
    },
    {
      id: 'hsk1-l3',
      title: 'Bài 3 — Tính từ & địa danh',
      description: '好, 大, 小, 人, 中国',
      wordIds: ['h1-011', 'h1-012', 'h1-013', 'h1-014', 'h1-015'],
    },
    {
      id: 'hsk1-l4',
      title: 'Bài 4 — Học tập',
      description: '学, 说, 听, 看, 书',
      wordIds: ['h1-016', 'h1-017', 'h1-018', 'h1-019', 'h1-020'],
    },
    {
      id: 'hsk1-l5',
      title: 'Bài 5 — Gia đình & trường học',
      description: '爱, 家, 朋友, 老师, 学生',
      wordIds: ['h1-021', 'h1-022', 'h1-023', 'h1-024', 'h1-025'],
    },
  ],
  2: [
    {
      id: 'hsk2-placeholder',
      title: 'HSK 2 — Sắp có',
      description: 'Nội dung sẽ được bổ sung (API / cập nhật dữ liệu).',
      wordIds: [],
    },
  ],
  3: [
    {
      id: 'hsk3-placeholder',
      title: 'HSK 3 — Sắp có',
      description: 'Lộ trình dài hơn, từ vựng & ngữ pháp mở rộng.',
      wordIds: [],
    },
  ],
  4: [
    {
      id: 'hsk4-placeholder',
      title: 'HSK 4 — Sắp có',
      description: '',
      wordIds: [],
    },
  ],
  5: [
    {
      id: 'hsk5-placeholder',
      title: 'HSK 5 — Sắp có',
      description: '',
      wordIds: [],
    },
  ],
  6: [
    {
      id: 'hsk6-placeholder',
      title: 'HSK 6 — Sắp có',
      description: '',
      wordIds: [],
    },
  ],
};
