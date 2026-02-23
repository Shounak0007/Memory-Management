import { useState, useEffect } from 'react';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

let toastIdCounter = 0;
const activeToasts = new Set<string>();

export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(() => {
        const oldestToast = toasts[0];
        setToasts(prev => prev.slice(1));
        activeToasts.delete(oldestToast.message);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [toasts]);

  const showToast = (message: string, type: Toast['type'] = 'info') => {
    // Prevent duplicate toasts
    if (activeToasts.has(message)) return;
    
    activeToasts.add(message);
    const id = `toast-${toastIdCounter++}`;
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => {
      const toast = prev.find(t => t.id === id);
      if (toast) activeToasts.delete(toast.message);
      return prev.filter(t => t.id !== id);
    });
  };

  return { toasts, showToast, removeToast };
};
