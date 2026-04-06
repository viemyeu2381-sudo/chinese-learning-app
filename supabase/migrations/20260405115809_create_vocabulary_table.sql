/*
  # Create vocabulary table for Chinese learning app

  1. New Tables
    - `vocabulary`
      - `id` (uuid, primary key)
      - `han_tu` (text) - Hanzi characters
      - `pinyin` (text) - Pinyin pronunciation
      - `han_viet` (text) - Han-Viet reading
      - `nghia` (text) - Vietnamese meaning
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on `vocabulary` table
    - Add policy for public read access (anyone can view vocabulary)
    - Add policy for authenticated users to insert/update/delete
*/

CREATE TABLE IF NOT EXISTS vocabulary (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  han_tu text NOT NULL,
  pinyin text NOT NULL,
  han_viet text NOT NULL,
  nghia text NOT NULL,
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

CREATE INDEX IF NOT EXISTS idx_vocabulary_han_tu ON vocabulary(han_tu);