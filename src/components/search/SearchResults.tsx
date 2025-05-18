import React from 'react';
import { motion } from 'framer-motion';
import { File as FilePdf, FileText as FileDocx, Clock, Tag, ArrowUpRight, Calendar, Download, Eye, Search } from 'lucide-react';
import { useDocuments } from '../../contexts/DocumentContext';
import { formatDate, formatBytes } from '../../utils/mockData';

const SearchResults: React.FC = () => {
  const { searchResults, searchQuery, documents } = useDocuments();
  
  if (!searchQuery) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-primary-100">
          <Search className="h-6 w-6 text-primary-600" />
        </div>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No search query</h3>
        <p className="mt-1 text-sm text-gray-500">
          Enter a search term to find documents.
        </p>
      </div>
    );
  }
  
  if (searchResults.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100">
          <SearchOff className="h-6 w-6 text-gray-600" />
        </div>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No results found</h3>
        <p className="mt-1 text-sm text-gray-500">
          We couldn't find any documents matching "{searchQuery}".
        </p>
        <div className="mt-6">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Clear search
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-800">
          {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'} for "{searchQuery}"
        </h2>
        <div className="text-sm text-gray-500">
          Showing {Math.min(searchResults.length, 10)} of {searchResults.length}
        </div>
      </div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="divide-y divide-gray-200"
      >
        {searchResults.map((result, index) => {
          const document = documents.find(doc => doc.id === result.documentId);
          if (!document) return null;
          
          const highlightText = (text: string, term: string) => {
            if (!term.trim()) return text;
            
            const regex = new RegExp(`(${term})`, 'gi');
            const parts = text.split(regex);
            
            return parts.map((part, i) => 
              regex.test(part) ? <mark key={i} className="bg-yellow-200">{part}</mark> : part
            );
          };
          
          // Extract a snippet from the content around the search term
          const getSnippet = (content: string, term: string, maxLength = 200) => {
            const lowerContent = content.toLowerCase();
            const lowerTerm = term.toLowerCase();
            const termIndex = lowerContent.indexOf(lowerTerm);
            
            if (termIndex === -1) return content.substring(0, maxLength) + '...';
            
            let start = Math.max(0, termIndex - 60);
            let end = Math.min(content.length, termIndex + term.length + 60);
            
            // Adjust to not cut words
            while (start > 0 && content[start] !== ' ') start--;
            while (end < content.length && content[end] !== ' ') end++;
            
            let snippet = '';
            if (start > 0) snippet += '...';
            snippet += content.substring(start, end);
            if (end < content.length) snippet += '...';
            
            return snippet;
          };
          
          return (
            <motion.div
              key={result.documentId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-6 hover:bg-gray-50"
            >
              <div className="flex">
                <div className="flex-shrink-0 mr-4">
                  {document.thumbnailUrl ? (
                    <img 
                      className="h-16 w-16 rounded object-cover" 
                      src={document.thumbnailUrl}
                      alt={document.title} 
                    />
                  ) : (
                    <div className="h-16 w-16 rounded bg-gray-100 flex items-center justify-center">
                      {document.fileType === 'pdf' ? (
                        <FilePdf size={24} className="text-error-600" />
                      ) : (
                        <FileDocx size={24} className="text-primary-600" />
                      )}
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-medium text-gray-900">
                      {highlightText(document.title, searchQuery)}
                    </h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      document.fileType === 'pdf' 
                        ? 'bg-error-100 text-error-800' 
                        : 'bg-primary-100 text-primary-800'
                    }`}>
                      {document.fileType?.toUpperCase() || 'UNKNOWN'}
                    </span>
                  </div>
                  
                  <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar size={14} className="mr-1" />
                      <span>{formatDate(document.uploadDate)}</span>
                    </div>
                    <div className="flex items-center">
                      <Tag size={14} className="mr-1" />
                      <span>{document.categories.map(cat => cat.name).join(', ')}</span>
                    </div>
                    <div>
                      {formatBytes(document.fileSize)}
                    </div>
                  </div>
                  
                  <p className="mt-2 text-sm text-gray-600">
                    {highlightText(getSnippet(document.content, searchQuery), searchQuery)}
                  </p>
                  
                  <div className="mt-3 flex space-x-2">
                    <button className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                      <Eye size={12} className="mr-1" />
                      View
                    </button>
                    <button className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                      <Download size={12} className="mr-1" />
                      Download
                    </button>
                    <button className="inline-flex items-center px-2.5 py-1.5 border border-transparent shadow-sm text-xs font-medium rounded text-primary-700 bg-primary-50 hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                      View in context
                      <ArrowUpRight size={12} className="ml-1" />
                    </button>
                  </div>
                </div>
                
                <div className="flex-shrink-0 ml-4 flex flex-col items-end space-y-2">
                  <div className="flex items-center">
                    <div className="w-12 bg-gray-200 rounded-full h-1.5 mr-1">
                      <div 
                        className="h-1.5 rounded-full bg-primary-600"
                        style={{ width: `${result.score * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-600">
                      {Math.round(result.score * 100)}%
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 flex items-center">
                    <Clock size={10} className="mr-1" />
                    Relevance
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
      
      {searchResults.length > 10 && (
        <div className="px-6 py-4 border-t flex items-center justify-center">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Load more results
          </button>
        </div>
      )}
    </div>
  );
};

// This is a simple component to avoid importing the lucide-react icon
const SearchOff = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="m18 18-6-6m-3-3L3 3m5 5-5 5m11-11 5 5M10.5 13.5a3 3 0 0 0 3.5 3.5M10.5 13.5 7 10m3.5 3.5L17 17m-6.5-3.5-5-5 5 5z" />
  </svg>
);

export default SearchResults;