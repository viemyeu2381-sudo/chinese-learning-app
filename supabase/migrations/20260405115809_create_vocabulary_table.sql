/*
  # Create vocabulary table for Chinese learning app

  1. New Tables
    - `vocabulary`
      - `id` (uuid, primary key)
      - `chinese` (text) - Chinese simplified characters
      - `pinyin` (text) - Pinyin pronunciation
      - `meaning` (text) - Vietnamese meaning
      - `hsk_level` (integer) - HSK level 1-6
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on `vocabulary` table
    - Add policy for public read access (anyone can view vocabulary)
    - Add policy for authenticated users to insert/update/delete
*/

CREATE TABLE IF NOT EXISTS vocabulary (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chinese text NOT NULL,
  pinyin text NOT NULL,
  meaning text NOT NULL,
  hsk_level integer DEFAULT 1 CHECK (hsk_level >= 1 AND hsk_level <= 6),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE vocabulary ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view vocabulary"
  ON vocabulary
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert vocabulary"
  ON vocabulary
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update vocabulary"
  ON vocabulary
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete vocabulary"
  ON vocabulary
  FOR DELETE
  USING (true);

CREATE INDEX IF NOT EXISTS idx_vocabulary_hsk_level ON vocabulary(hsk_level);
CREATE INDEX IF NOT EXISTS idx_vocabulary_chinese ON vocabulary(chinese);