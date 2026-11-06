import React, { useState } from 'react';
import {
  User,
  Settings,
  Scale,
  Flame,
  Activity,
  Droplet,
  Save,
  RotateCcw,
  Download,
  Upload,
  CheckCircle2,
  Moon,
  Sun,
  ShieldCheck,
} from 'lucide-react';
import { useFitness } from '../../context/FitnessContext';
import { calculateBMI, calculateBMR, calculateTDEE } from '../../utils/calculations';

interface ProfileSettingsViewProps {
  onOpenAuth: () => void;
}

export const ProfileSettingsView: React.FC<ProfileSettingsViewProps> = ({ onOpenAuth }) => {
  const { user, updateProfile, toggleTheme, theme, resetAllData, isAuthenticated } = useFitness();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [age, setAge] = useState(user.age.toString());
  const [gender, setGender] = useState(user.gender);
  const [heightCm, setHeightCm] = useState(user.heightCm.toString());
  const [weightKg, setWeightKg] = useState(user.weightKg.toString());
  const [targetWeightKg, setTargetWeightKg] = useState(user.targetWeightKg.toString());
  const [fitnessLevel, setFitnessLevel] = useState(user.fitnessLevel);
  const [primaryGoal, setPrimaryGoal] = useState(user.primaryGoal);
  const [activityLevel, setActivityLevel] = useState(user.activityLevel);
  const [unitSystem, setUnitSystem] = useState(user.unitSystem);

  // Targets
  const [stepTarget, setStepTarget] = useState(user.dailyTargets.steps.toString());
  const [calorieBurnTarget, setCalorieBurnTarget] = useState(user.dailyTargets.caloriesBurned.toString());
  const [activeMinTarget, setActiveMinTarget] = useState(user.dailyTargets.activeMinutes.toString());
  const [waterTarget, setWaterTarget] = useState(user.dailyTargets.waterMl.toString());
  const [calorieIntakeTarget, setCalorieIntakeTarget] = useState(user.dailyTargets.calorieIntake.toString());
  const [proteinTarget, setProteinTarget] = useState(user.dailyTargets.proteinGrams.toString());
  const [carbsTarget, setCarbsTarget] = useState(user.dailyTargets.carbsGrams.toString());
  const [fatsTarget, setFatsTarget] = useState(user.dailyTargets.fatsGrams.toString());

  const [savedSuccess, setSavedSuccess] = useState(false);

  // Calculations
  const bmr = calculateBMR(Number(weightKg) || 75, Number(heightCm) || 180, Number(age) || 28, gender);
  const tdee = calculateTDEE(bmr, activityLevel);
  const bmiInfo = calculateBMI(Number(weightKg) || 75, Number(heightCm) || 180);

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();

    updateProfile({
      name,
      email,
      age: Number(age) || 28,
      gender,
      heightCm: Number(heightCm) || 180,
      weightKg: Number(weightKg) || 75,
      targetWeightKg: Number(targetWeightKg) || 72,
      fitnessLevel,
      primaryGoal,
      activityLevel,
      unitSystem,
      dailyTargets: {
        steps: Number(stepTarget) || 10000,
        caloriesBurned: Number(calorieBurnTarget) || 550,
        activeMinutes: Number(activeMinTarget) || 45,
        waterMl: Number(waterTarget) || 2800,
        calorieIntake: Number(calorieIntakeTarget) || 2350,
        proteinGrams: Number(proteinTarget) || 160,
        carbsGrams: Number(carbsTarget) || 240,
        fatsGrams: Number(fatsTarget) || 65,
      },
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(localStorage));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `fittrack_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleResetData = () => {
    if (confirm('Are you sure you want to reset all fitness logs back to factory demo defaults?')) {
      resetAllData();
      alert('Data reset successfully!');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-neutral-900 border border-neutral-800">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <User className="w-5 h-5 text-emerald-400" />
            <span>Profile & Biometric Settings</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Customize personal targets, physiological parameters, and visual preferences
          </p>
        </div>

        {!isAuthenticated && (
          <button
            onClick={onOpenAuth}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-neutral-950 font-bold text-xs rounded-lg transition-colors shadow-sm"
          >
            Sign In / Register
          </button>
        )}
      </div>

      <form onSubmit={handleSaveAll} className="space-y-6">
        {/* Biometric Vital Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* BMR */}
          <div className="p-5 rounded-xl bg-neutral-900 border border-neutral-800">
            <div className="text-xs text-neutral-400 uppercase tracking-wider mb-1 font-semibold">
              Basal Metabolic Rate (BMR)
            </div>
            <div className="text-2xl font-black text-white tabular-nums">
              {bmr} <span className="text-xs font-normal text-neutral-400">kcal / day</span>
            </div>
            <p className="text-[11px] text-neutral-500 mt-1">
              Calories burned purely at resting state (Mifflin-St Jeor formula).
            </p>
          </div>

          {/* TDEE */}
          <div className="p-5 rounded-xl bg-neutral-900 border border-emerald-500/20">
            <div className="text-xs text-emerald-400 uppercase tracking-wider mb-1 font-semibold">
              Maintenance Energy (TDEE)
            </div>
            <div className="text-2xl font-black text-emerald-400 tabular-nums">
              {tdee} <span className="text-xs font-normal text-neutral-400">kcal / day</span>
            </div>
            <p className="text-[11px] text-neutral-500 mt-1">
              Daily burn including your {activityLevel.toLowerCase()} activity level.
            </p>
          </div>

          {/* BMI */}
          <div className="p-5 rounded-xl bg-neutral-900 border border-neutral-800">
            <div className="text-xs text-neutral-400 uppercase tracking-wider mb-1 font-semibold">
              Body Mass Index (BMI)
            </div>
            <div className="text-2xl font-black text-white tabular-nums flex items-baseline gap-2">
              <span>{bmiInfo.bmi}</span>
              <span className={`text-xs font-bold ${bmiInfo.color}`}>
                ({bmiInfo.category})
              </span>
            </div>
            <p className="text-[11px] text-neutral-500 mt-1">
              Based on {heightCm} cm height and {weightKg} kg weight.
            </p>
          </div>
        </div>

        {/* Profile Details & Biometric Inputs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
            <h3 className="text-sm font-bold text-white tracking-tight border-b border-neutral-800 pb-2">
              Personal Information
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-neutral-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-neutral-100 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Age
                </label>
                <input
                  type="number"
                  min="12"
                  max="110"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-neutral-100 tabular-nums focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Gender
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-neutral-100 focus:outline-none focus:border-emerald-500"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Height (cm)
                </label>
                <input
                  type="number"
                  value={heightCm}
                  onChange={(e) => setHeightCm(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-neutral-100 tabular-nums focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Current Weight (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-neutral-100 tabular-nums focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Target Weight (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={targetWeightKg}
                  onChange={(e) => setTargetWeightKg(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-neutral-100 tabular-nums focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Experience Level
                </label>
                <select
                  value={fitnessLevel}
                  onChange={(e) => setFitnessLevel(e.target.value as any)}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-neutral-100 focus:outline-none focus:border-emerald-500"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Elite">Elite</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Activity Level
                </label>
                <select
                  value={activityLevel}
                  onChange={(e) => setActivityLevel(e.target.value as any)}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-neutral-100 focus:outline-none focus:border-emerald-500"
                >
                  <option value="Sedentary">Sedentary (Desk job)</option>
                  <option value="Lightly Active">Lightly Active (1-3 days/wk)</option>
                  <option value="Moderately Active">Moderately Active (3-5 days/wk)</option>
                  <option value="Very Active">Very Active (6-7 days/wk)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Primary Goal
              </label>
              <select
                value={primaryGoal}
                onChange={(e) => setPrimaryGoal(e.target.value as any)}
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-neutral-100 focus:outline-none focus:border-emerald-500"
              >
                <option value="Weight Loss">Weight Loss & Fat Reduction</option>
                <option value="Muscle Building">Muscle Building & Hypertrophy</option>
                <option value="Endurance">Cardiovascular Endurance</option>
                <option value="General Health">General Health & Longevity</option>
                <option value="Athletic Conditioning">Athletic Conditioning</option>
              </select>
            </div>
          </div>

          {/* Daily Targets Configuration */}
          <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
            <h3 className="text-sm font-bold text-white tracking-tight border-b border-neutral-800 pb-2">
              Daily Target Goals
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Step Target
                </label>
                <input
                  type="number"
                  value={stepTarget}
                  onChange={(e) => setStepTarget(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-neutral-100 tabular-nums focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Active Calories (Burn)
                </label>
                <input
                  type="number"
                  value={calorieBurnTarget}
                  onChange={(e) => setCalorieBurnTarget(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-neutral-100 tabular-nums focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Active Minutes
                </label>
                <input
                  type="number"
                  value={activeMinTarget}
                  onChange={(e) => setActiveMinTarget(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-neutral-100 tabular-nums focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Daily Water (ml)
                </label>
                <input
                  type="number"
                  value={waterTarget}
                  onChange={(e) => setWaterTarget(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-neutral-100 tabular-nums focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Daily Calorie Intake (Food)
              </label>
              <input
                type="number"
                value={calorieIntakeTarget}
                onChange={(e) => setCalorieIntakeTarget(e.target.value)}
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
                  value={proteinTarget}
                  onChange={(e) => setProteinTarget(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-neutral-100 tabular-nums focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-cyan-400 mb-1">
                  Carbs (g)
                </label>
                <input
                  type="number"
                  value={carbsTarget}
                  onChange={(e) => setCarbsTarget(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-neutral-100 tabular-nums focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-amber-400 mb-1">
                  Fats (g)
                </label>
                <input
                  type="number"
                  value={fatsTarget}
                  onChange={(e) => setFatsTarget(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-neutral-100 tabular-nums focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Application Theme & Units */}
            <div className="pt-2 border-t border-neutral-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">Visual Theme</span>
                  <span className="text-[11px] text-neutral-400">Dark mode with neon emerald accents</span>
                </div>
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="px-3 py-1.5 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 rounded-lg text-xs font-medium text-neutral-200 flex items-center gap-1.5"
                >
                  {theme === 'dark' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
                  <span className="capitalize">{theme} Theme</span>
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">Measurement System</span>
                  <span className="text-[11px] text-neutral-400">Kilograms, kilometers, milliliters</span>
                </div>
                <select
                  value={unitSystem}
                  onChange={(e) => setUnitSystem(e.target.value as any)}
                  className="px-2.5 py-1 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-neutral-300"
                >
                  <option value="metric">Metric (kg / km)</option>
                  <option value="imperial">Imperial (lbs / miles)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls Strip */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-neutral-900 border border-neutral-800">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportData}
              className="px-3 py-2 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 rounded-lg text-xs font-semibold text-neutral-300 flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Data (JSON)</span>
            </button>
            <button
              type="button"
              onClick={handleResetData}
              className="px-3 py-2 bg-neutral-950 hover:bg-rose-500/10 border border-neutral-800 hover:border-rose-500/30 rounded-lg text-xs font-semibold text-neutral-400 hover:text-rose-400 flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Demo Defaults</span>
            </button>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {savedSuccess && (
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Profile Settings Saved</span>
              </span>
            )}
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-neutral-950 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
