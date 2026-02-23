export interface Memory {
  _id: string;
  text: string;
  category: 'study' | 'job' | 'task' | 'health' | 'event' | 'note';
  tags: string[];
  eventTime: string;
  createdAt: string;
  metadata?: {
    duration?: string;
    mood?: string;
    priority?: string;
    location?: string;
    people?: string[];
    outcome?: string;
  };
}

export interface Reminder {
  _id: string;
  text: string;
  reminderTime: string;
  status: 'pending' | 'triggered' | 'cancelled';
  createdAt: string;
  triggeredAt?: string;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'agent';
  content: string;
  timestamp: Date;
  intent?: string;
  data?: Memory[] | any;
}

export interface Stats {
  total: number;
  today: number;
  week: number;
  byCategory: Record<string, number>;
}

export interface ApiResponse<T = any> {
  success: boolean;
  response?: string;
  data?: T;
  intent?: string;
}
