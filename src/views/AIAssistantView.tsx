import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Send, 
  Compass, 
  RotateCcw, 
  CloudRain, 
  AlertTriangle, 
  Clock, 
  TrendingUp, 
  CheckCircle2, 
  Bot, 
  User, 
  Zap, 
  Sliders, 
  HelpCircle,
  Car,
  DollarSign
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { NavTab } from '../components/Navbar';

interface AIAssistantViewProps {
  initialPrompt?: string;
  initialDestinationId?: string;
  onNavigate: (tab: NavTab, params?: any) => void;
}

export const AIAssistantView: React.FC<AIAssistantViewProps> = ({
  initialPrompt = '',
  initialDestinationId = '',
  onNavigate
}) => {
  const { user } = useAuth();
  const { error, success } = useToast();

  const [activeSubTab, setActiveSubTab] = useState<'concierge' | 'autopilot' | 'whatif'>('concierge');

  // 1. Chat State
<<<<<<< HEAD
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string; time: string; groundingSources?: string[] }>>([
    {
      role: 'assistant',
      text: "Hello! I am your WanderAI Concierge. I can optimize your itineraries, forecast weather & crowds, suggest local hidden gems, and re-route your trip dynamically. How can I assist you today?",
=======
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string; time: string }>>([
    {
      role: 'assistant',
      text: "Hello! I am your ExploreX Concierge. I can optimize your itineraries, forecast weather & crowds, suggest local hidden gems, and re-route your trip dynamically. How can I assist you today?",
>>>>>>> 5761e1be8e8eb21e40f31a92e4c8a271991f2933
      time: 'Just now'
    }
  ]);
  const [inputQuery, setInputQuery] = useState(initialPrompt);
  const [chatLoading, setChatLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // 2. Autopilot State
  const [autopilotDest, setAutopilotDest] = useState('Bali, Indonesia');
  const [autopilotTrigger, setAutopilotTrigger] = useState('Heavy Afternoon Thunderstorm & Temple Flash Flooding');
  const [autopilotDays, setAutopilotDays] = useState(3);
  const [autopilotResult, setAutopilotResult] = useState<any | null>(null);
  const [autopilotLoading, setAutopilotLoading] = useState(false);

  // 3. What-If Simulator State
  const [whatIfDest, setWhatIfDest] = useState('Interlaken, Swiss Alps');
  const [whatIfScenario, setWhatIfScenario] = useState('What if severe snowfall closes the Jungfraujoch cogwheel railway for 2 days?');
  const [whatIfBudget, setWhatIfBudget] = useState(1500);
  const [whatIfResult, setWhatIfResult] = useState<any | null>(null);
  const [whatIfLoading, setWhatIfLoading] = useState(false);

  useEffect(() => {
    if (initialPrompt && messages.length === 1) {
      handleSendMessage(initialPrompt);
    }
  }, [initialPrompt]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, chatLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const userMsg = {
      role: 'user' as const,
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setChatLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.text }]
      }));

      const res = await api.askAIChat({
        message: query,
        destinationId: initialDestinationId,
        history
      });

      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: res.reply,
<<<<<<< HEAD
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          groundingSources: res.grounding?.sources
=======
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
>>>>>>> 5761e1be8e8eb21e40f31a92e4c8a271991f2933
        }
      ]);
    } catch (err: any) {
      error('AI Service Notice', err.message || 'Failed to reach AI assistant');
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: "I'm having a brief connection delay. Please ensure your Gemini API key is configured or try again in a moment.",
          time: 'Just now'
        }
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleRunAutopilot = async () => {
    setAutopilotLoading(true);
    try {
      const res = await api.runTripAutopilot({
        destination: autopilotDest,
        disruption: autopilotTrigger,
        days: autopilotDays,
        userPreferences: user?.preferences
      });
      setAutopilotResult(res);
      success('Autopilot Recalculation Complete', 'AI re-routed your days and adjusted indoor alternatives.');
    } catch (err: any) {
      error('Autopilot Error', err.message);
    } finally {
      setAutopilotLoading(false);
    }
  };

  const handleRunWhatIf = async () => {
    setWhatIfLoading(true);
    try {
      const res = await api.simulateWhatIf({
        destination: whatIfDest,
        scenario: whatIfScenario,
        budget: whatIfBudget
      });
      setWhatIfResult(res);
      success('What-If Scenario Simulated', 'Risk analysis & contingency pivot generated.');
    } catch (err: any) {
      error('Simulation Error', err.message);
    } finally {
      setWhatIfLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pb-16">
      {/* Top Banner */}
      <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            Gemini-Powered Travel Intelligence
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            AI Travel Assistant, Autopilot & What-If Simulator
          </h1>
        </div>

        {/* Feature Subtabs */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          {[
            { id: 'concierge', label: '💬 AI Concierge' },
            { id: 'autopilot', label: '⚡ Trip Autopilot' },
            { id: 'whatif', label: '🔮 What-If Simulator' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeSubTab === tab.id
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 1. AI CONCIERGE CHAT TAB */}
      {activeSubTab === 'concierge' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Quick Prompts */}
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Instant Travel Prompts
              </h4>
              <div className="space-y-2">
                {[
                  'Rain-proof indoor itinerary for Bali',
                  'Best vegetarian street food in Kyoto under $15',
                  'Family 4-day budget plan in Swiss Alps',
                  'Hidden Goa beaches with zero tourist rush',
                  'Packing checklist for winter in Manali'
                ].map((p, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(p)}
                    className="w-full text-left p-2.5 rounded-xl bg-slate-50 hover:bg-sky-50 text-slate-700 hover:text-sky-800 text-xs font-semibold border border-slate-100 hover:border-sky-200 transition-colors"
                  >
                    ✨ {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-5 rounded-3xl shadow-sm space-y-2 text-xs">
              <div className="font-bold flex items-center gap-1.5 text-indigo-300">
                <Compass className="w-4 h-4" />
                Personalized by Travel DNA
              </div>
              <p className="text-slate-300 leading-relaxed">
                WanderAI uses your selected travel pace ({user?.preferences?.travelPace || 'Balanced'}) and cultural interests to tailor every response.
              </p>
            </div>
          </div>

          {/* Chat Window */}
          <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-200 shadow-xl flex flex-col h-[600px] overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-sky-500 text-white flex items-center justify-center font-bold">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900">WanderAI Live Concierge</h3>
                  <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Gemini Intelligence Active
                  </span>
                </div>
              </div>

              <button
                onClick={() => setMessages([messages[0]])}
                className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Chat</span>
              </button>
            </div>

            {/* Chat Messages */}
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex gap-3 max-w-3xl ${m.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    m.role === 'user' ? 'bg-slate-900 text-white' : 'bg-sky-100 text-sky-700'
                  }`}>
                    {m.role === 'user' ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                  </div>

                  <div className={`p-4 rounded-2xl text-xs space-y-1 ${
                    m.role === 'user'
                      ? 'bg-slate-900 text-white rounded-tr-none'
                      : 'bg-slate-50 border border-slate-100 text-slate-800 rounded-tl-none leading-relaxed whitespace-pre-line'
                  }`}>
                    <div>{m.text}</div>
<<<<<<< HEAD
                    {/* ML Grounding Badges */}
                    {m.role === 'assistant' && m.groundingSources && m.groundingSources.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100 mt-2">
                        {m.groundingSources.map((source) => {
                          const badgeConfig: Record<string, { label: string; emoji: string; color: string }> = {
                            itinerary: { label: 'Optimized Itinerary', emoji: '📋', color: 'bg-sky-100 text-sky-800 border-sky-200' },
                            weather: { label: 'Live Weather', emoji: '🌤', color: 'bg-amber-100 text-amber-800 border-amber-200' },
                            price: { label: 'Dynamic Price', emoji: '💰', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
                            sentiment: { label: 'Sentiment Analysis', emoji: '📊', color: 'bg-violet-100 text-violet-800 border-violet-200' },
                            recommendations: { label: 'ML Recommendations', emoji: '🧠', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
                          };
                          const badge = badgeConfig[source] || { label: source, emoji: '⚡', color: 'bg-slate-100 text-slate-700 border-slate-200' };
                          return (
                            <span
                              key={source}
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${badge.color}`}
                            >
                              {badge.emoji} {badge.label}
                            </span>
                          );
                        })}
                      </div>
                    )}
=======
>>>>>>> 5761e1be8e8eb21e40f31a92e4c8a271991f2933
                    <span className={`text-[10px] block ${m.role === 'user' ? 'text-slate-400' : 'text-slate-400'}`}>
                      {m.time}
                    </span>
                  </div>
                </div>
              ))}

              {chatLoading && (
                <div className="flex gap-3 items-center text-xs text-slate-400">
                  <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 animate-spin" />
                  </div>
                  <span>WanderAI is researching & synthesizing live options...</span>
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Input Bar */}
            <div className="p-4 border-t border-slate-100 bg-white">
              <form
                onSubmit={e => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  placeholder="Ask anything (e.g., 'What is the best 2-day plan in Kyoto with kid-friendly cafes?')"
                  value={inputQuery}
                  onChange={e => setInputQuery(e.target.value)}
                  className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
                <button
                  type="submit"
                  disabled={chatLoading || !inputQuery.trim()}
                  className="p-3 bg-sky-600 hover:bg-sky-700 disabled:opacity-40 text-white rounded-2xl shadow-md transition-all"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 2. TRIP AUTOPILOT TAB */}
      {activeSubTab === 'autopilot' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
            <div>
              <span className="text-[10px] font-bold text-sky-600 uppercase tracking-wider">Dynamic Disruption Re-Routing</span>
              <h3 className="text-lg font-bold text-slate-900 mt-1">Configure Autopilot Trigger</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Destination</label>
                <input
                  type="text"
                  value={autopilotDest}
                  onChange={e => setAutopilotDest(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Disruption Event / Weather Spike</label>
                <input
                  type="text"
                  value={autopilotTrigger}
                  onChange={e => setAutopilotTrigger(e.target.value)}
                  placeholder="e.g. Flash Flooding, Flight Delayed 6hrs, 100% Crowd Congestion"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Itinerary Duration</label>
                <select
                  value={autopilotDays}
                  onChange={e => setAutopilotDays(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none"
                >
                  <option value={2}>2 Days Weekend Quick Replan</option>
                  <option value={3}>3 Days Full Holiday</option>
                  <option value={5}>5 Days Extended Trip</option>
                </select>
              </div>

              <button
                onClick={handleRunAutopilot}
                disabled={autopilotLoading}
                className="w-full py-3 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white rounded-xl font-bold shadow-md transition-all flex items-center justify-center gap-2 mt-4"
              >
                {autopilotLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>Run Autopilot Replan</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Autopilot Results Panel */}
          <div className="lg:col-span-2 space-y-4">
            {autopilotResult ? (
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      Autopilot Optimized
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 mt-1">{autopilotResult.destination} Re-Plan</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-medium">Confidence Score</span>
                    <div className="text-lg font-black text-emerald-600">{autopilotResult.optimizationConfidence}%</div>
                  </div>
                </div>

                {/* Pivot Strategy Card */}
                <div className="p-4 bg-sky-50 rounded-2xl border border-sky-100 text-xs space-y-1.5">
                  <div className="font-bold text-sky-900 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-sky-600" />
                    Dynamic Pivot Strategy:
                  </div>
                  <p className="text-sky-800 leading-relaxed">{autopilotResult.pivotReason}</p>
                </div>

                {/* Day-by-day modified schedule */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Recalibrated Daily Sequence</h4>
                  {autopilotResult.revisedDays?.map((day: any) => (
                    <div key={day.day} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="font-black text-slate-900 text-sm">Day {day.day}: {day.theme}</span>
                        <span className="text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-md text-[11px]">
                          🛡️ Weather Proofed
                        </span>
                      </div>

                      <div className="space-y-2">
                        {day.schedule?.map((s: any, idx: number) => (
                          <div key={idx} className="flex items-start gap-2 bg-white p-2.5 rounded-xl border border-slate-100">
                            <span className="font-mono font-bold text-sky-600 text-[11px] shrink-0 mt-0.5">{s.time}</span>
                            <div className="flex-1">
                              <span className="font-bold text-slate-800">{s.activity}</span>
                              <p className="text-[11px] text-slate-500 mt-0.5">{s.note}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
                <Zap className="w-12 h-12 text-sky-400 mx-auto" />
                <h3 className="text-base font-bold text-slate-800">Trip Autopilot Ready</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Select your destination and trigger on the left to watch Gemini synthesize an instant weather-proof itinerary fallback.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. WHAT-IF SIMULATOR TAB */}
      {activeSubTab === 'whatif' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
            <div>
              <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Predictive Risk Modelling</span>
              <h3 className="text-lg font-bold text-slate-900 mt-1">Simulate Trip Variables</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Target Destination</label>
                <input
                  type="text"
                  value={whatIfDest}
                  onChange={e => setWhatIfDest(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Hypothetical Scenario</label>
                <textarea
                  rows={3}
                  value={whatIfScenario}
                  onChange={e => setWhatIfScenario(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Estimated Trip Budget ($USD)</label>
                <input
                  type="number"
                  value={whatIfBudget}
                  onChange={e => setWhatIfBudget(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none"
                />
              </div>

              <button
                onClick={handleRunWhatIf}
                disabled={whatIfLoading}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl font-bold shadow-md transition-all flex items-center justify-center gap-2 mt-4"
              >
                {whatIfLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Run What-If Simulation</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* What-If Results Panel */}
          <div className="lg:col-span-2 space-y-4">
            {whatIfResult ? (
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                      Simulation Complete
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 mt-1">{whatIfResult.scenarioSummary}</h3>
                  </div>
                </div>

                {/* Metrics Breakdown Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                    <span className="text-slate-400 font-semibold block">Cost Impact</span>
                    <div className="text-base font-black text-slate-900">{whatIfResult.costImpact}</div>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                    <span className="text-slate-400 font-semibold block">Crowd Shift</span>
                    <div className="text-base font-black text-slate-900">{whatIfResult.crowdImpact}</div>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                    <span className="text-slate-400 font-semibold block">Experience Score</span>
                    <div className="text-base font-black text-indigo-600">{whatIfResult.experienceScore} / 100</div>
                  </div>
                </div>

                {/* Action Plan */}
                <div className="space-y-3 text-xs">
                  <h4 className="font-bold text-slate-900 uppercase tracking-wider">Actionable Contingency Playbook</h4>
                  <div className="p-4 bg-indigo-50/70 rounded-2xl border border-indigo-100 space-y-2 text-indigo-950">
                    <p className="leading-relaxed">{whatIfResult.actionablePivotPlan}</p>
                  </div>
                </div>

                {/* Recommendations */}
                {whatIfResult.recommendedAlternatives && (
                  <div className="space-y-2 text-xs">
                    <h4 className="font-bold text-slate-900">Recommended Alternative Activities:</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {whatIfResult.recommendedAlternatives.map((alt: string, i: number) => (
                        <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="text-slate-700 font-medium">{alt}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
                <HelpCircle className="w-12 h-12 text-indigo-400 mx-auto" />
                <h3 className="text-base font-bold text-slate-800">What-If Risk Engine Ready</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Type a scenario (e.g. unexpected snowstorms, flight strikes, budget cuts) to generate cost deltas and experience pivot contingencies.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
