/*
  # Document Management Schema Setup

  1. New Tables
    - `documents`
      - `id` (uuid, primary key)
      - `title` (text)
      - `file_type` (text)
      - `file_size` (bigint)
      - `content` (text)
      - `confidence_score` (float)
      - `url` (text)
      - `thumbnail_url` (text)
      - `upload_date` (timestamptz)
      - `last_modified` (timestamptz)
      - `user_id` (uuid, foreign key to auth.users)

    - `categories`
      - `id` (uuid, primary key)
      - `name` (text)
      - `parent` (uuid, self-referential foreign key)

    - `document_categories`
      - `id` (uuid, primary key)
      - `document_id` (uuid, foreign key to documents)
      - `category_id` (uuid, foreign key to categories)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  file_type text,
  file_size bigint,
  content text,
  confidence_score float,
  url text,
  thumbnail_url text,
  upload_date timestamptz DEFAULT now(),
  last_modified timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  CONSTRAINT valid_confidence_score CHECK (confidence_score >= 0 AND confidence_score <= 1)
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  parent uuid REFERENCES categories(id) ON DELETE SET NULL
);

-- Create document_categories junction table
CREATE TABLE IF NOT EXISTS document_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid REFERENCES documents(id) ON DELETE CASCADE,
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  UNIQUE(document_id, category_id)
);

-- Enable RLS
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_categories ENABLE ROW LEVEL SECURITY;

-- Documents policies
CREATE POLICY "Users can manage their own documents"
  ON documents
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Categories policies (all authenticated users can read, only admins can modify)
CREATE POLICY "All users can read categories"
  ON categories
  FOR SELECT
  TO authenticated
  USING (true);

-- Document categories policies
CREATE POLICY "Users can manage document categories for their documents"
  ON document_categories
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM documents
      WHERE documents.id = document_categories.document_id
      AND documents.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM documents
      WHERE documents.id = document_categories.document_id
      AND documents.user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_documents_user_id ON documents(user_id);
CREATE INDEX IF NOT EXISTS idx_document_categories_document_id ON document_categories(document_id);
CREATE INDEX IF NOT EXISTS idx_document_categories_category_id ON document_categories(category_id);
CREATE INDEX IF NOT EXISTS idx_categories_parent ON categories(parent);