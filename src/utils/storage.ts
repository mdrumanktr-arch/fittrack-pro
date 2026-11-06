import {
  UserProfile,
  Workout,
  MealLog,
  DailyActivity,
  FitnessGoal,
  WeightRecord,
  ChatMessage,
} from '../types/fitness';
import { getPastDates, getTodayDateString } from './calculations';

const STORAGE_KEYS = {
  USER_PROFILE: 'fittrack_user_profile',
  WORKOUTS: 'fittrack_workouts',
  MEALS: 'fittrack_meals',
  DAILY_ACTIVITIES: 'fittrack_daily_activities',
  GOALS: 'fittrack_goals',
  WEIGHT_RECORDS: 'fittrack_weight_records',
  CHAT_MESSAGES: 'fittrack_chat_messages',
  AUTH_STATE: 'fittrack_auth_state',
};

// Initial realistic default user profile
export const DEFAULT_USER: UserProfile = {
  id: 'usr_demo_101',
  name: 'Alex Mercer',
  email: 'alex.mercer@example.com',
  avatarUrl: '/src/assets/images/hero_fitness_athlete_1793968157848.jpg',
  gender: 'male',
  age: 28,
  heightCm: 182,
  weightKg: 76.5,
  targetWeightKg: 73.0,
  fitnessLevel: 'Intermediate',
  primaryGoal: 'Muscle Building',
  activityLevel: 'Moderately Active',
  unitSystem: 'metric',
  theme: 'dark',
  dailyTargets: {
    steps: 10000,
    caloriesBurned: 550,
    activeMinutes: 45,
    waterMl: 2800,
    calorieIntake: 2350,
    proteinGrams: 160,
    carbsGrams: 240,
    fatsGrams: 65,
  },
  weeklyWorkoutTarget: 5,
};

// Seed realistic mock data across recent days
export function generateSeedData() {
  const dates = getPastDates(14);
  const today = getTodayDateString();

  const workouts: Workout[] = [
    {
      id: 'w_1',
      userId: DEFAULT_USER.id,
      type: 'Gym',
      title: 'Upper Body Hypertrophy',
      durationMinutes: 55,
      caloriesBurned: 440,
      date: today,
      time: '07:30',
      intensity: 'High',
      notes: 'Bench press 4x8 @ 85kg, Incline DB press 3x10, Barbell rows 4x10.',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'w_2',
      userId: DEFAULT_USER.id,
      type: 'Running',
      title: 'Morning Interval Run',
      durationMinutes: 32,
      caloriesBurned: 360,
      date: dates[dates.length - 2],
      time: '06:45',
      intensity: 'High',
      distanceKm: 5.2,
      heartRateAvg: 154,
      notes: '5x 400m sprints with 90s jog recovery.',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'w_3',
      userId: DEFAULT_USER.id,
      type: 'Cycling',
      title: 'Zone 2 Cadence Ride',
      durationMinutes: 48,
      caloriesBurned: 410,
      date: dates[dates.length - 3],
      time: '18:15',
      intensity: 'Moderate',
      distanceKm: 16.4,
      heartRateAvg: 138,
      notes: 'Smooth river trail pace, kept cadence above 85rpm.',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'w_4',
      userId: DEFAULT_USER.id,
      type: 'Gym',
      title: 'Leg Day & Core Stability',
      durationMinutes: 60,
      caloriesBurned: 490,
      date: dates[dates.length - 4],
      time: '17:00',
      intensity: 'Extreme',
      notes: 'Back squats 5x5 @ 110kg, Bulgarian split squats 3x10, Romanian deadlifts.',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'w_5',
      userId: DEFAULT_USER.id,
      type: 'Yoga',
      title: 'Post-Lift Vinyasa Flow',
      durationMinutes: 30,
      caloriesBurned: 130,
      date: dates[dates.length - 5],
      time: '19:30',
      intensity: 'Light',
      notes: 'Hamstring stretches, thoracic spine opening, breathwork.',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'w_6',
      userId: DEFAULT_USER.id,
      type: 'HIIT',
      title: 'Tabata Bodyweight Burner',
      durationMinutes: 25,
      caloriesBurned: 310,
      date: dates[dates.length - 6],
      time: '12:15',
      intensity: 'High',
      notes: 'Kettlebell swings, burpees, jump rope, mountain climbers.',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'w_7',
      userId: DEFAULT_USER.id,
      type: 'Walking',
      title: 'Sunset Brisk Walk',
      durationMinutes: 40,
      caloriesBurned: 180,
      date: dates[dates.length - 7],
      time: '19:00',
      intensity: 'Moderate',
      distanceKm: 3.8,
      notes: 'Active recovery walk listening to fitness podcast.',
      createdAt: new Date().toISOString(),
    },
  ];

  const meals: MealLog[] = [
    {
      id: 'm_1',
      userId: DEFAULT_USER.id,
      date: today,
      type: 'Breakfast',
      time: '08:45',
      items: [
        { id: 'f_1', name: 'Rolled Oats & Chia Seeds', calories: 340, proteinGrams: 14, carbsGrams: 52, fatsGrams: 8, servingSize: '80g' },
        { id: 'f_2', name: 'Whey Protein Isolate (Vanilla)', calories: 120, proteinGrams: 25, carbsGrams: 2, fatsGrams: 1, servingSize: '1 scoop (30g)' },
        { id: 'f_3', name: 'Fresh Blueberries', calories: 60, proteinGrams: 1, carbsGrams: 14, fatsGrams: 0, servingSize: '100g' },
      ],
      totalCalories: 520,
      totalProtein: 40,
      totalCarbs: 68,
      totalFats: 9,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'm_2',
      userId: DEFAULT_USER.id,
      date: today,
      type: 'Lunch',
      time: '13:15',
      items: [
        { id: 'f_4', name: 'Grilled Herb Chicken Breast', calories: 280, proteinGrams: 48, carbsGrams: 0, fatsGrams: 6, servingSize: '200g' },
        { id: 'f_5', name: 'Quinoa & Wild Rice Blend', calories: 260, proteinGrams: 7, carbsGrams: 48, fatsGrams: 4, servingSize: '180g' },
        { id: 'f_6', name: 'Avocado & Baby Spinach', calories: 140, proteinGrams: 3, carbsGrams: 6, fatsGrams: 12, servingSize: '1 bowl' },
      ],
      totalCalories: 680,
      totalProtein: 58,
      totalCarbs: 54,
      totalFats: 22,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'm_3',
      userId: DEFAULT_USER.id,
      date: today,
      type: 'Snacks',
      time: '16:30',
      items: [
        { id: 'f_7', name: 'Greek Yogurt 0%', calories: 130, proteinGrams: 18, carbsGrams: 7, fatsGrams: 0, servingSize: '170g' },
        { id: 'f_8', name: 'Raw Almonds', calories: 160, proteinGrams: 6, carbsGrams: 6, fatsGrams: 14, servingSize: '28g' },
      ],
      totalCalories: 290,
      totalProtein: 24,
      totalCarbs: 13,
      totalFats: 14,
      createdAt: new Date().toISOString(),
    },
  ];

  const dailyActivities: DailyActivity[] = dates.map((dateStr, idx) => {
    // Generate realistic variance
    const isToday = dateStr === today;
    const baseSteps = isToday ? 8420 : 9200 + Math.floor(Math.sin(idx * 1.5) * 2100);
    const baseActiveMins = isToday ? 42 : 45 + Math.floor(Math.cos(idx) * 18);
    const baseCalories = isToday ? 440 : 480 + Math.floor(Math.sin(idx) * 120);
    const baseWater = isToday ? 2100 : 2500 + Math.floor(Math.cos(idx * 2) * 500);

    return {
      date: dateStr,
      steps: Math.max(3500, baseSteps),
      caloriesBurned: Math.max(250, baseCalories),
      activeMinutes: Math.max(20, baseActiveMins),
      waterMl: Math.max(1200, baseWater),
      distanceKm: Number(((baseSteps * 0.75) / 1000).toFixed(2)),
      floorsClimbed: 8 + (idx % 6),
    };
  });

  const goals: FitnessGoal[] = [
    {
      id: 'g_1',
      userId: DEFAULT_USER.id,
      title: 'Daily Movement Baseline',
      category: 'steps',
      period: 'daily',
      target: 10000,
      current: 8420,
      unit: 'steps',
      completed: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'g_2',
      userId: DEFAULT_USER.id,
      title: 'Daily Active Output',
      category: 'calories',
      period: 'daily',
      target: 550,
      current: 440,
      unit: 'kcal',
      completed: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'g_3',
      userId: DEFAULT_USER.id,
      title: 'Daily High-Intensity Zone',
      category: 'active_minutes',
      period: 'daily',
      target: 45,
      current: 42,
      unit: 'mins',
      completed: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'g_4',
      userId: DEFAULT_USER.id,
      title: 'Cellular Hydration Goal',
      category: 'water',
      period: 'daily',
      target: 2800,
      current: 2100,
      unit: 'ml',
      completed: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'g_5',
      userId: DEFAULT_USER.id,
      title: 'Weekly Training Consistency',
      category: 'workouts',
      period: 'weekly',
      target: 5,
      current: 4,
      unit: 'sessions',
      completed: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'g_6',
      userId: DEFAULT_USER.id,
      title: 'Sub-25min 5K Run Test',
      category: 'custom',
      period: 'custom',
      target: 25,
      current: 26.5,
      unit: 'minutes',
      completed: false,
      deadline: '2026-12-01',
      createdAt: new Date().toISOString(),
    },
  ];

  const weightRecords: WeightRecord[] = [
    { id: 'w_rec_1', date: dates[0], weightKg: 78.2, bodyFatPercentage: 17.5, notes: 'Starting log cycle' },
    { id: 'w_rec_2', date: dates[3], weightKg: 77.8, bodyFatPercentage: 17.2 },
    { id: 'w_rec_3', date: dates[7], weightKg: 77.2, bodyFatPercentage: 16.9 },
    { id: 'w_rec_4', date: dates[10], weightKg: 76.9, bodyFatPercentage: 16.6 },
    { id: 'w_rec_5', date: today, weightKg: 76.5, bodyFatPercentage: 16.4, notes: 'Morning fasting weigh-in' },
  ];

  const chatMessages: ChatMessage[] = [
    {
      id: 'msg_welcome',
      role: 'assistant',
      content: "Welcome to FitTrack Pro, Alex! I'm Coach Alex, your dedicated AI fitness trainer and sports nutritionist. I have access to your live telemetry, recent gym lifts, and macronutrient logs. How can I help optimize your training today?",
      timestamp: '09:00',
    },
  ];

  return {
    user: DEFAULT_USER,
    workouts,
    meals,
    dailyActivities,
    goals,
    weightRecords,
    chatMessages,
  };
}

// Storage helpers with localStorage fallback
export const storageService = {
  getUserProfile(): UserProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      return data ? JSON.parse(data) : DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
    }
  },

  saveUserProfile(profile: UserProfile): void {
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
  },

  getWorkouts(): Workout[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.WORKOUTS);
      if (data) return JSON.parse(data);
      const seed = generateSeedData();
      this.saveWorkouts(seed.workouts);
      return seed.workouts;
    } catch {
      return generateSeedData().workouts;
    }
  },

  saveWorkouts(workouts: Workout[]): void {
    localStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(workouts));
  },

  getMeals(): MealLog[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MEALS);
      if (data) return JSON.parse(data);
      const seed = generateSeedData();
      this.saveMeals(seed.meals);
      return seed.meals;
    } catch {
      return generateSeedData().meals;
    }
  },

  saveMeals(meals: MealLog[]): void {
    localStorage.setItem(STORAGE_KEYS.MEALS, JSON.stringify(meals));
  },

  getDailyActivities(): DailyActivity[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DAILY_ACTIVITIES);
      if (data) return JSON.parse(data);
      const seed = generateSeedData();
      this.saveDailyActivities(seed.dailyActivities);
      return seed.dailyActivities;
    } catch {
      return generateSeedData().dailyActivities;
    }
  },

  saveDailyActivities(activities: DailyActivity[]): void {
    localStorage.setItem(STORAGE_KEYS.DAILY_ACTIVITIES, JSON.stringify(activities));
  },

  getGoals(): FitnessGoal[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.GOALS);
      if (data) return JSON.parse(data);
      const seed = generateSeedData();
      this.saveGoals(seed.goals);
      return seed.goals;
    } catch {
      return generateSeedData().goals;
    }
  },

  saveGoals(goals: FitnessGoal[]): void {
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
  },

  getWeightRecords(): WeightRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.WEIGHT_RECORDS);
      if (data) return JSON.parse(data);
      const seed = generateSeedData();
      this.saveWeightRecords(seed.weightRecords);
      return seed.weightRecords;
    } catch {
      return generateSeedData().weightRecords;
    }
  },

  saveWeightRecords(records: WeightRecord[]): void {
    localStorage.setItem(STORAGE_KEYS.WEIGHT_RECORDS, JSON.stringify(records));
  },

  getChatMessages(): ChatMessage[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CHAT_MESSAGES);
      if (data) return JSON.parse(data);
      const seed = generateSeedData();
      this.saveChatMessages(seed.chatMessages);
      return seed.chatMessages;
    } catch {
      return generateSeedData().chatMessages;
    }
  },

  saveChatMessages(messages: ChatMessage[]): void {
    localStorage.setItem(STORAGE_KEYS.CHAT_MESSAGES, JSON.stringify(messages));
  },

  resetAllData(): void {
    localStorage.clear();
    const seed = generateSeedData();
    this.saveUserProfile(seed.user);
    this.saveWorkouts(seed.workouts);
    this.saveMeals(seed.meals);
    this.saveDailyActivities(seed.dailyActivities);
    this.saveGoals(seed.goals);
    this.saveWeightRecords(seed.weightRecords);
    this.saveChatMessages(seed.chatMessages);
  },
};
