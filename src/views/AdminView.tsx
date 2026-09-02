import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Database, 
  TrendingUp, 
  Users, 
  MapPin, 
  Package, 
  Ticket, 
  Tag, 
  Plus, 
  Trash2, 
  Edit3, 
  RotateCcw, 
  DollarSign, 
  CheckCircle2, 
  X,
  AlertTriangle,
  Server
} from 'lucide-react';
import { Destination, TravelPackage, Booking } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const AdminView: React.FC = () => {
  const { user } = useAuth();
  const { success, error } = useToast();

  const [stats, setStats] = useState<any>(null);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [packages, setPackages] = useState<TravelPackage[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [adminTab, setAdminTab] = useState<'overview' | 'destinations' | 'packages' | 'bookings' | 'promos'>('overview');

  // New Destination Form state
  const [newDestModalOpen, setNewDestModalOpen] = useState(false);
  const [destName, setDestName] = useState('');
  const [destCountry, setDestCountry] = useState('Switzerland');
  const [destTagline, setDestTagline] = useState('Alpine peaks and crystal lakes');
  const [destPrice, setDestPrice] = useState(750);
  const [destImage, setDestImage] = useState('https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=1000&q=80');

  // New Promo Code Form state
  const [newPromoModalOpen, setNewPromoModalOpen] = useState(false);
  const [promoCode, setPromoCode] = useState('WANDER2026');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState(15);

  const loadAdminData = async () => {
    try {
      const [statData, destList, pkgList, bkgList] = await Promise.all([
        api.getAdminStats(),
        api.getDestinations(),
        api.getPackages(),
        api.getBookings()
      ]);
      setStats(statData);
      setDestinations(destList);
      setPackages(pkgList);
      setBookings(bkgList);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleCreateDestination = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await api.createDestination({
        name: destName,
        stateOrRegion: destCountry,
        country: destCountry,
        tagline: destTagline,
        description: `${destName} in ${destCountry} offers majestic views and luxury travel experiences.`,
        startingPrice: destPrice,
        heroImage: destImage,
        galleryImages: [destImage],
        isInternational: true,
        vibe: ['nature', 'mountain'],
        lat: 46.8182,
        lng: 8.2275,
        currentWeather: { 
          tempC: 18, 
          condition: 'Clear Alpine', 
          icon: 'Sun', 
          forecast: 'Sunny and cool alpine weather', 
          airQualityIndex: 22 
        },
        safetyScore: { 
          overall: 96, 
          daySafety: 98, 
          nightSafety: 95, 
          emergencyContact: '112 (Emergency)', 
          advisory: 'Safe and peaceful alpine destination' 
        },
        crowdPrediction: { 
          currentStatus: 'Low', 
          peakHours: '12:00 PM - 02:00 PM', 
          quietHours: '08:00 AM - 10:00 AM', 
          recommendation: 'Visit early for quiet views.' 
        },
        bestMonths: ['June', 'July', 'August', 'September'],
        popularAttractions: [],
        localCuisines: ['Alpine Fondue', 'Swiss Chocolate'],
        rating: 4.9,
        reviewCount: 1
      });

      setDestinations(prev => [created, ...prev]);
      setNewDestModalOpen(false);
      setDestName('');
      success('Destination Created', `Added ${created.name} to global catalogue.`);
    } catch (err: any) {
      error('Creation Error', err.message);
    }
  };

  const handleDeleteDestination = async (id: string) => {
    try {
      await api.deleteDestination(id);
      setDestinations(prev => prev.filter(d => d.id !== id));
      success('Destination Removed', 'Deleted from destination inventory.');
    } catch (err: any) {
      error('Delete Error', err.message);
    }
  };

  const handleResetDatabase = async () => {
    if (confirm('Are you sure you want to reset all database stores back to initial seeds?')) {
      try {
        await api.resetDatabase();
        await loadAdminData();
        success('Database Restored', 'Reset data_store.json to clean baseline state.');
      } catch (err: any) {
        error('Reset Error', err.message);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pb-16">
      {/* Header */}
      <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4" />
            Platform Control & Ops Center
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            WanderAI Administrative Command Console
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleResetDatabase}
            className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo DB</span>
          </button>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-3 overflow-x-auto text-xs font-bold">
        {[
          { id: 'overview', label: '📊 System Telemetry' },
          { id: 'destinations', label: `🗺️ Destinations (${destinations.length})` },
          { id: 'packages', label: `📦 Packages (${packages.length})` },
          { id: 'bookings', label: `🎟️ Master Bookings (${bookings.length})` }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setAdminTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl transition-all ${
              adminTab === tab.id
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 1. SYSTEM TELEMETRY OVERVIEW */}
      {adminTab === 'overview' && stats && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Gross Travel GMV</span>
              <div className="text-2xl font-black text-slate-900">${stats.totalRevenue.toLocaleString()}</div>
              <span className="text-[10px] text-emerald-600 font-bold">● Active Settlement</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Total Reservations</span>
              <div className="text-2xl font-black text-slate-900">{stats.totalBookings}</div>
              <span className="text-[10px] text-slate-500">Across 6 service categories</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Explorer Fleet Rides</span>
              <div className="text-2xl font-black text-slate-900">{stats.totalRides} Rides</div>
              <span className="text-[10px] text-sky-600 font-bold">100% On-Time Dispatches</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Registered Travelers</span>
              <div className="text-2xl font-black text-slate-900">{stats.totalUsers}</div>
              <span className="text-[10px] text-indigo-600 font-bold">Travel DNA Enabled</span>
            </div>
          </div>

          {/* Infrastructure Health Status */}
          <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl space-y-4">
            <div className="flex items-center gap-2">
              <Server className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold">Service Health & Microservice Topology</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3 bg-white/10 rounded-2xl border border-white/10 space-y-1">
                <span className="text-slate-400">Gemini LLM Neural Engine</span>
                <div className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> 100% Latency &lt; 400ms
                </div>
              </div>

              <div className="p-3 bg-white/10 rounded-2xl border border-white/10 space-y-1">
                <span className="text-slate-400">Leaflet Geospatial Routing</span>
                <div className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Real-time GPS Emulation
                </div>
              </div>

              <div className="p-3 bg-white/10 rounded-2xl border border-white/10 space-y-1">
                <span className="text-slate-400">Database Engine (Persistence)</span>
                <div className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> data_store.json (JSON I/O)
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. DESTINATIONS MANAGEMENT */}
      {adminTab === 'destinations' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-bold text-slate-900">Destination Registry</h3>
            <button
              onClick={() => setNewDestModalOpen(true)}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Destination</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-3.5">Destination</th>
                  <th className="p-3.5">Country</th>
                  <th className="p-3.5">Live Weather</th>
                  <th className="p-3.5">Crowd Level</th>
                  <th className="p-3.5">Safety</th>
                  <th className="p-3.5">Price</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {destinations.map(d => (
                  <tr key={d.id} className="hover:bg-slate-50/60">
                    <td className="p-3.5 flex items-center gap-2 font-bold text-slate-900">
                      <img src={d.heroImage} alt={d.name} className="w-8 h-8 rounded-lg object-cover" />
                      <span>{d.name}</span>
                    </td>
                    <td className="p-3.5 text-slate-600">{d.country}</td>
                    <td className="p-3.5">{d.currentWeather.tempC}°C {d.currentWeather.condition}</td>
                    <td className="p-3.5 capitalize font-semibold">{d.crowdPrediction.currentLevel}</td>
                    <td className="p-3.5 text-emerald-700 font-bold">{d.safetyScore.overall}/100</td>
                    <td className="p-3.5 font-black text-slate-900">${d.startingPrice}</td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => handleDeleteDestination(d.id)}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. MASTER BOOKINGS LEDGER */}
      {adminTab === 'bookings' && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-900">Global Customer Reservations Ledger</h3>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-3.5">Booking ID</th>
                  <th className="p-3.5">Service</th>
                  <th className="p-3.5">Title</th>
                  <th className="p-3.5">Travel Date</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Total Amount</th>
                  <th className="p-3.5 text-right">Payment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {bookings.map(b => (
                  <tr key={b.id} className="hover:bg-slate-50/60">
                    <td className="p-3.5 font-mono text-slate-500 font-bold">#{b.id}</td>
                    <td className="p-3.5 capitalize font-semibold text-sky-700">{b.serviceType}</td>
                    <td className="p-3.5 text-slate-900 font-bold max-w-xs truncate">{b.title}</td>
                    <td className="p-3.5 text-slate-600">{b.travelDate}</td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        b.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' :
                        b.status === 'completed' ? 'bg-sky-100 text-sky-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="p-3.5 font-black text-slate-900">${b.totalAmount}</td>
                    <td className="p-3.5 text-right capitalize text-slate-500">{b.paymentMethod}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE DESTINATION MODAL */}
      {newDestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Add New Destination</h3>
            <form onSubmit={handleCreateDestination} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Destination Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Zermatt"
                  value={destName}
                  onChange={e => setDestName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Country</label>
                <input
                  type="text"
                  required
                  value={destCountry}
                  onChange={e => setDestCountry(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Starting Price ($)</label>
                <input
                  type="number"
                  required
                  value={destPrice}
                  onChange={e => setDestPrice(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tagline</label>
                <input
                  type="text"
                  value={destTagline}
                  onChange={e => setDestTagline(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setNewDestModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-sky-600 text-white rounded-xl font-bold shadow-md"
                >
                  Create Destination
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
