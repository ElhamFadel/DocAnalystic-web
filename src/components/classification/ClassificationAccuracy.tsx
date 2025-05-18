import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ClassificationAccuracy: React.FC = () => {
  // Mock data for classification accuracy
  const accuracyData = [
    { category: 'Financial', accuracy: 96 },
    { category: 'Legal', accuracy: 98 },
    { category: 'Technical', accuracy: 92 },
    { category: 'Marketing', accuracy: 89 },
    { category: 'HR', accuracy: 97 },
    { category: 'Research', accuracy: 94 },
  ];
  
  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 95) return '#15803D'; // success-700
    if (accuracy >= 90) return '#0D9488'; // secondary-600
    return '#1E40AF'; // primary-800
  };
  
  return (
    <div>
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">Overall Accuracy</span>
          <span className="text-lg font-bold text-gray-800">94.2%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
          <div 
            className="bg-success-600 h-2.5 rounded-full" 
            style={{ width: '94.2%' }}
          ></div>
        </div>
      </div>
      
      <div className="h-60">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={accuracyData}
            margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
            barSize={20}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="category" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: '#6B7280' }}
              angle={-45}
              textAnchor="end"
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6B7280' }}
              domain={[80, 100]}
            />
            <Tooltip
              contentStyle={{ 
                backgroundColor: 'white',
                border: 'none',
                borderRadius: '0.375rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                padding: '0.5rem 0.75rem',
              }}
              formatter={(value: number) => [`${value}%`, 'Accuracy']}
            />
            <Bar 
              dataKey="accuracy" 
              fill="#1E40AF"
              radius={[4, 4, 0, 0]}
              name="Accuracy"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4">
        <p className="text-xs text-gray-500">
          Classification accuracy is calculated based on manual verification samples.
        </p>
      </div>
    </div>
  );
};

export default ClassificationAccuracy;