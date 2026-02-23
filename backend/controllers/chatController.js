import { processChatInput, getStats } from '../services/chatService.js';
import { scheduleReminder } from '../services/reminderService.js';
import Memory from '../models/Memory.js';
import ChatHistory from '../models/ChatHistory.js';

/**
 * Handle chat message from user
 */
export const handleChat = async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        response: 'Message cannot be empty.'
      });
    }

    // Save user message to chat history
    await ChatHistory.create({
      userId: req.userId,
      type: 'user',
      content: message,
      timestamp: new Date()
    });
    
    const result = await processChatInput(message, req.userId);
    
    // Save agent response to chat history
    await ChatHistory.create({
      userId: req.userId,
      type: 'agent',
      content: result.response,
      intent: result.intent,
      timestamp: new Date()
    });
    
    // If it's a remind intent and successful, schedule it
    if (result.intent === 'remind' && result.success && result.data) {
      await scheduleReminder(result.data.text, result.data.reminderTime, req.userId);
    }
    
    res.json(result);
  } catch (error) {
    console.error('Error in handleChat:', error);
    res.status(500).json({
      success: false,
      response: 'Something went wrong. Please try again.'
    });
  }
};

/**
 * Get recent memories
 */
export const getRecentMemories = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    const memories = await Memory.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .limit(limit);
    
    res.json({
      success: true,
      data: memories
    });
  } catch (error) {
    console.error('Error in getRecentMemories:', error);
    res.status(500).json({
      success: false,
      data: []
    });
  }
};

/**
 * Get dashboard statistics
 */
export const getDashboardStats = async (req, res) => {
  try {
    const stats = await getStats(req.userId);
    res.json(stats);
  } catch (error) {
    console.error('Error in getDashboardStats:', error);
    res.status(500).json({
      success: false,
      data: null
    });
  }
};

/**
 * Delete a memory
 */
export const deleteMemory = async (req, res) => {
  try {
    const { id } = req.params;
    
    await Memory.findOneAndDelete({ _id: id, userId: req.userId });
    
    res.json({
      success: true,
      response: 'Memory deleted.'
    });
  } catch (error) {
    console.error('Error in deleteMemory:', error);
    res.status(500).json({
      success: false,
      response: 'Failed to delete memory.'
    });
  }
};

/**
 * Get chat history for the user
 */
export const getChatHistory = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50; // Get last 50 messages by default
    
    const history = await ChatHistory.find({ userId: req.userId })
      .sort({ timestamp: -1 }) // Get most recent first
      .limit(limit);
    
    // Reverse to show oldest first (chronological order)
    const chronologicalHistory = history.reverse();
    
    res.json({
      success: true,
      data: chronologicalHistory
    });
  } catch (error) {
    console.error('Error in getChatHistory:', error);
    res.status(500).json({
      success: false,
      data: []
    });
  }
};
