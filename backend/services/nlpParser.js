/**
 * Natural Language Parser Service
 * Parses user input to extract intent, category, tags, time references, and metadata
 */

const CATEGORY_KEYWORDS = {
  study: ['study', 'studied', 'learning', 'learn', 'revision', 'revise', 'gre', 'exam', 'test', 'course', 'lecture'],
  job: ['applied', 'application', 'interview', 'job', 'position', 'role', 'company', 'offer', 'resume', 'cv'],
  task: ['task', 'todo', 'complete', 'completed', 'work', 'project', 'deadline', 'finish', 'done'],
  health: ['workout', 'exercise', 'gym', 'run', 'walk', 'sleep', 'slept', 'ate', 'meal', 'headache', 'pain', 'doctor'],
  event: ['meeting', 'meet', 'met', 'call', 'appointment', 'party', 'dinner', 'lunch', 'celebration', 'concert'],
  note: ['note', 'idea', 'thought', 'remember', 'memo']
};

const TIME_PATTERNS = {
  tomorrow: () => {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    return date;
  },
  tom: () => {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    return date;
  },
  tmr: () => {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    return date;
  },
  yesterday: () => {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    return date;
  },
  today: () => new Date(),
  'next monday': () => {
    const date = new Date();
    const day = date.getDay();
    const daysUntilMonday = (8 - day) % 7 || 7;
    date.setDate(date.getDate() + daysUntilMonday);
    return date;
  },
  'next tuesday': () => {
    const date = new Date();
    const day = date.getDay();
    const daysUntilTuesday = (9 - day) % 7 || 7;
    date.setDate(date.getDate() + daysUntilTuesday);
    return date;
  },
  'next wednesday': () => {
    const date = new Date();
    const day = date.getDay();
    const daysUntilWednesday = (10 - day) % 7 || 7;
    date.setDate(date.getDate() + daysUntilWednesday);
    return date;
  },
  'next thursday': () => {
    const date = new Date();
    const day = date.getDay();
    const daysUntilThursday = (11 - day) % 7 || 7;
    date.setDate(date.getDate() + daysUntilThursday);
    return date;
  },
  'next friday': () => {
    const date = new Date();
    const day = date.getDay();
    const daysUntilFriday = (12 - day) % 7 || 7;
    date.setDate(date.getDate() + daysUntilFriday);
    return date;
  },
  'next saturday': () => {
    const date = new Date();
    const day = date.getDay();
    const daysUntilSaturday = (13 - day) % 7 || 7;
    date.setDate(date.getDate() + daysUntilSaturday);
    return date;
  },
  'next sunday': () => {
    const date = new Date();
    const day = date.getDay();
    const daysUntilSunday = (14 - day) % 7 || 7;
    date.setDate(date.getDate() + daysUntilSunday);
    return date;
  }
};

export const parseIntent = (input) => {
  const lower = input.toLowerCase().trim();
  
  // Check for greetings first
  const greetings = ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening', 'how are you', 'howdy', 'greetings', 'what\'s up', 'whats up', 'sup'];
  if (greetings.some(greeting => lower === greeting || lower.startsWith(greeting + ' ') || lower.startsWith(greeting + '!'))) {
    return 'greeting';
  }
  
  if (lower.startsWith('remember ') || lower.startsWith('i ')) {
    return 'remember';
  }
  if (lower.startsWith('remind me') || lower.startsWith('remind')) {
    return 'remind';
  }
  if (lower.startsWith('show ') || lower.startsWith('what ') || lower.startsWith('find ') || lower.startsWith('search ')) {
    return 'show';
  }
  if (lower.startsWith('summarize') || lower.startsWith('summary')) {
    return 'summarize';
  }
  
  return 'unknown';
};

export const extractCategory = (text) => {
  const lower = text.toLowerCase();
  
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lower.includes(keyword)) {
        return category;
      }
    }
  }
  
  return 'note';
};

export const extractTags = (text) => {
  const lower = text.toLowerCase();
  const tags = [];
  
  // Common tags to look for
  const potentialTags = [
    'gre', 'toefl', 'interview', 'backend', 'frontend', 'system design',
    'headache', 'migraine', 'fever', 'razorpay', 'google', 'amazon',
    'urgent', 'important', 'personal', 'work'
  ];
  
  for (const tag of potentialTags) {
    if (lower.includes(tag)) {
      tags.push(tag);
    }
  }
  
  return [...new Set(tags)]; // Remove duplicates
};

export const extractDuration = (text) => {
  const patterns = [
    /(\d+)\s*(hour|hr|h)/i,
    /(\d+)\s*(minute|min|m)/i,
    /(\d+\.?\d*)\s*(hour|hr|h)/i
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return `${match[1]} ${match[2]}`;
    }
  }
  
  return null;
};

export const parseTimeReference = (text) => {
  const lower = text.toLowerCase();
  
  // Check for full date formats: "February 10, 2026", "Feb 10, 2026", "on February 10"
  const monthNames = {
    january: 0, jan: 0, february: 1, feb: 1, march: 2, mar: 2,
    april: 3, apr: 3, may: 4, june: 5, jun: 5, july: 6, jul: 6,
    august: 7, aug: 7, september: 8, sep: 8, sept: 8, october: 9, oct: 9,
    november: 10, nov: 10, december: 11, dec: 11
  };
  
  // Pattern 1: "February 10, 2026" or "Feb 10, 2026" or "on February 10"
  const fullDateMatch = text.match(/(?:on\s+)?(\w+)\s+(\d{1,2})(?:,?\s+(\d{4}))?/i);
  if (fullDateMatch) {
    const monthStr = fullDateMatch[1].toLowerCase();
    const day = parseInt(fullDateMatch[2]);
    const year = fullDateMatch[3] ? parseInt(fullDateMatch[3]) : new Date().getFullYear();
    
    if (monthNames.hasOwnProperty(monthStr)) {
      const month = monthNames[monthStr];
      const date = new Date(year, month, day);
      
      // Extract time if specified
      const timeMatch = text.match(/at\s+(\d{1,2}):?(\d{2})?\s*(am|pm)?/i);
      if (timeMatch) {
        let hours = parseInt(timeMatch[1]);
        const minutes = timeMatch[2] ? parseInt(timeMatch[2]) : 0;
        const meridiem = timeMatch[3]?.toLowerCase();
        
        if (meridiem === 'pm' && hours < 12) hours += 12;
        if (meridiem === 'am' && hours === 12) hours = 0;
        
        date.setHours(hours, minutes, 0, 0);
      }
      
      return date;
    }
  }
  
  // Pattern 2: "3 february 2026" or "15 march" (day before month)
  const dayMonthMatch = text.match(/(?:on\s+)?(\d{1,2})\s+(\w+)(?:\s+(\d{4}))?/i);
  if (dayMonthMatch) {
    const day = parseInt(dayMonthMatch[1]);
    const monthStr = dayMonthMatch[2].toLowerCase();
    const year = dayMonthMatch[3] ? parseInt(dayMonthMatch[3]) : new Date().getFullYear();
    
    if (monthNames.hasOwnProperty(monthStr)) {
      const month = monthNames[monthStr];
      const date = new Date(year, month, day);
      
      // Extract time if specified
      const timeMatch = text.match(/at\s+(\d{1,2}):?(\d{2})?\s*(am|pm)?/i);
      if (timeMatch) {
        let hours = parseInt(timeMatch[1]);
        const minutes = timeMatch[2] ? parseInt(timeMatch[2]) : 0;
        const meridiem = timeMatch[3]?.toLowerCase();
        
        if (meridiem === 'pm' && hours < 12) hours += 12;
        if (meridiem === 'am' && hours === 12) hours = 0;
        
        date.setHours(hours, minutes, 0, 0);
      }
      
      return date;
    }
  }
  
  // Check for "on the 15th" or "on 15th"
  const dayOnlyMatch = text.match(/on\s+(?:the\s+)?(\d{1,2})(?:st|nd|rd|th)?/i);
  if (dayOnlyMatch) {
    const day = parseInt(dayOnlyMatch[1]);
    const date = new Date();
    date.setDate(day);
    
    // If day has passed this month, move to next month
    if (day < date.getDate()) {
      date.setMonth(date.getMonth() + 1);
    }
    
    // Extract time if specified
    const timeMatch = text.match(/at\s+(\d{1,2}):?(\d{2})?\s*(am|pm)?/i);
    if (timeMatch) {
      let hours = parseInt(timeMatch[1]);
      const minutes = timeMatch[2] ? parseInt(timeMatch[2]) : 0;
      const meridiem = timeMatch[3]?.toLowerCase();
      
      if (meridiem === 'pm' && hours < 12) hours += 12;
      if (meridiem === 'am' && hours === 12) hours = 0;
      
      date.setHours(hours, minutes, 0, 0);
    }
    
    return date;
  }
  
  // Check for relative time patterns (tomorrow, next Monday, etc.)
  for (const [pattern, fn] of Object.entries(TIME_PATTERNS)) {
    if (lower.includes(pattern)) {
      const baseDate = fn();
      
      // Extract time if specified - support both "at 6 pm" and just "6pm" or "6 pm"
      const timeMatch = text.match(/(?:at\s+)?(\d{1,2}):?(\d{2})?\s*(am|pm)/i);
      if (timeMatch) {
        let hours = parseInt(timeMatch[1]);
        const minutes = timeMatch[2] ? parseInt(timeMatch[2]) : 0;
        const meridiem = timeMatch[3]?.toLowerCase();
        
        if (meridiem === 'pm' && hours < 12) hours += 12;
        if (meridiem === 'am' && hours === 12) hours = 0;
        
        baseDate.setHours(hours, minutes, 0, 0);
      }
      
      return baseDate;
    }
  }
  
  // Check for "in X hours/minutes"
  const inHoursMatch = text.match(/in\s+(\d+)\s*(hour|hr|h)s?/i);
  if (inHoursMatch) {
    const date = new Date();
    date.setHours(date.getHours() + parseInt(inHoursMatch[1]));
    return date;
  }
  
  const inMinutesMatch = text.match(/in\s+(\d+)\s*(minute|min|m)s?/i);
  if (inMinutesMatch) {
    const date = new Date();
    date.setMinutes(date.getMinutes() + parseInt(inMinutesMatch[1]));
    return date;
  }
  
  // Check for just time "at 3:24 pm" without date (default to today, or tomorrow if time has passed)
  const timeOnlyMatch = text.match(/(?:at\s+)?(\d{1,2}):?(\d{2})?\s*(am|pm)/i);
  if (timeOnlyMatch) {
    const date = new Date();
    let hours = parseInt(timeOnlyMatch[1]);
    const minutes = timeOnlyMatch[2] ? parseInt(timeOnlyMatch[2]) : 0;
    const meridiem = timeOnlyMatch[3].toLowerCase();
    
    if (meridiem === 'pm' && hours < 12) hours += 12;
    if (meridiem === 'am' && hours === 12) hours = 0;
    
    date.setHours(hours, minutes, 0, 0);
    
    // If time has already passed today, schedule for tomorrow
    if (date <= new Date()) {
      date.setDate(date.getDate() + 1);
    }
    
    return date;
  }
  
  // Check for explicit date (YYYY-MM-DD)
  const dateMatch = text.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (dateMatch) {
    const date = new Date(dateMatch[0]);
    
    // Extract time if specified
    const timeMatch = text.match(/at\s+(\d{1,2}):?(\d{2})?\s*(am|pm)?/i);
    if (timeMatch) {
      let hours = parseInt(timeMatch[1]);
      const minutes = timeMatch[2] ? parseInt(timeMatch[2]) : 0;
      const meridiem = timeMatch[3]?.toLowerCase();
      
      if (meridiem) {
        if (meridiem === 'pm' && hours < 12) hours += 12;
        if (meridiem === 'am' && hours === 12) hours = 0;
      }
      
      date.setHours(hours, minutes, 0, 0);
    }
    
    return date;
  }
  
  return null;
};

export const parseTimeRange = (text) => {
  const lower = text.toLowerCase();
  const now = new Date();
  
  if (lower.includes('today')) {
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    const end = new Date(now);
    end.setHours(23, 59, 59, 999);
    return { start, end };
  }
  
  if (lower.includes('yesterday')) {
    const start = new Date(now);
    start.setDate(start.getDate() - 1);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setHours(23, 59, 59, 999);
    return { start, end };
  }
  
  if (lower.includes('this week')) {
    const start = new Date(now);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1); // Monday
    start.setDate(diff);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    end.setHours(23, 59, 59, 999);
    return { start, end };
  }
  
  if (lower.includes('last week')) {
    const start = new Date(now);
    const day = start.getDay();
    const diff = start.getDate() - day - 6; // Previous Monday
    start.setDate(diff);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    end.setHours(23, 59, 59, 999);
    return { start, end };
  }
  
  if (lower.includes('this month')) {
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    return { start, end };
  }
  
  if (lower.includes('last month')) {
    const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const end = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
    return { start, end };
  }
  
  return null;
};

export const cleanMemoryText = (text, intent) => {
  let cleaned = text.trim();
  
  // Remove intent prefix
  if (intent === 'remember') {
    cleaned = cleaned.replace(/^remember\s+/i, '').replace(/^i\s+/i, 'I ');
  }
  
  return cleaned;
};

export const cleanReminderText = (text) => {
  // Extract the actual task from "remind me to X at Y"
  let cleaned = text.replace(/^remind\s+me\s+(to\s+)?/i, '');
  
  // Remove time references (including "at" before times)
  cleaned = cleaned.replace(/\s+(tomorrow|yesterday|today|tom|tmr|next\s+\w+)\s*/gi, ' ');
  cleaned = cleaned.replace(/\s+at\s+\d{1,2}:?\d{0,2}\s*(am|pm)?/gi, '');
  cleaned = cleaned.replace(/\s+\d{1,2}:?\d{0,2}\s*(am|pm)/gi, '');
  cleaned = cleaned.replace(/\s+in\s+\d+\s*(hour|minute|hr|min|h|m)s?/gi, '');
  
  // Remove date patterns like "February 10, 2026", "Feb 10", "on the 15th", "3 february"
  cleaned = cleaned.replace(/\s+on\s+(?:the\s+)?(?:\w+\s+)?\d{1,2}(?:st|nd|rd|th)?(?:,?\s+\d{4})?/gi, '');
  cleaned = cleaned.replace(/\s+(?:january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)\s+\d{1,2}(?:,?\s+\d{4})?/gi, '');
  cleaned = cleaned.replace(/\s+\d{1,2}\s+(?:january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)(?:\s+\d{4})?/gi, '');
  
  // Clean up extra whitespace and "at" at the start
  cleaned = cleaned.replace(/^at\s+/i, '');
  cleaned = cleaned.replace(/\s+/g, ' ');
  
  return cleaned.trim();
};
