import React from 'react';
import { motion } from 'framer-motion';
import { Building2, Users, Target, Award } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto py-8 px-4"
    >
      <h1 className="text-3xl font-serif font-semibold text-gray-800 mb-6">About DocAnalytics</h1>
      
      <div className="prose prose-lg text-gray-600 mb-12">
        <p>
          DocAnalytics is a cutting-edge document management and analytics platform designed to help organizations efficiently manage, analyze, and extract insights from their documents.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Target className="w-6 h-6 text-primary-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 ml-3">Our Mission</h2>
          </div>
          <p className="text-gray-600">
            To revolutionize document management by providing intelligent, secure, and user-friendly solutions that help organizations work smarter.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-secondary-100 rounded-lg">
              <Building2 className="w-6 h-6 text-secondary-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 ml-3">Our Company</h2>
          </div>
          <p className="text-gray-600">
            Founded in 2024, we've quickly grown to become a trusted partner for businesses seeking innovative document management solutions.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8 mb-12">
        <h2 className="text-2xl font-serif font-semibold text-gray-800 mb-6">Why Choose Us?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Quality First</h3>
            <p className="text-gray-600">
              Industry-leading accuracy in document processing and classification.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-secondary-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Customer Focus</h3>
            <p className="text-gray-600">
              Dedicated support team and continuous platform improvements.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-6 h-6 text-accent-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Innovation</h3>
            <p className="text-gray-600">
              Cutting-edge technology and continuous feature development.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-primary-50 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-serif font-semibold text-gray-800 mb-4">
          Ready to Get Started?
        </h2>
        <p className="text-gray-600 mb-6">
          Join thousands of satisfied users who trust DocAnalytics for their document management needs.
        </p>
        <button className="px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors duration-150">
          Start Free Trial
        </button>
      </div>
    </motion.div>
  );
};

export default AboutPage;