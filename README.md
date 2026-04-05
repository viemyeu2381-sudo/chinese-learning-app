# Hanzi Flow

Web app học tiếng Trung **mobile-first**: flashcard (vuốt + SRS), luyện nét với [Hanzi Writer](https://github.com/chanind/hanzi-writer), game ôn tập, lộ trình HSK, tra từ, dark/light mode. Frontend **React + Vite + Tailwind + Zustand + Framer Motion**; backend mẫu **Express + MongoDB** (hoặc chỉ JSON tĩnh).

## Cấu trúc

```
src/
  components/     layout, flashcards, stroke, games, dictionary, learn
  data/           vocabulary.ts (HSK1 mẫu), hsk-path.ts
  lib/            srs, speech, api, shuffle
  pages/          Home, Learn, Games, Dictionary, Profile
  store/          Zustand + persist (localStorage)
server/           API Express (tuỳ chọn)
```

## Chạy frontend

```bash
npm install
npm run dev
```

Mở `http://localhost:5173`. Dữ liệu mặc định: **28 từ HSK1** trong `src/data/vocabulary.ts`.

### Biến môi trường

Sao chép `.env.example` → `.env`.

- **Development:** Nếu **không** set `VITE_API_URL`, app vẫn gọi `GET /api/vocabulary` qua **proxy Vite** (cần chạy backend cổng 3001). Nếu API lỗi / tắt server, app dùng dữ liệu cục bộ.
- **Production:** Chỉ gọi API khi có `VITE_API_URL`. Kết quả **chỉ thay thế** danh sách từ khi API trả về **ít nhất bằng** số mục cục bộ (tránh mất dữ liệu khi API mẫu quá ngắn).

## Chạy backend (tuỳ chọn)

```bash
cd server
npm install
npm start
```

- Không có `MONGODB_URI`: server đọc `server/vocabulary.sample.json`.
- Có `MONGODB_URI`: kết nối MongoDB, collection `vocabulary`, schema trùng field với `VocabularyItem` (xem `server/index.js`).

Proxy dev: Vite đã cấu hình `/api` → `http://localhost:3001`. Với production, set `VITE_API_URL` đúng origin backend (ví dụ `https://your-api.onrender.com`).

## Deploy gợi ý

| Phần     | Nền tảng  | Ghi chú                                      |
|----------|-----------|----------------------------------------------|
| Frontend | Vercel    | Build: `npm run build`, output `dist`        |
| Backend  | Render    | Root `server`, start `npm start`, set `PORT` |

## Tính năng chính

- **Flashcard**: lật thẻ, vuốt trái/phải, nút Đã nhớ / Chưa nhớ, SRS (lặp lại ngắt quãng), bookmark, phát âm (Web Speech `zh-CN`).
- **Viết nét**: animation thứ tự nét, chế độ quiz vẽ lại, phản hồi số lỗi (Hanzi Writer).
- **Game**: trắc nghiệm nghĩa, nối cặp chữ–nghĩa, chọn pinyin, time attack 60s.
- **HSK**: HSK1 có 5 bài + placeholder HSK2–6.
- **Dashboard**: streak, phút học, biểu đồ 7 ngày (Recharts).
- **Profile**: dark mode, danh sách từ đã lưu, xóa dữ liệu cục bộ.

## Ghi chú

- **Phát âm**: phụ thuộc trình duyệt / hệ điều hành (giọng tiếng Trung có thể khác nhau).
- **Hanzi Writer** tải dữ liệu nét qua mạng; cần internet lần đầu cho từng chữ.
- Thư mục `supabase/migrations` là di sản từ project cũ; app hiện không dùng Supabase.
