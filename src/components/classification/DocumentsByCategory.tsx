import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { FileText, File as FilePdf, FileText as FileDocx, Eye, Download } from 'lucide-react';
import { Document, Category } from '../../types';
import { formatDate, formatBytes } from '../../utils/mockData';

interface DocumentsByCategoryProps {
  selectedCategory: string;
  documents: Document[];
}

const DocumentsByCategory: React.FC<DocumentsByCategoryProps> = ({ 
  selectedCategory, 
  documents 
}) => {
  // Filter documents by selected category
  const filteredDocuments = selectedCategory
    ? documents.filter(doc => 
        doc.categories.some(cat => cat.name === selectedCategory)
      )
    : documents;
  
  if (filteredDocuments.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText size={36} className="mx-auto text-gray-300 mb-3" />
        <h3 className="text-lg font-medium text-gray-900">No documents found</h3>
        <p className="mt-1 text-sm text-gray-500">
          {selectedCategory 
            ? `There are no documents in the "${selectedCategory}" category.`
            : 'There are no classified documents.'}
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Document
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Size
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Confidence
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredDocuments.map((doc, index) => (
              <motion.tr
                key={doc.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="hover:bg-gray-50"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      {doc.thumbnailUrl ? (
                        <img
                          className="h-10 w-10 rounded object-cover"
                          src={doc.thumbnailUrl}
                          alt={doc.title}
                        />
                      ) : (
                        <div className="h-10 w-10 rounded bg-gray-100 flex items-center justify-center">
                          {doc.fileType === 'pdf' ? (
                            <FilePdf size={20} className="text-error-600" />
                          ) : (
                            <FileDocx size={20} className="text-primary-600" />
                          )}
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{doc.title}</div>
                      <div className="text-sm text-gray-500">{doc.categories.map(cat => cat.name).join(', ')}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(doc.uploadDate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatBytes(doc.fileSize)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2 mr-1">
                      <div
                        className={`h-2 rounded-full ${
                          doc.confidenceScore > 0.9
                            ? 'bg-success-500'
                            : doc.confidenceScore > 0.8
                              ? 'bg-warning-500'
                              : 'bg-error-500'
                        }`}
                        style={{ width: `${doc.confidenceScore * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600">
                      {Math.round(doc.confidenceScore * 100)}%
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex space-x-2 justify-end">
                    <button className="text-primary-600 hover:text-primary-900">
                      <Eye size={16} />
                    </button>
                    <button className="text-primary-600 hover:text-primary-900">
                      <Download size={16} />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Chart component for category distribution
const Chart: React.FC<{ categories: Category[], documents: Document[] }> = ({ categories, documents }) => {
  // Calculate the number of documents in each category
  const categoryData = categories.map(category => {
    const count = documents.filter(doc => 
      doc.categories.some(cat => cat.id === category.id)
    ).length;
    
    return {
      name: category.name,
      value: count
    };
  });
  
  // Filter out categories with zero documents
  const filteredData = categoryData.filter(item => item.value > 0);
  
  // Color palette for the chart
  const COLORS = ['#1E40AF', '#0D9488', '#7E22CE', '#F59E0B', '#15803D', '#B91C1C'];
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={filteredData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          nameKey="name"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          labelLine={false}
        >
          {filteredData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value) => [`${value} documents`, 'Count']}
          contentStyle={{
            backgroundColor: 'white',
            border: 'none',
            borderRadius: '0.375rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            padding: '0.5rem 0.75rem',
          }}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

// Attach the Chart component to DocumentsByCategory
DocumentsByCategory.Chart = Chart;

export default DocumentsByCategory;