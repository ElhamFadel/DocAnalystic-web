/*
  # Add Arabic Language Support for Document Search

  1. Changes
    - Add language column to documents table
    - Update search vector generation function to handle both English and Arabic
    - Update existing documents with new search vector format

  2. Details
    - Uses simple text search configuration for Arabic
    - Maintains existing English search capabilities
    - Handles both languages in the same search vector
*/

-- Add language column if it doesn't exist
ALTER TABLE documents 
ADD COLUMN IF NOT EXISTS language varchar(2) DEFAULT 'en';

-- Update search vector generation function to handle both English and Arabic
CREATE OR REPLACE FUNCTION documents_search_vector_update() RETURNS trigger AS $$
BEGIN
  IF NEW.language = 'ar' THEN
    NEW.search_vector :=
      setweight(to_tsvector('simple', COALESCE(NEW.title, '')), 'A') ||
      setweight(to_tsvector('simple', COALESCE(NEW.content, '')), 'B');
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
      setweight(to_tsvector('simple', COALESCE(title, '')), 'A') ||
      setweight(to_tsvector('simple', COALESCE(content, '')), 'B')
    ELSE
      setweight(to_tsvector('english', COALESCE(title, '')), 'A') ||
      setweight(to_tsvector('english', COALESCE(content, '')), 'B')
  END;