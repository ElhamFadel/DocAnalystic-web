import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Document, UploadProgress, SearchResult } from '../types';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

interface DocumentContextType {
  documents: Document[];
  categories: { id: string; name: string; parent?: string; children?: string[] }[];
  uploadProgress: UploadProgress[];
  searchResults: SearchResult[];
  searchQuery: string;
  sortOption: string;
  filterCategory: string;
  addDocument: (document: Document) => Promise<void>;
  removeDocument: (id: string) => Promise<void>;
  updateDocument: (document: Document) => Promise<void>;
  addUploadProgress: (progress: UploadProgress) => void;
  updateUploadProgress: (filename: string, progress: Partial<UploadProgress>) => void;
  setSearchResults: (results: SearchResult[]) => void;
  setSearchQuery: (query: string) => void;
  setSortOption: (option: string) => void;
  setFilterCategory: (category: string) => void;
  searchDocuments: (query: string, filters?: {
    fileTypes?: string[];
    dateRange?: string;
    categories?: string[];
  }) => Promise<void>;
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

export const DocumentProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string; parent?: string; children?: string[] }[]>([]);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('date-desc');
  const [filterCategory, setFilterCategory] = useState('');

  useEffect(() => {
    if (user) {
      fetchDocuments();
      fetchCategories();
    }
  }, [user]);

  const fetchDocuments = async () => {
    const { data, error } = await supabase
      .from('documents')
      .select(`
        *,
        document_categories (
          category_id,
          categories (
            id,
            name
          )
        )
      `);

    if (error) {
      console.error('Error fetching documents:', error);
      return;
    }

    const formattedDocs = data.map(doc => ({
      ...doc,
      uploadDate: new Date(doc.upload_date),
      lastModified: new Date(doc.last_modified),
      categories: doc.document_categories.map((dc: any) => ({
        id: dc.categories.id,
        name: dc.categories.name
      }))
    }));

    setDocuments(formattedDocs);
  };

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*');

    if (error) {
      console.error('Error fetching categories:', error);
      return;
    }

    setCategories(data);
  };

  const addDocument = async (document: Document) => {
    const { data, error } = await supabase
      .from('documents')
      .insert([{
        title: document.title,
        file_type: document.fileType,
        file_size: document.fileSize,
        content: document.content,
        confidence_score: document.confidenceScore,
        url: document.url,
        thumbnail_url: document.thumbnailUrl,
        user_id: user?.id
      }])
      .select()
      .single();

    if (error) {
      console.error('Error adding document:', error);
      return;
    }

    if (document.categories.length > 0) {
      const categoryLinks = document.categories.map(cat => ({
        document_id: data.id,
        category_id: cat.id
      }));

      const { error: linkError } = await supabase
        .from('document_categories')
        .insert(categoryLinks);

      if (linkError) {
        console.error('Error linking categories:', linkError);
      }
    }

    await fetchDocuments();
  };

  const removeDocument = async (id: string) => {
    const { error } = await supabase
      .from('documents')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error removing document:', error);
      return;
    }

    await fetchDocuments();
  };

  const updateDocument = async (document: Document) => {
    const { error } = await supabase
      .from('documents')
      .update({
        title: document.title,
        content: document.content,
        confidence_score: document.confidenceScore,
        last_modified: new Date().toISOString()
      })
      .eq('id', document.id);

    if (error) {
      console.error('Error updating document:', error);
      return;
    }

    const { error: deleteError } = await supabase
      .from('document_categories')
      .delete()
      .eq('document_id', document.id);

    if (deleteError) {
      console.error('Error removing old categories:', deleteError);
      return;
    }

    if (document.categories.length > 0) {
      const categoryLinks = document.categories.map(cat => ({
        document_id: document.id,
        category_id: cat.id
      }));

      const { error: linkError } = await supabase
        .from('document_categories')
        .insert(categoryLinks);

      if (linkError) {
        console.error('Error linking new categories:', linkError);
      }
    }

    await fetchDocuments();
  };

  const addUploadProgress = (progress: UploadProgress) => {
    setUploadProgress(prev => [...prev, progress]);
  };

  const updateUploadProgress = (filename: string, progress: Partial<UploadProgress>) => {
    setUploadProgress(prev =>
      prev.map(item =>
        item.filename === filename ? { ...item, ...progress } : item
      )
    );
  };

  const searchDocuments = async (query: string, filters?: {
    fileTypes?: string[];
    dateRange?: string;
    categories?: string[];
  }) => {
    try {
      // Format the search query for tsquery
      const formattedQuery = query
        .trim()
        .split(/\s+/)
        .map(term => term + ':*') // Add prefix matching
        .join(' & '); // Use AND operator between terms

      let queryBuilder = supabase
        .from('documents')
        .select(`
          *,
          document_categories (
            category_id,
            categories (
              id,
              name
            )
          )
        `);

      // Apply text search if query is not empty
      if (formattedQuery) {
        queryBuilder = queryBuilder.textSearch('search_vector', formattedQuery, {
          type: 'websearch',
          config: 'english'
        });
      }

      // Apply filters
      if (filters) {
        if (filters.fileTypes?.length) {
          queryBuilder = queryBuilder.in('file_type', filters.fileTypes);
        }

        if (filters.dateRange) {
          const now = new Date();
          let startDate = new Date();

          switch (filters.dateRange) {
            case 'today':
              startDate.setHours(0, 0, 0, 0);
              break;
            case 'week':
              startDate.setDate(now.getDate() - 7);
              break;
            case 'month':
              startDate.setMonth(now.getMonth() - 1);
              break;
            case 'year':
              startDate.setFullYear(now.getFullYear() - 1);
              break;
          }

          if (filters.dateRange !== 'all') {
            queryBuilder = queryBuilder.gte('upload_date', startDate.toISOString());
          }
        }

        if (filters.categories?.length) {
          queryBuilder = queryBuilder.in('document_categories.categories.name', filters.categories);
        }
      }

      const { data, error } = await queryBuilder;

      if (error) {
        console.error('Error searching documents:', error);
        return;
      }

      const formattedResults = data.map(doc => ({
        documentId: doc.id,
        title: doc.title,
        matches: [{
          field: 'content',
          text: doc.content,
          positions: [doc.content.toLowerCase().indexOf(query.toLowerCase())]
        }],
        score: doc.confidence_score
      }));

      setSearchResults(formattedResults);
    } catch (error) {
      console.error('Error during search:', error);
    }
  };

  const value = {
    documents,
    categories,
    uploadProgress,
    searchResults,
    searchQuery,
    sortOption,
    filterCategory,
    addDocument,
    removeDocument,
    updateDocument,
    addUploadProgress,
    updateUploadProgress,
    setSearchResults,
    setSearchQuery,
    setSortOption,
    setFilterCategory,
    searchDocuments,
  };

  return (
    <DocumentContext.Provider value={value}>
      {children}
    </DocumentContext.Provider>
  );
};

export const useDocuments = () => {
  const context = useContext(DocumentContext);
  if (context === undefined) {
    throw new Error('useDocuments must be used within a DocumentProvider');
  }
  return context;
};