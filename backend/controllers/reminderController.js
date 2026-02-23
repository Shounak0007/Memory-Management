import { 
  getPendingReminders, 
  getTriggeredReminders, 
  deleteReminder,
  dismissTriggeredReminder
} from '../services/reminderService.js';

/**
 * Get all pending reminders
 */
export const getPending = async (req, res) => {
  try {
    const result = await getPendingReminders(req.userId);
    res.json(result);
  } catch (error) {
    console.error('Error in getPending:', error);
    res.status(500).json({
      success: false,
      data: []
    });
  }
};

/**
 * Get recently triggered reminders
 */
export const getTriggered = async (req, res) => {
  try {
    const result = await getTriggeredReminders(req.userId);
    res.json(result);
  } catch (error) {
    console.error('Error in getTriggered:', error);
    res.status(500).json({
      success: false,
      data: []
    });
  }
};

/**
 * Mark triggered reminders as dismissed
 */
export const dismissReminder = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await dismissTriggeredReminder(id);
    res.json(result);
  } catch (error) {
    console.error('Error in dismissReminder:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to dismiss reminder.'
    });
  }
};

/**
 * Delete/cancel a reminder
 */
export const cancelReminder = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteReminder(id);
    res.json(result);
  } catch (error) {
    console.error('Error in cancelReminder:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to cancel reminder.'
    });
  }
};
