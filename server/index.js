/**
 * API mẫu — Node + Express (+ MongoDB tùy chọn).
 * Render: đặt MONGODB_URI và build script cài dependencies.
 * Không có MongoDB: trả về vocabulary từ file JSON.
 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

const vocabPath = path.join(__dirname, 'vocabulary.sample.json');
let staticVocabulary = [];
try {
  staticVocabulary = JSON.parse(fs.readFileSync(vocabPath, 'utf8'));
} catch {
  console.warn('Không đọc được vocabulary.sample.json — trả mảng rỗng.');
}

const wordSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    hanzi: String,
    pinyin: String,
    meaning: String,
    hsk: Number,
    lessonId: String,
    example: String,
    radical: String,
    radicalHint: String,
  },
  { collection: 'vocabulary' }
);

const Word = mongoose.models.Word || mongoose.model('Word', wordSchema);

async function getVocabularyFromDb() {
  if (mongoose.connection.readyState !== 1) return null;
  const docs = await Word.find().lean();
  if (!docs.length) return null;
  return docs.map(({ _id, ...rest }) => rest);
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, mongo: mongoose.connection.readyState === 1 });
});

app.get('/api/vocabulary', async (req, res) => {
  try {
    const fromDb = await getVocabularyFromDb();
    const list = fromDb?.length ? fromDb : staticVocabulary;
    const hsk = req.query.hsk ? Number(req.query.hsk) : null;
    const filtered = hsk ? list.filter((w) => w.hsk === hsk) : list;
    res.json(filtered);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'server_error' });
  }
});

const PORT = process.env.PORT || 3001;

async function boot() {
  const uri = process.env.MONGODB_URI;
  if (uri) {
    try {
      await mongoose.connect(uri);
      console.log('Đã kết nối MongoDB');
    } catch (e) {
      console.warn('MongoDB lỗi — dùng file tĩnh:', e.message);
    }
  } else {
    console.log('Không có MONGODB_URI — dùng vocabulary.sample.json');
  }

  app.listen(PORT, () => {
    console.log(`Hanzi Flow API: http://localhost:${PORT}`);
  });
}

boot();
