import React from 'react';
import {
  Menu,
  Sun,
  Moon,
  Plus,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Flame,
} from 'lucide-react';
import { useFitness } from '../../context/FitnessContext';
import { formatDate, getTodayDateString } from '../../utils/calculations';

interface HeaderProps {
  onToggleSidebar: () => void;
  onOpenQuickLog: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar, onOpenQuickLog }) => {
  const { activeTab, selectedDate, setSelectedDate, theme, toggleTheme } = useFitness();
  const today = getTodayDateString();

  const tabTitles: Record<string, string> = {
    dashboard: 'Fitness Overview',
    workouts: 'Workout Tracker',
    nutrition: 'Nutrition & Meals',
    progress: 'Progress & Analytics',
    goals: 'Fitness Targets',
    'ai-coach': 'FitTrack AI Coach',
    profile: 'Profile & Settings',
  };

  const handlePrevDay = () => {
    const [y, m, d] = selectedDate.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    date.setDate(date.getDate() - 1);
    const prev = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    setSelectedDate(prev);
  };

  const handleNextDay = () => {
    const [y, m, d] = selectedDate.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    date.setDate(date.getDate() + 1);
    const next = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    setSelectedDate(next);
  };

  const isToday = selectedDate === today;

  return (
    <header className="h-16 px-4 md:px-6 bg-neutral-900/90 backdrop-blur-md border-b border-neutral-800 sticky top-0 z-30 flex items-center justify-between">
      {/* Left: Mobile hamburger & Context title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 lg:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-base md:text-lg font-bold text-white tracking-tight">
            {tabTitles[activeTab] || 'FitTrack Pro'}
          </h1>
          <div className="text-xs text-neutral-400 hidden sm:block">
            {isToday ? 'Live metrics for today' : `Viewing records for ${formatDate(selectedDate)}`}
          </div>
        </div>
      </div>

      {/* Right: Date navigation, quick log & theme toggle */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Date Navigator */}
        <div className="flex items-center bg-neutral-950/70 border border-neutral-800 rounded-lg p-0.5 text-xs text-neutral-300">
          <button
            onClick={handlePrevDay}
            title="Previous Day"
            className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800/60 rounded"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1.5 px-2">
            <Calendar className="w-3.5 h-3.5 text-emerald-400 hidden xs:block" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => e.target.value && setSelectedDate(e.target.value)}
              className="bg-transparent text-xs text-neutral-200 border-none outline-none cursor-pointer tabular-nums"
            />
          </div>

          <button
            onClick={handleNextDay}
            title="Next Day"
            className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800/60 rounded"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {!isToday && (
            <button
              onClick={() => setSelectedDate(today)}
              className="ml-1 px-2 py-1 text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 rounded"
            >
              Today
            </button>
          )}
        </div>

        {/* Quick Log Button */}
        <button
          onClick={onOpenQuickLog}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-neutral-950 font-semibold text-xs rounded-lg transition-colors shadow-sm whitespace-nowrap shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Log Activity</span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          className="p-2 text-neutral-400 hover:text-neutral-200 bg-neutral-800/50 hover:bg-neutral-800 border border-neutral-700/60 rounded-lg transition-colors"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-neutral-300" />}
        </button>
      </div>
    </header>
  );
};
