import React, { useState } from 'react';
import { motion } from 'framer-motion';
import DocumentUpload from './DocumentUpload';
import DocumentList from './DocumentList';
import { 
  Upload, 
  Filter, 
  SortDesc,
  Grid,
  List
} from 'lucide-react';
import { useDocuments } from '../../contexts/DocumentContext';

const DocumentsPage: React.FC = () => {
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { setSortOption, setFilterCategory, categories } = useDocuments();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-serif font-semibold text-gray-800">Documents</h1>
        
        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <select 
              className="appearance-none bg-white border border-gray-200 text-gray-700 py-2 px-3 pr-8 rounded leading-tight focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              onChange={(e) => setFilterCategory(e.target.value)}
              defaultValue=""
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <Filter size={16} />
            </div>
          </div>
          
          <div className="relative">
            <select 
              className="appearance-none bg-white border border-gray-200 text-gray-700 py-2 px-3 pr-8 rounded leading-tight focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              onChange={(e) => setSortOption(e.target.value)}
              defaultValue="date-desc"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="size-desc">Size (Largest)</option>
              <option value="size-asc">Size (Smallest)</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <SortDesc size={16} />
            </div>
          </div>
          
          <div className="flex rounded border border-gray-200 bg-white">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-gray-100 text-primary-600' : 'text-gray-600'}`}
              aria-label="Grid view"
            >
              <Grid size={18} />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-gray-100 text-primary-600' : 'text-gray-600'}`}
              aria-label="List view"
            >
              <List size={18} />
            </button>
          </div>
          
          <button 
            onClick={() => setUploadModalOpen(true)}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Upload size={16} className="mr-2" />
            Upload
          </button>
        </div>
      </div>

      <DocumentList viewMode={viewMode} />
      
      {uploadModalOpen && (
        <DocumentUpload onClose={() => setUploadModalOpen(false)} />
      )}
    </motion.div>
  );
};

export default DocumentsPage;