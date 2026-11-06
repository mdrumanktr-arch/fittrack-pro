import React, { useState } from 'react';
import {
  Target,
  Plus,
  CheckCircle2,
  Clock,
  Flame,
  Footprints,
  Droplet,
  Dumbbell,
  Trash2,
  Edit2,
  Trophy,
  Sparkles,
} from 'lucide-react';
import { useFitness } from '../../context/FitnessContext';
import { FitnessGoal, GoalCategory } from '../../types/fitness';

export const FitnessGoalsView: React.FC = () => {
  const {
    goals,
    addGoal,
    updateGoal,
    deleteGoal,
    toggleGoalComplete,
    todayActivity,
    workouts,
  } = useFitness();

  const [isAdding, setIsAdding] = useState(false);
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);

  // Form State
  const [goalTitle, setGoalTitle] = useState('');
  const [category, setCategory] = useState<GoalCategory>('steps');
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'custom'>('daily');
  const [target, setTarget] = useState('10000');
  const [current, setCurrent] = useState('0');
  const [unit, setUnit] = useState('steps');
  const [deadline, setDeadline] = useState('');

  const completedCount = goals.filter((g) => g.completed).length;
  const overallRate = goals.length > 0 ? Math.round((completedCount / goals.length) * 100) : 0;

  const handleOpenAdd = () => {
    setGoalTitle('');
    setCategory('steps');
    setPeriod('daily');
    setTarget('10000');
    setCurrent('0');
    setUnit('steps');
    setDeadline('');
    setEditingGoalId(null);
    setIsAdding(true);
  };

  const handleCategoryChange = (cat: GoalCategory) => {
    setCategory(cat);
    if (cat === 'steps') {
      setUnit('steps');
      setTarget('10000');
    } else if (cat === 'calories') {
      setUnit('kcal');
      setTarget('600');
    } else if (cat === 'active_minutes') {
      setUnit('mins');
      setTarget('45');
    } else if (cat === 'water') {
      setUnit('ml');
      setTarget('3000');
    } else if (cat === 'workouts') {
      setUnit('sessions');
      setTarget('5');
      setPeriod('weekly');
    } else {
      setUnit('reps / km / target');
      setTarget('100');
      setPeriod('custom');
    }
  };

  const handleSubmitGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalTitle.trim()) return;

    const targetNum = Number(target) || 100;
    const currentNum = Number(current) || 0;

    if (editingGoalId) {
      updateGoal(editingGoalId, {
        title: goalTitle.trim(),
        category,
        period,
        target: targetNum,
        current: currentNum,
        unit,
        deadline: deadline || undefined,
        completed: currentNum >= targetNum,
      });
    } else {
      addGoal({
        title: goalTitle.trim(),
        category,
        period,
        target: targetNum,
        current: currentNum,
        unit,
        completed: currentNum >= targetNum,
        deadline: deadline || undefined,
      });
    }

    setIsAdding(false);
    setEditingGoalId(null);
  };

  const startEdit = (g: FitnessGoal) => {
    setEditingGoalId(g.id);
    setGoalTitle(g.title);
    setCategory(g.category);
    setPeriod(g.period);
    setTarget(g.target.toString());
    setCurrent(g.current.toString());
    setUnit(g.unit);
    setDeadline(g.deadline || '');
    setIsAdding(true);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-neutral-900 border border-neutral-800">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-400" />
            <span>Fitness Targets & Milestones</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Configure daily movement habits, weekly volume targets, and custom athletic milestones
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-neutral-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Goal</span>
        </button>
      </div>

      {/* Goal Summary Header Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-neutral-900 to-neutral-950 border border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <Trophy className="w-7 h-7" />
          </div>
          <div>
            <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              Goal Completion Status
            </div>
            <div className="text-2xl font-black text-white mt-0.5">
              {completedCount} of {goals.length} Targets Completed ({overallRate}%)
            </div>
            <div className="text-xs text-neutral-400 mt-1">
              {overallRate >= 80
                ? 'Outstanding discipline! You are executing near peak athletic compliance.'
                : 'Consistent daily adherence compounds into transformative long-term fitness.'}
            </div>
          </div>
        </div>

        <div className="w-full sm:w-48 h-3 rounded-full bg-neutral-800 overflow-hidden shrink-0">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-300"
            style={{ width: `${overallRate}%` }}
          />
        </div>
      </div>

      {/* Add / Edit Goal Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h3 className="text-base font-bold text-white">
                {editingGoalId ? 'Edit Target' : 'Create New Target'}
              </h3>
              <button
                onClick={() => setIsAdding(false)}
                className="text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitGoal} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Goal Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 10,000 Daily Steps"
                  value={goalTitle}
                  onChange={(e) => setGoalTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-neutral-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => handleCategoryChange(e.target.value as GoalCategory)}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-neutral-100 focus:outline-none focus:border-emerald-500"
                >
                  <option value="steps">Steps (Movement)</option>
                  <option value="calories">Calories (Active Burn)</option>
                  <option value="active_minutes">Active Minutes (Exercise)</option>
                  <option value="water">Water (Hydration)</option>
                  <option value="workouts">Workouts Count (Frequency)</option>
                  <option value="custom">Custom Milestone</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Cadence / Period
                  </label>
                  <select
                    value={period}
                    onChange={(e) => setPeriod(e.target.value as any)}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-neutral-100 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="daily">Daily Target</option>
                    <option value="weekly">Weekly Target</option>
                    <option value="custom">Milestone / Custom</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Unit Label
                  </label>
                  <input
                    type="text"
                    required
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-neutral-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Target Goal
                  </label>
                  <input
                    type="number"
                    required
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-neutral-100 tabular-nums focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Current Progress
                  </label>
                  <input
                    type="number"
                    value={current}
                    onChange={(e) => setCurrent(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-neutral-100 tabular-nums focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Target Deadline (Optional)
                </label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-neutral-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="flex-1 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-semibold text-xs rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-600 text-neutral-950 font-bold text-xs rounded-lg transition-colors"
                >
                  {editingGoalId ? 'Save Changes' : 'Create Target'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Goal Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {goals.map((g) => {
          // Dynamic calculation for live sync targets
          const currentVal =
            g.category === 'steps' && g.period === 'daily'
              ? todayActivity.steps
              : g.category === 'calories' && g.period === 'daily'
              ? todayActivity.caloriesBurned
              : g.category === 'active_minutes' && g.period === 'daily'
              ? todayActivity.activeMinutes
              : g.category === 'water' && g.period === 'daily'
              ? todayActivity.waterMl
              : g.category === 'workouts' && g.period === 'weekly'
              ? workouts.length
              : g.current;

          const pct = Math.min(100, Math.round((currentVal / g.target) * 100));
          const isFinished = pct >= 100 || g.completed;

          return (
            <div
              key={g.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                isFinished
                  ? 'bg-neutral-900/90 border-emerald-500/40 shadow-sm shadow-emerald-500/5'
                  : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isFinished
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-neutral-800 text-neutral-400'
                      }`}
                    >
                      {g.category === 'steps' && <Footprints className="w-4 h-4" />}
                      {g.category === 'calories' && <Flame className="w-4 h-4" />}
                      {g.category === 'active_minutes' && <Clock className="w-4 h-4" />}
                      {g.category === 'water' && <Droplet className="w-4 h-4" />}
                      {g.category === 'workouts' && <Dumbbell className="w-4 h-4" />}
                      {g.category === 'custom' && <Target className="w-4 h-4" />}
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-white line-clamp-1">{g.title}</h4>
                      <div className="text-[11px] text-neutral-400 capitalize">
                        {g.period} · {g.category.replace('_', ' ')}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => startEdit(g)}
                      title="Edit Goal"
                      className="p-1 text-neutral-500 hover:text-neutral-200 rounded transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteGoal(g.id)}
                      title="Delete Goal"
                      className="p-1 text-neutral-500 hover:text-rose-400 rounded transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Numbers */}
                <div className="flex items-baseline justify-between pt-1">
                  <div className="text-2xl font-black text-white tabular-nums">
                    {currentVal.toLocaleString()}{' '}
                    <span className="text-xs font-normal text-neutral-400">
                      / {g.target.toLocaleString()} {g.unit}
                    </span>
                  </div>
                  <span
                    className={`text-xs font-bold tabular-nums ${
                      isFinished ? 'text-emerald-400' : 'text-neutral-300'
                    }`}
                  >
                    {pct}%
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 rounded-full bg-neutral-950 overflow-hidden border border-neutral-800/80">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isFinished ? 'bg-emerald-400' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>

                {g.deadline && (
                  <div className="text-[11px] text-neutral-400">
                    Target Date: {g.deadline}
                  </div>
                )}
              </div>

              {/* Bottom Complete Toggle */}
              <div className="pt-3 mt-3 border-t border-neutral-800/80 flex items-center justify-between">
                <span className="text-xs text-neutral-400">
                  {isFinished ? 'Milestone Achieved!' : 'In Progress'}
                </span>
                <button
                  onClick={() => toggleGoalComplete(g.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                    isFinished
                      ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30'
                      : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isFinished ? 'Completed' : 'Mark Complete'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
