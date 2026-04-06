/*
  # Redesign vocabulary columns

  Upgrade existing `vocabulary` table to the new structure:
  - chinese -> han_tu
  - meaning -> nghia
  - add han_viet
  - remove hsk_level
*/

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'vocabulary' AND column_name = 'chinese'
  ) THEN
    ALTER TABLE vocabulary RENAME COLUMN chinese TO han_tu;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'vocabulary' AND column_name = 'meaning'
  ) THEN
    ALTER TABLE vocabulary RENAME COLUMN meaning TO nghia;
  END IF;
END $$;

ALTER TABLE vocabulary
  ADD COLUMN IF NOT EXISTS han_viet text;

UPDATE vocabulary
SET han_viet = COALESCE(han_viet, '')
WHERE han_viet IS NULL;

ALTER TABLE vocabulary
  ALTER COLUMN han_viet SET NOT NULL;

ALTER TABLE vocabulary
  DROP COLUMN IF EXISTS hsk_level;

DROP INDEX IF EXISTS idx_vocabulary_chinese;
DROP INDEX IF EXISTS idx_vocabulary_hsk_level;
CREATE INDEX IF NOT EXISTS idx_vocabulary_han_tu ON vocabulary(han_tu);
