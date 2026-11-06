import React, { useState, useEffect } from 'react';
import {
  Dumbbell,
  Plus,
  Search,
  Filter,
  Calendar as CalendarIcon,
  Clock,
  Flame,
  Trash2,
  Edit2,
  Play,
  Pause,
  RotateCcw,
  Check,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { useFitness } from '../../context/FitnessContext';
import { Workout, WorkoutType, WorkoutIntensity } from '../../types/fitness';
import { estimateCaloriesBurned, formatDate, getTodayDateString } from '../../utils/calculations';

interface WorkoutTrackerViewProps {
  onOpenQuickLog: () => void;
}

export const WorkoutTrackerView: React.FC<WorkoutTrackerViewProps> = ({ onOpenQuickLog }) => {
  const { workouts, addWorkout, updateWorkout, deleteWorkout, selectedDate, setSelectedDate, user } = useFitness();

  const [activeSubTab, setActiveSubTab] = useState<'list' | 'calendar' | 'stopwatch'>('list');
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<'date' | 'duration' | 'calories'>('date');

  // Edit Workout Modal State
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);

  // Live Workout Timer / Stopwatch State
  const [timerRunning, setTimerRunning] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [activeWorkoutType, setActiveWorkoutType] = useState<WorkoutType>('Gym');
  const [timerIntensity, setTimerIntensity] = useState<WorkoutIntensity>('Moderate');
  const [timerTitle, setTimerTitle] = useState('Live Workout Session');

  // Calendar month state
  const [calendarMonth, setCalendarMonth] = useState(() => new Date());

  // Timer interval effect
  useEffect(() => {
    let interval: any = null;
    if (timerRunning) {
      interval = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    } else if (!timerRunning && secondsElapsed !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerRunning, secondsElapsed]);

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    const hrs = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${remainingMins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleFinishTimerWorkout = () => {
    const durationMinutes = Math.max(1, Math.round(secondsElapsed / 60));
    const caloriesBurned = estimateCaloriesBurned(activeWorkoutType, timerIntensity, durationMinutes, user.weightKg);

    addWorkout({
      type: activeWorkoutType,
      title: timerTitle || `${activeWorkoutType} Live Session`,
      durationMinutes,
      caloriesBurned,
      date: getTodayDateString(),
      intensity: timerIntensity,
      notes: `Logged via Live Workout Stopwatch. Total elapsed time: ${formatTimer(secondsElapsed)}.`,
    });

    setTimerRunning(false);
    setSecondsElapsed(0);
    setActiveSubTab('list');
  };

  // Filtered & Sorted Workouts
  const filteredWorkouts = workouts
    .filter((w) => {
      const matchesType = filterType === 'all' || w.type.toLowerCase() === filterType.toLowerCase();
      const matchesSearch =
        w.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (w.notes && w.notes.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesType && matchesSearch;
    })
    .sort((a, b) => {
      if (sortField === 'duration') return b.durationMinutes - a.durationMinutes;
      if (sortField === 'calories') return b.caloriesBurned - a.caloriesBurned;
      return b.date.localeCompare(a.date);
    });

  // Calendar calculations
  const year = calendarMonth.getFullYear();
  const month = calendarMonth.getMonth();
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const handlePrevMonth = () => setCalendarMonth(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCalendarMonth(new Date(year, month + 1, 1));

  // Edit modal submit
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingWorkout) return;
    updateWorkout(editingWorkout.id, {
      title: editingWorkout.title,
      type: editingWorkout.type,
      durationMinutes: Number(editingWorkout.durationMinutes),
      caloriesBurned: Number(editingWorkout.caloriesBurned),
      intensity: editingWorkout.intensity,
      distanceKm: editingWorkout.distanceKm ? Number(editingWorkout.distanceKm) : undefined,
      notes: editingWorkout.notes,
    });
    setEditingWorkout(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner with Actions & Subtab Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-neutral-900 border border-neutral-800">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Dumbbell className="w-5 h-5 text-emerald-400" />
            <span>Workout Management & History</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Track exercises, view scheduled workouts on the calendar, or start a live session
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Subtabs */}
          <div className="flex bg-neutral-950 p-1 rounded-lg border border-neutral-800 text-xs">
            <button
              onClick={() => setActiveSubTab('list')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
                activeSubTab === 'list'
                  ? 'bg-neutral-800 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Log List
            </button>
            <button
              onClick={() => setActiveSubTab('calendar')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
                activeSubTab === 'calendar'
                  ? 'bg-neutral-800 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Calendar
            </button>
            <button
              onClick={() => setActiveSubTab('stopwatch')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors flex items-center gap-1.5 ${
                activeSubTab === 'stopwatch'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Live Stopwatch</span>
            </button>
          </div>

          <button
            onClick={onOpenQuickLog}
            className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-neutral-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-sm whitespace-nowrap shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Workout</span>
          </button>
        </div>
      </div>

      {/* LIVE STOPWATCH TAB */}
      {activeSubTab === 'stopwatch' && (
        <div className="p-8 rounded-2xl bg-neutral-900 border border-neutral-800 text-center max-w-xl mx-auto space-y-6">
          <div>
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              Real-Time Workout Tracker
            </span>
            <h3 className="text-xl font-bold text-white mt-1">Live Training Session</h3>
          </div>

          {/* Time display */}
          <div className="py-6 px-4 bg-neutral-950 rounded-2xl border border-neutral-800/80 shadow-inner">
            <div className="text-5xl md:text-6xl font-black text-emerald-400 font-mono tabular-nums tracking-wider">
              {formatTimer(secondsElapsed)}
            </div>
            <div className="text-xs text-neutral-400 mt-2">
              Est. Burn: ~{estimateCaloriesBurned(activeWorkoutType, timerIntensity, Math.max(1, Math.round(secondsElapsed / 60)), user.weightKg)} kcal
            </div>
          </div>

          {/* Configuration controls */}
          <div className="grid grid-cols-2 gap-3 text-left">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Workout Activity
              </label>
              <select
                value={activeWorkoutType}
                onChange={(e) => setActiveWorkoutType(e.target.value as WorkoutType)}
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-neutral-200 focus:outline-none focus:border-emerald-500"
              >
                {(['Gym', 'Running', 'Cycling', 'Cardio', 'HIIT', 'Yoga', 'Walking', 'Swimming'] as WorkoutType[]).map(
                  (t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  )
                )}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Intensity Level
              </label>
              <select
                value={timerIntensity}
                onChange={(e) => setTimerIntensity(e.target.value as WorkoutIntensity)}
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-neutral-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="Light">Light</option>
                <option value="Moderate">Moderate</option>
                <option value="High">High</option>
                <option value="Extreme">Extreme</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1 text-left">
              Session Focus / Name
            </label>
            <input
              type="text"
              value={timerTitle}
              onChange={(e) => setTimerTitle(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-neutral-200 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-center gap-3 pt-2">
            {!timerRunning ? (
              <button
                onClick={() => setTimerRunning(true)}
                className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-neutral-950 font-bold text-sm rounded-xl transition-colors flex items-center gap-2 shadow-lg shadow-emerald-500/20"
              >
                <Play className="w-4 h-4 fill-neutral-950" />
                <span>{secondsElapsed === 0 ? 'Start Workout' : 'Resume'}</span>
              </button>
            ) : (
              <button
                onClick={() => setTimerRunning(false)}
                className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold text-sm rounded-xl transition-colors flex items-center gap-2"
              >
                <Pause className="w-4 h-4 fill-neutral-950" />
                <span>Pause</span>
              </button>
            )}

            {secondsElapsed > 0 && (
              <>
                <button
                  onClick={handleFinishTimerWorkout}
                  className="px-5 py-2.5 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-400 font-bold text-sm rounded-xl transition-colors flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Finish & Log</span>
                </button>
                <button
                  onClick={() => {
                    setTimerRunning(false);
                    setSecondsElapsed(0);
                  }}
                  className="p-2.5 text-neutral-400 hover:text-rose-400 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 rounded-xl transition-colors"
                  title="Reset Timer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* CALENDAR VIEW */}
      {activeSubTab === 'calendar' && (
        <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                {monthNames[month]} {year}
              </h3>
              <p className="text-xs text-neutral-400">
                Click any day to inspect its workouts or set as the active date
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevMonth}
                className="p-1.5 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 rounded-lg text-neutral-300"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-1.5 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 rounded-lg text-neutral-300"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2 text-center text-xs">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <div key={d} className="font-semibold text-neutral-500 py-1 uppercase tracking-wider text-[11px]">
                {d}
              </div>
            ))}

            {/* Empty slots for start of month */}
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <div key={`empty-${i}`} className="h-20 rounded-lg bg-neutral-950/20 border border-transparent" />
            ))}

            {/* Month days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
              const dayWorkouts = workouts.filter((w) => w.date === dateStr);
              const isSelected = selectedDate === dateStr;
              const isToday = dateStr === getTodayDateString();

              return (
                <div
                  key={dayNum}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`min-h-[80px] p-2 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-emerald-500/10 border-emerald-500/50 ring-1 ring-emerald-500/30'
                      : 'bg-neutral-950/60 border-neutral-800/80 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold ${
                        isToday
                          ? 'w-5 h-5 rounded-full bg-emerald-500 text-neutral-950 flex items-center justify-center font-black'
                          : 'text-neutral-300'
                      }`}
                    >
                      {dayNum}
                    </span>
                    {dayWorkouts.length > 0 && (
                      <span className="text-[10px] text-emerald-400 font-bold tabular-nums">
                        {dayWorkouts.reduce((acc, w) => acc + w.caloriesBurned, 0)} kcal
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 mt-1 overflow-hidden">
                    {dayWorkouts.slice(0, 2).map((w) => (
                      <div
                        key={w.id}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-200 truncate font-medium border border-neutral-700/50"
                      >
                        {w.title}
                      </div>
                    ))}
                    {dayWorkouts.length > 2 && (
                      <div className="text-[9px] text-neutral-500 text-center font-bold">
                        +{dayWorkouts.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* LOG LIST VIEW */}
      {activeSubTab === 'list' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-xl bg-neutral-900 border border-neutral-800">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search workouts by title or notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-neutral-200 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Filter by Category */}
            <div className="flex items-center gap-2">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-1.5 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-neutral-300 focus:outline-none focus:border-emerald-500"
              >
                <option value="all">All Activities ({workouts.length})</option>
                <option value="Gym">Gym / Strength</option>
                <option value="Running">Running</option>
                <option value="Walking">Walking</option>
                <option value="Cycling">Cycling</option>
                <option value="Yoga">Yoga</option>
                <option value="Cardio">Cardio</option>
                <option value="HIIT">HIIT</option>
                <option value="Swimming">Swimming</option>
              </select>

              {/* Sort */}
              <select
                value={sortField}
                onChange={(e) => setSortField(e.target.value as any)}
                className="px-3 py-1.5 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-neutral-300 focus:outline-none focus:border-emerald-500"
              >
                <option value="date">Sort: Recent First</option>
                <option value="duration">Sort: Longest Duration</option>
                <option value="calories">Sort: Most Calories</option>
              </select>
            </div>
          </div>

          {/* Workout Cards */}
          {filteredWorkouts.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
              <div className="w-12 h-12 rounded-full bg-neutral-800 text-neutral-500 flex items-center justify-center mx-auto">
                <Dumbbell className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-white">No workouts match your filter</h3>
              <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                Try clearing search terms or log your first workout now.
              </p>
              <button
                onClick={onOpenQuickLog}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-neutral-950 font-bold text-xs rounded-lg transition-colors inline-flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Log New Workout</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredWorkouts.map((w) => (
                <div
                  key={w.id}
                  className="p-5 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700/80 transition-colors flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                          <Dumbbell className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white">{w.title}</h4>
                          <div className="text-xs text-neutral-400">
                            {w.type} · {formatDate(w.date)} {w.time ? `· ${w.time}` : ''}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setEditingWorkout(w)}
                          title="Edit Workout"
                          className="p-1.5 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteWorkout(w.id)}
                          title="Delete Workout"
                          className="p-1.5 text-neutral-400 hover:text-rose-400 hover:bg-neutral-800 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {w.notes && (
                      <p className="text-xs text-neutral-400 bg-neutral-950/60 p-2.5 rounded-lg border border-neutral-800/80 leading-relaxed">
                        {w.notes}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-3 mt-3 border-t border-neutral-800 text-center">
                    <div className="p-2 bg-neutral-950/40 rounded-lg border border-neutral-800/50">
                      <div className="text-[10px] text-neutral-500 uppercase">Duration</div>
                      <div className="text-xs font-bold text-white tabular-nums flex items-center justify-center gap-1">
                        <Clock className="w-3 h-3 text-neutral-400" />
                        <span>{w.durationMinutes} min</span>
                      </div>
                    </div>
                    <div className="p-2 bg-neutral-950/40 rounded-lg border border-neutral-800/50">
                      <div className="text-[10px] text-neutral-500 uppercase">Burn</div>
                      <div className="text-xs font-bold text-amber-400 tabular-nums flex items-center justify-center gap-1">
                        <Flame className="w-3 h-3" />
                        <span>{w.caloriesBurned} kcal</span>
                      </div>
                    </div>
                    <div className="p-2 bg-neutral-950/40 rounded-lg border border-neutral-800/50">
                      <div className="text-[10px] text-neutral-500 uppercase">Intensity</div>
                      <div className="text-xs font-bold text-emerald-400">
                        {w.intensity}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* EDIT WORKOUT MODAL */}
      {editingWorkout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h3 className="text-base font-bold text-white">Edit Workout</h3>
              <button
                onClick={() => setEditingWorkout(null)}
                className="text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={editingWorkout.title}
                  onChange={(e) => setEditingWorkout({ ...editingWorkout, title: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-neutral-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={editingWorkout.durationMinutes}
                    onChange={(e) => setEditingWorkout({ ...editingWorkout, durationMinutes: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-neutral-100 tabular-nums focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Calories Burned (kcal)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={editingWorkout.caloriesBurned}
                    onChange={(e) => setEditingWorkout({ ...editingWorkout, caloriesBurned: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-neutral-100 tabular-nums focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Intensity
                  </label>
                  <select
                    value={editingWorkout.intensity}
                    onChange={(e) => setEditingWorkout({ ...editingWorkout, intensity: e.target.value as any })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-neutral-100 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Light">Light</option>
                    <option value="Moderate">Moderate</option>
                    <option value="High">High</option>
                    <option value="Extreme">Extreme</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Distance (km)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingWorkout.distanceKm || ''}
                    onChange={(e) => setEditingWorkout({ ...editingWorkout, distanceKm: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-neutral-100 tabular-nums focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Notes
                </label>
                <textarea
                  rows={2}
                  value={editingWorkout.notes || ''}
                  onChange={(e) => setEditingWorkout({ ...editingWorkout, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-neutral-100 resize-none focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingWorkout(null)}
                  className="flex-1 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-semibold text-xs rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-600 text-neutral-950 font-bold text-xs rounded-lg transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
