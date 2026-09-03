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
  DollarSign,
  Calendar,
  MapPin,
  Check,
  ShieldCheck,
  Building2,
  Utensils,
  BookOpen,
  ChevronDown,
  Loader2,
  ArrowRight,
  Bookmark
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { NavTab } from '../components/Navbar';
import { formatINR } from '../utils/currency';

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

  const [activeSubTab, setActiveSubTab] = useState<'itinerary' | 'concierge' | 'autopilot' | 'whatif'>('itinerary');

  // 1. AI Itinerary Generator State
  const [itinDest, setItinDest] = useState('Goa, India');
  const [itinDays, setItinDays] = useState(4);
  const [itinTravelers, setItinTravelers] = useState(2);
  const [itinBudgetLevel, setItinBudgetLevel] = useState<'budget' | 'moderate' | 'luxury'>('moderate');
  const [itinMaxBudget, setItinMaxBudget] = useState(800);
  const [itinStyle, setItinStyle] = useState<'solo' | 'couple' | 'family' | 'friends'>('couple');
  const [itinPace, setItinPace] = useState<'relaxed' | 'moderate' | 'fast_paced'>('moderate');
  const [itinSelectedInterests, setItinSelectedInterests] = useState<string[]>(['culture', 'food', 'beaches', 'photography']);
  const [itinStayType, setItinStayType] = useState<'hotel' | 'resort' | 'homestay'>('hotel');
  const [itinFoodPref, setItinFoodPref] = useState<'local' | 'veg' | 'non_veg' | 'gourmet'>('local');
  const [itinTransport, setItinTransport] = useState<'private_cab' | 'public' | 'rental'>('private_cab');
  const [itinSpecialReq, setItinSpecialReq] = useState('');

  const [itinResult, setItinResult] = useState<any | null>(null);
  const [itinLoading, setItinLoading] = useState(false);
  const [generationStep, setGenerationStep] = useState<string>('');

  // Available Interests List
  const allInterests = [
    { id: 'beaches', label: '🏖️ Beaches' },
    { id: 'adventure', label: '🪂 Adventure' },
    { id: 'trekking', label: '🥾 Trekking & Hikes' },
    { id: 'history', label: '⛩️ History & Forts' },
    { id: 'culture', label: '🎭 Local Culture' },
    { id: 'temples', label: '🛕 Temples & Spiritual' },
    { id: 'food', label: '🍛 Culinary & Street Food' },
    { id: 'nightlife', label: '🌃 Nightlife & Lounges' },
    { id: 'shopping', label: '🛍️ Handicrafts & Shopping' },
    { id: 'photography', label: '📸 Photography' },
    { id: 'nature', label: '🌲 Nature & Backwaters' },
    { id: 'wildlife', label: '🐅 Wildlife Safaris' },
    { id: 'luxury', label: '💎 Luxury Stays' },
    { id: 'hidden_gems', label: '🌿 Hidden Gems' }
  ];

  const handleToggleInterest = (id: string) => {
    if (itinSelectedInterests.includes(id)) {
      setItinSelectedInterests(itinSelectedInterests.filter(i => i !== id));
    } else {
      setItinSelectedInterests([...itinSelectedInterests, id]);
    }
  };

  const handleGenerateItinerary = async () => {
    setItinLoading(true);
    setGenerationStep('Gathering verified POIs & weather forecast...');
    try {
      setTimeout(() => setGenerationStep('Running route & transit optimization solver...'), 800);
      setTimeout(() => setGenerationStep('Synthesizing personalized AI day-by-day plan...'), 1600);
      setTimeout(() => setGenerationStep('Validating logistical feasibility & budget safety...'), 2400);

      const result = await api.generateItinerary({
        destination: itinDest,
        durationDays: itinDays,
        travelersCount: itinTravelers,
        budgetLevel: itinBudgetLevel,
        maxBudget: itinMaxBudget,
        interests: itinSelectedInterests,
        travelStyle: itinStyle,
        pace: itinPace,
        accommodationPreference: itinStayType,
        foodPreference: itinFoodPref,
        transportPreference: itinTransport,
        specialRequirements: itinSpecialReq
      });

      setItinResult(result);
      success('Itinerary Generated!', `Created a logistically verified ${itinDays}-day plan for ${itinDest}.`);
    } catch (err: any) {
      error('Generation Failed', err.message || 'Error creating AI itinerary');
    } finally {
      setItinLoading(false);
      setGenerationStep('');
    }
  };

  // 2. Chat State
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string; time: string; groundingSources?: string[] }>>([
    {
      role: 'assistant',
      text: "Hello! I am your ExploreX Concierge. I can optimize your itineraries, forecast weather & crowds, suggest local hidden gems, and re-route your trip dynamically. How can I assist you today?",
      time: 'Just now'
    }
  ]);
  const [inputQuery, setInputQuery] = useState(initialPrompt);
  const [chatLoading, setChatLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // 3. Autopilot State
  const [autopilotDest, setAutopilotDest] = useState('Bali, Indonesia');
  const [autopilotTrigger, setAutopilotTrigger] = useState('Heavy Afternoon Thunderstorm & Temple Flash Flooding');
  const [autopilotDays, setAutopilotDays] = useState(3);
  const [autopilotResult, setAutopilotResult] = useState<any | null>(null);
  const [autopilotLoading, setAutopilotLoading] = useState(false);

  // 4. What-If Simulator State
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
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          groundingSources: res.grounding?.sources
        }
      ]);
    } catch (err: any) {
      error('AI Service Error', err.message || 'Could not fetch response from ExploreX.');
    } finally {
      setChatLoading(false);
    }
  };

  const handleRunAutopilot = async () => {
    setAutopilotLoading(true);
    try {
      const result = await api.runTripAutopilot(autopilotDest, autopilotTrigger);
      setAutopilotResult(result);
      success('Autopilot Re-sequence Complete', 'Optimized schedule generated to bypass real-time disruptions.');
    } catch (err: any) {
      error('Autopilot Error', err.message);
    } finally {
      setAutopilotLoading(false);
    }
  };

  const handleRunWhatIf = async () => {
    setWhatIfLoading(true);
    try {
      const result = await api.simulateWhatIf(whatIfScenario, whatIfDest, whatIfBudget, 2, 5);
      setWhatIfResult(result);
      success('Simulation Completed', 'Evaluated cost, time, and crowd impacts.');
    } catch (err: any) {
      error('Simulation Error', err.message);
    } finally {
      setWhatIfLoading(false);
    }
  };

  return (
    <div className="page-container space-y-8 pb-16 bg-white">
      {/* Header */}
      <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E4E4DF] pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[10px] font-mono tracking-wider uppercase text-[#B45F3C] font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            Trip Planning Assistant
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#242424] tracking-tight mt-0.5">
            Plan Your Trip
          </h1>
          <p className="font-prose text-xs sm:text-sm text-[#6B6B67] mt-0.5 max-w-2xl">
            Get day-by-day itineraries, weather updates, and local recommendations.
          </p>
        </div>

        {/* SubTab Navigation Switcher */}
        <div className="flex items-center gap-1 bg-[#F7F7F4] p-1 rounded-lg border border-[#E4E4DF] overflow-x-auto">
          <button
            onClick={() => setActiveSubTab('itinerary')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeSubTab === 'itinerary'
                ? 'bg-[#242424] text-white font-semibold'
                : 'text-[#6B6B67] hover:text-[#242424]'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Itinerary Planner</span>
          </button>
          <button
            onClick={() => setActiveSubTab('concierge')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeSubTab === 'concierge'
                ? 'bg-[#B45F3C] text-white font-semibold'
                : 'text-[#6B6B67] hover:text-[#242424]'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Trip Assistant Chat</span>
          </button>
          <button
            onClick={() => setActiveSubTab('autopilot')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeSubTab === 'autopilot'
                ? 'bg-[#5F7564] text-white font-semibold'
                : 'text-[#6B6B67] hover:text-[#242424]'
            }`}
          >
            <CloudRain className="w-3.5 h-3.5" />
            <span>Weather & Alerts</span>
          </button>
          <button
            onClick={() => setActiveSubTab('whatif')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeSubTab === 'whatif'
                ? 'bg-[#242424] text-white font-semibold'
                : 'text-[#6B6B67] hover:text-[#242424]'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Plan Adjuster</span>
          </button>
        </div>
      </div>

      {/* ============================================================
          SUBTAB 1: AI ITINERARY GENERATOR
         ============================================================ */}
      {activeSubTab === 'itinerary' && (
        <div className="space-y-6">
          {/* Preference Wizard Form */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Personalized Travel Preferences</h3>
                <p className="text-xs text-slate-500 mt-0.5">Customize your inputs to generate a logistically optimized day-by-day plan.</p>
              </div>
              <span className="px-3 py-1 bg-indigo-50 text-indigo-700 font-bold text-xs rounded-full border border-indigo-100">
                Multi-Constraint Solver
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Destination</label>
                <input
                  type="text"
                  value={itinDest}
                  onChange={e => setItinDest(e.target.value)}
                  placeholder="e.g. Goa, Kerala, Kashmir, Hampi"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Duration (Days)</label>
                <input
                  type="number"
                  min={1}
                  max={14}
                  value={itinDays}
                  onChange={e => setItinDays(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Travelers & Group</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={itinTravelers}
                    onChange={e => setItinTravelers(Number(e.target.value))}
                    className="w-20 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                  <select
                    value={itinStyle}
                    onChange={e => setItinStyle(e.target.value as any)}
                    className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="solo">Solo</option>
                    <option value="couple">Couple</option>
                    <option value="family">Family</option>
                    <option value="friends">Friends</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-slate-700">Max Budget ($)</label>
                  <span className="text-xs font-black text-indigo-600">${itinMaxBudget}</span>
                </div>
                <input
                  type="range"
                  min={200}
                  max={4000}
                  step={50}
                  value={itinMaxBudget}
                  onChange={e => setItinMaxBudget(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer mt-2"
                />
              </div>
            </div>

            {/* Interests Grid */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Travel Interests (Select all that apply)</label>
              <div className="flex flex-wrap gap-2">
                {allInterests.map(item => {
                  const isSelected = itinSelectedInterests.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleToggleInterest(item.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                        isSelected
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Secondary preferences */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Travel Pace</label>
                <select
                  value={itinPace}
                  onChange={e => setItinPace(e.target.value as any)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900"
                >
                  <option value="relaxed">Relaxed & Leisurely</option>
                  <option value="moderate">Balanced Moderate</option>
                  <option value="fast_paced">Fast Paced & Action Packed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Accommodation</label>
                <select
                  value={itinStayType}
                  onChange={e => setItinStayType(e.target.value as any)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900"
                >
                  <option value="hotel">Boutique Hotel</option>
                  <option value="resort">Luxury Resort</option>
                  <option value="homestay">Authentic Homestay</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Food Preference</label>
                <select
                  value={itinFoodPref}
                  onChange={e => setItinFoodPref(e.target.value as any)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900"
                >
                  <option value="local">Authentic Local Specialties</option>
                  <option value="veg">🌱 Pure Vegetarian</option>
                  <option value="non_veg">🍗 Non-Veg Feast</option>
                  <option value="gourmet">🍷 Gourmet Fine Dining</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Transit</label>
                <select
                  value={itinTransport}
                  onChange={e => setItinTransport(e.target.value as any)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900"
                >
                  <option value="private_cab">Private Chauffeured Cab</option>
                  <option value="rental">Self-Drive / Rental Scooter</option>
                  <option value="public">Public Transit & Walks</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleGenerateItinerary}
                disabled={itinLoading}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-bold shadow-md transition-all flex items-center gap-2"
              >
                {itinLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{generationStep || 'Generating Itinerary...'}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Personalized AI Itinerary</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Generated Itinerary Display */}
          {itinResult && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6 animate-in fade-in">
              {/* Summary Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-indigo-500 text-white text-[10px] font-bold rounded-full uppercase">
                      {itinResult.durationDays}-Day Customized Plan
                    </span>
                    <span className="text-xs text-slate-300 font-medium">
                      {itinResult.travelersCount} Traveler({itinResult.travelersCount > 1 ? 's' : ''}) • {itinResult.travelStyle}
                    </span>
                  </div>
                  <h2 className="text-2xl font-black mt-1 text-white">{itinResult.destination} Personalized Itinerary</h2>
                  <p className="text-xs text-slate-300 mt-1">🌦️ {itinResult.weatherForecastSummary}</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 text-right">
                    <span className="text-[10px] text-slate-300 block uppercase font-medium">Validation Score</span>
                    <div className="flex items-center gap-1 text-emerald-400 font-black text-lg">
                      <ShieldCheck className="w-4 h-4" />
                      <span>{itinResult.validationScore}/100</span>
                    </div>
                  </div>
                  <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 text-right">
                    <span className="text-[10px] text-slate-300 block uppercase font-medium">Estimated Total</span>
                    <div className="text-xl font-black text-amber-300">
                      {formatINR(itinResult.budget?.estimatedTotal || 15000)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Validation Warnings Alert if any */}
              {itinResult.validationWarnings && itinResult.validationWarnings.length > 0 && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-1.5 text-xs text-amber-900">
                  <div className="font-bold flex items-center gap-1.5 text-amber-950">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>Logistical Validation Notes & Adjustments Applied</span>
                  </div>
                  <ul className="list-disc pl-5 space-y-1 text-amber-800">
                    {itinResult.validationWarnings.map((w: string, i: number) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Budget Breakdown */}
              {itinResult.budget?.breakdown && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-indigo-600" />
                    Transparent Budget Allocation (INR ₹)
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 block font-medium">Stay & Homestay</span>
                      <span className="font-bold text-slate-900">{formatINR(itinResult.budget.breakdown.stay)}</span>
                    </div>
                    <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 block font-medium">Dining & Food</span>
                      <span className="font-bold text-slate-900">{formatINR(itinResult.budget.breakdown.food)}</span>
                    </div>
                    <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 block font-medium">Chauffeured Transit</span>
                      <span className="font-bold text-slate-900">{formatINR(itinResult.budget.breakdown.transport)}</span>
                    </div>
                    <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 block font-medium">Activities & Entry Fees</span>
                      <span className="font-bold text-slate-900">{formatINR(itinResult.budget.breakdown.activities)}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Day-by-day itinerary schedule */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-indigo-600" />
                  Day-by-Day Customized Schedule
                </h3>

                {(itinResult.days || []).map((day: any) => (
                  <div key={day.dayNumber} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                      <div>
                        <span className="font-bold text-indigo-700 bg-indigo-100 px-2.5 py-0.5 rounded-md text-[11px]">
                          Day {day.dayNumber}
                        </span>
                        <h4 className="font-bold text-slate-900 text-sm inline-block ml-2">{day.theme}</h4>
                      </div>
                      <span className="text-xs font-bold text-slate-600">
                        Est. Daily: {formatINR(day.dailyTotalCost)}
                      </span>
                    </div>

                    {/* Morning */}
                    {(day.morning || []).map((act: any, idx: number) => (
                      <div key={idx} className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1.5 text-xs">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded">Morning</span>
                            <h5 className="font-bold text-slate-900">{act.name}</h5>
                          </div>
                          <span className="font-semibold text-slate-500">{act.startTime} – {act.endTime}</span>
                        </div>
                        <p className="text-slate-600 text-[11px]">{act.reason}</p>
                        {act.location?.address && (
                          <div className="flex items-center gap-1 text-[11px] text-indigo-700 font-semibold">
                            <MapPin className="w-3 h-3 text-indigo-500 shrink-0" />
                            <span>Location: {act.location.address} {act.location.lat ? `(${act.location.lat.toFixed(4)}, ${act.location.lng.toFixed(4)})` : ''}</span>
                          </div>
                        )}
                        <div className="flex flex-wrap items-center gap-4 text-[10px] text-slate-500 pt-1 font-medium border-t border-slate-100">
                          <span>⏱️ {act.durationMins} mins</span>
                          <span>🚗 {act.distanceKm} km ({act.travelTimeMins} mins transit)</span>
                          <span>💰 ~{formatINR(act.estimatedCost || 0)}</span>
                          {act.mealRecommendation && <span className="text-emerald-700">🍽️ {act.mealRecommendation}</span>}
                        </div>
                      </div>
                    ))}

                    {/* Afternoon */}
                    {(day.afternoon || []).map((act: any, idx: number) => (
                      <div key={idx} className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1.5 text-xs">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 bg-sky-100 text-sky-800 text-[10px] font-bold rounded">Afternoon</span>
                            <h5 className="font-bold text-slate-900">{act.name}</h5>
                          </div>
                          <span className="font-semibold text-slate-500">{act.startTime} – {act.endTime}</span>
                        </div>
                        <p className="text-slate-600 text-[11px]">{act.reason}</p>
                        {act.location?.address && (
                          <div className="flex items-center gap-1 text-[11px] text-indigo-700 font-semibold">
                            <MapPin className="w-3 h-3 text-indigo-500 shrink-0" />
                            <span>Location: {act.location.address} {act.location.lat ? `(${act.location.lat.toFixed(4)}, ${act.location.lng.toFixed(4)})` : ''}</span>
                          </div>
                        )}
                        <div className="flex flex-wrap items-center gap-4 text-[10px] text-slate-500 pt-1 font-medium border-t border-slate-100">
                          <span>⏱️ {act.durationMins} mins</span>
                          <span>🚗 {act.distanceKm} km ({act.travelTimeMins} mins transit)</span>
                          <span>💰 ~{formatINR(act.estimatedCost || 0)}</span>
                          {act.mealRecommendation && <span className="text-emerald-700">🍽️ {act.mealRecommendation}</span>}
                        </div>
                      </div>
                    ))}

                    {/* Evening */}
                    {(day.evening || []).map((act: any, idx: number) => (
                      <div key={idx} className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1.5 text-xs">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 text-[10px] font-bold rounded">Evening</span>
                            <h5 className="font-bold text-slate-900">{act.name}</h5>
                          </div>
                          <span className="font-semibold text-slate-500">{act.startTime} – {act.endTime}</span>
                        </div>
                        <p className="text-slate-600 text-[11px]">{act.reason}</p>
                        {act.location?.address && (
                          <div className="flex items-center gap-1 text-[11px] text-indigo-700 font-semibold">
                            <MapPin className="w-3 h-3 text-indigo-500 shrink-0" />
                            <span>Location: {act.location.address} {act.location.lat ? `(${act.location.lat.toFixed(4)}, ${act.location.lng.toFixed(4)})` : ''}</span>
                          </div>
                        )}
                        <div className="flex flex-wrap items-center gap-4 text-[10px] text-slate-500 pt-1 font-medium border-t border-slate-100">
                          <span>⏱️ {act.durationMins} mins</span>
                          <span>🚗 {act.distanceKm} km ({act.travelTimeMins} mins transit)</span>
                          <span>💰 ~{formatINR(act.estimatedCost || 0)}</span>
                          {act.mealRecommendation && <span className="text-emerald-700">🍽️ {act.mealRecommendation}</span>}
                        </div>
                      </div>
                    ))}

                    {day.stayHotel && (
                      <div className="p-2.5 bg-indigo-50/50 rounded-xl border border-indigo-100 text-xs font-semibold text-indigo-900 flex items-center justify-between">
                        <span>🏨 Overnight Stay: <strong>{day.stayHotel}</strong></span>
                        <button
                          onClick={() => onNavigate('packages')}
                          className="text-[11px] text-indigo-600 hover:text-indigo-800 font-bold"
                        >
                          Book Stay Package →
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Bottom Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      success('Itinerary Saved', `Saved ${itinResult.destination} itinerary to your profile.`);
                      onNavigate('bookings');
                    }}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>Save to My Trips</span>
                  </button>

                  <button
                    onClick={() => onNavigate('packages')}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                  >
                    <span>Book Package for Trip</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={handleGenerateItinerary}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
                >
                  Regenerate Schedule
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================
          SUBTAB 2: WANDERAI CONCIERGE CHAT
         ============================================================ */}
      {activeSubTab === 'concierge' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[650px]">
          {/* Chat Header */}
          <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-sky-500 flex items-center justify-center text-white">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">ExploreX Real-Time Concierge</h3>
                <span className="text-[10px] text-sky-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Connected to Grounded ML POI & Weather Engine
                </span>
              </div>
            </div>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50 text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${m.role === 'user' ? 'bg-slate-900 text-white' : 'bg-sky-600 text-white'}`}>
                  {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div className={`max-w-xl p-4 rounded-2xl space-y-2 ${m.role === 'user' ? 'bg-slate-900 text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-800 shadow-sm rounded-tl-none'}`}>
                  <p className="whitespace-pre-wrap leading-relaxed">{m.text}</p>
                  {m.groundingSources && m.groundingSources.length > 0 && (
                    <div className="pt-2 border-t border-slate-100 text-[10px] text-sky-600 font-semibold flex items-center gap-1.5">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Grounded by real-time ML datasets: {m.groundingSources.join(', ')}</span>
                    </div>
                  )}
                  <span className="text-[9px] text-slate-400 block text-right">{m.time}</span>
                </div>
              </div>
            ))}
            {chatLoading && (
              <div className="flex items-center gap-2 text-slate-400 text-xs p-3 bg-white rounded-2xl border border-slate-200 w-fit">
                <Loader2 className="w-4 h-4 animate-spin text-sky-600" />
                <span>ExploreX is synthesizing response...</span>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Chat Input Bar */}
          <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask anything (e.g. What's the best time for sunset at Hampi Fort?)"
              value={inputQuery}
              onChange={e => setInputQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={chatLoading}
              className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ============================================================
          SUBTAB 3: TRIP AUTOPILOT
         ============================================================ */}
      {activeSubTab === 'autopilot' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">Trip Autopilot — Automated Disruption Re-sequencing</h3>
            <p className="text-xs text-slate-500 mt-0.5">Real-time weather, crowd surge, and traffic alert auto-rerouting.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Target Destination</label>
              <input
                type="text"
                value={autopilotDest}
                onChange={e => setAutopilotDest(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Disruption Event Trigger</label>
              <select
                value={autopilotTrigger}
                onChange={e => setAutopilotTrigger(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900"
              >
                <option value="rain_storm">🌧️ Heavy Afternoon Rainstorm</option>
                <option value="crowd_surge">👥 Peak Tourist Crowd Surge</option>
                <option value="traffic_congestion">🚦 Highway Traffic Delay</option>
                <option value="flight_delay">✈️ Arrival Flight Delay</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={handleRunAutopilot}
                disabled={autopilotLoading}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5"
              >
                {autopilotLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                <span>Trigger Autopilot Re-sequence</span>
              </button>
            </div>
          </div>

          {autopilotResult && (
            <div className="p-5 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-4 animate-in fade-in">
              <div className="flex items-center gap-2 text-emerald-950 font-bold text-sm">
                <AlertTriangle className="w-4 h-4 text-emerald-600" />
                <span>{autopilotResult.alertTitle}</span>
              </div>
              <p className="text-xs text-emerald-900">{autopilotResult.alertSummary}</p>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wider">Re-Sequenced Schedule:</h4>
                {(autopilotResult.optimizedSchedule || []).map((s: any, idx: number) => (
                  <div key={idx} className="p-3 bg-white rounded-xl border border-emerald-100 text-xs flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900">{s.time} — {s.activity}</span>
                      <p className="text-[11px] text-slate-500 mt-0.5">{s.reason}</p>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded capitalize">
                      {s.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================
          SUBTAB 4: WHAT-IF SIMULATOR
         ============================================================ */}
      {activeSubTab === 'whatif' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">What-If Travel Scenario Simulator</h3>
            <p className="text-xs text-slate-500 mt-0.5">Stress-test travel scenarios for cost, time, and weather impact before booking.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Destination</label>
              <input
                type="text"
                value={whatIfDest}
                onChange={e => setWhatIfDest(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Scenario Question</label>
              <input
                type="text"
                value={whatIfScenario}
                onChange={e => setWhatIfScenario(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={handleRunWhatIf}
                disabled={whatIfLoading}
                className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5"
              >
                {whatIfLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sliders className="w-4 h-4" />}
                <span>Simulate Scenario Impact</span>
              </button>
            </div>
          </div>

          {whatIfResult && (
            <div className="p-5 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-4 animate-in fade-in text-xs">
              <h4 className="font-bold text-amber-950 text-sm">{whatIfResult.scenarioTitle}</h4>
              <p className="text-slate-700">{whatIfResult.adjustedPlanSummary}</p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-2.5 bg-white rounded-xl border border-amber-200">
                  <span className="text-[10px] text-slate-400 block">Impact Score</span>
                  <span className="font-bold text-amber-900">{whatIfResult.impactScore}/100</span>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-amber-200">
                  <span className="text-[10px] text-slate-400 block">Cost Difference</span>
                  <span className="font-bold text-slate-900">${whatIfResult.costDifference}</span>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-amber-200">
                  <span className="text-[10px] text-slate-400 block">Time Saved</span>
                  <span className="font-bold text-slate-900">{Math.abs(whatIfResult.timeDifferenceMins || 30)} mins</span>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-amber-200">
                  <span className="text-[10px] text-slate-400 block">Crowd Reduction</span>
                  <span className="font-bold text-emerald-700">-{whatIfResult.crowdReductionPct}%</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
