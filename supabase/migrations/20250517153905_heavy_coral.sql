/*
  # Add Arabic language support

  1. Changes
    - Add language column to documents table
    - Create Arabic text search configuration
    - Update search vector to support both English and Arabic
    - Add Arabic stopwords

  2. Security
    - No changes to RLS policies required
*/

-- Create Arabic text search configuration
CREATE TEXT SEARCH CONFIGURATION public.arabic ( COPY = pg_catalog.simple );

-- Add Arabic stop words
CREATE OR REPLACE FUNCTION install_arabic_stop_words() RETURNS void AS $$
BEGIN
  -- Common Arabic stop words
  INSERT INTO pg_catalog.pg_ts_config_map (mapcfg, maptokentype, mapseqno, mapdict)
  SELECT 
    'arabic'::regconfig,
    1,
    1,
    'simple'::regdictionary
  WHERE NOT EXISTS (
    SELECT 1 FROM pg_catalog.pg_ts_config_map
    WHERE mapcfg = 'arabic'::regconfig
  );
END;
$$ LANGUAGE plpgsql;

SELECT install_arabic_stop_words();

-- Add language column to documents table
ALTER TABLE documents 
ADD COLUMN IF NOT EXISTS language varchar(2) DEFAULT 'en';

-- Update search vector generation function to handle both English and Arabic
CREATE OR REPLACE FUNCTION documents_search_vector_update() RETURNS trigger AS $$
BEGIN
  IF NEW.language = 'ar' THEN
    NEW.search_vector :=
      setweight(to_tsvector('arabic', COALESCE(NEW.title, '')), 'A') ||
      setweight(to_tsvector('arabic', COALESCE(NEW.content, '')), 'B');
  ELSE
    NEW.search_vector :=
      setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
      setweight(to_tsvector('english', COALESCE(NEW.content, '')), 'B');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Update existing documents
UPDATE documents SET search_vector = 
  CASE 
    WHEN language = 'ar' THEN
      setweight(to_tsvector('arabic', COALESCE(title, '')), 'A') ||
      setweight(to_tsvector('arabic', COALESCE(content, '')), 'B')
    ELSE
      setweight(to_tsvector('english', COALESCE(title, '')), 'A') ||
      setweight(to_tsvector('english', COALESCE(content, '')), 'B')
  END;