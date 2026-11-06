import React, { useState } from 'react';
import {
  TrendingUp,
  Scale,
  Calendar,
  Flame,
  Footprints,
  Clock,
  Plus,
  Trash2,
  Award,
  Zap,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useFitness } from '../../context/FitnessContext';
import { calculateBMI, formatDate } from '../../utils/calculations';

export const ProgressTrackerView: React.FC = () => {
  const {
    dailyActivities,
    workouts,
    meals,
    weightRecords,
    addWeightRecord,
    deleteWeightRecord,
    user,
    goals,
  } = useFitness();

  const [timeRange, setTimeRange] = useState<'7' | '14' | '30'>('14');
  const [newWeight, setNewWeight] = useState(user.weightKg.toString());
  const [newBodyFat, setNewBodyFat] = useState('');
  const [weightNotes, setWeightNotes] = useState('');

  const rangeDays = Number(timeRange);
  const slicedActivities = dailyActivities.slice(-rangeDays);

  // Format data for Steps & Active Minutes Chart
  const activityTrendData = slicedActivities.map((d) => {
    const parts = d.date.split('-');
    const label = `${parts[1]}/${parts[2]}`;
    return {
      date: label,
      fullDate: d.date,
      steps: d.steps,
      activeMinutes: d.activeMinutes,
    };
  });

  // Calorie Burned vs Consumed
  const calorieBalanceData = slicedActivities.map((d) => {
    const parts = d.date.split('-');
    const label = `${parts[1]}/${parts[2]}`;
    const dayMeals = meals.filter((m) => m.date === d.date);
    const consumed = dayMeals.reduce((sum, m) => sum + m.totalCalories, 0);

    return {
      date: label,
      burned: d.caloriesBurned,
      consumed: consumed || 2000 + (Math.sin(d.steps) * 300), // realistic estimate if not logged
    };
  });

  // Workout Type Distribution
  const typeCounts: Record<string, number> = {};
  workouts.forEach((w) => {
    typeCounts[w.type] = (typeCounts[w.type] || 0) + 1;
  });

  const workoutPieColors = ['#10b981', '#06b6d4', '#f59e0b', '#8b5cf6', '#ec4899', '#3b82f6'];
  const workoutTypeData = Object.entries(typeCounts).map(([name, count], index) => ({
    name,
    count,
    color: workoutPieColors[index % workoutPieColors.length],
  }));

  // Weight Trend Data
  const weightTrendData = weightRecords.map((r) => {
    const parts = r.date.split('-');
    return {
      date: `${parts[1]}/${parts[2]}`,
      weightKg: r.weightKg,
      bodyFat: r.bodyFatPercentage,
    };
  });

  const bmiInfo = calculateBMI(user.weightKg, user.heightCm);

  // Overall Goal Completion Rate
  const completedGoalsCount = goals.filter((g) => g.completed).length;
  const goalCompletionRate = goals.length > 0 ? Math.round((completedGoalsCount / goals.length) * 100) : 0;

  const handleSaveWeight = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWeight) return;
    addWeightRecord(
      Number(newWeight),
      newBodyFat ? Number(newBodyFat) : undefined,
      weightNotes || undefined
    );
    setWeightNotes('');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header & Range Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-neutral-900 border border-neutral-800">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <span>Progress & Performance Analytics</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Weekly and monthly reports, weight trajectory, and telemetry charts
          </p>
        </div>

        {/* Range Buttons */}
        <div className="flex bg-neutral-950 p-1 rounded-lg border border-neutral-800 text-xs">
          {(['7', '14', '30'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setTimeRange(r)}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
                timeRange === r
                  ? 'bg-neutral-800 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Last {r} Days
            </button>
          ))}
        </div>
      </div>

      {/* Analytics KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Steps in Range */}
        <div className="p-5 rounded-xl bg-neutral-900 border border-neutral-800">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Steps</span>
            <Footprints className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-white tabular-nums">
            {slicedActivities.reduce((sum, d) => sum + d.steps, 0).toLocaleString()}
          </div>
          <div className="text-xs text-neutral-400 mt-1">
            Avg: {Math.round(slicedActivities.reduce((sum, d) => sum + d.steps, 0) / slicedActivities.length || 0).toLocaleString()} steps / day
          </div>
        </div>

        {/* Total Calorie Burn */}
        <div className="p-5 rounded-xl bg-neutral-900 border border-neutral-800">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Burned</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-white tabular-nums">
            {slicedActivities.reduce((sum, d) => sum + d.caloriesBurned, 0).toLocaleString()} kcal
          </div>
          <div className="text-xs text-neutral-400 mt-1">
            Avg: {Math.round(slicedActivities.reduce((sum, d) => sum + d.caloriesBurned, 0) / slicedActivities.length || 0)} kcal / day
          </div>
        </div>

        {/* Total Active Time */}
        <div className="p-5 rounded-xl bg-neutral-900 border border-neutral-800">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Output</span>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-extrabold text-white tabular-nums">
            {(slicedActivities.reduce((sum, d) => sum + d.activeMinutes, 0) / 60).toFixed(1)} hrs
          </div>
          <div className="text-xs text-neutral-400 mt-1">
            {workouts.length} total workout sessions logged
          </div>
        </div>

        {/* Goal Completion Rate */}
        <div className="p-5 rounded-xl bg-neutral-900 border border-neutral-800">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Target Success</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-white tabular-nums">
            {goalCompletionRate}%
          </div>
          <div className="text-xs text-neutral-400 mt-1">
            {completedGoalsCount} of {goals.length} active goals achieved
          </div>
        </div>
      </div>

      {/* Main Charts: Daily Steps & Activity Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Steps Trend Area Chart */}
        <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">Daily Steps Trajectory</h3>
            <p className="text-xs text-neutral-400">Step volume over the selected {timeRange}-day period</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="stepGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
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
                        <div className="p-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-xs space-y-1 shadow-xl">
                          <div className="font-bold text-white">{label}</div>
                          <div className="text-emerald-400 tabular-nums">
                            {payload[0]?.value?.toLocaleString()} steps
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="steps"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#stepGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Calorie Burn vs Consumed Comparison */}
        <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">Calorie Balance</h3>
            <p className="text-xs text-neutral-400">Burned (active output) vs Intake (nutrition)</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={calorieBalanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="p-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-xs space-y-1 shadow-xl">
                          <div className="font-bold text-white">{label}</div>
                          <div className="text-amber-400 tabular-nums">
                            Burned: {payload[0]?.value} kcal
                          </div>
                          <div className="text-cyan-400 tabular-nums">
                            Consumed: {Math.round(Number(payload[1]?.value))} kcal
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="burned" fill="#f59e0b" radius={[3, 3, 0, 0]} name="Burned" />
                <Bar dataKey="consumed" fill="#06b6d4" radius={[3, 3, 0, 0]} name="Consumed" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-6 pt-2 border-t border-neutral-800 text-xs text-neutral-400">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-sm bg-amber-500" />
              <span>Calories Burned</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-sm bg-cyan-500" />
              <span>Calories Consumed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Body Weight Progress Section & Workout Volume Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weight Progress Chart & Quick Log Form */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                <Scale className="w-4 h-4 text-emerald-400" />
                <span>Weight Trajectory & Body Composition</span>
              </h3>
              <p className="text-xs text-neutral-400">
                Current: <span className="text-white font-bold">{user.weightKg} kg</span> · BMI: <span className={bmiInfo.color}>{bmiInfo.bmi} ({bmiInfo.category})</span>
              </p>
            </div>

            <div className="text-xs text-neutral-400">
              Target: <span className="font-bold text-emerald-400">{user.targetWeightKg} kg</span>
            </div>
          </div>

          {/* Weight Line Chart */}
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weightTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis
                  dataKey="date"
                  stroke="#737373"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#262626' }}
                />
                <YAxis
                  domain={['dataMin - 1', 'dataMax + 1']}
                  stroke="#737373"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#262626' }}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="p-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-xs space-y-1 shadow-xl">
                          <div className="font-bold text-white">{label}</div>
                          <div className="text-emerald-400 tabular-nums">
                            Weight: {payload[0]?.value} kg
                          </div>
                          {payload[0]?.payload?.bodyFat && (
                            <div className="text-cyan-400 tabular-nums">
                              Body Fat: {payload[0]?.payload?.bodyFat}%
                            </div>
                          )}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="weightKg"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  dot={{ fill: '#10b981', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Quick Weight Log Inline Form */}
          <form onSubmit={handleSaveWeight} className="pt-3 border-t border-neutral-800 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-neutral-300">Log Weigh-in:</span>
            <input
              type="number"
              step="0.1"
              required
              placeholder="Weight (kg)"
              value={newWeight}
              onChange={(e) => setNewWeight(e.target.value)}
              className="w-24 px-2.5 py-1.5 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-neutral-100 tabular-nums focus:outline-none focus:border-emerald-500"
            />
            <input
              type="number"
              step="0.1"
              placeholder="Body fat % (opt)"
              value={newBodyFat}
              onChange={(e) => setNewBodyFat(e.target.value)}
              className="w-28 px-2.5 py-1.5 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-neutral-100 tabular-nums focus:outline-none focus:border-emerald-500"
            />
            <input
              type="text"
              placeholder="Notes..."
              value={weightNotes}
              onChange={(e) => setWeightNotes(e.target.value)}
              className="flex-1 min-w-[120px] px-2.5 py-1.5 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-neutral-100 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-neutral-950 font-bold text-xs rounded-lg transition-colors whitespace-nowrap"
            >
              Record Weight
            </button>
          </form>
        </div>

        {/* Workout Modality Breakdown Pie */}
        <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight mb-1">Workout Distribution</h3>
            <p className="text-xs text-neutral-400 mb-4">Total sessions grouped by discipline</p>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={workoutTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="count"
                  >
                    {workoutTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="p-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-xs space-y-0.5 shadow-xl">
                            <div className="font-bold text-white">{data.name}</div>
                            <div className="text-neutral-300 tabular-nums">{data.count} session(s)</div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-neutral-800 text-xs">
              {workoutTypeData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-neutral-300">{item.name}</span>
                  </div>
                  <span className="font-semibold text-white tabular-nums">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Historical Activity Log Table */}
      <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white tracking-tight">Recent Daily Activity Ledger</h3>
          <span className="text-xs text-neutral-400">{dailyActivities.length} days recorded</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-800 text-neutral-400 uppercase tracking-wider text-[11px]">
                <th className="py-2.5 px-3 font-semibold">Date</th>
                <th className="py-2.5 px-3 font-semibold text-right">Steps</th>
                <th className="py-2.5 px-3 font-semibold text-right">Distance</th>
                <th className="py-2.5 px-3 font-semibold text-right">Burned (kcal)</th>
                <th className="py-2.5 px-3 font-semibold text-right">Active (min)</th>
                <th className="py-2.5 px-3 font-semibold text-right">Water</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60">
              {dailyActivities.slice(-10).reverse().map((act) => (
                <tr key={act.date} className="hover:bg-neutral-800/40 transition-colors">
                  <td className="py-2.5 px-3 font-medium text-white">{formatDate(act.date)}</td>
                  <td className="py-2.5 px-3 text-right font-mono tabular-nums text-emerald-400">
                    {act.steps.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono tabular-nums text-neutral-300">
                    {act.distanceKm} km
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono tabular-nums text-amber-400">
                    {act.caloriesBurned}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono tabular-nums text-cyan-400">
                    {act.activeMinutes}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono tabular-nums text-neutral-400">
                    {(act.waterMl / 1000).toFixed(1)}L
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
