import React, { useState } from 'react';
import {
  X,
  Dumbbell,
  UtensilsCrossed,
  Droplet,
  Footprints,
  Flame,
  Clock,
  Plus,
} from 'lucide-react';
import { useFitness } from '../../context/FitnessContext';
import { WorkoutType, WorkoutIntensity, MealType } from '../../types/fitness';
import { estimateCaloriesBurned } from '../../utils/calculations';

interface LogActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'workout' | 'meal' | 'water' | 'steps';
}

export const LogActivityModal: React.FC<LogActivityModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'workout',
}) => {
  const { addWorkout, addMeal, addWater, addSteps, selectedDate, user } = useFitness();
  const [activeType, setActiveType] = useState<'workout' | 'meal' | 'water' | 'steps'>(defaultTab);

  // Workout state
  const [workoutType, setWorkoutType] = useState<WorkoutType>('Running');
  const [workoutTitle, setWorkoutTitle] = useState('Morning Cardio Session');
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [intensity, setIntensity] = useState<WorkoutIntensity>('Moderate');
  const [customCalories, setCustomCalories] = useState('');
  const [distanceKm, setDistanceKm] = useState('');
  const [workoutNotes, setWorkoutNotes] = useState('');

  // Meal state
  const [mealType, setMealType] = useState<MealType>('Lunch');
  const [foodName, setFoodName] = useState('');
  const [mealCalories, setMealCalories] = useState('');
  const [proteinGrams, setProteinGrams] = useState('');
  const [carbsGrams, setCarbsGrams] = useState('');
  const [fatsGrams, setFatsGrams] = useState('');
  const [servingSize, setServingSize] = useState('1 serving');

  // Steps & Water custom
  const [customSteps, setCustomSteps] = useState('2500');
  const [customWater, setCustomWater] = useState('500');

  if (!isOpen) return null;

  // Auto-calculated workout calories
  const autoCalories = estimateCaloriesBurned(workoutType, intensity, durationMinutes, user.weightKg);

  const handleSaveWorkout = (e: React.FormEvent) => {
    e.preventDefault();
    const finalCalories = customCalories ? Number(customCalories) : autoCalories;

    addWorkout({
      type: workoutType,
      title: workoutTitle.trim() || `${workoutType} Session`,
      durationMinutes: Number(durationMinutes) || 30,
      caloriesBurned: finalCalories,
      date: selectedDate,
      intensity,
      distanceKm: distanceKm ? Number(distanceKm) : undefined,
      notes: workoutNotes.trim() || undefined,
    });
    onClose();
  };

  const handleSaveMeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodName.trim()) return;

    const cal = Number(mealCalories) || 350;
    const p = Number(proteinGrams) || 20;
    const c = Number(carbsGrams) || 40;
    const f = Number(fatsGrams) || 10;

    addMeal({
      date: selectedDate,
      type: mealType,
      items: [
        {
          id: `f_${Date.now()}`,
          name: foodName.trim(),
          calories: cal,
          proteinGrams: p,
          carbsGrams: c,
          fatsGrams: f,
          servingSize: servingSize || '1 plate',
        },
      ],
      totalCalories: cal,
      totalProtein: p,
      totalCarbs: c,
      totalFats: f,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });

    onClose();
  };

  const handleSaveSteps = (amount: number) => {
    addSteps(amount);
    onClose();
  };

  const handleSaveWater = (amount: number) => {
    addWater(amount);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">Log Fitness Activity</h2>
            <p className="text-xs text-neutral-400">Record metrics for {selectedDate}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Activity Type Switcher */}
        <div className="flex border-b border-neutral-800 bg-neutral-950/40 p-2 gap-1.5">
          {[
            { id: 'workout', label: 'Workout', icon: Dumbbell },
            { id: 'meal', label: 'Meal', icon: UtensilsCrossed },
            { id: 'steps', label: 'Steps', icon: Footprints },
            { id: 'water', label: 'Water', icon: Droplet },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeType === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveType(tab.id as any)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-semibold transition-colors ${
                  isSelected
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/40'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto space-y-4">
          {/* WORKOUT FORM */}
          {activeType === 'workout' && (
            <form onSubmit={handleSaveWorkout} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  Workout Category
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['Running', 'Walking', 'Cycling', 'Gym', 'Yoga', 'Cardio', 'HIIT', 'Swimming'] as WorkoutType[]).map(
                    (type) => (
                      <button
                        type="button"
                        key={type}
                        onClick={() => {
                          setWorkoutType(type);
                          if (!workoutTitle || workoutTitle.includes('Session')) {
                            setWorkoutTitle(`${type} Training`);
                          }
                        }}
                        className={`py-2 px-1 text-xs rounded-lg font-medium border transition-colors text-center ${
                          workoutType === type
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                            : 'bg-neutral-950/40 text-neutral-400 border-neutral-800 hover:border-neutral-700'
                        }`}
                      >
                        {type}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Title / Focus
                </label>
                <input
                  type="text"
                  required
                  value={workoutTitle}
                  onChange={(e) => setWorkoutTitle(e.target.value)}
                  placeholder="e.g. Chest & Triceps Blast"
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-neutral-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Duration (Minutes)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      max="360"
                      required
                      value={durationMinutes}
                      onChange={(e) => setDurationMinutes(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-neutral-100 tabular-nums focus:outline-none focus:border-emerald-500"
                    />
                    <Clock className="w-4 h-4 text-neutral-500 absolute right-3 top-2.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Intensity Level
                  </label>
                  <select
                    value={intensity}
                    onChange={(e) => setIntensity(e.target.value as WorkoutIntensity)}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-neutral-100 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Light">Light (Easy pace)</option>
                    <option value="Moderate">Moderate (Steady burn)</option>
                    <option value="High">High (Challenging)</option>
                    <option value="Extreme">Extreme (All-out)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Calories Burned (kcal)
                  </label>
                  <input
                    type="number"
                    value={customCalories}
                    onChange={(e) => setCustomCalories(e.target.value)}
                    placeholder={`Estimated: ${autoCalories} kcal`}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-neutral-100 tabular-nums focus:outline-none focus:border-emerald-500"
                  />
                  <span className="text-[11px] text-neutral-500 mt-0.5 block">
                    Auto-estimated based on weight & MET
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Distance (km, optional)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={distanceKm}
                    onChange={(e) => setDistanceKm(e.target.value)}
                    placeholder="e.g. 5.2"
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-neutral-100 tabular-nums focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Workout Notes / Sets (optional)
                </label>
                <textarea
                  rows={2}
                  value={workoutNotes}
                  onChange={(e) => setWorkoutNotes(e.target.value)}
                  placeholder="Sets, weights lifted, route or how you felt..."
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-neutral-100 focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-neutral-950 font-bold text-sm rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Save Workout</span>
              </button>
            </form>
          )}

          {/* MEAL FORM */}
          {activeType === 'meal' && (
            <form onSubmit={handleSaveMeal} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  Meal Category
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['Breakfast', 'Lunch', 'Dinner', 'Snacks'] as MealType[]).map((type) => (
                    <button
                      type="button"
                      key={type}
                      onClick={() => setMealType(type)}
                      className={`py-2 text-xs rounded-lg font-medium border transition-colors ${
                        mealType === type
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                          : 'bg-neutral-950/40 text-neutral-400 border-neutral-800 hover:border-neutral-700'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Meal / Food Name
                  </label>
                  <input
                    type="text"
                    required
                    value={foodName}
                    onChange={(e) => setFoodName(e.target.value)}
                    placeholder="e.g. Grilled Chicken & Brown Rice"
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-neutral-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Serving
                  </label>
                  <input
                    type="text"
                    value={servingSize}
                    onChange={(e) => setServingSize(e.target.value)}
                    placeholder="1 bowl"
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-neutral-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Total Calories (kcal)
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={mealCalories}
                  onChange={(e) => setMealCalories(e.target.value)}
                  placeholder="e.g. 520"
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-neutral-100 tabular-nums focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-emerald-400 mb-1">
                    Protein (g)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={proteinGrams}
                    onChange={(e) => setProteinGrams(e.target.value)}
                    placeholder="35"
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-neutral-100 tabular-nums focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-cyan-400 mb-1">
                    Carbs (g)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={carbsGrams}
                    onChange={(e) => setCarbsGrams(e.target.value)}
                    placeholder="45"
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-neutral-100 tabular-nums focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-amber-400 mb-1">
                    Fats (g)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={fatsGrams}
                    onChange={(e) => setFatsGrams(e.target.value)}
                    placeholder="12"
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-neutral-100 tabular-nums focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-neutral-950 font-bold text-sm rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Log Meal</span>
              </button>
            </form>
          )}

          {/* STEPS FORM */}
          {activeType === 'steps' && (
            <div className="space-y-4">
              <p className="text-xs text-neutral-400">
                Quickly add steps to your count for {selectedDate}. Each 1,000 steps adds approximately 40 burned calories.
              </p>

              <div className="grid grid-cols-3 gap-2">
                {[1000, 2500, 5000].map((stepCount) => (
                  <button
                    key={stepCount}
                    onClick={() => handleSaveSteps(stepCount)}
                    className="py-3 px-2 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-emerald-500/50 hover:bg-emerald-500/10 text-center transition-colors group"
                  >
                    <Footprints className="w-4 h-4 text-emerald-400 mx-auto mb-1 group-hover:scale-110 transition-transform" />
                    <div className="text-sm font-bold text-white tabular-nums">+{stepCount.toLocaleString()}</div>
                    <div className="text-[10px] text-neutral-500">steps</div>
                  </button>
                ))}
              </div>

              <div className="pt-2 border-t border-neutral-800">
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  Or Log Custom Steps Count:
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={customSteps}
                    onChange={(e) => setCustomSteps(e.target.value)}
                    className="flex-1 px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-neutral-100 tabular-nums focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    onClick={() => {
                      if (customSteps) handleSaveSteps(Number(customSteps));
                    }}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-neutral-950 font-bold text-xs rounded-lg transition-colors"
                  >
                    Add Steps
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* WATER FORM */}
          {activeType === 'water' && (
            <div className="space-y-4">
              <p className="text-xs text-neutral-400">
                Stay hydrated! Tap a preset glass to log water consumed for {selectedDate}.
              </p>

              <div className="grid grid-cols-3 gap-2">
                {[250, 500, 750].map((ml) => (
                  <button
                    key={ml}
                    onClick={() => handleSaveWater(ml)}
                    className="py-3 px-2 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-cyan-500/50 hover:bg-cyan-500/10 text-center transition-colors group"
                  >
                    <Droplet className="w-4 h-4 text-cyan-400 mx-auto mb-1 group-hover:scale-110 transition-transform" />
                    <div className="text-sm font-bold text-white tabular-nums">+{ml} ml</div>
                    <div className="text-[10px] text-neutral-500">
                      {ml === 250 ? 'Standard Glass' : ml === 500 ? 'Sports Bottle' : 'Large Shaker'}
                    </div>
                  </button>
                ))}
              </div>

              <div className="pt-2 border-t border-neutral-800">
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  Or Log Custom Water (ml):
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={customWater}
                    onChange={(e) => setCustomWater(e.target.value)}
                    className="flex-1 px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-neutral-100 tabular-nums focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    onClick={() => {
                      if (customWater) handleSaveWater(Number(customWater));
                    }}
                    className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-neutral-950 font-bold text-xs rounded-lg transition-colors"
                  >
                    Add Water
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
