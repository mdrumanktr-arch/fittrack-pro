import React, { useState } from 'react';
import {
  UtensilsCrossed,
  Plus,
  Droplet,
  Trash2,
  PieChart as PieChartIcon,
  Flame,
  CheckCircle2,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { useFitness } from '../../context/FitnessContext';
import { MealType, FoodItem, MealLog } from '../../types/fitness';
import { formatDate, getTodayDateString } from '../../utils/calculations';

interface NutritionTrackerViewProps {
  onOpenQuickLog: () => void;
}

export const NutritionTrackerView: React.FC<NutritionTrackerViewProps> = ({ onOpenQuickLog }) => {
  const {
    meals,
    addMeal,
    deleteMeal,
    selectedDate,
    user,
    todayActivity,
    addWater,
    setWater,
  } = useFitness();

  const [activeCategory, setActiveCategory] = useState<MealType>('Breakfast');
  const [customFoodName, setCustomFoodName] = useState('');
  const [customCalories, setCustomCalories] = useState('');
  const [customProtein, setCustomProtein] = useState('');
  const [customCarbs, setCustomCarbs] = useState('');
  const [customFats, setCustomFats] = useState('');

  // Daily meals for selected date
  const dayMeals = meals.filter((m) => m.date === selectedDate);

  const totalCalories = dayMeals.reduce((sum, m) => sum + m.totalCalories, 0);
  const totalProtein = dayMeals.reduce((sum, m) => sum + m.totalProtein, 0);
  const totalCarbs = dayMeals.reduce((sum, m) => sum + m.totalCarbs, 0);
  const totalFats = dayMeals.reduce((sum, m) => sum + m.totalFats, 0);

  const targetCalories = user.dailyTargets.calorieIntake || 2350;
  const targetProtein = user.dailyTargets.proteinGrams || 160;
  const targetCarbs = user.dailyTargets.carbsGrams || 240;
  const targetFats = user.dailyTargets.fatsGrams || 65;
  const waterTarget = user.dailyTargets.waterMl || 2800;

  // Macro calorie contributions (Protein: 4 kcal/g, Carbs: 4 kcal/g, Fat: 9 kcal/g)
  const proteinCals = totalProtein * 4;
  const carbsCals = totalCarbs * 4;
  const fatCals = totalFats * 9;
  const macroCalSum = proteinCals + carbsCals + fatCals || 1;

  const macroPieData = [
    { name: 'Protein', value: proteinCals, grams: totalProtein, color: '#10b981' },
    { name: 'Carbohydrates', value: carbsCals, grams: totalCarbs, color: '#06b6d4' },
    { name: 'Fats', value: fatCals, grams: totalFats, color: '#f59e0b' },
  ];

  // Quick Healthy Food Presets Library
  const PRESET_FOODS: Array<Omit<FoodItem, 'id'> & { defaultCategory: MealType }> = [
    {
      name: 'Whey Protein Isolate Shake',
      calories: 130,
      proteinGrams: 26,
      carbsGrams: 3,
      fatsGrams: 1,
      servingSize: '1 scoop with water',
      defaultCategory: 'Snacks',
    },
    {
      name: 'Greek Yogurt 0% & Blueberries',
      calories: 160,
      proteinGrams: 18,
      carbsGrams: 18,
      fatsGrams: 0,
      servingSize: '170g bowl',
      defaultCategory: 'Breakfast',
    },
    {
      name: 'Grilled Herb Chicken & Brown Rice',
      calories: 520,
      proteinGrams: 46,
      carbsGrams: 55,
      fatsGrams: 12,
      servingSize: '1 plate',
      defaultCategory: 'Lunch',
    },
    {
      name: 'Wild Salmon Fillet & Asparagus',
      calories: 480,
      proteinGrams: 42,
      carbsGrams: 8,
      fatsGrams: 28,
      servingSize: '220g serving',
      defaultCategory: 'Dinner',
    },
    {
      name: 'Avocado Toast & Poached Egg',
      calories: 340,
      proteinGrams: 12,
      carbsGrams: 28,
      fatsGrams: 20,
      servingSize: '1 slice sourdough',
      defaultCategory: 'Breakfast',
    },
    {
      name: 'Raw Almonds & Dark Chocolate (85%)',
      calories: 220,
      proteinGrams: 6,
      carbsGrams: 14,
      fatsGrams: 16,
      servingSize: '40g snack',
      defaultCategory: 'Snacks',
    },
  ];

  const handleAddPreset = (food: typeof PRESET_FOODS[0]) => {
    addMeal({
      date: selectedDate,
      type: food.defaultCategory,
      items: [
        {
          id: `f_${Date.now()}`,
          name: food.name,
          calories: food.calories,
          proteinGrams: food.proteinGrams,
          carbsGrams: food.carbsGrams,
          fatsGrams: food.fatsGrams,
          servingSize: food.servingSize,
        },
      ],
      totalCalories: food.calories,
      totalProtein: food.proteinGrams,
      totalCarbs: food.carbsGrams,
      totalFats: food.fatsGrams,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
  };

  const handleCustomMealSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customFoodName.trim()) return;

    const cal = Number(customCalories) || 400;
    const p = Number(customProtein) || 30;
    const c = Number(customCarbs) || 40;
    const f = Number(customFats) || 12;

    addMeal({
      date: selectedDate,
      type: activeCategory,
      items: [
        {
          id: `f_${Date.now()}`,
          name: customFoodName.trim(),
          calories: cal,
          proteinGrams: p,
          carbsGrams: c,
          fatsGrams: f,
          servingSize: '1 serving',
        },
      ],
      totalCalories: cal,
      totalProtein: p,
      totalCarbs: c,
      totalFats: f,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });

    setCustomFoodName('');
    setCustomCalories('');
    setCustomProtein('');
    setCustomCarbs('');
    setCustomFats('');
  };

  const mealCategories: MealType[] = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner with Macro Split Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Caloric Balance Hero */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                  Macronutrient Balance
                </span>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Daily Nutrition for {formatDate(selectedDate)}
                </h3>
              </div>
              <button
                onClick={onOpenQuickLog}
                className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-neutral-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Log Meal</span>
              </button>
            </div>

            {/* Macro Cards Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {/* Calories */}
              <div className="p-3.5 rounded-xl bg-neutral-950/70 border border-neutral-800">
                <div className="text-xs text-neutral-400">Calories</div>
                <div className="text-xl font-bold text-white tabular-nums mt-0.5">
                  {totalCalories}
                </div>
                <div className="text-[11px] text-neutral-500 mt-0.5">
                  Goal: {targetCalories} kcal
                </div>
                <div className="w-full h-1.5 bg-neutral-800 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full"
                    style={{ width: `${Math.min(100, (totalCalories / targetCalories) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Protein */}
              <div className="p-3.5 rounded-xl bg-neutral-950/70 border border-emerald-500/20">
                <div className="text-xs font-semibold text-emerald-400">Protein</div>
                <div className="text-xl font-bold text-white tabular-nums mt-0.5">
                  {totalProtein}g
                </div>
                <div className="text-[11px] text-neutral-500 mt-0.5">
                  Goal: {targetProtein}g
                </div>
                <div className="w-full h-1.5 bg-neutral-800 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${Math.min(100, (totalProtein / targetProtein) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Carbs */}
              <div className="p-3.5 rounded-xl bg-neutral-950/70 border border-cyan-500/20">
                <div className="text-xs font-semibold text-cyan-400">Carbohydrates</div>
                <div className="text-xl font-bold text-white tabular-nums mt-0.5">
                  {totalCarbs}g
                </div>
                <div className="text-[11px] text-neutral-500 mt-0.5">
                  Goal: {targetCarbs}g
                </div>
                <div className="w-full h-1.5 bg-neutral-800 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full bg-cyan-500 rounded-full"
                    style={{ width: `${Math.min(100, (totalCarbs / targetCarbs) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Fats */}
              <div className="p-3.5 rounded-xl bg-neutral-950/70 border border-amber-500/20">
                <div className="text-xs font-semibold text-amber-400">Healthy Fats</div>
                <div className="text-xl font-bold text-white tabular-nums mt-0.5">
                  {totalFats}g
                </div>
                <div className="text-[11px] text-neutral-500 mt-0.5">
                  Goal: {targetFats}g
                </div>
                <div className="w-full h-1.5 bg-neutral-800 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full"
                    style={{ width: `${Math.min(100, (totalFats / targetFats) * 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Visual Meal Feature */}
            <div className="flex items-center gap-4 p-3 bg-neutral-950/40 rounded-xl border border-neutral-800/60">
              <img
                src="/src/assets/images/nutrition_healthy_bowl_1793968158774.jpg"
                alt="Nutritious Fitness Bowl"
                className="w-16 h-16 rounded-lg object-cover shrink-0 border border-neutral-800"
                referrerPolicy="no-referrer"
              />
              <div className="text-xs text-neutral-300">
                <span className="font-bold text-white block mb-0.5">Nutrition Philosophy</span>
                Fueling your body with whole foods, complex carbohydrates, and adequate amino acids maximizes muscular protein synthesis and workout endurance.
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
            <span>Remaining Daily Budget:</span>
            <span className="font-bold text-emerald-400 tabular-nums">
              {Math.max(0, targetCalories - totalCalories)} kcal left
            </span>
          </div>
        </div>

        {/* Macro Distribution Donut */}
        <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight mb-1">Macro Calorie Split</h3>
            <p className="text-xs text-neutral-400 mb-4">Energy distribution across today's intake</p>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={macroPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {macroPieData.map((entry, index) => (
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
                            <div className="text-neutral-300 tabular-nums">
                              {data.grams}g ({Math.round((data.value / macroCalSum) * 100)}%)
                            </div>
                            <div className="text-[10px] text-neutral-500 tabular-nums">
                              {data.value} kcal
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2 pt-2 border-t border-neutral-800 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-neutral-300">Protein</span>
                </div>
                <span className="font-semibold text-white tabular-nums">
                  {Math.round((proteinCals / macroCalSum) * 100)}% ({totalProtein}g)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
                  <span className="text-neutral-300">Carbs</span>
                </div>
                <span className="font-semibold text-white tabular-nums">
                  {Math.round((carbsCals / macroCalSum) * 100)}% ({totalCarbs}g)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="text-neutral-300">Fats</span>
                </div>
                <span className="font-semibold text-white tabular-nums">
                  {Math.round((fatCals / macroCalSum) * 100)}% ({totalFats}g)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hydration Widget */}
      <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
              <Droplet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Hydration Tracker</h3>
              <p className="text-xs text-neutral-400">
                Logged <span className="text-cyan-400 font-semibold tabular-nums">{todayActivity.waterMl} ml</span> of {waterTarget} ml goal ({Math.min(100, Math.round((todayActivity.waterMl / waterTarget) * 100))}%)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => addWater(250)}
              className="flex-1 sm:flex-none px-3.5 py-2 bg-neutral-950 hover:bg-cyan-500/15 border border-neutral-800 hover:border-cyan-500/40 rounded-lg text-xs font-semibold text-neutral-200 transition-colors flex items-center justify-center gap-1.5"
            >
              <Droplet className="w-3.5 h-3.5 text-cyan-400" />
              <span>+250ml Glass</span>
            </button>
            <button
              onClick={() => addWater(500)}
              className="flex-1 sm:flex-none px-3.5 py-2 bg-neutral-950 hover:bg-cyan-500/15 border border-neutral-800 hover:border-cyan-500/40 rounded-lg text-xs font-semibold text-neutral-200 transition-colors flex items-center justify-center gap-1.5"
            >
              <Droplet className="w-3.5 h-3.5 text-cyan-400" />
              <span>+500ml Bottle</span>
            </button>
            <button
              onClick={() => setWater(0)}
              className="px-2.5 py-2 text-neutral-400 hover:text-rose-400 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 rounded-lg text-xs transition-colors"
              title="Reset Water Counter"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Visual glass progression */}
        <div className="mt-4 pt-4 border-t border-neutral-800">
          <div className="w-full h-3 rounded-full bg-neutral-950 border border-neutral-800 overflow-hidden">
            <div
              className="h-full bg-cyan-500 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, (todayActivity.waterMl / waterTarget) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Meals Breakdown By Category & Quick Food Library */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Meals Log List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white tracking-tight">Today's Logged Meals</h3>
            <span className="text-xs text-neutral-400">{dayMeals.length} records</span>
          </div>

          {mealCategories.map((category) => {
            const categoryMeals = dayMeals.filter((m) => m.type === category);
            const catCals = categoryMeals.reduce((sum, m) => sum + m.totalCalories, 0);
            const catProtein = categoryMeals.reduce((sum, m) => sum + m.totalProtein, 0);

            return (
              <div key={category} className="p-5 rounded-xl bg-neutral-900 border border-neutral-800 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white">{category}</span>
                    <span className="text-xs text-neutral-500">({categoryMeals.length} items)</span>
                  </div>
                  <div className="text-xs font-semibold text-neutral-300 tabular-nums">
                    {catCals} kcal · <span className="text-emerald-400">{catProtein}g protein</span>
                  </div>
                </div>

                {categoryMeals.length === 0 ? (
                  <div className="py-4 text-center text-xs text-neutral-500">
                    No {category.toLowerCase()} logged for {selectedDate}.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {categoryMeals.map((meal) => (
                      <div
                        key={meal.id}
                        className="p-3 rounded-lg bg-neutral-950/60 border border-neutral-800/80 flex items-center justify-between"
                      >
                        <div className="space-y-0.5 min-w-0">
                          <div className="text-xs font-bold text-white truncate">
                            {meal.items.map((i) => i.name).join(', ')}
                          </div>
                          <div className="text-[11px] text-neutral-400">
                            P: {meal.totalProtein}g · C: {meal.totalCarbs}g · F: {meal.totalFats}g
                            {meal.time ? ` · ${meal.time}` : ''}
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <div className="text-xs font-bold text-emerald-400 tabular-nums">
                            {meal.totalCalories} kcal
                          </div>
                          <button
                            onClick={() => deleteMeal(meal.id)}
                            className="p-1 text-neutral-500 hover:text-rose-400 transition-colors"
                            title="Delete meal"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Quick Food Library & Direct Add */}
        <div className="space-y-4">
          <div className="p-5 rounded-xl bg-neutral-900 border border-neutral-800 space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white tracking-tight">Quick Food Presets</h3>
            </div>
            <p className="text-xs text-neutral-400">
              Tap any verified macro item to add it instantly to your daily log:
            </p>

            <div className="space-y-2">
              {PRESET_FOODS.map((food, i) => (
                <button
                  key={i}
                  onClick={() => handleAddPreset(food)}
                  className="w-full p-2.5 rounded-lg bg-neutral-950/60 hover:bg-neutral-800/80 border border-neutral-800 hover:border-emerald-500/40 text-left transition-colors flex items-center justify-between group"
                >
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors truncate">
                      {food.name}
                    </div>
                    <div className="text-[10px] text-neutral-400">
                      {food.calories} kcal · {food.proteinGrams}g Protein ({food.defaultCategory})
                    </div>
                  </div>
                  <Plus className="w-3.5 h-3.5 text-neutral-400 group-hover:text-emerald-400 shrink-0 ml-2" />
                </button>
              ))}
            </div>
          </div>

          {/* Quick Custom Food Add Box */}
          <div className="p-5 rounded-xl bg-neutral-900 border border-neutral-800 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Quick Add Custom Food
            </h4>
            <form onSubmit={handleCustomMealSubmit} className="space-y-2.5">
              <select
                value={activeCategory}
                onChange={(e) => setActiveCategory(e.target.value as MealType)}
                className="w-full px-2.5 py-1.5 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-neutral-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
                <option value="Snacks">Snacks</option>
              </select>

              <input
                type="text"
                required
                placeholder="Food item name"
                value={customFoodName}
                onChange={(e) => setCustomFoodName(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-neutral-200 focus:outline-none focus:border-emerald-500"
              />

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  required
                  placeholder="Calories"
                  value={customCalories}
                  onChange={(e) => setCustomCalories(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-neutral-200 tabular-nums focus:outline-none focus:border-emerald-500"
                />
                <input
                  type="number"
                  placeholder="Protein (g)"
                  value={customProtein}
                  onChange={(e) => setCustomProtein(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-neutral-200 tabular-nums focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Carbs (g)"
                  value={customCarbs}
                  onChange={(e) => setCustomCarbs(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-neutral-200 tabular-nums focus:outline-none focus:border-emerald-500"
                />
                <input
                  type="number"
                  placeholder="Fats (g)"
                  value={customFats}
                  onChange={(e) => setCustomFats(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-neutral-200 tabular-nums focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-neutral-950 font-bold text-xs rounded-lg transition-colors"
              >
                Add to {activeCategory}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
