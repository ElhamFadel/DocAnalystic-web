import React from 'react';
import { motion } from 'framer-motion';
import { 
  Book, 
  FileQuestion,
  Video,
  MessageSquare,
  ChevronRight,
  Search,
  Upload,
  Tags,
  Settings
} from 'lucide-react';

const HelpPage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto py-8 px-4"
    >
      <div className="mb-12">
        <h1 className="text-3xl font-serif font-semibold text-gray-800 mb-4">Help Center</h1>
        <div className="relative">
          <input
            type="search"
            placeholder="Search help articles..."
            className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
          <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Book className="w-6 h-6 text-primary-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 ml-3">Documentation</h2>
          </div>
          <p className="text-gray-600 mb-4">
            Comprehensive guides and documentation for all features.
          </p>
          <button className="text-primary-600 hover:text-primary-700 font-medium flex items-center">
            Browse Documentation
            <ChevronRight size={16} className="ml-1" />
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-secondary-100 rounded-lg">
              <Video className="w-6 h-6 text-secondary-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 ml-3">Video Tutorials</h2>
          </div>
          <p className="text-gray-600 mb-4">
            Learn through step-by-step video guides and tutorials.
          </p>
          <button className="text-secondary-600 hover:text-secondary-700 font-medium flex items-center">
            Watch Tutorials
            <ChevronRight size={16} className="ml-1" />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8 mb-12">
        <h2 className="text-2xl font-serif font-semibold text-gray-800 mb-6">Popular Topics</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Upload className="w-5 h-5 text-primary-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                Document Upload
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <a href="#" className="hover:text-primary-600">How to upload documents</a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary-600">Supported file formats</a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary-600">Bulk upload guide</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex items-start">
            <div className="p-2 bg-secondary-100 rounded-lg">
              <Tags className="w-5 h-5 text-secondary-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                Classification
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <a href="#" className="hover:text-primary-600">Understanding categories</a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary-600">Auto-classification</a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary-600">Managing tags</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex items-start">
            <div className="p-2 bg-accent-100 rounded-lg">
              <Search className="w-5 h-5 text-accent-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                Search & Retrieval
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <a href="#" className="hover:text-primary-600">Advanced search techniques</a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary-600">Filtering results</a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary-600">Saved searches</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex items-start">
            <div className="p-2 bg-success-100 rounded-lg">
              <Settings className="w-5 h-5 text-success-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                Account Settings
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <a href="#" className="hover:text-primary-600">Profile management</a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary-600">Security settings</a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary-600">Notifications</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-primary-50 rounded-lg p-8 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Need More Help?
          </h2>
          <p className="text-gray-600">
            Contact our support team for personalized assistance.
          </p>
        </div>
        <button className="flex items-center px-6 py-3 bg-white text-primary-600 rounded-md hover:bg-gray-50 transition-colors duration-150 shadow-sm">
          <MessageSquare size={20} className="mr-2" />
          Contact Support
        </button>
      </div>
    </motion.div>
  );
};

export default HelpPage;