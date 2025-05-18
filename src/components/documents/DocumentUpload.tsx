import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { X, Upload, File as FilePdf, FileText as FileDocx, Eye, Download, AlertCircle } from 'lucide-react';
import { useDocuments } from '../../contexts/DocumentContext';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { extractDocumentInfo, validateDocument, sanitizeTitle } from '../../lib/documentProcessor';
import { ensureBucketAccess, verifyStorageUrl, constructStorageUrl } from '../../lib/storageUtils';

interface DocumentUploadProps {
  onClose: () => void;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({ onClose }) => {
  const { addUploadProgress, updateUploadProgress, addDocument } = useDocuments();
  const { user } = useAuth();
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [bucketChecked, setBucketChecked] = useState(false);

  const checkBucketAccess = async () => {
    if (!bucketChecked) {
      console.log('Performing initial bucket access check');
      const { success, error: bucketError } = await ensureBucketAccess();
      if (!success) {
        setError(bucketError || 'Storage access error');
        return false;
      }
      setBucketChecked(true);
      console.log('Bucket access check completed successfully');
    }
    return true;
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    try {
      console.log('Files dropped:', acceptedFiles.map(f => ({ name: f.name, size: f.size, type: f.type })));
      
      // Check bucket access first
      const hasAccess = await checkBucketAccess();
      if (!hasAccess) return;

      // Validate files
      await Promise.all(acceptedFiles.map(validateDocument));
      
      setFiles(acceptedFiles);
      setError('');
      
      // Add upload progress entries for each file
      acceptedFiles.forEach(file => {
        addUploadProgress({
          filename: file.name,
          progress: 0,
          status: 'pending'
        });
      });
    } catch (err) {
      console.error('File drop error:', err);
      setError(err instanceof Error ? err.message : 'Error validating files');
    }
  }, [addUploadProgress]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxSize: 10485760, // 10MB
    onDropRejected: (rejectedFiles) => {
      const errors = rejectedFiles.map(file => {
        if (file.size > 10485760) {
          return `${file.file.name} is too large. Maximum size is 10MB.`;
        }
        return `${file.file.name} is not a supported file type.`;
      });
      setError(errors.join('\n'));
    }
  });

  const uploadFile = async (file: File) => {
    try {
      console.log('Starting upload for file:', file.name);
      updateUploadProgress(file.name, { status: 'processing', progress: 0 });

      // Extract document info
      console.log('Extracting document info...');
      const docInfo = await extractDocumentInfo(file);
      console.log('Document info extracted:', { title: docInfo.title, pageCount: docInfo.pageCount });
      
      const fileExt = file.name.split('.').pop();
      const sanitizedTitle = sanitizeTitle(docInfo.title);
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${user?.id}/${fileName}`;

      console.log('Generated file path:', filePath);
      updateUploadProgress(file.name, { status: 'uploading', progress: 20 });

      // Upload file to Supabase Storage
      console.log('Uploading to Supabase storage...');
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      console.log('Upload successful:', uploadData);
      updateUploadProgress(file.name, { progress: 60 });

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

      console.log('Generated public URL:', urlData.publicUrl);
      
      // Verify the URL is valid
      if (!verifyStorageUrl(urlData.publicUrl)) {
        throw new Error('Invalid storage URL generated');
      }

      updateUploadProgress(file.name, { progress: 80 });

      // Create document record
      const newDoc = {
        title: sanitizedTitle,
        fileType: fileExt?.toLowerCase() as 'pdf' | 'docx',
        fileSize: file.size,
        content: docInfo.content,
        url: urlData.publicUrl,
        confidenceScore: 0.95,
        pageCount: docInfo.pageCount,
        metadata: docInfo.metadata,
        categories: [] // Initialize with empty categories
      };

      console.log('Creating document record:', newDoc);
      await addDocument(newDoc);
      updateUploadProgress(file.name, { status: 'complete', progress: 100 });
      return true;
    } catch (error) {
      console.error('Upload error:', error);
      updateUploadProgress(file.name, { 
        status: 'error',
        error: 'Failed to upload file'
      });
      return false;
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    
    setUploading(true);
    setError('');

    try {
      // Check bucket access again before uploading
      const hasAccess = await checkBucketAccess();
      if (!hasAccess) {
        setUploading(false);
        return;
      }

      console.log('Starting upload for', files.length, 'files');
      const results = await Promise.all(files.map(uploadFile));
      const allSuccessful = results.every(result => result === true);
      
      if (allSuccessful) {
        console.log('All files uploaded successfully');
        onClose(); // Close the modal only if all uploads were successful
      } else {
        console.log('Some files failed to upload');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError('An error occurred during upload');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl"
      >
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-serif font-semibold text-gray-800">Upload Documents</h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6">
          {error && (
            <div className="mb-4 bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded relative">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                <span className="whitespace-pre-line">{error}</span>
              </div>
            </div>
          )}

          <div 
            {...getRootProps()} 
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-400'
            }`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center justify-center space-y-3">
              <div className="p-4 bg-primary-50 text-primary-600 rounded-full">
                <Upload size={24} />
              </div>
              <p className="text-lg font-medium text-gray-800">
                {isDragActive ? "Drop files here" : "Drag & drop files here"}
              </p>
              <p className="text-sm text-gray-500">
                or <span className="text-primary-600 font-medium">browse files</span>
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Supported formats: PDF, DOCX (Max size: 10MB)
              </p>
            </div>
          </div>
          
          {files.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-6"
            >
              <h3 className="text-sm font-medium text-gray-700 mb-2">Selected files</h3>
              <div className="space-y-3">
                {files.map((file, index) => (
                  <motion.div
                    key={file.name}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center p-3 bg-gray-50 rounded-lg"
                  >
                    {file.name.endsWith('.pdf') ? (
                      <FilePdf size={20} className="text-error-600" />
                    ) : (
                      <FileDocx size={20} className="text-primary-600" />
                    )}
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium text-gray-800">{file.name}</p>
                      <p className="text-xs text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <button 
                      onClick={() => {
                        setFiles(files.filter(f => f !== file));
                      }}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <X size={16} />
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
        
        <div className="flex justify-end p-6 border-t bg-gray-50 rounded-b-lg">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 mr-3"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={files.length === 0 || uploading}
            className={`px-4 py-2 text-sm font-medium text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
              files.length === 0 || uploading
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-primary-600 hover:bg-primary-700'
            }`}
          >
            {uploading ? (
              <>
                <span className="inline-block animate-spin mr-2">⌛</span>
                Uploading...
              </>
            ) : (
              `Upload ${files.length > 0 ? `(${files.length})` : ''}`
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default DocumentUpload;