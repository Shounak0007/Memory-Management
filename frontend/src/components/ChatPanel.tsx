import { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { MemoryList } from './MemoryList';

interface ChatPanelProps {
  messages: ChatMessage[];
  isTyping: boolean;
  onSendMessage: (message: string) => void;
  isLoadingHistory?: boolean;
}

const SUGGESTIONS = [
  'remember I studied system design for 2 hours',
  'remind me tomorrow at 6 pm to revise GRE',
  'show what I did yesterday',
  'summarize my week'
];

export const ChatPanel = ({ messages, isTyping, onSendMessage, isLoadingHistory = false }: ChatPanelProps) => {
  const [input, setInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    onSendMessage(input.trim());
    setInput('');
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (!isTyping) {
      onSendMessage(suggestion);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="max-w-chat mx-auto">
          {isLoadingHistory ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center px-4 py-16 animate-fade-in">
              <div className="w-16 h-16 mb-8 rounded-2xl bg-gradient-to-br from-primary-500/10 to-primary-600/10 flex items-center justify-center">
                <svg className="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium dark:text-white text-slate-900 mb-3 tracking-tight">
                How can I help you today?
              </h3>
              <p className="dark:text-slate-300 text-slate-600 mb-10 max-w-md leading-relaxed">
                I'm your memory agent. Tell me what you'd like to remember, and I'll keep track of it for you.
              </p>
              <div className="grid grid-cols-1 gap-3 w-full max-w-lg">
                {SUGGESTIONS.map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="text-left px-5 py-3.5 
                      dark:bg-slate-800/80 dark:hover:bg-slate-700 dark:border-slate-700 dark:hover:border-slate-600 dark:text-slate-50
                      bg-white hover:bg-slate-50 border-slate-300 hover:border-slate-400 text-slate-900
                      border-2 rounded-xl text-[0.9375rem] transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <span className="text-primary-500 mr-2 opacity-70">→</span>
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <div key={message.id}>
                  <MessageBubble message={message} />
                  {message.type === 'agent' && message.data && Array.isArray(message.data) && message.data.length > 0 && (
                    <div className="mb-6 ml-11">
                      <MemoryList memories={message.data} />
                    </div>
                  )}
                </div>
              ))}

              {isTyping && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="px-6 pb-8 pt-4">
        <div className="max-w-chat mx-auto">
          <form onSubmit={handleSubmit} className="relative">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="remember I studied GRE for 2 hours..."
              className={`w-full pl-5 pr-14 py-4 
                dark:bg-slate-900/90 dark:text-white dark:placeholder-slate-500
                bg-white text-slate-900 placeholder-slate-400
                backdrop-blur-sm border-2 ${
                isFocused 
                  ? 'border-primary-500 shadow-lg shadow-primary-500/20' 
                  : 'dark:border-slate-700 border-slate-300'
              } rounded-2xl focus:outline-none text-[0.9375rem] transition-all duration-300`}
              disabled={isTyping}
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-primary-600 hover:bg-primary-500 disabled:bg-slate-400 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl transition-all duration-200 shadow-md"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
