export interface Document {
  id: string;
  title: string;
  fileType: 'pdf' | 'docx' | 'txt';
  fileSize: number;
  uploadDate: Date;
  lastModified: Date;
  content: string;
  categories: Category[];
  confidenceScore: number;
  url?: string;
  thumbnailUrl?: string;
}

export interface Category {
  id: string;
  name: string;
  parent?: string;
  children?: string[];
}

export interface SearchResult {
  documentId: string;
  title: string;
  matches: {
    field: string;
    text: string;
    positions: number[];
  }[];
  score: number;
}

export interface MetricsData {
  totalDocuments: number;
  totalStorage: number;
  avgProcessingTime: number;
  avgResponseTime: number;
  classificationAccuracy: number;
  documentsPerDay: {
    date: string;
    count: number;
  }[];
  storageUsage: {
    date: string;
    usage: number;
  }[];
  categoryDistribution: {
    category: string;
    count: number;
  }[];
}

export interface UploadProgress {
  filename: string;
  progress: number;
  status: 'pending' | 'uploading' | 'processing' | 'complete' | 'error';
  error?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  jobTitle: string;
  department: string;
  organization: string;
  avatarUrl?: string;
  theme: 'light' | 'dark';
  notificationPreferences: {
    email: boolean;
    desktop: boolean;
    documentUpdates: boolean;
    securityAlerts: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}