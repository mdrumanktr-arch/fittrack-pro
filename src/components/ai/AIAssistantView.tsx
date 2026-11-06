import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Bot,
  User,
  Zap,
  TrendingUp,
  Dumbbell,
  UtensilsCrossed,
  CheckCircle2,
  Plus,
  RefreshCw,
  Award,
} from 'lucide-react';
import { useFitness } from '../../context/FitnessContext';

export const AIAssistantView: React.FC = () => {
  const {
    chatMessages,
    sendMessageToAI,
    isAiThinking,
    aiAnalysisReport,
    isAnalyzing,
    generateAIAnalysis,
    addGoal,
    todayActivity,
    workouts,
    meals,
    user,
  } = useFitness();

  const [inputMessage, setInputMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'chat' | 'analysis'>('chat');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (activeTab === 'chat') {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isAiThinking, activeTab]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isAiThinking) return;
    const msg = inputMessage;
    setInputMessage('');
    await sendMessageToAI(msg);
  };

  const handleQuickPrompt = (prompt: string) => {
    sendMessageToAI(prompt);
  };

  const handleAdoptGoal = (suggestedGoal: {
    title: string;
    category: any;
    target: number;
    unit: string;
    reason: string;
  }) => {
    addGoal({
      title: suggestedGoal.title,
      category: suggestedGoal.category,
      period: 'daily',
      target: suggestedGoal.target,
      current: 0,
      unit: suggestedGoal.unit,
      completed: false,
    });
    alert(`Goal "${suggestedGoal.title}" added to your active fitness targets!`);
  };

  const PROMPT_SUGGESTIONS = [
    'Suggest a 30-min beginner full-body workout with dumbbells',
    'How should I adjust my macros for lean muscle gain?',
    'What should I eat before and after morning cardio?',
    'How can I improve my recovery between heavy training days?',
    'Suggest realistic fitness goals based on my logged steps',
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-neutral-900 border border-neutral-800">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl overflow-hidden border border-emerald-500/30 shrink-0">
            <img
              src="/src/assets/images/avatar_coach_alex_1793968158587.jpg"
              alt="Coach Alex"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white tracking-tight">Coach Alex</h2>
              <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                Powered by Gemini
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              Personalized athletic training, nutritional science, and live trend analysis
            </p>
          </div>
        </div>

        {/* Tab Toggle */}
        <div className="flex bg-neutral-950 p-1 rounded-lg border border-neutral-800 text-xs w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex-1 sm:flex-none px-4 py-1.5 rounded-md font-semibold transition-colors ${
              activeTab === 'chat'
                ? 'bg-neutral-800 text-white shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Live AI Chat
          </button>
          <button
            onClick={() => {
              setActiveTab('analysis');
              if (!aiAnalysisReport) {
                generateAIAnalysis();
              }
            }}
            className={`flex-1 sm:flex-none px-4 py-1.5 rounded-md font-semibold transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'analysis'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Activity Trends</span>
          </button>
        </div>
      </div>

      {/* CHAT TAB */}
      {activeTab === 'chat' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Chat Box */}
          <div className="lg:col-span-3 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col h-[600px] overflow-hidden">
            {/* Messages Scroll Area */}
            <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-4">
              {chatMessages.map((msg) => {
                const isUser = msg.role === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                        isUser
                          ? 'bg-emerald-500 text-neutral-950'
                          : 'bg-neutral-800 text-emerald-400 border border-emerald-500/30 overflow-hidden'
                      }`}
                    >
                      {isUser ? (
                        <User className="w-4 h-4" />
                      ) : (
                        <img
                          src="/src/assets/images/avatar_coach_alex_1793968158587.jpg"
                          alt="Coach"
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      )}
                    </div>

                    <div
                      className={`max-w-[85%] md:max-w-[75%] rounded-2xl px-4 py-3 text-xs md:text-sm leading-relaxed ${
                        isUser
                          ? 'bg-emerald-500 text-neutral-950 font-medium'
                          : 'bg-neutral-950 border border-neutral-800 text-neutral-200'
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{msg.content}</div>
                      <div
                        className={`text-[10px] mt-1.5 ${
                          isUser ? 'text-neutral-800 text-right' : 'text-neutral-500'
                        }`}
                      >
                        {msg.timestamp}
                      </div>
                    </div>
                  </div>
                );
              })}

              {isAiThinking && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-emerald-400 shrink-0">
                    <Sparkles className="w-4 h-4 animate-spin" />
                  </div>
                  <div className="bg-neutral-950 border border-neutral-800 rounded-2xl px-4 py-3 text-xs text-neutral-400 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Coach Alex is analyzing your telemetry and formulating advice...</span>
                  </div>
                </div>
              )}

              <div ref={chatBottomRef} />
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSend} className="p-3 md:p-4 bg-neutral-950 border-t border-neutral-800 flex gap-2">
              <input
                type="text"
                placeholder="Ask about workout form, meal timing, macro plans, or pacing..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                disabled={isAiThinking}
                className="flex-1 px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-xs md:text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                disabled={isAiThinking || !inputMessage.trim()}
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-neutral-950 font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          {/* Sidebar: Telemetry Context & Quick Questions */}
          <div className="space-y-4">
            {/* Live Context Card */}
            <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Live Coach Context
                </h3>
              </div>
              <p className="text-[11px] text-neutral-400 leading-relaxed">
                Coach Alex factors in your real telemetry during every response:
              </p>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between py-1 border-b border-neutral-800 text-neutral-300">
                  <span>Steps Today:</span>
                  <span className="font-semibold text-emerald-400 tabular-nums">{todayActivity.steps.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-800 text-neutral-300">
                  <span>Burned:</span>
                  <span className="font-semibold text-amber-400 tabular-nums">{todayActivity.caloriesBurned} kcal</span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-800 text-neutral-300">
                  <span>Water:</span>
                  <span className="font-semibold text-cyan-400 tabular-nums">{todayActivity.waterMl} ml</span>
                </div>
                <div className="flex justify-between py-1 text-neutral-300">
                  <span>Workouts:</span>
                  <span className="font-semibold text-white tabular-nums">{workouts.length} total</span>
                </div>
              </div>
            </div>

            {/* Quick Prompt Starters */}
            <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Recommended Prompts
              </h3>
              <div className="space-y-2">
                {PROMPT_SUGGESTIONS.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuickPrompt(prompt)}
                    className="w-full p-2 rounded-lg bg-neutral-950 hover:bg-neutral-800/80 border border-neutral-800 hover:border-emerald-500/40 text-left text-[11px] text-neutral-300 hover:text-white transition-colors"
                  >
                    "{prompt}"
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TREND ANALYSIS TAB */}
      {activeTab === 'analysis' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-neutral-900 rounded-xl border border-neutral-800">
            <div>
              <h3 className="text-sm font-bold text-white">AI-Powered Training & Recovery Audit</h3>
              <p className="text-xs text-neutral-400">Deep telemetry analysis powered by Gemini 3.8 Flash</p>
            </div>
            <button
              onClick={() => generateAIAnalysis()}
              disabled={isAnalyzing}
              className="px-3.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-50 text-emerald-400 font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
              <span>{isAnalyzing ? 'Auditing Telemetry...' : 'Refresh Analysis'}</span>
            </button>
          </div>

          {isAnalyzing ? (
            <div className="p-16 rounded-2xl bg-neutral-900 border border-neutral-800 text-center space-y-3">
              <Sparkles className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
              <h4 className="text-base font-bold text-white">Synthesizing Workout & Nutrition Data...</h4>
              <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                Correlating cardiovascular volume, resistance training cadence, and hydration balance to generate customized recommendations.
              </p>
            </div>
          ) : aiAnalysisReport ? (
            <div className="space-y-6">
              {/* Summary Statement */}
              <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800">
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                  Executive Performance Summary
                </span>
                <p className="text-sm text-neutral-200 mt-2 leading-relaxed">
                  {aiAnalysisReport.summary}
                </p>
              </div>

              {/* Strengths & Improvements */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle2 className="w-5 h-5" />
                    <h4 className="text-sm font-bold text-white">Observed Strengths</h4>
                  </div>
                  <ul className="space-y-2">
                    {aiAnalysisReport.strengths.map((s, idx) => (
                      <li key={idx} className="text-xs text-neutral-300 flex items-start gap-2">
                        <span className="text-emerald-400 font-bold">•</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
                  <div className="flex items-center gap-2 text-amber-400">
                    <TrendingUp className="w-5 h-5" />
                    <h4 className="text-sm font-bold text-white">Areas for Progressive Overload</h4>
                  </div>
                  <ul className="space-y-2">
                    {aiAnalysisReport.areasForImprovement.map((a, idx) => (
                      <li key={idx} className="text-xs text-neutral-300 flex items-start gap-2">
                        <span className="text-amber-400 font-bold">•</span>
                        <span>{a}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Actionable Recommendations */}
              <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-indigo-400" />
                  <h4 className="text-sm font-bold text-white">Actionable Training Directives</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                  {aiAnalysisReport.actionableRecommendations.map((rec, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-xl bg-neutral-950/70 border border-neutral-800 text-xs text-neutral-300 leading-relaxed"
                    >
                      <span className="font-bold text-emerald-400 block mb-1">Step {i + 1}</span>
                      {rec}
                    </div>
                  ))}
                </div>
              </div>

              {/* Suggested Goals with 1-Click Adoption */}
              <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
                <div>
                  <h4 className="text-sm font-bold text-white tracking-tight">
                    Recommended Realistic Goals
                  </h4>
                  <p className="text-xs text-neutral-400">
                    Target adjustments suggested by AI based on your actual 14-day average
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {aiAnalysisReport.suggestedGoals.map((sg, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-xl bg-neutral-950 border border-neutral-800/90 flex flex-col justify-between space-y-3"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-white">{sg.title}</span>
                          <span className="text-xs font-semibold text-emerald-400 tabular-nums">
                            {sg.target.toLocaleString()} {sg.unit}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed">
                          {sg.reason}
                        </p>
                      </div>

                      <button
                        onClick={() => handleAdoptGoal(sg)}
                        className="w-full py-2 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Adopt This Target</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
              <TrendingUp className="w-8 h-8 text-neutral-500 mx-auto" />
              <h4 className="text-sm font-bold text-white">Generate Your First Trend Audit</h4>
              <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                Let Gemini audit your workouts, step counts, and macro adherence to pinpoint opportunities for gains.
              </p>
              <button
                onClick={() => generateAIAnalysis()}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-neutral-950 font-bold text-xs rounded-lg transition-colors inline-flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Run Trend Analysis Now</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
