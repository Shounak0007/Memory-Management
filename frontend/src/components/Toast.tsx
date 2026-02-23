import { useEffect } from 'react';

interface ToastProps {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: (id: string) => void;
}

export const Toast = ({ id, message, type, onClose }: ToastProps) => {
  useEffect(() => {
    // Keep reminder notifications longer (8 seconds), others 4 seconds
    const duration = message.includes('🔔') ? 8000 : 4000;
    const timer = setTimeout(() => onClose(id), duration);
    return () => clearTimeout(timer);
  }, [id, message, onClose]);

  const styles = {
    success: 'bg-green-500/90 backdrop-blur-sm border-green-400/30',
    error: 'bg-red-500/90 backdrop-blur-sm border-red-400/30',
    info: 'bg-primary-600/90 backdrop-blur-sm border-primary-500/30'
  }[type];

  return (
    <div
      className={`${styles} border text-white px-5 py-3.5 rounded-xl shadow-lg animate-slide-up flex items-center gap-3 min-w-[240px]`}
    >
      <span className="flex-1 text-sm">{message}</span>
      <button
        onClick={() => onClose(id)}
        className="text-white/70 hover:text-white text-lg leading-none transition-colors"
      >
        ×
      </button>
    </div>
  );
};

interface ToastContainerProps {
  toasts: Array<{ id: string; message: string; type: 'success' | 'error' | 'info' }>;
  onClose: (id: string) => void;
}

export const ToastContainer = ({ toasts, onClose }: ToastContainerProps) => {
  return (
    <div className="fixed top-6 right-6 z-50 flex flex-col gap-2">
      {toasts.map(toast => (
        <Toast key={toast.id} {...toast} onClose={onClose} />
      ))}
    </div>
  );
};
