import Reminder from '../models/Reminder.js';

let activeReminders = new Map(); // In-memory storage for active timers

/**
 * Schedule a new reminder
 */
export const scheduleReminder = async (text, reminderTime, userId) => {
  try {
    const reminder = new Reminder({
      userId,
      text,
      reminderTime
    });
    
    await reminder.save();
    
    // Set up in-memory timer
    const delay = new Date(reminderTime) - new Date();
    const MAX_TIMEOUT = 2147483647; // Maximum setTimeout delay (~24.8 days)
    
    console.log(`📅 Scheduling reminder: "${text}" for ${new Date(reminderTime).toLocaleString()}`);
    console.log(`⏱️  Delay: ${Math.floor(delay / 1000 / 60)} minutes (${delay}ms)`);
    
    if (delay > 0 && delay <= MAX_TIMEOUT) {
      const timerId = setTimeout(() => {
        triggerReminder(reminder._id);
      }, delay);
      
      activeReminders.set(reminder._id.toString(), timerId);
      console.log(`✓ Timer set for reminder ${reminder._id}`);
    } else if (delay <= 0) {
      console.log(`⚠️  Reminder time is in the past, triggering immediately`);
      await triggerReminder(reminder._id);
    } else {
      console.log(`⚠️  Delay too long for setTimeout, will trigger on server restart`);
    }
    
    return {
      success: true,
      data: reminder
    };
  } catch (error) {
    console.error('Error scheduling reminder:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Trigger a reminder (mark as triggered)
 */
const triggerReminder = async (reminderId) => {
  try {
    const reminder = await Reminder.findByIdAndUpdate(
      reminderId,
      {
        status: 'triggered',
        triggeredAt: new Date()
      },
      { new: true }
    );
    
    activeReminders.delete(reminderId.toString());
    
    console.log(`🔔 Reminder ${reminderId} triggered: "${reminder?.text}"`);
  } catch (error) {
    console.error('Error triggering reminder:', error);
  }
};

/**
 * Get all pending reminders
 */
export const getPendingReminders = async (userId) => {
  try {
    const reminders = await Reminder.find({ userId, status: 'pending' })
      .sort({ reminderTime: 1 });
    
    return {
      success: true,
      data: reminders
    };
  } catch (error) {
    console.error('Error getting reminders:', error);
    return {
      success: false,
      data: []
    };
  }
};

/**
 * Get recently triggered reminders (for notifications)
 * Only returns reminders that haven't been dismissed yet
 */
export const getTriggeredReminders = async (userId) => {
  try {
    const reminders = await Reminder.find({
      userId,
      status: 'triggered',
      dismissed: { $ne: true } // Only get non-dismissed reminders
    }).sort({ triggeredAt: -1 });
    
    return {
      success: true,
      data: reminders
    };
  } catch (error) {
    console.error('Error getting triggered reminders:', error);
    return {
      success: false,
      data: []
    };
  }
};

/**
 * Mark triggered reminders as dismissed
 */
export const dismissTriggeredReminder = async (reminderId) => {
  try {
    await Reminder.findByIdAndUpdate(reminderId, {
      dismissed: true,
      dismissedAt: new Date()
    });
    
    return {
      success: true
    };
  } catch (error) {
    console.error('Error dismissing reminder:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Delete a reminder
 */
export const deleteReminder = async (reminderId) => {
  try {
    // Clear timer if exists
    if (activeReminders.has(reminderId)) {
      clearTimeout(activeReminders.get(reminderId));
      activeReminders.delete(reminderId);
    }
    
    await Reminder.findByIdAndUpdate(reminderId, { status: 'cancelled' });
    
    return {
      success: true
    };
  } catch (error) {
    console.error('Error deleting reminder:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Initialize reminder system on server start
 * Reschedule all pending reminders
 */
export const initializeReminderSystem = async () => {
  try {
    const pendingReminders = await Reminder.find({ status: 'pending' });
    
    for (const reminder of pendingReminders) {
      const delay = new Date(reminder.reminderTime) - new Date();
      
      if (delay > 0) {
        const timerId = setTimeout(() => {
          triggerReminder(reminder._id);
        }, delay);
        
        activeReminders.set(reminder._id.toString(), timerId);
      } else {
        // Past due - trigger immediately
        await triggerReminder(reminder._id);
      }
    }
    
    console.log(`✓ Initialized ${activeReminders.size} active reminders`);
  } catch (error) {
    console.error('Error initializing reminder system:', error);
  }
};
