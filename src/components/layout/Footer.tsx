import React from 'react';
import { Link } from 'react-router-dom';
import { FileIcon, Github, Twitter, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <FileIcon className="w-6 h-6 text-white" />
              </div>
              <span className="ml-2 text-xl font-semibold text-gray-800">DocAnalytics</span>
            </div>
            <p className="mt-4 text-gray-500 text-sm">
              Intelligent document management and analytics platform for modern businesses.
            </p>
            <div className="mt-4 flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <Github size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-800 tracking-wider uppercase">
              Product
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link to="/about" className="text-gray-500 hover:text-gray-900">
                  About
                </Link>
              </li>
              <li>
                <Link to="/documents" className="text-gray-500 hover:text-gray-900">
                  Documents
                </Link>
              </li>
              <li>
                <Link to="/classification" className="text-gray-500 hover:text-gray-900">
                  Classification
                </Link>
              </li>
              <li>
                <Link to="/search" className="text-gray-500 hover:text-gray-900">
                  Search
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-800 tracking-wider uppercase">
              Support
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link to="/help" className="text-gray-500 hover:text-gray-900">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-500 hover:text-gray-900">
                  Contact Us
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-gray-900">
                  API Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-gray-900">
                  Status
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-800 tracking-wider uppercase">
              Legal
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link to="/privacy" className="text-gray-500 hover:text-gray-900">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-500 hover:text-gray-900">
                  Terms of Service
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-gray-900">
                  Cookie Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-gray-900">
                  GDPR
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} DocAnalytics. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;