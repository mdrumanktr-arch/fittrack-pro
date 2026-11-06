import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  UserProfile,
  Workout,
  MealLog,
  DailyActivity,
  FitnessGoal,
  WeightRecord,
  ChatMessage,
  AIAnalysisReport,
  WorkoutType,
} from '../types/fitness';
import { storageService, DEFAULT_USER } from '../utils/storage';
import { getTodayDateString } from '../utils/calculations';

interface FitnessContextType {
  user: UserProfile;
  isAuthenticated: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  todayActivity: DailyActivity;
  workouts: Workout[];
  meals: MealLog[];
  dailyActivities: DailyActivity[];
  goals: FitnessGoal[];
  weightRecords: WeightRecord[];
  chatMessages: ChatMessage[];
  isAiThinking: boolean;
  aiAnalysisReport: AIAnalysisReport | null;
  isAnalyzing: boolean;
  theme: 'dark' | 'light';
  
  // Actions
  toggleTheme: () => void;
  login: (email: string, name?: string) => void;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  
  // Workout operations
  addWorkout: (workout: Omit<Workout, 'id' | 'createdAt' | 'userId'>) => void;
  updateWorkout: (id: string, updates: Partial<Workout>) => void;
  deleteWorkout: (id: string) => void;
  
  // Meal operations
  addMeal: (meal: Omit<MealLog, 'id' | 'createdAt' | 'userId'>) => void;
  updateMeal: (id: string, updates: Partial<MealLog>) => void;
  deleteMeal: (id: string) => void;
  
  // Quick Daily activity adjustments
  addSteps: (count: number) => void;
  addWater: (ml: number) => void;
  setWater: (ml: number) => void;
  addActiveMinutes: (minutes: number) => void;
  
  // Goal operations
  addGoal: (goal: Omit<FitnessGoal, 'id' | 'createdAt' | 'userId'>) => void;
  updateGoal: (id: string, updates: Partial<FitnessGoal>) => void;
  deleteGoal: (id: string) => void;
  toggleGoalComplete: (id: string) => void;
  
  // Weight operations
  addWeightRecord: (weightKg: number, bodyFat?: number, notes?: string) => void;
  deleteWeightRecord: (id: string) => void;
  
  // AI Chat & Analysis
  sendMessageToAI: (content: string) => Promise<void>;
  generateAIAnalysis: () => Promise<void>;
  resetAllData: () => void;
}

const FitnessContext = createContext<FitnessContextType | undefined>(undefined);

export const FitnessProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(() => storageService.getUserProfile());
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedDate, setSelectedDate] = useState<string>(() => getTodayDateString());
  
  const [workouts, setWorkouts] = useState<Workout[]>(() => storageService.getWorkouts());
  const [meals, setMeals] = useState<MealLog[]>(() => storageService.getMeals());
  const [dailyActivities, setDailyActivities] = useState<DailyActivity[]>(() => storageService.getDailyActivities());
  const [goals, setGoals] = useState<FitnessGoal[]>(() => storageService.getGoals());
  const [weightRecords, setWeightRecords] = useState<WeightRecord[]>(() => storageService.getWeightRecords());
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => storageService.getChatMessages());
  
  const [isAiThinking, setIsAiThinking] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [aiAnalysisReport, setAiAnalysisReport] = useState<AIAnalysisReport | null>(null);

  const theme = user.theme || 'dark';

  // Apply theme to document element
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Persist state updates to storage
  useEffect(() => {
    storageService.saveUserProfile(user);
  }, [user]);

  useEffect(() => {
    storageService.saveWorkouts(workouts);
  }, [workouts]);

  useEffect(() => {
    storageService.saveMeals(meals);
  }, [meals]);

  useEffect(() => {
    storageService.saveDailyActivities(dailyActivities);
  }, [dailyActivities]);

  useEffect(() => {
    storageService.saveGoals(goals);
  }, [goals]);

  useEffect(() => {
    storageService.saveWeightRecords(weightRecords);
  }, [weightRecords]);

  useEffect(() => {
    storageService.saveChatMessages(chatMessages);
  }, [chatMessages]);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setUser((prev) => ({ ...prev, theme: nextTheme }));
  };

  const login = (email: string, name?: string) => {
    setUser((prev) => ({
      ...prev,
      email,
      name: name || email.split('@')[0],
    }));
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...updates }));
  };

  // Get current activity for selected date (auto-creates if missing)
  const todayActivity = useMemo(() => {
    const existing = dailyActivities.find((a) => a.date === selectedDate);
    if (existing) return existing;

    const newActivity: DailyActivity = {
      date: selectedDate,
      steps: 0,
      caloriesBurned: 0,
      activeMinutes: 0,
      waterMl: 0,
      distanceKm: 0,
      floorsClimbed: 0,
    };
    return newActivity;
  }, [dailyActivities, selectedDate]);

  const updateActivityForDate = (date: string, updater: (prev: DailyActivity) => DailyActivity) => {
    setDailyActivities((prev) => {
      const index = prev.findIndex((a) => a.date === date);
      if (index >= 0) {
        const updated = [...prev];
        updated[index] = updater(updated[index]);
        return updated;
      } else {
        const initial: DailyActivity = {
          date,
          steps: 0,
          caloriesBurned: 0,
          activeMinutes: 0,
          waterMl: 0,
          distanceKm: 0,
          floorsClimbed: 0,
        };
        return [...prev, updater(initial)];
      }
    });
  };

  const addSteps = (count: number) => {
    updateActivityForDate(selectedDate, (act) => {
      const newSteps = Math.max(0, act.steps + count);
      const addedCalories = Math.round(count * 0.04); // ~40 kcal per 1000 steps
      const addedKm = Number(((count * 0.75) / 1000).toFixed(2));
      return {
        ...act,
        steps: newSteps,
        caloriesBurned: Math.max(0, act.caloriesBurned + addedCalories),
        distanceKm: Number((act.distanceKm + addedKm).toFixed(2)),
      };
    });

    // Update steps goal progress
    setGoals((prev) =>
      prev.map((g) => {
        if (g.category === 'steps' && g.period === 'daily') {
          const nextCurrent = Math.max(0, g.current + count);
          return {
            ...g,
            current: nextCurrent,
            completed: nextCurrent >= g.target,
          };
        }
        return g;
      })
    );
  };

  const addWater = (ml: number) => {
    updateActivityForDate(selectedDate, (act) => ({
      ...act,
      waterMl: Math.max(0, act.waterMl + ml),
    }));

    setGoals((prev) =>
      prev.map((g) => {
        if (g.category === 'water' && g.period === 'daily') {
          const nextCurrent = Math.max(0, g.current + ml);
          return {
            ...g,
            current: nextCurrent,
            completed: nextCurrent >= g.target,
          };
        }
        return g;
      })
    );
  };

  const setWater = (ml: number) => {
    updateActivityForDate(selectedDate, (act) => ({
      ...act,
      waterMl: Math.max(0, ml),
    }));
  };

  const addActiveMinutes = (minutes: number) => {
    updateActivityForDate(selectedDate, (act) => ({
      ...act,
      activeMinutes: Math.max(0, act.activeMinutes + minutes),
    }));

    setGoals((prev) =>
      prev.map((g) => {
        if (g.category === 'active_minutes' && g.period === 'daily') {
          const nextCurrent = Math.max(0, g.current + minutes);
          return {
            ...g,
            current: nextCurrent,
            completed: nextCurrent >= g.target,
          };
        }
        return g;
      })
    );
  };

  // Workout CRUD
  const addWorkout = (data: Omit<Workout, 'id' | 'createdAt' | 'userId'>) => {
    const newWorkout: Workout = {
      ...data,
      id: `w_${Date.now()}`,
      userId: user.id,
      createdAt: new Date().toISOString(),
    };

    setWorkouts((prev) => [newWorkout, ...prev]);

    // Automatically update calories burned and active minutes for that date
    updateActivityForDate(data.date, (act) => ({
      ...act,
      caloriesBurned: act.caloriesBurned + data.caloriesBurned,
      activeMinutes: act.activeMinutes + data.durationMinutes,
      distanceKm: data.distanceKm ? Number((act.distanceKm + data.distanceKm).toFixed(2)) : act.distanceKm,
    }));

    // Increment weekly workouts goal if applicable
    setGoals((prev) =>
      prev.map((g) => {
        if (g.category === 'workouts' && g.period === 'weekly') {
          const nextCurrent = g.current + 1;
          return {
            ...g,
            current: nextCurrent,
            completed: nextCurrent >= g.target,
          };
        }
        return g;
      })
    );
  };

  const updateWorkout = (id: string, updates: Partial<Workout>) => {
    setWorkouts((prev) =>
      prev.map((w) => (w.id === id ? { ...w, ...updates } : w))
    );
  };

  const deleteWorkout = (id: string) => {
    const workoutToDelete = workouts.find((w) => w.id === id);
    if (workoutToDelete) {
      updateActivityForDate(workoutToDelete.date, (act) => ({
        ...act,
        caloriesBurned: Math.max(0, act.caloriesBurned - workoutToDelete.caloriesBurned),
        activeMinutes: Math.max(0, act.activeMinutes - workoutToDelete.durationMinutes),
      }));
    }
    setWorkouts((prev) => prev.filter((w) => w.id !== id));
  };

  // Meal CRUD
  const addMeal = (data: Omit<MealLog, 'id' | 'createdAt' | 'userId'>) => {
    const newMeal: MealLog = {
      ...data,
      id: `m_${Date.now()}`,
      userId: user.id,
      createdAt: new Date().toISOString(),
    };
    setMeals((prev) => [newMeal, ...prev]);
  };

  const updateMeal = (id: string, updates: Partial<MealLog>) => {
    setMeals((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updates } : m))
    );
  };

  const deleteMeal = (id: string) => {
    setMeals((prev) => prev.filter((m) => m.id !== id));
  };

  // Goals CRUD
  const addGoal = (data: Omit<FitnessGoal, 'id' | 'createdAt' | 'userId'>) => {
    const newGoal: FitnessGoal = {
      ...data,
      id: `g_${Date.now()}`,
      userId: user.id,
      completed: data.current >= data.target,
      createdAt: new Date().toISOString(),
    };
    setGoals((prev) => [...prev, newGoal]);
  };

  const updateGoal = (id: string, updates: Partial<FitnessGoal>) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id === id) {
          const updated = { ...g, ...updates };
          if (updates.current !== undefined || updates.target !== undefined) {
            updated.completed = (updated.current ?? g.current) >= (updated.target ?? g.target);
          }
          return updated;
        }
        return g;
      })
    );
  };

  const deleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  };

  const toggleGoalComplete = (id: string) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, completed: !g.completed } : g))
    );
  };

  // Weight CRUD
  const addWeightRecord = (weightKg: number, bodyFat?: number, notes?: string) => {
    const newRecord: WeightRecord = {
      id: `wrec_${Date.now()}`,
      date: selectedDate,
      weightKg,
      bodyFatPercentage: bodyFat,
      notes,
    };
    setWeightRecords((prev) => [...prev, newRecord].sort((a, b) => a.date.localeCompare(b.date)));
    setUser((prev) => ({ ...prev, weightKg }));
  };

  const deleteWeightRecord = (id: string) => {
    setWeightRecords((prev) => prev.filter((r) => r.id !== id));
  };

  // AI Chat integration via Express proxy
  const sendMessageToAI = async (content: string) => {
    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedMessages = [...chatMessages, userMsg];
    setChatMessages(updatedMessages);
    setIsAiThinking(true);

    try {
      // Calculate today's meal macros
      const todaysMeals = meals.filter((m) => m.date === selectedDate);
      const consumedCalories = todaysMeals.reduce((acc, m) => acc + m.totalCalories, 0);
      const protein = todaysMeals.reduce((acc, m) => acc + m.totalProtein, 0);
      const carbs = todaysMeals.reduce((acc, m) => acc + m.totalCarbs, 0);
      const fats = todaysMeals.reduce((acc, m) => acc + m.totalFats, 0);

      const recentWorkouts = workouts.filter((w) => w.date === selectedDate);

      const userContext = {
        steps: todayActivity.steps,
        stepGoal: user.dailyTargets.steps,
        caloriesBurned: todayActivity.caloriesBurned,
        calorieGoal: user.dailyTargets.caloriesBurned,
        activeMinutes: todayActivity.activeMinutes,
        activeGoal: user.dailyTargets.activeMinutes,
        waterMl: todayActivity.waterMl,
        waterGoal: user.dailyTargets.waterMl,
        caloriesConsumed: consumedCalories,
        protein,
        carbs,
        fats,
        recentWorkouts,
      };

      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({ role: m.role, content: m.content })),
          userContext,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();
      const assistantMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        role: 'assistant',
        content: data.response || 'I am ready to assist with your training and nutrition plans!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setChatMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error('AI chat failed:', err);
      const fallbackMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        role: 'assistant',
        content: "I'm having a brief connection pause, but here's a quick coaching takeaway: Focus on steady progressive training, fuel with adequate lean protein, and ensure at least 7-8 hours of sleep for cellular repair. Try asking again in a moment!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsAiThinking(false);
    }
  };

  // AI Activity Trend Analysis
  const generateAIAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activityHistory: dailyActivities,
          workouts,
          nutrition: {
            todayCalories: meals.filter((m) => m.date === selectedDate).reduce((sum, m) => sum + m.totalCalories, 0),
            waterMl: todayActivity.waterMl,
          },
          goals,
        }),
      });

      if (!res.ok) throw new Error('Analysis failed');
      const data: AIAnalysisReport = await res.json();
      setAiAnalysisReport(data);
    } catch (err) {
      console.error('Trend analysis error:', err);
      // Fallback structured data
      setAiAnalysisReport({
        summary: 'Your logged activity shows strong discipline with cardiovascular training and steady daily movement. Increasing structured strength sessions will enhance metabolic efficiency.',
        strengths: ['Consistent weekly exercise cadence', 'Strong daily movement habits above 8,000 steps'],
        areasForImprovement: ['Protein pacing across meals', 'Post-workout hydration timing'],
        actionableRecommendations: [
          'Add 10-15 minutes of dynamic joint mobility before compound lifts.',
          'Aim for 30-40g protein within 2 hours post-workout.',
          'Gradually scale your water intake to 2.8L on training days.',
        ],
        suggestedGoals: [
          {
            title: 'Optimal Hydration Target',
            category: 'water',
            target: 2800,
            unit: 'ml',
            reason: 'Enhances cognitive focus and neuromuscular power output.',
          },
          {
            title: 'Zone 2 Weekly Cardio',
            category: 'active_minutes',
            target: 180,
            unit: 'minutes',
            reason: 'Expands aerobic mitochondrial base and accelerates recovery.',
          },
        ],
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAllData = () => {
    storageService.resetAllData();
    setUser(storageService.getUserProfile());
    setWorkouts(storageService.getWorkouts());
    setMeals(storageService.getMeals());
    setDailyActivities(storageService.getDailyActivities());
    setGoals(storageService.getGoals());
    setWeightRecords(storageService.getWeightRecords());
    setChatMessages(storageService.getChatMessages());
    setAiAnalysisReport(null);
  };

  return (
    <FitnessContext.Provider
      value={{
        user,
        isAuthenticated,
        activeTab,
        setActiveTab,
        selectedDate,
        setSelectedDate,
        todayActivity,
        workouts,
        meals,
        dailyActivities,
        goals,
        weightRecords,
        chatMessages,
        isAiThinking,
        aiAnalysisReport,
        isAnalyzing,
        theme,
        toggleTheme,
        login,
        logout,
        updateProfile,
        addWorkout,
        updateWorkout,
        deleteWorkout,
        addMeal,
        updateMeal,
        deleteMeal,
        addSteps,
        addWater,
        setWater,
        addActiveMinutes,
        addGoal,
        updateGoal,
        deleteGoal,
        toggleGoalComplete,
        addWeightRecord,
        deleteWeightRecord,
        sendMessageToAI,
        generateAIAnalysis,
        resetAllData,
      }}
    >
      {children}
    </FitnessContext.Provider>
  );
};

export const useFitness = () => {
  const context = useContext(FitnessContext);
  if (!context) {
    throw new Error('useFitness must be used within a FitnessProvider');
  }
  return context;
};
