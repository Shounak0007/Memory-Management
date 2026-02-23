import { Memory } from '../types';
import { formatDate } from '../utils/dateUtils';

interface MemoryListProps {
  memories: Memory[];
  onDelete?: (id: string) => void;
}

const categoryColors: Record<string, string> = {
  study: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30',
  job: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30',
  task: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/30',
  health: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30',
  event: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/30',
  note: 'dark:bg-slate-700/40 bg-slate-200/60 dark:text-slate-300 text-slate-700 dark:border-slate-600/30 border-slate-400/30'
};

export const MemoryList = ({ memories, onDelete }: MemoryListProps) => {
  if (memories.length === 0) {
    return (
      <div className="text-center py-6 dark:text-slate-500 text-slate-400">
        <svg className="w-12 h-12 mx-auto mb-2 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p className="text-sm">No memories found</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {memories.map((memory) => (
        <div
          key={memory._id}
          className="dark:bg-slate-800/80 bg-white backdrop-blur-sm border-2 dark:border-slate-700 border-slate-300 rounded-xl p-4 dark:hover:border-slate-600 hover:border-slate-400 transition-all duration-200 group shadow-sm"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2.5">
                <span className={`px-2.5 py-1 rounded-lg text-xs font-medium border-2 ${categoryColors[memory.category]}`}>
                  {memory.category}
                </span>
                <span className="text-xs dark:text-slate-400 text-slate-500">
                  {formatDate(memory.eventTime)}
                </span>
              </div>
              <p className="text-[0.9375rem] dark:text-white text-slate-900 leading-relaxed mb-2">
                {memory.text}
              </p>
              {memory.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {memory.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 text-xs dark:bg-slate-700/60 bg-slate-100 dark:text-slate-400 text-slate-600 rounded-md border dark:border-slate-600 border-slate-300"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
              {memory.metadata?.duration && (
                <div className="mt-2 text-xs dark:text-slate-500 text-slate-500">
                  Duration: {memory.metadata.duration}
                </div>
              )}
            </div>
            {onDelete && (
              <button
                onClick={() => onDelete(memory._id)}
                className="opacity-0 group-hover:opacity-100 dark:text-slate-500 text-slate-400 hover:text-red-500 transition-all p-1"
                title="Delete"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
