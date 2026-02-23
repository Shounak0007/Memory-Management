import express from 'express';
import {
  getPending,
  getTriggered,
  cancelReminder,
  dismissReminder
} from '../controllers/reminderController.js';

const router = express.Router();

router.get('/pending', getPending);
router.get('/triggered', getTriggered);
router.post('/:id/dismiss', dismissReminder);
router.delete('/:id', cancelReminder);

export default router;
