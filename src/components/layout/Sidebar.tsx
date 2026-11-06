import React from 'react';
import {
  LayoutDashboard,
  Dumbbell,
  UtensilsCrossed,
  TrendingUp,
  Target,
  Sparkles,
  User,
  Activity,
  Flame,
  Footprints,
  Droplet,
  LogOut,
  LogIn,
  X,
} from 'lucide-react';
import { useFitness } from '../../context/FitnessContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAuth: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onOpenAuth }) => {
  const { activeTab, setActiveTab, user, isAuthenticated, logout, todayActivity } = useFitness();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'workouts', label: 'Workouts', icon: Dumbbell },
    { id: 'nutrition', label: 'Nutrition', icon: UtensilsCrossed },
    { id: 'progress', label: 'Progress & Analytics', icon: TrendingUp },
    { id: 'goals', label: 'Fitness Goals', icon: Target },
    { id: 'ai-coach', label: 'AI Coach', icon: Sparkles, badge: 'Gemini' },
    { id: 'profile', label: 'Profile & Settings', icon: User },
  ];

  const handleSelectTab = (tabId: string) => {
    setActiveTab(tabId);
    onClose();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-neutral-900 border-r border-neutral-800 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Area */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-white flex items-center gap-1.5">
                FitTrack <span className="text-emerald-400 font-extrabold text-sm uppercase tracking-wider">Pro</span>
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg lg:hidden"
            aria-label="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Daily Glances */}
        <div className="p-4 mx-3 my-3 rounded-xl bg-neutral-950/60 border border-neutral-800/80">
          <div className="text-xs font-semibold text-neutral-400 mb-2.5 tracking-wide uppercase">
            Today's Vitals
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 rounded-lg bg-neutral-900/80 border border-neutral-800/50">
              <Footprints className="w-3.5 h-3.5 text-emerald-400 mx-auto mb-1" />
              <div className="text-xs font-bold text-white tabular-nums">
                {todayActivity.steps >= 1000 ? `${(todayActivity.steps / 1000).toFixed(1)}k` : todayActivity.steps}
              </div>
              <div className="text-[10px] text-neutral-500">Steps</div>
            </div>
            <div className="p-2 rounded-lg bg-neutral-900/80 border border-neutral-800/50">
              <Flame className="w-3.5 h-3.5 text-amber-400 mx-auto mb-1" />
              <div className="text-xs font-bold text-white tabular-nums">
                {todayActivity.caloriesBurned}
              </div>
              <div className="text-[10px] text-neutral-500">kcal</div>
            </div>
            <div className="p-2 rounded-lg bg-neutral-900/80 border border-neutral-800/50">
              <Droplet className="w-3.5 h-3.5 text-cyan-400 mx-auto mb-1" />
              <div className="text-xs font-bold text-white tabular-nums">
                {(todayActivity.waterMl / 1000).toFixed(1)}L
              </div>
              <div className="text-[10px] text-neutral-500">Water</div>
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
                  isActive
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'text-neutral-300 hover:text-white hover:bg-neutral-800/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-neutral-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/20 border border-emerald-500/30 px-1.5 py-0.5 rounded">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Card & Authentication */}
        <div className="p-3 border-t border-neutral-800">
          <div className="p-2.5 rounded-xl bg-neutral-950/40 border border-neutral-800/60 flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-emerald-500/20 border border-emerald-500/30 overflow-hidden shrink-0 flex items-center justify-center text-emerald-400 font-bold text-sm">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  user.name.charAt(0)
                )}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-white truncate">{user.name}</div>
                <div className="text-[11px] text-neutral-400 truncate">{user.primaryGoal}</div>
              </div>
            </div>

            {isAuthenticated ? (
              <button
                onClick={logout}
                title="Log out"
                className="p-1.5 text-neutral-400 hover:text-rose-400 hover:bg-neutral-800/80 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                title="Sign in"
                className="p-1.5 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 rounded-lg transition-colors"
              >
                <LogIn className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
