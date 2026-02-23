import { ChatMessage } from '../types';
import { formatTime } from '../utils/dateUtils';

interface MessageBubbleProps {
  message: ChatMessage;
}

export const MessageBubble = ({ message }: MessageBubbleProps) => {
  const isUser = message.type === 'user';

  return (
    <div className={`flex mb-6 animate-message-in ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center mr-3 flex-shrink-0 mt-1 shadow-md">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
      )}
      
      <div className={`max-w-[85%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-1.5`}>
        <div
          className={`${
            isUser
              ? 'message-user'
              : 'message-agent'
          }`}
        >
          <p className="text-[0.9375rem] leading-relaxed whitespace-pre-wrap">{message.content}</p>
        </div>
        <div className={`text-xs dark:text-slate-500 text-slate-400 px-3`}>
          {formatTime(message.timestamp)}
        </div>
      </div>
      
      {isUser && (
        <div className="w-8 h-8 rounded-full dark:bg-slate-700 bg-slate-200 flex items-center justify-center ml-3 flex-shrink-0 mt-1 border-2 dark:border-slate-600 border-slate-300">
          <svg className="w-4 h-4 dark:text-slate-300 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
      )}
    </div>
  );
};
