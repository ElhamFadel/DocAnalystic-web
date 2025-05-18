import React from 'react';
import { motion } from 'framer-motion';
import { useDocuments } from '../../contexts/DocumentContext';
import { formatDate, formatBytes } from '../../utils/mockData';
import { File as FilePdf, FileText as FileDocx, Clock, Tag, MoreVertical, Download, Trash2, Share, Eye } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { getSignedUrl } from '../../lib/storageUtils';

interface DocumentListProps {
  viewMode: 'grid' | 'list';
}

const DocumentList: React.FC<DocumentListProps> = ({ viewMode }) => {
  const { documents, sortOption, filterCategory, removeDocument } = useDocuments();

  // Filter documents by category if selected
  const filteredDocuments = filterCategory
    ? documents.filter(doc => 
        doc.categories.some(cat => 
          cat.name.toLowerCase() === filterCategory.toLowerCase()
        )
      )
    : documents;

  // Sort documents based on selected option
  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    switch (sortOption) {
      case 'date-desc':
        return b.uploadDate.getTime() - a.uploadDate.getTime();
      case 'date-asc':
        return a.uploadDate.getTime() - b.uploadDate.getTime();
      case 'name-asc':
        return a.title.localeCompare(b.title);
      case 'name-desc':
        return b.title.localeCompare(a.title);
      case 'size-desc':
        return b.fileSize - a.fileSize;
      case 'size-asc':
        return a.fileSize - b.fileSize;
      default:
        return 0;
    }
  });

  const handlePreview = async (doc: typeof documents[0]) => {
    try {
      if (!doc.url) {
        throw new Error('Document URL not found');
      }

      const signedUrl = await getSignedUrl(doc.url);
      if (!signedUrl) {
        throw new Error('Failed to generate signed URL');
      }

      window.open(signedUrl, '_blank');
    } catch (error) {
      console.error('Error previewing document:', error);
      alert('Failed to preview document');
    }
  };

  const handleDownload = async (doc: typeof documents[0]) => {
    try {
      if (!doc.url) {
        throw new Error('Document URL not found');
      }

      const signedUrl = await getSignedUrl(doc.url);
      if (!signedUrl) {
        throw new Error('Failed to generate signed URL');
      }

      const response = await fetch(signedUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = doc.title + '.' + doc.fileType;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading document:', error);
      alert('Failed to download document');
    }
  };

  const handleDelete = async (doc: typeof documents[0]) => {
    if (!window.confirm('Are you sure you want to delete this document?')) {
      return;
    }

    try {
      // Delete file from storage
      if (doc.url) {
        const path = doc.url.split('/').pop();
        if (path) {
          await supabase.storage
            .from('documents')
            .remove([path]);
        }
      }

      // Delete document from database
      await removeDocument(doc.id);
    } catch (error) {
      console.error('Error deleting document:', error);
      alert('Failed to delete document');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (viewMode === 'grid') {
    return (
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {sortedDocuments.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow">
            <FileDocx size={40} className="text-gray-300 mb-2" />
            <p className="text-gray-500">No documents found</p>
          </div>
        ) : (
          sortedDocuments.map(doc => (
            <motion.div
              key={doc.id}
              variants={itemVariants}
              className="bg-white rounded-lg shadow overflow-hidden flex flex-col group hover:shadow-md transition-shadow"
            >
              <div className="relative h-36 bg-gray-100">
                {doc.thumbnailUrl ? (
                  <img 
                    src={doc.thumbnailUrl} 
                    alt={doc.title}
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    {doc.fileType === 'pdf' ? (
                      <FilePdf size={40} className="text-error-500" />
                    ) : (
                      <FileDocx size={40} className="text-primary-500" />
                    )}
                  </div>
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-3">
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handlePreview(doc)}
                      className="p-1.5 bg-white rounded-full text-gray-700 hover:text-primary-600"
                    >
                      <Eye size={16} />
                    </button>
                    <button 
                      onClick={() => handleDownload(doc)}
                      className="p-1.5 bg-white rounded-full text-gray-700 hover:text-primary-600"
                    >
                      <Download size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(doc)}
                      className="p-1.5 bg-white rounded-full text-gray-700 hover:text-error-600"
                    >
                      <Trash2 size={16} />
                    </button>
                    <button className="p-1.5 bg-white rounded-full text-gray-700 hover:text-primary-600">
                      <Share size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="absolute top-2 right-2">
                  {doc.fileType && (
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      doc.fileType === 'pdf' 
                        ? 'bg-error-100 text-error-800' 
                        : 'bg-primary-100 text-primary-800'
                    }`}>
                      {doc.fileType.toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="text-sm font-medium text-gray-800 mb-1 line-clamp-2" title={doc.title}>
                  {doc.title}
                </h3>
                
                <div className="mt-2 flex items-center text-xs text-gray-500">
                  <Clock size={12} className="mr-1" />
                  <span>{formatDate(doc.uploadDate)}</span>
                </div>
                
                <div className="mt-1 flex items-center text-xs text-gray-500">
                  <Tag size={12} className="mr-1" />
                  <span>{doc.categories.map(cat => cat.name).join(', ')}</span>
                </div>
                
                <div className="mt-3 pt-3 border-t flex items-center justify-between">
                  <span className="text-xs text-gray-500">{formatBytes(doc.fileSize)}</span>
                  
                  <div className="flex items-center">
                    <div className="w-12 bg-gray-200 rounded-full h-1.5 mr-1">
                      <div 
                        className={`h-1.5 rounded-full ${
                          doc.confidenceScore > 0.9 
                            ? 'bg-success-500' 
                            : doc.confidenceScore > 0.8 
                              ? 'bg-warning-500' 
                              : 'bg-error-500'
                        }`}
                        style={{ width: `${doc.confidenceScore * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-600">
                      {Math.round(doc.confidenceScore * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>
    );
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="bg-white rounded-lg shadow overflow-hidden"
    >
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
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedDocuments.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-12 text-center">
                <div className="flex flex-col items-center justify-center">
                  <FileDocx size={40} className="text-gray-300 mb-2" />
                  <p className="text-gray-500">No documents found</p>
                </div>
              </td>
            </tr>
          ) : (
            sortedDocuments.map((doc, index) => (
              <motion.tr
                key={doc.id}
                variants={itemVariants}
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
                            <FilePdf className="text-error-500" size={18} />
                          ) : (
                            <FileDocx className="text-primary-500" size={18} />
                          )}
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
                  {doc.fileType && (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      doc.fileType === 'pdf' 
                        ? 'bg-error-100 text-error-800' 
                        : 'bg-primary-100 text-primary-800'
                    }`}>
                      {doc.fileType.toUpperCase()}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatBytes(doc.fileSize)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
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
                    <span className="text-sm text-gray-700">
                      {Math.round(doc.confidenceScore * 100)}%
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="relative group inline-block">
                    <button className="text-gray-400 hover:text-gray-500">
                      <MoreVertical size={16} />
                    </button>
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 hidden group-hover:block z-10">
                      <button 
                        onClick={() => handlePreview(doc)}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Eye size={16} className="mr-2" />
                        View Document
                      </button>
                      <button 
                        onClick={() => handleDownload(doc)}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Download size={16} className="mr-2" />
                        Download
                      </button>
                      <button 
                        onClick={() => handleDelete(doc)}
                        className="flex items-center w-full px-4 py-2 text-sm text-error-600 hover:bg-gray-100"
                      >
                        <Trash2 size={16} className="mr-2" />
                        Delete
                      </button>
                    </div>
                  </div>
                </td>
              </motion.tr>
            ))
          )}
        </tbody>
      </table>
    </motion.div>
  );
};

export default DocumentList;