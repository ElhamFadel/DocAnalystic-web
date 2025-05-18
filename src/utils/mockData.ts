import { Document, Category, MetricsData } from '../types';

export const mockCategories: Category[] = [
  { id: 'cat-1', name: 'Financial' },
  { id: 'cat-2', name: 'Legal' },
  { id: 'cat-3', name: 'Technical' },
  { id: 'cat-4', name: 'Marketing' },
  { id: 'cat-5', name: 'Human Resources' },
  { id: 'cat-6', name: 'Research' },
];

export const mockDocuments: Document[] = [
  {
    id: 'doc-1',
    title: 'Financial Report Q1 2025',
    fileType: 'pdf',
    fileSize: 2456000,
    uploadDate: new Date('2025-04-01T10:30:00'),
    lastModified: new Date('2025-04-01T10:30:00'),
    content: 'This financial report covers the first quarter of 2025...',
    categories: [mockCategories[0]],
    confidenceScore: 0.95,
    thumbnailUrl: 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    id: 'doc-2',
    title: 'Legal Contract Template',
    fileType: 'docx',
    fileSize: 1245000,
    uploadDate: new Date('2025-03-28T14:20:00'),
    lastModified: new Date('2025-03-28T14:20:00'),
    content: 'This legal contract template is designed for...',
    categories: [mockCategories[1]],
    confidenceScore: 0.98,
    thumbnailUrl: 'https://images.pexels.com/photos/5668855/pexels-photo-5668855.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    id: 'doc-3',
    title: 'Technical Documentation: Cloud Architecture',
    fileType: 'pdf',
    fileSize: 3500000,
    uploadDate: new Date('2025-03-25T09:15:00'),
    lastModified: new Date('2025-03-25T09:15:00'),
    content: 'This technical documentation outlines the cloud architecture...',
    categories: [mockCategories[2]],
    confidenceScore: 0.92,
    thumbnailUrl: 'https://images.pexels.com/photos/1181277/pexels-photo-1181277.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    id: 'doc-4',
    title: 'Marketing Campaign Strategy',
    fileType: 'docx',
    fileSize: 1800000,
    uploadDate: new Date('2025-03-22T11:45:00'),
    lastModified: new Date('2025-03-22T11:45:00'),
    content: 'This marketing campaign strategy focuses on...',
    categories: [mockCategories[3]],
    confidenceScore: 0.89,
    thumbnailUrl: 'https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    id: 'doc-5',
    title: 'HR Policy Update 2025',
    fileType: 'pdf',
    fileSize: 1200000,
    uploadDate: new Date('2025-03-20T15:30:00'),
    lastModified: new Date('2025-03-20T15:30:00'),
    content: 'This HR policy update for 2025 includes changes to...',
    categories: [mockCategories[4]],
    confidenceScore: 0.97,
    thumbnailUrl: 'https://images.pexels.com/photos/9881263/pexels-photo-9881263.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    id: 'doc-6',
    title: 'Research Findings: AI Applications',
    fileType: 'pdf',
    fileSize: 4200000,
    uploadDate: new Date('2025-03-18T13:10:00'),
    lastModified: new Date('2025-03-18T13:10:00'),
    content: 'This research paper presents findings on AI applications in...',
    categories: [mockCategories[5]],
    confidenceScore: 0.94,
    thumbnailUrl: 'https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
];

export const mockMetricsData: MetricsData = {
  totalDocuments: 142,
  totalStorage: 428500000, // bytes
  avgProcessingTime: 1.8, // seconds
  avgResponseTime: 0.35, // seconds
  classificationAccuracy: 94.2, // percentage
  documentsPerDay: [
    { date: '2025-03-18', count: 18 },
    { date: '2025-03-19', count: 21 },
    { date: '2025-03-20', count: 15 },
    { date: '2025-03-21', count: 24 },
    { date: '2025-03-22', count: 12 },
    { date: '2025-03-23', count: 8 },
    { date: '2025-03-24', count: 19 },
    { date: '2025-03-25', count: 22 },
    { date: '2025-03-26', count: 17 },
    { date: '2025-03-27', count: 23 },
    { date: '2025-03-28', count: 20 },
    { date: '2025-03-29', count: 14 },
    { date: '2025-03-30', count: 16 },
    { date: '2025-03-31', count: 25 },
    { date: '2025-04-01', count: 28 },
  ],
  storageUsage: [
    { date: '2025-03-18', usage: 245000000 },
    { date: '2025-03-19', usage: 267000000 },
    { date: '2025-03-20', usage: 285000000 },
    { date: '2025-03-21', usage: 310000000 },
    { date: '2025-03-22', usage: 325000000 },
    { date: '2025-03-23', usage: 335000000 },
    { date: '2025-03-24', usage: 356000000 },
    { date: '2025-03-25', usage: 375000000 },
    { date: '2025-03-26', usage: 392000000 },
    { date: '2025-03-27', usage: 401000000 },
    { date: '2025-03-28', usage: 412000000 },
    { date: '2025-03-29', usage: 418000000 },
    { date: '2025-03-30', usage: 422000000 },
    { date: '2025-03-31', usage: 425000000 },
    { date: '2025-04-01', usage: 428500000 },
  ],
  categoryDistribution: [
    { category: 'Financial', count: 32 },
    { category: 'Legal', count: 28 },
    { category: 'Technical', count: 35 },
    { category: 'Marketing', count: 18 },
    { category: 'Human Resources', count: 15 },
    { category: 'Research', count: 14 },
  ],
};

export function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

export function searchDocuments(query: string, documents: Document[]): Document[] {
  if (!query.trim()) return [];
  
  const lowerCaseQuery = query.toLowerCase();
  
  return documents.filter(doc => 
    doc.title.toLowerCase().includes(lowerCaseQuery) || 
    doc.content.toLowerCase().includes(lowerCaseQuery)
  ).sort((a, b) => {
    // Prioritize title matches over content matches
    const aInTitle = a.title.toLowerCase().includes(lowerCaseQuery);
    const bInTitle = b.title.toLowerCase().includes(lowerCaseQuery);
    
    if (aInTitle && !bInTitle) return -1;
    if (!aInTitle && bInTitle) return 1;
    
    // If both match in the same way, sort by most recent
    return b.uploadDate.getTime() - a.uploadDate.getTime();
  });
}