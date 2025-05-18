import React from 'react';
import { motion } from 'framer-motion';
import { FileQuestion, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4"
    >
      <div className="text-center">
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center">
            <FileQuestion className="w-12 h-12 text-primary-600" />
          </div>
        </div>
        
        <h1 className="text-6xl font-serif font-bold text-gray-800 mb-4">404</h1>
        <h2 className="text-2xl font-medium text-gray-600 mb-8">Page Not Found</h2>
        
        <p className="text-gray-500 max-w-md mx-auto mb-8">
          The page you're looking for doesn't exist or has been moved.
          Please check the URL or return to the homepage.
        </p>
        
        <Link
          to="/"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <Home size={20} className="mr-2" />
          Back to Home
        </Link>
      </div>
    </motion.div>
  );
};

export default NotFoundPage;