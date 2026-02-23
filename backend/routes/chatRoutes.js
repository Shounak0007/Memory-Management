import express from 'express';
import {
  handleChat,
  getRecentMemories,
  getDashboardStats,
  deleteMemory,
  getChatHistory
} from '../controllers/chatController.js';

const router = express.Router();

router.post('/chat', handleChat);
router.get('/chat/history', getChatHistory);
router.get('/memories', getRecentMemories);
router.get('/stats', getDashboardStats);
router.delete('/memories/:id', deleteMemory);

export default router;
