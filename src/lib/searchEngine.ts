import { Document, SearchResult } from '../types';
import { supabase } from './supabase';

interface SearchFilters {
  fileTypes?: string[];
  dateRange?: string;
  categories?: string[];
  confidenceScore?: number;
}

interface SearchOptions {
  limit?: number;
  offset?: number;
  sortBy?: 'relevance' | 'date' | 'title';
  sortOrder?: 'asc' | 'desc';
}

export async function searchDocuments(
  query: string,
  filters?: SearchFilters,
  options?: SearchOptions
): Promise<{ results: SearchResult[]; total: number }> {
  try {
    let queryBuilder = supabase
      .from('documents')
      .select(`
        *,
        document_categories!inner (
          categories (
            id,
            name
          )
        )
      `, { count: 'exact' });

    // Apply full-text search
    if (query) {
      queryBuilder = queryBuilder.textSearch('search_vector', query, {
        config: 'english',
        type: 'websearch'
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

      if (filters.confidenceScore) {
        queryBuilder = queryBuilder.gte('confidence_score', filters.confidenceScore);
      }
    }

    // Apply sorting
    if (options?.sortBy) {
      const order = options.sortOrder || 'desc';
      switch (options.sortBy) {
        case 'date':
          queryBuilder = queryBuilder.order('upload_date', { ascending: order === 'asc' });
          break;
        case 'title':
          queryBuilder = queryBuilder.order('title', { ascending: order === 'asc' });
          break;
        case 'relevance':
        default:
          // For relevance sorting, we rely on the full-text search ranking
          if (query) {
            queryBuilder = queryBuilder.order('ts_rank(search_vector, websearch_to_tsquery(\'english\', :query))', {
              ascending: order === 'asc',
              foreignTable: 'documents'
            });
          }
      }
    }

    // Apply pagination
    if (options?.limit) {
      queryBuilder = queryBuilder.limit(options.limit);
    }
    if (options?.offset) {
      queryBuilder = queryBuilder.range(options.offset, options.offset + (options.limit || 10) - 1);
    }

    const { data, error, count } = await queryBuilder;

    if (error) throw error;

    // Process and format search results
    const results: SearchResult[] = data.map(doc => {
      const matches = findMatches(doc.content, query);
      return {
        documentId: doc.id,
        title: doc.title,
        matches,
        score: calculateRelevanceScore(doc, query, matches)
      };
    });

    return {
      results: results.sort((a, b) => b.score - a.score),
      total: count || 0
    };
  } catch (error) {
    console.error('Search error:', error);
    throw error;
  }
}

function findMatches(content: string, query: string): { field: string; text: string; positions: number[] }[] {
  if (!query.trim() || !content) return [];

  const matches: { field: string; text: string; positions: number[] }[] = [];
  const words = query.toLowerCase().split(/\s+/);
  const contentLower = content.toLowerCase();

  words.forEach(word => {
    let pos = -1;
    const positions: number[] = [];

    while ((pos = contentLower.indexOf(word, pos + 1)) !== -1) {
      positions.push(pos);
    }

    if (positions.length > 0) {
      // Extract context around each match
      positions.forEach(position => {
        const start = Math.max(0, position - 50);
        const end = Math.min(content.length, position + word.length + 50);
        let text = content.slice(start, end);

        // Add ellipsis if we're not at the start/end
        if (start > 0) text = '...' + text;
        if (end < content.length) text = text + '...';

        matches.push({
          field: 'content',
          text,
          positions: [position - start]
        });
      });
    }
  });

  return matches;
}

function calculateRelevanceScore(doc: Document, query: string, matches: any[]): number {
  let score = 0;

  // Base score from confidence score
  score += doc.confidenceScore * 0.3;

  // Title match bonus
  if (doc.title.toLowerCase().includes(query.toLowerCase())) {
    score += 0.3;
  }

  // Recent document bonus
  const daysSinceUpload = (Date.now() - doc.uploadDate.getTime()) / (1000 * 60 * 60 * 24);
  score += Math.max(0, 0.2 * (1 - daysSinceUpload / 365)); // Bonus decreases over time

  // Number of matches bonus
  score += Math.min(0.2, matches.length * 0.02);

  return Math.min(1, score);
}

export function highlightSearchResults(text: string, query: string): string {
  if (!query.trim()) return text;

  const words = query.toLowerCase().split(/\s+/);
  let highlightedText = text;

  words.forEach(word => {
    const regex = new RegExp(`(${word})`, 'gi');
    highlightedText = highlightedText.replace(regex, '<mark>$1</mark>');
  });

  return highlightedText;
}