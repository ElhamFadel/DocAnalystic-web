/*
  # Create documents table and related schemas

  1. New Tables
    - `documents`
      - `id` (uuid, primary key)
      - `title` (text)
      - `file_type` (text)
      - `file_size` (bigint)
      - `upload_date` (timestamptz)
      - `last_modified` (timestamptz)
      - `content` (text)
      - `confidence_score` (real)
      - `url` (text)
      - `thumbnail_url` (text)
      - `user_id` (uuid, foreign key to auth.users)
    
    - `categories`
      - `id` (uuid, primary key)
      - `name` (text)
      - `parent_id` (uuid, self-referential foreign key)
    
    - `document_categories`
      - Junction table for documents and categories
      - Enables many-to-many relationship

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  file_type text NOT NULL,
  file_size bigint NOT NULL,
  upload_date timestamptz DEFAULT now(),
  last_modified timestamptz DEFAULT now(),
  content text,
  confidence_score real DEFAULT 0,
  url text,
  thumbnail_url text,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  parent_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create junction table for document categories
CREATE TABLE IF NOT EXISTS document_categories (
  document_id uuid REFERENCES documents(id) ON DELETE CASCADE,
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (document_id, category_id)
);

-- Enable RLS
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_categories ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own documents"
  ON documents
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own documents"
  ON documents
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own documents"
  ON documents
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own documents"
  ON documents
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Categories are readable by all authenticated users
CREATE POLICY "Categories are readable by authenticated users"
  ON categories
  FOR SELECT
  TO authenticated
  USING (true);

-- Document categories are readable by document owners
CREATE POLICY "Document categories are readable by document owners"
  ON document_categories
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM documents
      WHERE documents.id = document_categories.document_id
      AND documents.user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_documents_user_id ON documents(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_upload_date ON documents(upload_date);
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_document_categories_document_id ON document_categories(document_id);
CREATE INDEX IF NOT EXISTS idx_document_categories_category_id ON document_categories(category_id);