import { WorkoutType, WorkoutIntensity } from '../types/fitness';

/**
 * Calculates Basal Metabolic Rate using Mifflin-St Jeor Equation
 */
export function calculateBMR(
  weightKg: number,
  heightCm: number,
  age: number,
  gender: 'male' | 'female' | 'other'
): number {
  if (gender === 'female') {
    return Math.round(10 * weightKg + 6.25 * heightCm - 5 * age - 161);
  }
  // Default to male / other formula
  return Math.round(10 * weightKg + 6.25 * heightCm - 5 * age + 5);
}

/**
 * Calculates Total Daily Energy Expenditure (TDEE)
 */
export function calculateTDEE(
  bmr: number,
  activityLevel: 'Sedentary' | 'Lightly Active' | 'Moderately Active' | 'Very Active'
): number {
  const multipliers: Record<string, number> = {
    'Sedentary': 1.2,
    'Lightly Active': 1.375,
    'Moderately Active': 1.55,
    'Very Active': 1.725,
  };
  return Math.round(bmr * (multipliers[activityLevel] || 1.375));
}

/**
 * Calculates Body Mass Index (BMI)
 */
export function calculateBMI(weightKg: number, heightCm: number): {
  bmi: number;
  category: 'Underweight' | 'Normal' | 'Overweight' | 'Obese';
  color: string;
} {
  const heightM = heightCm / 100;
  const bmi = Number((weightKg / (heightM * heightM)).toFixed(1));

  if (bmi < 18.5) {
    return { bmi, category: 'Underweight', color: 'text-amber-400' };
  } else if (bmi < 25) {
    return { bmi, category: 'Normal', color: 'text-emerald-400' };
  } else if (bmi < 30) {
    return { bmi, category: 'Overweight', color: 'text-amber-500' };
  } else {
    return { bmi, category: 'Obese', color: 'text-rose-500' };
  }
}

/**
 * MET (Metabolic Equivalent of Task) values for standard activities
 */
const MET_VALUES: Record<WorkoutType, Record<WorkoutIntensity, number>> = {
  Running: { Light: 7.0, Moderate: 9.8, High: 11.5, Extreme: 13.5 },
  Walking: { Light: 2.8, Moderate: 3.5, High: 4.5, Extreme: 5.5 },
  Cycling: { Light: 5.5, Moderate: 7.5, High: 10.0, Extreme: 12.0 },
  Gym: { Light: 3.5, Moderate: 5.0, High: 6.5, Extreme: 8.0 },
  Yoga: { Light: 2.5, Moderate: 3.3, High: 4.0, Extreme: 5.0 },
  Cardio: { Light: 5.0, Moderate: 7.0, High: 9.0, Extreme: 11.0 },
  HIIT: { Light: 6.0, Moderate: 8.5, High: 11.0, Extreme: 14.0 },
  Swimming: { Light: 5.8, Moderate: 7.0, High: 9.8, Extreme: 11.0 },
};

/**
 * Estimates calories burned during a workout: Calories = MET * Weight(kg) * Duration(hours)
 */
export function estimateCaloriesBurned(
  type: WorkoutType,
  intensity: WorkoutIntensity,
  durationMinutes: number,
  weightKg: number = 75
): number {
  const met = MET_VALUES[type]?.[intensity] || 6.0;
  const durationHours = durationMinutes / 60;
  return Math.round(met * weightKg * durationHours);
}

/**
 * Converts kg to lbs
 */
export function kgToLbs(kg: number): number {
  return Number((kg * 2.20462).toFixed(1));
}

/**
 * Converts lbs to kg
 */
export function lbsToKg(lbs: number): number {
  return Number((lbs / 2.20462).toFixed(1));
}

/**
 * Converts km to miles
 */
export function kmToMiles(km: number): number {
  return Number((km * 0.621371).toFixed(2));
}

/**
 * Formats a date string YYYY-MM-DD into readable format
 */
export function formatDate(dateString: string): string {
  try {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
}

/**
 * Returns today's date formatted as YYYY-MM-DD
 */
export function getTodayDateString(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Returns array of dates for past N days
 */
export function getPastDates(daysCount: number): string[] {
  const dates: string[] = [];
  const today = new Date();

  for (let i = daysCount - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    dates.push(`${year}-${month}-${day}`);
  }
  return dates;
}
