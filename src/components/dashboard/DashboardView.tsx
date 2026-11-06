import React from 'react';
import {
  Footprints,
  Flame,
  Clock,
  Droplet,
  Dumbbell,
  TrendingUp,
  Plus,
  ArrowUpRight,
  ChevronRight,
  Target,
  Sparkles,
  Zap,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area,
} from 'recharts';
import { useFitness } from '../../context/FitnessContext';
import { formatDate, getTodayDateString } from '../../utils/calculations';

interface DashboardViewProps {
  onOpenQuickLog: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onOpenQuickLog }) => {
  const {
    user,
    todayActivity,
    dailyActivities,
    workouts,
    meals,
    goals,
    selectedDate,
    addSteps,
    addWater,
    setActiveTab,
  } = useFitness();

  const isToday = selectedDate === getTodayDateString();

  // Selected date's workouts and meals
  const dayWorkouts = workouts.filter((w) => w.date === selectedDate);
  const dayMeals = meals.filter((m) => m.date === selectedDate);

  const caloriesConsumed = dayMeals.reduce((sum, m) => sum + m.totalCalories, 0);
  const proteinConsumed = dayMeals.reduce((sum, m) => sum + m.totalProtein, 0);

  // Targets
  const stepTarget = user.dailyTargets.steps || 10000;
  const calorieBurnTarget = user.dailyTargets.caloriesBurned || 550;
  const activeMinTarget = user.dailyTargets.activeMinutes || 45;
  const waterTarget = user.dailyTargets.waterMl || 2800;

  // Percentages
  const stepPct = Math.min(100, Math.round((todayActivity.steps / stepTarget) * 100));
  const caloriePct = Math.min(100, Math.round((todayActivity.caloriesBurned / calorieBurnTarget) * 100));
  const activePct = Math.min(100, Math.round((todayActivity.activeMinutes / activeMinTarget) * 100));
  const waterPct = Math.min(100, Math.round((todayActivity.waterMl / waterTarget) * 100));

  // Weekly data for chart (last 7 days up to selected date)
  const last7Days = dailyActivities.slice(-7).map((d) => {
    const parts = d.date.split('-');
    const dayLabel = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2])).toLocaleDateString('en-US', {
      weekday: 'short',
    });
    return {
      date: dayLabel,
      fullDate: d.date,
      steps: d.steps,
      caloriesBurned: d.caloriesBurned,
      activeMinutes: d.activeMinutes,
    };
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Welcome & Motivational Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-neutral-800 bg-gradient-to-r from-neutral-900 via-neutral-900/90 to-neutral-950 p-6 md:p-8">
        <div className="absolute top-0 right-0 w-96 h-full opacity-15 pointer-events-none hidden md:block">
          <img
            src="/src/assets/images/hero_fitness_athlete_1793968157848.jpg"
            alt="Fitness Banner"
            className="w-full h-full object-cover object-center mask-radial"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Optimized Training Day</span>
          </div>

          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Ready to train, {user.name.split(' ')[0]}?
          </h2>

          <p className="text-sm text-neutral-300 leading-relaxed">
            You've completed <span className="text-emerald-400 font-semibold">{dayWorkouts.length}</span> workouts today and reached <span className="text-emerald-400 font-semibold">{stepPct}%</span> of your movement target. Keep pushing your baseline forward!
          </p>

          <div className="pt-2 flex flex-wrap gap-2.5">
            <button
              onClick={onOpenQuickLog}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-neutral-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Log Workout or Meal</span>
            </button>
            <button
              onClick={() => setActiveTab('ai-coach')}
              className="px-4 py-2 bg-neutral-800/80 hover:bg-neutral-800 border border-neutral-700/70 text-neutral-200 font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Ask Coach Alex</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary KPI Grid (4 Pillars) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Daily Steps */}
        <div className="p-5 rounded-xl bg-neutral-900 border border-neutral-800 flex flex-col justify-between hover:border-neutral-700/80 transition-colors">
          <div>
            <div className="flex items-center justify-between text-neutral-400 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider">Daily Steps</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Footprints className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl md:text-3xl font-extrabold text-white tabular-nums">
                {todayActivity.steps.toLocaleString()}
              </span>
              <span className="text-xs text-neutral-500 tabular-nums">
                / {stepTarget.toLocaleString()}
              </span>
            </div>
            <div className="text-xs text-neutral-400 mt-1">
              Est. {todayActivity.distanceKm} km walked
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-800/80">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-neutral-400">Goal Progress</span>
              <span className="font-semibold text-emerald-400 tabular-nums">{stepPct}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                style={{ width: `${stepPct}%` }}
              />
            </div>
            <button
              onClick={() => addSteps(1000)}
              className="mt-3 w-full py-1 px-2 text-[11px] font-semibold text-neutral-300 hover:text-white bg-neutral-950/60 hover:bg-neutral-800/80 border border-neutral-800 rounded transition-colors"
            >
              +1,000 Quick Steps
            </button>
          </div>
        </div>

        {/* 2. Calories Burned */}
        <div className="p-5 rounded-xl bg-neutral-900 border border-neutral-800 flex flex-col justify-between hover:border-neutral-700/80 transition-colors">
          <div>
            <div className="flex items-center justify-between text-neutral-400 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider">Active Burn</span>
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Flame className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl md:text-3xl font-extrabold text-white tabular-nums">
                {todayActivity.caloriesBurned}
              </span>
              <span className="text-xs text-neutral-500 tabular-nums">
                / {calorieBurnTarget} kcal
              </span>
            </div>
            <div className="text-xs text-neutral-400 mt-1">
              {caloriesConsumed > 0 ? `${caloriesConsumed} kcal eaten today` : 'No meals logged yet'}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-800/80">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-neutral-400">Burn Target</span>
              <span className="font-semibold text-amber-400 tabular-nums">{caloriePct}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full transition-all duration-300"
                style={{ width: `${caloriePct}%` }}
              />
            </div>
            <div className="mt-3 text-[11px] text-center text-neutral-500 tabular-nums">
              Net: {caloriesConsumed - todayActivity.caloriesBurned} kcal
            </div>
          </div>
        </div>

        {/* 3. Active Minutes */}
        <div className="p-5 rounded-xl bg-neutral-900 border border-neutral-800 flex flex-col justify-between hover:border-neutral-700/80 transition-colors">
          <div>
            <div className="flex items-center justify-between text-neutral-400 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider">Active Minutes</span>
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl md:text-3xl font-extrabold text-white tabular-nums">
                {todayActivity.activeMinutes}
              </span>
              <span className="text-xs text-neutral-500 tabular-nums">
                / {activeMinTarget} min
              </span>
            </div>
            <div className="text-xs text-neutral-400 mt-1">
              {dayWorkouts.length} workout session(s) today
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-800/80">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-neutral-400">Active Zone</span>
              <span className="font-semibold text-indigo-400 tabular-nums">{activePct}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden">
              <div
                className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                style={{ width: `${activePct}%` }}
              />
            </div>
            <button
              onClick={() => setActiveTab('workouts')}
              className="mt-3 w-full py-1 px-2 text-[11px] font-semibold text-neutral-300 hover:text-white bg-neutral-950/60 hover:bg-neutral-800/80 border border-neutral-800 rounded transition-colors text-center"
            >
              Open Workout Timer
            </button>
          </div>
        </div>

        {/* 4. Water Intake Summary */}
        <div className="p-5 rounded-xl bg-neutral-900 border border-neutral-800 flex flex-col justify-between hover:border-neutral-700/80 transition-colors">
          <div>
            <div className="flex items-center justify-between text-neutral-400 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider">Water Intake</span>
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <Droplet className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl md:text-3xl font-extrabold text-white tabular-nums">
                {todayActivity.waterMl}
              </span>
              <span className="text-xs text-neutral-500 tabular-nums">
                / {waterTarget} ml
              </span>
            </div>
            <div className="text-xs text-neutral-400 mt-1">
              {(todayActivity.waterMl / 1000).toFixed(2)} Liters logged
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-800/80">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-neutral-400">Hydration Target</span>
              <span className="font-semibold text-cyan-400 tabular-nums">{waterPct}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden">
              <div
                className="h-full bg-cyan-500 rounded-full transition-all duration-300"
                style={{ width: `${waterPct}%` }}
              />
            </div>
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => addWater(250)}
                className="flex-1 py-1 px-1 text-[11px] font-semibold text-neutral-300 hover:text-white bg-neutral-950/60 hover:bg-cyan-500/20 border border-neutral-800 rounded transition-colors text-center"
              >
                +250ml
              </button>
              <button
                onClick={() => addWater(500)}
                className="flex-1 py-1 px-1 text-[11px] font-semibold text-neutral-300 hover:text-white bg-neutral-950/60 hover:bg-cyan-500/20 border border-neutral-800 rounded transition-colors text-center"
              >
                +500ml
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Section: Weekly Activity Chart & Today's Workouts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Activity Trends Chart */}
        <div className="lg:col-span-2 p-6 rounded-xl bg-neutral-900 border border-neutral-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">Weekly Activity & Burn</h3>
              <p className="text-xs text-neutral-400">Daily steps and active calories for the past 7 days</p>
            </div>
            <button
              onClick={() => setActiveTab('progress')}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
            >
              <span>Detailed Analytics</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={last7Days} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis
                  dataKey="date"
                  stroke="#737373"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#262626' }}
                />
                <YAxis
                  stroke="#737373"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#262626' }}
                  tickFormatter={(val) => (val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val)}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-lg shadow-xl text-xs space-y-1">
                          <div className="font-bold text-white">{label}</div>
                          <div className="text-emerald-400 tabular-nums">
                            Steps: {payload[0]?.value?.toLocaleString()}
                          </div>
                          <div className="text-amber-400 tabular-nums">
                            Calories: {payload[1]?.value} kcal
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="steps" fill="#10b981" radius={[4, 4, 0, 0]} name="Steps" />
                <Bar dataKey="caloriesBurned" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Calories" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-6 pt-3 border-t border-neutral-800 text-xs text-neutral-400">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
              <span>Daily Steps</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-sm bg-amber-500" />
              <span>Calories Burned</span>
            </div>
          </div>
        </div>

        {/* Workout Summary for the Selected Date */}
        <div className="p-6 rounded-xl bg-neutral-900 border border-neutral-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight">Today's Workouts</h3>
                <p className="text-xs text-neutral-400">{formatDate(selectedDate)}</p>
              </div>
              <button
                onClick={() => setActiveTab('workouts')}
                className="text-xs font-semibold text-emerald-400 hover:text-emerald-300"
              >
                View All
              </button>
            </div>

            {dayWorkouts.length === 0 ? (
              <div className="py-8 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-500 mx-auto">
                  <Dumbbell className="w-5 h-5" />
                </div>
                <div className="text-xs font-medium text-neutral-300">No workouts logged yet</div>
                <p className="text-[11px] text-neutral-500 max-w-xs mx-auto">
                  Record a workout session or start the live workout timer to track your burn.
                </p>
                <button
                  onClick={onOpenQuickLog}
                  className="mt-3 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-emerald-400 font-semibold text-xs rounded-lg transition-colors inline-flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Log Workout</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {dayWorkouts.map((w) => (
                  <div
                    key={w.id}
                    className="p-3 rounded-lg bg-neutral-950/60 border border-neutral-800/80 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                        <Dumbbell className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white truncate">{w.title}</div>
                        <div className="text-[11px] text-neutral-400">
                          {w.type} · {w.durationMinutes} min · {w.intensity}
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xs font-bold text-emerald-400 tabular-nums">
                        {w.caloriesBurned} kcal
                      </div>
                      {w.distanceKm && (
                        <div className="text-[10px] text-neutral-500 tabular-nums">
                          {w.distanceKm} km
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-800">
            <div className="flex items-center justify-between text-xs text-neutral-400">
              <span>Weekly Workouts</span>
              <span className="font-semibold text-white tabular-nums">
                {workouts.length} total logged
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Daily Goal Progress & Nutrition Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Daily Goal Completion List */}
        <div className="p-6 rounded-xl bg-neutral-900 border border-neutral-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">Active Target Completion</h3>
              <p className="text-xs text-neutral-400">Progress across your configured daily and weekly goals</p>
            </div>
            <button
              onClick={() => setActiveTab('goals')}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300"
            >
              Manage Goals
            </button>
          </div>

          <div className="space-y-3.5">
            {goals.slice(0, 4).map((goal) => {
              const currentVal =
                goal.category === 'steps'
                  ? todayActivity.steps
                  : goal.category === 'calories'
                  ? todayActivity.caloriesBurned
                  : goal.category === 'active_minutes'
                  ? todayActivity.activeMinutes
                  : goal.category === 'water'
                  ? todayActivity.waterMl
                  : goal.current;

              const pct = Math.min(100, Math.round((currentVal / goal.target) * 100));

              return (
                <div key={goal.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-neutral-200">{goal.title}</span>
                    <span className="text-neutral-400 tabular-nums">
                      {currentVal.toLocaleString()} / {goal.target.toLocaleString()} {goal.unit} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        pct >= 100 ? 'bg-emerald-400' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Nutrition Glance */}
        <div className="p-6 rounded-xl bg-neutral-900 border border-neutral-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight">Nutrition & Fueling</h3>
                <p className="text-xs text-neutral-400">Calories and macronutrients for {selectedDate}</p>
              </div>
              <button
                onClick={() => setActiveTab('nutrition')}
                className="text-xs font-semibold text-emerald-400 hover:text-emerald-300"
              >
                Log Meal
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2 text-center mb-4">
              <div className="p-2.5 rounded-lg bg-neutral-950/60 border border-neutral-800/80">
                <div className="text-xs text-neutral-400">Calories</div>
                <div className="text-sm font-bold text-white tabular-nums">{caloriesConsumed}</div>
                <div className="text-[10px] text-neutral-500">/ {user.dailyTargets.calorieIntake}</div>
              </div>
              <div className="p-2.5 rounded-lg bg-neutral-950/60 border border-neutral-800/80">
                <div className="text-xs text-emerald-400">Protein</div>
                <div className="text-sm font-bold text-white tabular-nums">{proteinConsumed}g</div>
                <div className="text-[10px] text-neutral-500">/ {user.dailyTargets.proteinGrams}g</div>
              </div>
              <div className="p-2.5 rounded-lg bg-neutral-950/60 border border-neutral-800/80">
                <div className="text-xs text-cyan-400">Carbs</div>
                <div className="text-sm font-bold text-white tabular-nums">
                  {dayMeals.reduce((sum, m) => sum + m.totalCarbs, 0)}g
                </div>
                <div className="text-[10px] text-neutral-500">/ {user.dailyTargets.carbsGrams}g</div>
              </div>
              <div className="p-2.5 rounded-lg bg-neutral-950/60 border border-neutral-800/80">
                <div className="text-xs text-amber-400">Fats</div>
                <div className="text-sm font-bold text-white tabular-nums">
                  {dayMeals.reduce((sum, m) => sum + m.totalFats, 0)}g
                </div>
                <div className="text-[10px] text-neutral-500">/ {user.dailyTargets.fatsGrams}g</div>
              </div>
            </div>

            <div className="text-xs text-neutral-400">
              {dayMeals.length === 0 ? (
                <span>No meals recorded yet for this day.</span>
              ) : (
                <span>
                  {dayMeals.length} meal(s) logged: {dayMeals.map((m) => m.type).join(', ')}.
                </span>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-800 flex items-center justify-between">
            <span className="text-xs text-neutral-500">Protein Target Status</span>
            <span className="text-xs font-semibold text-emerald-400 tabular-nums">
              {Math.min(100, Math.round((proteinConsumed / user.dailyTargets.proteinGrams) * 100))}% of goal
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
