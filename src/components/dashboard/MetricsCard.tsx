import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MetricsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend: string;
  trendUp: boolean;
}

const MetricsCard: React.FC<MetricsCardProps> = ({ 
  title, 
  value, 
  icon, 
  trend, 
  trendUp 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow p-6"
    >
      <div className="flex items-center">
        <div className="p-3 rounded-full bg-gray-50">
          {icon}
        </div>
        <div className="ml-4">
          <h2 className="text-sm font-medium text-gray-500">{title}</h2>
          <div className="flex items-center">
            <p className="text-2xl font-semibold text-gray-800">{value}</p>
            <div className={`flex items-center ml-2 ${trendUp ? 'text-success-600' : 'text-error-600'}`}>
              {trendUp ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              <span className="text-xs font-medium ml-1">{trend}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MetricsCard;