export const TypingIndicator = () => {
  return (
    <div className="flex mb-6 animate-message-in">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center mr-3 flex-shrink-0 mt-1 shadow-md">
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      </div>
      <div className="message-agent w-16 h-11 flex items-center justify-center gap-1">
        <div className="w-1.5 h-1.5 dark:bg-slate-400 bg-slate-600 rounded-full animate-bounce" style={{ animationDelay: '0ms', animationDuration: '1s' }}></div>
        <div className="w-1.5 h-1.5 dark:bg-slate-400 bg-slate-600 rounded-full animate-bounce" style={{ animationDelay: '150ms', animationDuration: '1s' }}></div>
        <div className="w-1.5 h-1.5 dark:bg-slate-400 bg-slate-600 rounded-full animate-bounce" style={{ animationDelay: '300ms', animationDuration: '1s' }}></div>
      </div>
    </div>
  );
};
