import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Filter, 
  Plus,
  Tag,
  FileText,
  BarChart4,
  PieChart
} from 'lucide-react';
import { useDocuments } from '../../contexts/DocumentContext';
import CategoryTree from './CategoryTree';
import ClassificationAccuracy from './ClassificationAccuracy';
import DocumentsByCategory from './DocumentsByCategory';

const ClassificationPage: React.FC = () => {
  const { categories, documents } = useDocuments();
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  
  const categoryDocumentCounts = categories.map(cat => ({
    id: cat.id,
    name: cat.name,
    count: documents.filter(doc => 
      doc.categories.some(docCat => docCat.id === cat.id)
    ).length
  }));
  
  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      // In a real implementation, this would call an API to add the category
      alert(`Adding new category: ${newCategoryName}`);
      setNewCategoryName('');
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-serif font-semibold text-gray-800">Document Classification</h1>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center">
            <input
              type="text"
              placeholder="New category name"
              className="border border-gray-300 rounded-l-md px-3 py-2 text-sm"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
            />
            <button
              onClick={handleAddCategory}
              className="bg-primary-600 text-white rounded-r-md px-3 py-2 text-sm font-medium hover:bg-primary-700"
            >
              <Plus size={16} />
            </button>
          </div>
          
          <button className="flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
            <Filter size={16} className="mr-2" />
            Manage Categories
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
              <div className="flex items-center">
                <Tag size={18} className="text-primary-600 mr-2" />
                <h2 className="text-lg font-medium text-gray-800">Categories</h2>
              </div>
              <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {categories.length}
              </span>
            </div>
            
            <div className="p-4">
              <CategoryTree 
                categories={categories} 
                documentCounts={categoryDocumentCounts}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />
            </div>
          </div>
          
          <div className="mt-6 bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b bg-gray-50 flex items-center">
              <BarChart4 size={18} className="text-primary-600 mr-2" />
              <h2 className="text-lg font-medium text-gray-800">Classification Accuracy</h2>
            </div>
            
            <div className="p-4">
              <ClassificationAccuracy />
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
              <div className="flex items-center">
                <FileText size={18} className="text-primary-600 mr-2" />
                <h2 className="text-lg font-medium text-gray-800">
                  {selectedCategory ? `Documents in "${selectedCategory}"` : 'All Classified Documents'}
                </h2>
              </div>
              <div>
                <select
                  className="text-sm border-gray-300 rounded-md shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50"
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  value={selectedCategory}
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="p-4">
              <DocumentsByCategory 
                selectedCategory={selectedCategory} 
                documents={documents}
              />
            </div>
          </div>
          
          <div className="mt-6 bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b bg-gray-50 flex items-center">
              <PieChart size={18} className="text-primary-600 mr-2" />
              <h2 className="text-lg font-medium text-gray-800">Category Distribution</h2>
            </div>
            
            <div className="p-4 h-64">
              <DocumentsByCategory.Chart 
                categories={categories}
                documents={documents}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ClassificationPage;