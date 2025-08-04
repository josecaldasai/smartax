export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'accountant';
  company: Company;
  avatar?: string;
  phone?: string;
  createdAt: Date;
}

export interface Company {
  id: string;
  name: string;
  rfc: string;
  fiscalRegime: string;
  address: string;
  industry: string;
  size: 'small' | 'medium' | 'large';
  createdAt: Date;
}

export interface FiscalMetric {
  id: string;
  name: string;
  value: number;
  previousValue: number;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: string;
  color: string;
  period: string;
}

export interface FiscalHealthIndicator {
  overall: 'low' | 'medium' | 'high';
  score: number;
  factors: {
    compliance: number;
    documentation: number;
    declarations: number;
    deductions: number;
  };
  recommendations: string[];
}

export interface FiscalObligation {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  status: 'pending' | 'completed' | 'overdue';
  priority: 'high' | 'medium' | 'low';
  type: 'declaration' | 'payment' | 'filing';
  amount?: number;
}

export interface Alert {
  id: string;
  title: string;
  message: string;
  type: 'risk' | 'opportunity' | 'deadline' | 'compliance';
  severity: 'high' | 'medium' | 'low';
  status: 'active' | 'resolved' | 'dismissed';
  createdAt: Date;
  actionRequired?: boolean;
  relatedDocument?: string;
}

export interface Document {
  id: string;
  name: string;
  type: 'invoice' | 'receipt' | 'statement' | 'contract' | 'other';
  category: string;
  uploadDate: Date;
  size: number;
  status: 'processed' | 'processing' | 'error';
  extractedData?: any;
  url: string;
  tags: string[];
}

export interface CFDI {
  id: string;
  uuid: string;
  rfc: string;
  issueDate: Date;
  total: number;
  status: 'valid' | 'invalid' | 'cancelled';
  type: 'issued' | 'received';
  concept: string;
  taxAmount: number;
  category: string;
}

export interface ChatMessage {
  id: string;
  message: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  type: 'text' | 'file' | 'action';
  metadata?: any;
}

export interface FiscalScenario {
  id: string;
  name: string;
  description: string;
  parameters: {
    income: number;
    expenses: number;
    deductions: number;
    taxRate: number;
  };
  results: {
    estimatedTax: number;
    savings: number;
    recommendations: string[];
  };
  createdAt: Date;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  type: 'deadline' | 'reminder' | 'meeting';
  description?: string;
  status: 'upcoming' | 'completed' | 'overdue';
  priority: 'high' | 'medium' | 'low';
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: Date;
  actionUrl?: string;
}

export interface DeductionOpportunity {
  id: string;
  category: string;
  description: string;
  estimatedSavings: number;
  difficulty: 'easy' | 'medium' | 'complex';
  requirements: string[];
  deadline?: Date;
  status: 'available' | 'in_progress' | 'completed';
}

export interface BenchmarkData {
  industry: string;
  metrics: {
    averageTaxRate: number;
    averageDeductions: number;
    complianceScore: number;
    averageRefund: number;
  };
  comparison: {
    taxEfficiency: 'above' | 'average' | 'below';
    deductionUtilization: 'above' | 'average' | 'below';
    complianceLevel: 'above' | 'average' | 'below';
  };
} 