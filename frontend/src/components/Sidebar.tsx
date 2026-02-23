import { useEffect, useState } from 'react';
import { Stats, Reminder } from '../types';
import { chatApi, reminderApi } from '../services/api';
import { formatDateTime } from '../utils/dateUtils';

interface SidebarProps {
  onRefresh: () => void;
}

export const Sidebar = ({ onRefresh }: SidebarProps) => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [activeTab, setActiveTab] = useState<'stats' | 'reminders'>('stats');

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    const [statsData, remindersData] = await Promise.all([
      chatApi.getStats(),
      reminderApi.getPending()
    ]);
    setStats(statsData);
    setReminders(remindersData);
  };

  const handleCancelReminder = async (id: string) => {
    try {
      await reminderApi.cancel(id);
      setReminders(prev => prev.filter(r => r._id !== id));
    } catch (error) {
      console.error('Failed to cancel reminder:', error);
    }
  };

  return (
    <div className="w-72 border-l dark:border-slate-800 border-slate-200 flex flex-col dark:bg-slate-900/60 bg-white/60 backdrop-blur-md">
      {/* Tabs */}
      <div className="flex border-b dark:border-slate-800 border-slate-200 px-4 pt-4">
        <button
          onClick={() => setActiveTab('stats')}
          className={`flex-1 px-3 py-2.5 text-sm font-medium transition-all rounded-t-lg ${
            activeTab === 'stats'
              ? 'dark:text-slate-50 text-slate-900 dark:bg-slate-800/60 bg-white border-2 dark:border-slate-700 border-slate-300 border-b-0'
              : 'dark:text-slate-400 text-slate-600 dark:hover:text-slate-300 hover:text-slate-900'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('reminders')}
          className={`flex-1 px-3 py-2.5 text-sm font-medium transition-all rounded-t-lg relative ${
            activeTab === 'reminders'
              ? 'dark:text-slate-50 text-slate-900 dark:bg-slate-800/60 bg-white border-2 dark:border-slate-700 border-slate-300 border-b-0'
              : 'dark:text-slate-400 text-slate-600 dark:hover:text-slate-300 hover:text-slate-900'
          }`}
        >
          Reminders
          {reminders.length > 0 && (
            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-primary-500 rounded-full shadow-lg"></span>
          )}
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'stats' && (
          <div className="space-y-4">
            {/* Summary Cards */}
            <div className="space-y-3">
              <div className="dark:bg-slate-800/80 bg-white border-2 dark:border-slate-700 border-slate-300 rounded-xl p-4 shadow-sm">
                <div className="text-2xl font-semibold dark:text-white text-slate-900 mb-0.5">
                  {stats?.today || 0}
                </div>
                <div className="text-xs dark:text-slate-300 text-slate-600">memories today</div>
              </div>
              <div className="dark:bg-slate-800/80 bg-white border-2 dark:border-slate-700 border-slate-300 rounded-xl p-4 shadow-sm">
                <div className="text-2xl font-semibold dark:text-white text-slate-900 mb-0.5">
                  {stats?.week || 0}
                </div>
                <div className="text-xs dark:text-slate-300 text-slate-600">this week</div>
              </div>
              <div className="dark:bg-slate-800/80 bg-white border-2 dark:border-slate-700 border-slate-300 rounded-xl p-4 shadow-sm">
                <div className="text-2xl font-semibold dark:text-white text-slate-900 mb-0.5">
                  {stats?.total || 0}
                </div>
                <div className="text-xs dark:text-slate-300 text-slate-600">total memories</div>
              </div>
            </div>

            {/* Category Breakdown */}
            {stats?.byCategory && Object.keys(stats.byCategory).length > 0 && (
              <div className="pt-2">
                <h3 className="text-xs font-medium dark:text-slate-400 text-slate-600 mb-3 uppercase tracking-wider">
                  By Category
                </h3>
                <div className="space-y-2">
                  {Object.entries(stats.byCategory)
                    .sort((a, b) => b[1] - a[1])
                    .map(([category, count]) => (
                      <div key={category} className="flex items-center justify-between py-1.5 px-2 rounded-lg dark:hover:bg-slate-800/40 hover:bg-slate-100">
                        <span className="text-sm dark:text-slate-200 text-slate-700 capitalize">
                          {category}
                        </span>
                        <span className="text-sm font-medium dark:text-slate-50 text-slate-900">
                          {count}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'reminders' && (
          <div className="space-y-3">
            {reminders.length === 0 ? (
              <div className="text-center py-12 dark:text-slate-500 text-slate-400">
                <svg className="w-10 h-10 mx-auto mb-2 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <p className="text-sm">No pending reminders</p>
              </div>
            ) : (
              reminders.map((reminder) => (
                <div
                  key={reminder._id}
                  className="dark:bg-slate-800/80 bg-white border-2 dark:border-slate-700 border-slate-300 rounded-xl p-3.5 group dark:hover:border-slate-600 hover:border-slate-400 transition-all shadow-sm"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-[0.9375rem] dark:text-white text-slate-900 line-clamp-2 leading-relaxed mb-1.5">
                        {reminder.text}
                      </p>
                      <p className="text-xs dark:text-slate-400 text-slate-500">
                        {formatDateTime(reminder.reminderTime)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleCancelReminder(reminder._id)}
                      className="opacity-0 group-hover:opacity-100 dark:text-slate-500 text-slate-400 hover:text-red-500 transition-all p-1 -mt-1"
                      title="Cancel"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Refresh Button */}
      <div className="border-t dark:border-slate-800 border-slate-200 p-4">
        <button
          onClick={() => {
            loadData();
            onRefresh();
          }}
          className="w-full px-4 py-2.5 dark:bg-slate-800/80 bg-white dark:hover:bg-slate-700 hover:bg-slate-50 border-2 dark:border-slate-700 border-slate-300 dark:hover:border-slate-600 hover:border-slate-400 dark:text-white text-slate-900 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>
    </div>
  );
};
