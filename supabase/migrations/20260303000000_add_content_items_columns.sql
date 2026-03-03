-- Add story/glossary content columns to content_items
ALTER TABLE public.content_items
  ADD COLUMN IF NOT EXISTS preview_en text,
  ADD COLUMN IF NOT EXISTS preview_or text,
  ADD COLUMN IF NOT EXISTS character_name text,
  ADD COLUMN IF NOT EXISTS character_profession_en text,
  ADD COLUMN IF NOT EXISTS character_profession_or text;

-- slug UNIQUE constraint already exists from initial migration
