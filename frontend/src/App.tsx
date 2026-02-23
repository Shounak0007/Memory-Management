import { useState, useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { Header } from './components/Header';
import { ChatPanel } from './components/ChatPanel';
import { Sidebar } from './components/Sidebar';
import { ToastContainer } from './components/Toast';
import { useToast } from './hooks/useToast';
import { chatApi, reminderApi } from './services/api';
import { ChatMessage } from './types';

function AppContent() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const { toasts, showToast, removeToast } = useToast();
  const [refreshKey, setRefreshKey] = useState(0);
  const [shownReminders, setShownReminders] = useState<Set<string>>(new Set());
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  // Load chat history on mount
  useEffect(() => {
    const loadChatHistory = async () => {
      try {
        const history = await chatApi.getChatHistory();
        const loadedMessages: ChatMessage[] = history.map((msg: any, index: number) => ({
          id: msg._id || `history-${index}`,
          type: msg.type,
          content: msg.content,
          timestamp: new Date(msg.timestamp),
          intent: msg.intent
        }));
        setMessages(loadedMessages);
      } catch (error) {
        console.error('Failed to load chat history:', error);
      } finally {
        setIsLoadingHistory(false);
      }
    };

    loadChatHistory();
  }, []);

  // Check for triggered reminders periodically
  useEffect(() => {
    const checkReminders = async () => {
      try {
        const triggered = await reminderApi.getTriggered();
        
        // Use for...of to properly handle async operations
        for (const reminder of triggered) {
          // Only show if not already shown
          if (!shownReminders.has(reminder._id)) {
            // Dismiss in backend FIRST to prevent re-showing on logout/login
            try {
              await reminderApi.dismiss(reminder._id);
            } catch (error) {
              console.error('Failed to dismiss reminder:', error);
              continue; // Skip showing if dismiss fails
            }
            
            // Show toast notification
            showToast(`🔔 Reminder: ${reminder.text}`, 'info');
            
            // Add reminder message to chat
            const reminderMessage: ChatMessage = {
              id: `reminder-${reminder._id}-${Date.now()}`,
              type: 'agent',
              content: `🔔 Reminder: ${reminder.text}\n\nThis reminder was scheduled for ${new Date(reminder.reminderTime).toLocaleString()}.`,
              timestamp: new Date()
            };
            
            setMessages(prev => [...prev, reminderMessage]);
            
            // Mark as shown in memory
            setShownReminders(prev => new Set(prev).add(reminder._id));
          }
        }
      } catch (error) {
        console.error('Failed to check reminders:', error);
      }
    };

    checkReminders();
    const interval = setInterval(checkReminders, 10000); // Check every 10 seconds
    return () => clearInterval(interval);
  }, [shownReminders]);

  const handleSendMessage = async (messageText: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: messageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const response = await chatApi.sendMessage(messageText);

      // Simulate slight delay for natural feel
      await new Promise(resolve => setTimeout(resolve, 600));

      const agentMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'agent',
        content: response.response || 'I received your message.',
        timestamp: new Date(),
        intent: response.intent,
        data: response.data
      };

      setMessages(prev => [...prev, agentMessage]);

      if (response.success) {
        showToast(
          response.intent === 'remember' ? 'Memory saved' :
          response.intent === 'remind' ? 'Reminder set' :
          response.intent === 'show' ? 'Memories retrieved' :
          response.intent === 'summarize' ? 'Summary generated' :
          'Done',
          'success'
        );
      }

      setRefreshKey(prev => prev + 1);
    } catch (error) {
      console.error('Failed to send message:', error);
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'agent',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
      showToast('Failed to process message', 'error');
    } finally {
      setIsTyping(false);
    }
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col">
          <ChatPanel
            messages={messages}
            isTyping={isTyping}
            onSendMessage={handleSendMessage}
            isLoadingHistory={isLoadingHistory}
          />
        </div>
        <Sidebar key={refreshKey} onRefresh={handleRefresh} />
      </div>
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
