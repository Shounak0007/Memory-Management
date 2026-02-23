import Memory from '../models/Memory.js';
import mongoose from 'mongoose';
import {
  parseIntent,
  extractCategory,
  extractTags,
  extractDuration,
  parseTimeReference,
  parseTimeRange,
  cleanMemoryText,
  cleanReminderText
} from './nlpParser.js';

/**
 * Process user chat input and route to appropriate handler
 */
export const processChatInput = async (input, userId) => {
  const intent = parseIntent(input);
  
  switch (intent) {
    case 'greeting':
      return handleGreetingIntent(input);
    case 'remember':
      return await handleRememberIntent(input, userId);
    case 'remind':
      return await handleRemindIntent(input, userId);
    case 'show':
      return await handleShowIntent(input, userId);
    case 'summarize':
      return await handleSummarizeIntent(input, userId);
    default:
      return {
        success: false,
        response: "I'm not sure what you mean. Try 'remember', 'remind me', 'show', or 'summarize'.",
        intent: 'unknown'
      };
  }
};

/**
 * Handle "greeting" intent - respond to user greetings
 */
const handleGreetingIntent = (input) => {
  const lower = input.toLowerCase();
  
  const responses = [
    "Hi there! I'm your Memory Agent. I can help you remember things, set reminders, and retrieve your memories. What can I do for you?",
    "Hello! I'm here to help you manage your memories and reminders. Feel free to ask me anything!",
    "Hey! Good to see you. I'm your personal memory assistant. How can I help you today?",
    "Hi! I'm doing great, thanks for asking! I'm here to help you remember things and stay organized. What would you like to do?"
  ];
  
  // If user asks "how are you", use the fourth response more often
  if (lower.includes('how are you') || lower.includes('how r u')) {
    return {
      success: true,
      response: responses[3],
      intent: 'greeting'
    };
  }
  
  // Otherwise, pick a random greeting response
  const randomResponse = responses[Math.floor(Math.random() * responses.length)];
  
  return {
    success: true,
    response: randomResponse,
    intent: 'greeting'
  };
};

/**
 * Handle "remember" intent - store a new memory
 */
const handleRememberIntent = async (input, userId) => {
  try {
    const cleanedText = cleanMemoryText(input, 'remember');
    const category = extractCategory(cleanedText);
    const tags = extractTags(cleanedText);
    const duration = extractDuration(cleanedText);
    const eventTime = parseTimeReference(cleanedText) || new Date();
    
    const metadata = {};
    if (duration) metadata.duration = duration;
    
    const memory = new Memory({
      userId,
      text: cleanedText,
      category,
      tags,
      eventTime,
      metadata
    });
    
    await memory.save();
    
    return {
      success: true,
      response: `Got it! Stored as ${category}${tags.length > 0 ? ` (${tags.join(', ')})` : ''}.`,
      intent: 'remember',
      data: memory
    };
  } catch (error) {
    console.error('Error in handleRememberIntent:', error);
    return {
      success: false,
      response: 'Sorry, I had trouble storing that memory.',
      intent: 'remember'
    };
  }
};

/**
 * Handle "remind" intent - schedule a reminder
 */
const handleRemindIntent = async (input, userId) => {
  try {
    const reminderTime = parseTimeReference(input);
    
    if (!reminderTime) {
      return {
        success: false,
        response: "I couldn't figure out when to remind you. Try 'tomorrow at 6 pm' or 'in 2 hours'.",
        intent: 'remind'
      };
    }
    
    const cleanedText = cleanReminderText(input);
    
    return {
      success: true,
      response: `I'll remind you on ${reminderTime.toLocaleString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        hour: 'numeric', 
        minute: '2-digit' 
      })}.`,
      intent: 'remind',
      data: {
        text: cleanedText,
        reminderTime
      }
    };
  } catch (error) {
    console.error('Error in handleRemindIntent:', error);
    return {
      success: false,
      response: 'Sorry, I had trouble setting that reminder.',
      intent: 'remind'
    };
  }
};

/**
 * Handle "show" intent - retrieve memories
 */
const handleShowIntent = async (input, userId) => {
  try {
    const lower = input.toLowerCase();
    let query = { userId };
    
    // Time-based queries
    const timeRange = parseTimeRange(input);
    if (timeRange) {
      query.eventTime = {
        $gte: timeRange.start,
        $lte: timeRange.end
      };
    }
    
    // Category-based queries
    for (const category of ['study', 'job', 'task', 'health', 'event', 'note']) {
      if (lower.includes(category) || lower.includes(category + 's')) {
        query.category = category;
        break;
      }
    }
    
    // Tag-based queries
    const potentialTags = ['gre', 'interview', 'backend', 'frontend', 'headache', 'razorpay', 'google', 'amazon'];
    for (const tag of potentialTags) {
      if (lower.includes(tag)) {
        query.tags = tag;
        break;
      }
    }
    
    const memories = await Memory.find(query)
      .sort({ eventTime: -1 })
      .limit(20);
    
    if (memories.length === 0) {
      return {
        success: true,
        response: "I don't have any memories matching that.",
        intent: 'show',
        data: []
      };
    }
    
    return {
      success: true,
      response: `Found ${memories.length} ${memories.length === 1 ? 'memory' : 'memories'}.`,
      intent: 'show',
      data: memories
    };
  } catch (error) {
    console.error('Error in handleShowIntent:', error);
    return {
      success: false,
      response: 'Sorry, I had trouble finding those memories.',
      intent: 'show'
    };
  }
};

/**
 * Handle "summarize" intent - generate summary
 */
const handleSummarizeIntent = async (input, userId) => {
  try {
    const timeRange = parseTimeRange(input) || (() => {
      // Default to today if no time specified
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      const end = new Date();
      end.setHours(23, 59, 59, 999);
      return { start, end };
    })();
    
    const memories = await Memory.find({
      userId,
      eventTime: {
        $gte: timeRange.start,
        $lte: timeRange.end
      }
    }).sort({ eventTime: -1 });
    
    if (memories.length === 0) {
      return {
        success: true,
        response: "No activities to summarize for that period.",
        intent: 'summarize',
        data: { summary: '', period: '', memories: [] }
      };
    }
    
    // Generate concise summary
    const categoryCounts = memories.reduce((acc, m) => {
      acc[m.category] = (acc[m.category] || 0) + 1;
      return acc;
    }, {});
    
    const summaryParts = Object.entries(categoryCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([cat, count]) => `${count} ${cat}${count > 1 ? ' items' : ''}`);
    
    const period = input.toLowerCase().includes('week') ? 'this week' : 
                   input.toLowerCase().includes('yesterday') ? 'yesterday' : 'today';
    
    const summary = `You had ${summaryParts.join(', ')} ${period}. ${
      memories.length > 3 ? 'Pretty productive!' : 'Light day.'
    }`;
    
    return {
      success: true,
      response: summary,
      intent: 'summarize',
      data: {
        summary,
        period,
        memories,
        stats: categoryCounts
      }
    };
  } catch (error) {
    console.error('Error in handleSummarizeIntent:', error);
    return {
      success: false,
      response: 'Sorry, I had trouble generating that summary.',
      intent: 'summarize'
    };
  }
};

/**
 * Get statistics for dashboard
 */
export const getStats = async (userId) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const week = new Date();
    week.setDate(week.getDate() - 7);
    week.setHours(0, 0, 0, 0);
    
    // Convert userId to ObjectId for aggregation
    const userObjectId = new mongoose.Types.ObjectId(userId);
    
    const [totalMemories, todayCount, weekCount, categoryStats] = await Promise.all([
      Memory.countDocuments({ userId }),
      Memory.countDocuments({ userId, createdAt: { $gte: today } }),
      Memory.countDocuments({ userId, createdAt: { $gte: week } }),
      Memory.aggregate([
        { $match: { userId: userObjectId } },
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 }
          }
        }
      ])
    ]);
    
    return {
      success: true,
      data: {
        total: totalMemories,
        today: todayCount,
        week: weekCount,
        byCategory: categoryStats.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {})
      }
    };
  } catch (error) {
    console.error('Error in getStats:', error);
    return {
      success: false,
      data: null
    };
  }
};
