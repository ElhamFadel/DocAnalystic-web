import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, FolderOpen, Folder } from 'lucide-react';
import { Category } from '../../types';

interface CategoryTreeProps {
  categories: Category[];
  documentCounts: {
    id: string;
    name: string;
    count: number;
  }[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const CategoryTree: React.FC<CategoryTreeProps> = ({ 
  categories, 
  documentCounts,
  selectedCategory,
  onSelectCategory
}) => {
  const [expandedCategories, setExpandedCategories] = React.useState<string[]>([]);
  
  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };
  
  const renderCategory = (category: Category, level = 0) => {
    const isExpanded = expandedCategories.includes(category.id);
    const hasChildren = category.children && category.children.length > 0;
    const count = documentCounts.find(dc => dc.id === category.id)?.count || 0;
    const isSelected = category.name === selectedCategory;
    
    return (
      <div key={category.id}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className={`flex items-center py-2 px-2 rounded-md cursor-pointer ${
            isSelected ? 'bg-primary-50 text-primary-700' : 'hover:bg-gray-100'
          }`}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
          onClick={() => onSelectCategory(category.name)}
        >
          {hasChildren ? (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                toggleCategory(category.id);
              }}
              className="p-1 mr-1 rounded-full hover:bg-gray-200"
            >
              <ChevronRight
                size={16}
                className={`transition-transform ${isExpanded ? 'transform rotate-90' : ''}`}
              />
            </button>
          ) : (
            <span className="w-6"></span>
          )}
          
          {isExpanded ? (
            <FolderOpen size={18} className="text-primary-500 mr-2" />
          ) : (
            <Folder size={18} className="text-primary-500 mr-2" />
          )}
          
          <span className="text-sm flex-1">{category.name}</span>
          
          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
            {count}
          </span>
        </motion.div>
        
        {isExpanded && hasChildren && (
          <div>
            {categories
              .filter(cat => category.children?.includes(cat.id))
              .map(childCat => renderCategory(childCat, level + 1))
            }
          </div>
        )}
      </div>
    );
  };
  
  // Get top-level categories (those without parents)
  const topLevelCategories = categories.filter(cat => !cat.parent);
  
  return (
    <div className="space-y-1">
      {topLevelCategories.map(category => renderCategory(category))}
    </div>
  );
};

export default CategoryTree;