import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatBytes } from '../../utils/mockData';

interface StorageChartProps {
  data: { date: string; usage: number }[];
}

const StorageChart: React.FC<StorageChartProps> = ({ data }) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
  };

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0D9488" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#0D9488" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis 
            dataKey="date" 
            tickFormatter={formatDate}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#6B7280' }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#6B7280' }}
            tickFormatter={(value) => formatBytes(value, 0)}
          />
          <Tooltip
            contentStyle={{ 
              backgroundColor: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              padding: '0.5rem 0.75rem',
            }}
            labelFormatter={formatDate}
            formatter={(value: number) => [formatBytes(value), 'Storage Used']}
          />
          <Area 
            type="monotone" 
            dataKey="usage" 
            stroke="#0D9488" 
            fillOpacity={1}
            fill="url(#colorUsage)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StorageChart;