import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  MapPin, 
  CloudSun, 
  Calendar, 
  Wallet, 
  Plus, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  CreditCard, 
  Users, 
  Camera, 
  Heart, 
  ArrowRight, 
  ShieldCheck,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { Booking, Destination, MagicMomentPhoto, GroupTrip } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { NavTab } from '../components/Navbar';
import { InvoiceModal } from '../components/InvoiceModal';

interface MyTripsDashboardViewProps {
  onNavigate: (tab: NavTab, params?: any) => void;
}

export const MyTripsDashboardView: React.FC<MyTripsDashboardViewProps> = ({ onNavigate }) => {
  const { user, refreshProfile } = useAuth();
  const { success } = useToast();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [groupTrips, setGroupTrips] = useState<GroupTrip[]>([]);
  const [recentPhotos, setRecentPhotos] = useState<MagicMomentPhoto[]>([]);
  const [selectedInvoiceBooking, setSelectedInvoiceBooking] = useState<Booking | null>(null);

  // Active Trip State
  const [activeTrip, setActiveTrip] = useState({
    title: 'Bali Tropical Luxury & Cultural Odyssey',
    destination: 'Bali, Indonesia',
    weather: { temp: 28, condition: 'Tropical Breeze' },
    budgetTotal: 2500,
    budgetSpent: 1420,
    daysLeft: 4,
    todaySchedule: [
      { id: 'act-1', time: '08:30 AM', title: 'Tegallalang Sunrise Rice Terrace Walk', done: true },
      { id: 'act-2', time: '11:30 AM', title: 'Artisan Woodcarving Workshop in Mas Village', done: true },
      { id: 'act-3', time: '02:00 PM', title: 'Sacred Monkey Forest Sanctuary Tour', done: false },
      { id: 'act-4', time: '05:30 PM', title: 'Uluwatu Temple Cliffside Kecak Fire Dance', done: false }
    ]
  });

  useEffect(() => {
    const loadAll = async () => {
      try {
        const [bkgData, destData, grpData, albData] = await Promise.all([
          api.getBookings(),
          api.getDestinations(),
          api.getGroupTrips(),
          api.getAlbums()
        ]);
        setBookings(bkgData || []);
        setDestinations(destData || []);
        setGroupTrips(grpData || []);

        if (albData && albData.length > 0) {
          const photos = await api.getPhotos(albData[0].id);
          setRecentPhotos((photos || []).slice(0, 4));
        }
      } catch (err) {
        console.error(err);
      }
    };
    loadAll();
  }, []);

  const handleToggleActivity = (actId: string) => {
    setActiveTrip(prev => ({
      ...prev,
      todaySchedule: prev.todaySchedule.map(a => a.id === actId ? { ...a, done: !a.done } : a)
    }));
  };

  const activeBookings = bookings.filter(b => b.status === 'confirmed');
  const spentPct = Math.round((activeTrip.budgetSpent / activeTrip.budgetTotal) * 100);

  const savedDestList = destinations.filter(d => user?.savedDestinations?.includes(d.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pb-16">
      {/* 1. Header greeting */}
      <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 uppercase tracking-wider">
            <Briefcase className="w-4 h-4" />
            Active Traveler Command Dashboard
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            Welcome back, {user?.name || 'Traveler'}!
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Your live trips, real-time itinerary autopilot, wallet balance & travel statistics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('ai', { initialPrompt: 'Evaluate my current Bali schedule and suggest indoor backups for afternoon rain' })}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>AI Autopilot Replan</span>
          </button>
        </div>
      </div>

      {/* 2. Top Summary KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase">Active Bookings</div>
            <div className="text-xl font-black text-slate-900">{activeBookings.length} Trips</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-3.5 cursor-pointer hover:border-sky-300 transition-colors" onClick={() => onNavigate('wallet')}>
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase">Wander Wallet</div>
            <div className="text-xl font-black text-slate-900">${(user?.walletBalance || 0).toFixed(2)}</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase">DNA Match Index</div>
            <div className="text-xl font-black text-slate-900">96% Fit</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-3.5 cursor-pointer hover:border-sky-300 transition-colors" onClick={() => onNavigate('moments')}>
          <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase">Magic Moments</div>
            <div className="text-xl font-black text-slate-900">20 MB Quota</div>
          </div>
        </div>
      </div>

      {/* 3. CURRENT ACTIVE TRIP CARD & LIVE ITINERARY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Active Trip & Budget */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
            <div className="relative z-10 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold rounded-full">
                  🟢 Currently Happening Now
                </span>
                <div className="flex items-center gap-2 text-xs text-sky-200">
                  <CloudSun className="w-4 h-4 text-amber-300" />
                  <span>{activeTrip.weather.temp}°C, {activeTrip.weather.condition}</span>
                </div>
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-white">{activeTrip.title}</h2>
                <p className="text-xs text-slate-300 flex items-center gap-1.5 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-sky-400" />
                  <span>{activeTrip.destination}</span>
                  <span>•</span>
                  <span>⏱️ {activeTrip.daysLeft} Days Remaining</span>
                </p>
              </div>

              {/* Trip Budget Tracker */}
              <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-300 font-medium">Trip Expense Tracker</span>
                  <span className="font-bold text-white">${activeTrip.budgetSpent} / ${activeTrip.budgetTotal} ({spentPct}%)</span>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400 transition-all duration-500" style={{ width: `${spentPct}%` }} />
                </div>
                <div className="flex justify-between text-[11px] text-slate-300 pt-1">
                  <span>${activeTrip.budgetTotal - activeTrip.budgetSpent} buffer remaining</span>
                  <button onClick={() => onNavigate('wallet')} className="text-sky-300 hover:text-white font-semibold">
                    Split Shared Expenses ➔
                  </button>
                </div>
              </div>

              {/* Today's Schedule Checklist */}
              <div className="space-y-2.5 pt-2">
                <div className="flex items-center justify-between text-xs font-bold text-sky-300 uppercase tracking-wider">
                  <span>Today's Real-Time Sequence</span>
                  <span className="text-[10px] text-slate-400">Tap to toggle completion</span>
                </div>

                <div className="space-y-2">
                  {activeTrip.todaySchedule.map(item => (
                    <div
                      key={item.id}
                      onClick={() => handleToggleActivity(item.id)}
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        item.done
                          ? 'bg-white/5 border-white/5 text-slate-400 line-through'
                          : 'bg-white/15 border-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-3 text-xs">
                        <CheckCircle2 className={`w-4 h-4 ${item.done ? 'text-emerald-400' : 'text-slate-400'}`} />
                        <span>{item.title}</span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-300">{item.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Active Bookings List */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Upcoming E-Tickets & Reservations</h3>
              <button
                onClick={() => onNavigate('bookings')}
                className="text-xs font-bold text-sky-600 hover:text-sky-700"
              >
                View All ({bookings.length})
              </button>
            </div>

            <div className="space-y-3">
              {activeBookings.map(b => (
                <div
                  key={b.id}
                  className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full uppercase">
                        {b.status}
                      </span>
                      <span className="text-xs font-bold text-slate-700">#{b.id}</span>
                      <span className="text-xs text-sky-600 font-semibold capitalize">• {b.serviceType}</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900">{b.title}</h4>
                    <span className="text-[11px] text-slate-500 block">📅 Date: {b.travelDate} • 📍 {b.destinationName}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block font-medium">Total Paid</span>
                      <span className="text-sm font-black text-slate-900">${b.totalAmount}</span>
                    </div>
                    <button
                      onClick={() => setSelectedInvoiceBooking(b)}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
                    >
                      E-Ticket
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Widgets */}
        <div className="space-y-6">
          {/* Quick Wallet Widget */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wallet className="w-4 h-4 text-sky-600" />
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Wander Wallet</h4>
              </div>
              <span className="text-[11px] text-emerald-600 font-bold">● Active</span>
            </div>

            <div>
              <div className="text-[10px] text-slate-400 font-medium">Available Balance</div>
              <div className="text-2xl font-black text-slate-900">${(user?.walletBalance || 0).toFixed(2)}</div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => onNavigate('wallet')}
                className="flex-1 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
              >
                + Top-up Funds
              </button>
              <button
                onClick={() => onNavigate('wallet')}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
              >
                Group Split
              </button>
            </div>
          </div>

          {/* Travel DNA Radar Widget */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Your Travel DNA</h4>
              </div>
              <button onClick={() => onNavigate('profile')} className="text-xs text-indigo-600 font-bold">
                Edit
              </button>
            </div>

            <div className="text-xs font-bold text-slate-800">
              {user?.travelDNA?.primaryArchetype || 'Authentic Heritage & Epicurean Explorer'}
            </div>

            <div className="space-y-2 text-xs pt-1">
              <div>
                <div className="flex justify-between text-slate-600 mb-1 text-[11px]">
                  <span>Heritage Immersion</span>
                  <span className="font-bold text-slate-900">{user?.travelDNA?.culturalExplorer || 85}%</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500" style={{ width: `${user?.travelDNA?.culturalExplorer || 85}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-600 mb-1 text-[11px]">
                  <span>Culinary Passion</span>
                  <span className="font-bold text-slate-900">{user?.travelDNA?.gastronomyLover || 90}%</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500" style={{ width: `${user?.travelDNA?.gastronomyLover || 90}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-600 mb-1 text-[11px]">
                  <span>Sustainable Transit</span>
                  <span className="font-bold text-slate-900">{user?.travelDNA?.ecoConscious || 88}%</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500" style={{ width: `${user?.travelDNA?.ecoConscious || 88}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Saved Destinations Preview */}
          {savedDestList.length > 0 && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                  Saved Destinations ({savedDestList.length})
                </h4>
              </div>

              <div className="space-y-2">
                {(savedDestList || []).slice(0, 3).map(d => (
                  <div
                    key={d.id}
                    onClick={() => onNavigate('destinations', { search: d.name })}
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 cursor-pointer border border-slate-100 transition-colors"
                  >
                    <img src={d.heroImage} alt={d.name} className="w-10 h-10 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <h5 className="text-xs font-bold text-slate-900 truncate">{d.name}</h5>
                      <span className="text-[10px] text-slate-400">{d.country} • From ${d.startingPrice}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Invoice Modal */}
      <InvoiceModal
        booking={selectedInvoiceBooking}
        isOpen={!!selectedInvoiceBooking}
        onClose={() => setSelectedInvoiceBooking(null)}
        onBookingCancelled={() => {
          api.getBookings().then(setBookings);
          refreshProfile();
        }}
      />
    </div>
  );
};
