import React, { useState } from 'react';
import { FitnessProvider, useFitness } from './context/FitnessContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { DashboardView } from './components/dashboard/DashboardView';
import { WorkoutTrackerView } from './components/workouts/WorkoutTrackerView';
import { NutritionTrackerView } from './components/nutrition/NutritionTrackerView';
import { ProgressTrackerView } from './components/progress/ProgressTrackerView';
import { FitnessGoalsView } from './components/goals/FitnessGoalsView';
import { AIAssistantView } from './components/ai/AIAssistantView';
import { ProfileSettingsView } from './components/profile/ProfileSettingsView';
import { LogActivityModal } from './components/modals/LogActivityModal';
import { AuthModal } from './components/modals/AuthModal';

const AppContent: React.FC = () => {
  const { activeTab } = useFitness();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [quickLogOpen, setQuickLogOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col selection:bg-emerald-500/20 selection:text-emerald-400">
      {/* Sidebar Navigation */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onOpenAuth={() => setAuthModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="lg:pl-64 flex-1 flex flex-col min-w-0">
        {/* Sticky Header */}
        <Header
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onOpenQuickLog={() => setQuickLogOpen(true)}
        />

        {/* Dynamic Route Viewport */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <DashboardView onOpenQuickLog={() => setQuickLogOpen(true)} />
          )}
          {activeTab === 'workouts' && (
            <WorkoutTrackerView onOpenQuickLog={() => setQuickLogOpen(true)} />
          )}
          {activeTab === 'nutrition' && (
            <NutritionTrackerView onOpenQuickLog={() => setQuickLogOpen(true)} />
          )}
          {activeTab === 'progress' && <ProgressTrackerView />}
          {activeTab === 'goals' && <FitnessGoalsView />}
          {activeTab === 'ai-coach' && <AIAssistantView />}
          {activeTab === 'profile' && (
            <ProfileSettingsView onOpenAuth={() => setAuthModalOpen(true)} />
          )}
        </main>
      </div>

      {/* Global Modals */}
      <LogActivityModal
        isOpen={quickLogOpen}
        onClose={() => setQuickLogOpen(false)}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <FitnessProvider>
      <AppContent />
    </FitnessProvider>
  );
}
