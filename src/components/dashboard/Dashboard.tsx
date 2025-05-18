import React from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  HardDrive, 
  Clock,
  TrendingUp,
  Filter,
  RefreshCw,
  Calendar
} from 'lucide-react';
import MetricsCard from './MetricsCard';
import DocumentsChart from './DocumentsChart';
import StorageChart from './StorageChart';
import CategoryDistributionChart from './CategoryDistributionChart';
import RecentDocuments from './RecentDocuments';
import { mockMetricsData } from '../../utils/mockData';
import { formatBytes } from '../../utils/mockData';

const Dashboard: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-serif font-semibold text-gray-800">Dashboard</h1>
        <div className="flex space-x-2">
          <button className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white rounded-md border border-gray-200 hover:bg-gray-50">
            <Calendar size={16} className="mr-2" />
            Last 30 days
          </button>
          <button className="flex items-center p-2 text-gray-700 bg-white rounded-md border border-gray-200 hover:bg-gray-50">
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricsCard 
          title="Total Documents"
          value={mockMetricsData.totalDocuments.toString()}
          icon={<FileText className="text-primary-600" />}
          trend="+15.2%"
          trendUp={true}
        />
        <MetricsCard 
          title="Storage Used"
          value={formatBytes(mockMetricsData.totalStorage)}
          icon={<HardDrive className="text-secondary-600" />}
          trend="+8.4%"
          trendUp={true}
        />
        <MetricsCard 
          title="Avg. Processing Time"
          value={`${mockMetricsData.avgProcessingTime.toFixed(1)}s`}
          icon={<Clock className="text-accent-600" />}
          trend="-5.3%"
          trendUp={false}
        />
        <MetricsCard 
          title="Classification Accuracy"
          value={`${mockMetricsData.classificationAccuracy}%`}
          icon={<Filter className="text-success-500" />}
          trend="+2.1%"
          trendUp={true}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-serif font-semibold text-gray-800">Documents Processed</h2>
            <TrendingUp size={20} className="text-primary-600" />
          </div>
          <DocumentsChart data={mockMetricsData.documentsPerDay} />
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-serif font-semibold text-gray-800">Storage Usage</h2>
            <HardDrive size={20} className="text-secondary-600" />
          </div>
          <StorageChart data={mockMetricsData.storageUsage} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentDocuments />
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-serif font-semibold text-gray-800">Category Distribution</h2>
            <Filter size={20} className="text-accent-600" />
          </div>
          <CategoryDistributionChart data={mockMetricsData.categoryDistribution} />
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;