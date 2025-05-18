import React from 'react';
import { motion } from 'framer-motion';
import { WrenchIcon, Clock } from 'lucide-react';

const MaintenancePage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4"
    >
      <div className="text-center">
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center">
            <WrenchIcon className="w-12 h-12 text-primary-600" />
          </div>
        </div>
        
        <h1 className="text-3xl font-serif font-bold text-gray-800 mb-4">
          System Maintenance
        </h1>
        
        <p className="text-xl text-gray-600 mb-8">
          We'll be back soon!
        </p>
        
        <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto mb-8">
          <div className="flex items-center justify-center mb-4">
            <Clock className="w-6 h-6 text-primary-600 mr-2" />
            <span className="text-gray-700 font-medium">Estimated Duration:</span>
          </div>
          <p className="text-gray-600">
            Our system is currently undergoing scheduled maintenance to improve your experience.
            We expect to be back online within 2 hours.
          </p>
        </div>
        
        <div className="text-gray-500">
          <p>For urgent inquiries, please contact:</p>
          <a 
            href="mailto:support@docanalytics.com"
            className="text-primary-600 hover:text-primary-700"
          >
            support@docanalytics.com
          </a>
        </div>
      </div>
    </motion.div>
  );
};

export default MaintenancePage;