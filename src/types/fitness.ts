export type WorkoutType = 
  | 'Running'
  | 'Walking'
  | 'Cycling'
  | 'Gym'
  | 'Yoga'
  | 'Cardio'
  | 'HIIT'
  | 'Swimming';

export type WorkoutIntensity = 'Light' | 'Moderate' | 'High' | 'Extreme';

export interface Workout {
  id: string;
  userId: string;
  type: WorkoutType;
  title: string;
  durationMinutes: number;
  caloriesBurned: number;
  date: string; // YYYY-MM-DD
  time?: string; // HH:mm
  intensity: WorkoutIntensity;
  notes?: string;
  distanceKm?: number;
  heartRateAvg?: number;
  createdAt: string;
}

export type MealType = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks';

export interface FoodItem {
  id: string;
  name: string;
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatsGrams: number;
  servingSize?: string;
}

export interface MealLog {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  type: MealType;
  items: FoodItem[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFats: number;
  time?: string;
  createdAt: string;
}

export interface DailyActivity {
  date: string; // YYYY-MM-DD
  steps: number;
  caloriesBurned: number;
  activeMinutes: number;
  waterMl: number;
  distanceKm: number;
  floorsClimbed: number;
}

export type GoalCategory = 'steps' | 'calories' | 'active_minutes' | 'water' | 'workouts' | 'custom';

export interface FitnessGoal {
  id: string;
  userId: string;
  title: string;
  category: GoalCategory;
  period: 'daily' | 'weekly' | 'custom';
  target: number;
  current: number;
  unit: string;
  completed: boolean;
  deadline?: string;
  createdAt: string;
}

export interface WeightRecord {
  id: string;
  date: string; // YYYY-MM-DD
  weightKg: number;
  bodyFatPercentage?: number;
  notes?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  gender: 'male' | 'female' | 'other';
  age: number;
  heightCm: number;
  weightKg: number;
  targetWeightKg: number;
  fitnessLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Elite';
  primaryGoal: 'Weight Loss' | 'Muscle Building' | 'Endurance' | 'General Health' | 'Athletic Conditioning';
  activityLevel: 'Sedentary' | 'Lightly Active' | 'Moderately Active' | 'Very Active';
  unitSystem: 'metric' | 'imperial';
  theme: 'dark' | 'light';
  dailyTargets: {
    steps: number;
    caloriesBurned: number;
    activeMinutes: number;
    waterMl: number;
    calorieIntake: number;
    proteinGrams: number;
    carbsGrams: number;
    fatsGrams: number;
  };
  weeklyWorkoutTarget: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface AIAnalysisReport {
  summary: string;
  strengths: string[];
  areasForImprovement: string[];
  actionableRecommendations: string[];
  suggestedGoals: Array<{
    title: string;
    category: GoalCategory;
    target: number;
    unit: string;
    reason: string;
  }>;
}
