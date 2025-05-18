import React from 'react';
import { motion } from 'framer-motion';
import { Clock, FileText, File as FilePdf, FileText as FileDocx } from 'lucide-react';
import { useDocuments } from '../../contexts/DocumentContext';
import { formatDate, formatBytes } from '../../utils/mockData';

const RecentDocuments: React.FC = () => {
  const { documents } = useDocuments();
  
  // Sort by upload date and get the 5 most recent
  const recentDocuments = [...documents]
    .sort((a, b) => b.uploadDate.getTime() - a.uploadDate.getTime())
    .slice(0, 5);

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="flex items-center justify-between p-6 border-b">
        <div className="flex items-center">
          <Clock size={20} className="text-primary-600 mr-2" />
          <h2 className="text-lg font-serif font-semibold text-gray-800">Recently Added Documents</h2>
        </div>
        <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
          View all
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Document
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date Added
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Size
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Confidence
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {recentDocuments.map((doc, index) => (
              <motion.tr 
                key={doc.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
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
                          <FileText className="text-gray-400" size={18} />
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{doc.title}</div>
                      <div className="text-sm text-gray-500">
                        {doc.categories.map(cat => cat.name).join(', ')}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(doc.uploadDate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {doc.fileType && (
                      <>
                        {doc.fileType === 'pdf' ? (
                          <FilePdf size={16} className="text-error-600 mr-1" />
                        ) : (
                          <FileDocx size={16} className="text-primary-600 mr-1" />
                        )}
                        <span className="text-sm text-gray-500">
                          {doc.fileType.toUpperCase()}
                        </span>
                      </>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatBytes(doc.fileSize)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full ${
                          doc.confidenceScore > 0.9 
                            ? 'bg-success-500' 
                            : doc.confidenceScore > 0.8 
                              ? 'bg-warning-500' 
                              : 'bg-error-500'
                        }`}
                        style={{ width: `${doc.confidenceScore * 100}%` }}
                      />
                    </div>
                    <span className="ml-2 text-sm text-gray-700">
                      {Math.round(doc.confidenceScore * 100)}%
                    </span>
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

export default RecentDocuments;