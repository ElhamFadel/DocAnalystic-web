import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Clock, 
  XCircle, 
  Target, 
  Sliders
} from 'lucide-react';
import { useDocuments } from '../../contexts/DocumentContext';
import SearchResults from './SearchResults';

const SearchPage: React.FC = () => {
  const { searchQuery, setSearchQuery, documents, searchDocuments } = useDocuments();
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [searchHistory] = useState<string[]>([
    'financial report', 
    'marketing strategy', 
    'legal documents',
    'technical specifications'
  ]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [filters, setFilters] = useState({
    fileTypes: ['pdf', 'docx'],
    dateRange: 'all',
    categories: [] as string[]
  });

  useEffect(() => {
    if (searchQuery) {
      setLocalQuery(searchQuery);
      handleSearch();
    }
  }, [searchQuery]);

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (localQuery.trim()) {
      setSearchQuery(localQuery);
      await searchDocuments(localQuery, filters);
    }
  };

  const handleFilterChange = (type: string, value: string) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      
      switch (type) {
        case 'fileType':
          newFilters.fileTypes = prev.fileTypes.includes(value)
            ? prev.fileTypes.filter(t => t !== value)
            : [...prev.fileTypes, value];
          break;
        case 'dateRange':
          newFilters.dateRange = value;
          break;
        case 'category':
          newFilters.categories = prev.categories.includes(value)
            ? prev.categories.filter(c => c !== value)
            : [...prev.categories, value];
          break;
      }
      
      return newFilters;
    });
  };

  const handleApplyFilters = () => {
    if (localQuery.trim()) {
      handleSearch();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <h1 className="text-2xl font-serif font-semibold text-gray-800">Search Documents</h1>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                <Search className="w-5 h-5 text-gray-500" />
              </div>
              <input
                type="search"
                className="block p-4 pl-10 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Search for documents, content, or keywords..."
                value={localQuery}
                onChange={(e) => setLocalQuery(e.target.value)}
              />
              <button
                type="submit"
                className="text-white absolute right-2.5 bottom-2.5 bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2"
              >
                Search
              </button>
            </div>
          </form>
          
          <div className="mt-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center text-sm text-gray-700 hover:text-primary-600"
              >
                <Sliders size={14} className="mr-1" />
                {showAdvanced ? 'Hide' : 'Show'} Advanced Filters
              </button>
            </div>
            
            {localQuery && (
              <button
                onClick={() => {
                  setLocalQuery('');
                  setSearchQuery('');
                }}
                className="flex items-center text-sm text-gray-500 hover:text-gray-700"
              >
                <XCircle size={14} className="mr-1" />
                Clear Search
              </button>
            )}
          </div>
          
          {showAdvanced && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-4 pt-4 border-t"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">File Type</label>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        id="pdf"
                        type="checkbox"
                        checked={filters.fileTypes.includes('pdf')}
                        onChange={() => handleFilterChange('fileType', 'pdf')}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <label htmlFor="pdf" className="ml-2 text-sm text-gray-700">PDF Documents</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="docx"
                        type="checkbox"
                        checked={filters.fileTypes.includes('docx')}
                        onChange={() => handleFilterChange('fileType', 'docx')}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <label htmlFor="docx" className="ml-2 text-sm text-gray-700">Word Documents</label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                  <select
                    value={filters.dateRange}
                    onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                  >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="year">This Year</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Categories</label>
                  <select
                    multiple
                    value={filters.categories}
                    onChange={(e) => {
                      const options = Array.from(e.target.selectedOptions, option => option.value);
                      setFilters(prev => ({ ...prev, categories: options }));
                    }}
                    className="form-multiselect block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50"
                  >
                    {documents.reduce((categories, doc) => {
                      doc.categories.forEach(cat => {
                        if (!categories.includes(cat.name)) {
                          categories.push(cat.name);
                        }
                      });
                      return categories;
                    }, [] as string[]).map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={handleApplyFilters}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b">
              <h2 className="text-lg font-medium text-gray-800">Search History</h2>
            </div>
            <div className="p-4">
              {searchHistory.length > 0 ? (
                <ul className="space-y-2">
                  {searchHistory.map((query, index) => (
                    <li key={index}>
                      <button
                        onClick={() => {
                          setLocalQuery(query);
                          setSearchQuery(query);
                        }}
                        className="flex items-center text-sm text-gray-600 hover:text-primary-600"
                      >
                        <Clock size={14} className="mr-2" />
                        {query}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">No recent searches</p>
              )}
            </div>
          </div>
          
          <div className="mt-6 bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b">
              <h2 className="text-lg font-medium text-gray-800">Popular Searches</h2>
            </div>
            <div className="p-4">
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => {
                      setLocalQuery('quarterly report');
                      setSearchQuery('quarterly report');
                    }}
                    className="flex items-center text-sm text-gray-600 hover:text-primary-600"
                  >
                    <Target size={14} className="mr-2" />
                    quarterly report
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setLocalQuery('policy update');
                      setSearchQuery('policy update');
                    }}
                    className="flex items-center text-sm text-gray-600 hover:text-primary-600"
                  >
                    <Target size={14} className="mr-2" />
                    policy update
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setLocalQuery('contract template');
                      setSearchQuery('contract template');
                    }}
                    className="flex items-center text-sm text-gray-600 hover:text-primary-600"
                  >
                    <Target size={14} className="mr-2" />
                    contract template
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-3">
          <SearchResults />
        </div>
      </div>
    </motion.div>
  );
};

export default SearchPage;