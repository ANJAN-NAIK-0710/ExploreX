import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  Sparkles, 
  MapPin, 
  Calendar, 
  TrendingUp, 
  ShieldCheck, 
  Car, 
  ArrowRight, 
  Heart, 
  Star, 
  Clock, 
  Users, 
  CloudSun, 
  Compass, 
  Activity, 
  ChevronRight,
  Zap,
  TrendingDown,
  Utensils,
  ShoppingBag,
  Leaf,
  Layers,
  HeartHandshake,
  CheckCircle
} from 'lucide-react';
import { Destination, TravelPackage, Review } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { NavTab } from '../components/Navbar';

interface HomeViewProps {
  onNavigate: (tab: NavTab, params?: any) => void;
  onBookPackage: (pkg: TravelPackage) => void;
  onSelectDestination: (dest: Destination) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  onBookPackage,
  onSelectDestination
}) => {
  const { user, toggleSaveDestination } = useAuth();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [packages, setPackages] = useState<TravelPackage[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVibe, setSelectedVibe] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [destData, pkgData, revData] = await Promise.all([
          api.getDestinations(),
          api.getPackages(),
          api.getReviews()
        ]);
        setDestinations(destData || []);
        setPackages(pkgData || []);
        setReviews((revData || []).slice(0, 3));
      } catch (err) {
        console.error('Home data load error:', err);
      }
    };
    fetchData();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate('destinations', { search: searchQuery, vibe: selectedVibe });
  };

  const vibes = [
    { id: 'all', label: 'All Experiences' },
    { id: 'heritage', label: '⛩️ Heritage & Forts' },
    { id: 'culinary', label: '🍛 Regional Food' },
    { id: 'beach', label: '🏖️ Coastal Escapes' },
    { id: 'nature', label: '🌿 Valleys & Wildlife' },
    { id: 'wellness', label: '✨ Wellness & Temples' }
  ];

  // Featured Indian alternative highlights
  const hiddenGems = destinations.filter(d => d.whyAlternativeBetter || d.popularityTier === 'gem').slice(0, 4);

  return (
    <div className="space-y-16 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative rounded-3xl overflow-hidden bg-slate-900 text-white min-h-[520px] flex items-center shadow-2xl mx-4 sm:mx-6 lg:mx-8 mt-4">
        {/* Background Image Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-overlay scale-105"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=2000&q=80')`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/70 to-transparent" />

        <div className="relative max-w-5xl mx-auto px-6 py-16 text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-wider"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>AI Tourism Demand Balancer & India Culture Discovery</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight"
          >
            Smart, Sustainable Travel <br />
            <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-amber-300 bg-clip-text text-transparent">
              Tailored Across India & Beyond
            </span>
          </motion.h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            AI-driven demand relief for over-visited hotspots, deep local cultural discoveries (food, handicrafts, textiles), micro-mobility rides, and direct artisan economic empowerment.
          </p>

          {/* Smart Search Bar */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleSearchSubmit}
            className="bg-white/95 backdrop-blur-md p-2 sm:p-3 rounded-2xl shadow-2xl max-w-3xl mx-auto text-slate-800 flex flex-col sm:flex-row items-center gap-2 border border-white/40"
          >
            <div className="flex-1 flex items-center gap-2 px-3 w-full">
              <Search className="w-5 h-5 text-emerald-600 shrink-0" />
              <input
                id="home-search-input"
                type="text"
                placeholder="Search Sindhudurg, Pune, Kolhapur, Chettinad, Bali, Kyoto, Misal Pav, Solapuri Chaddar..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full py-2 bg-transparent text-xs sm:text-sm font-medium focus:outline-none placeholder:text-slate-400"
              />
            </div>

            <div className="hidden md:block w-px h-8 bg-slate-200" />

            <select
              id="home-vibe-select"
              value={selectedVibe}
              onChange={e => setSelectedVibe(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 bg-slate-100 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
            >
              {vibes.map(v => (
                <option key={v.id} value={v.id}>{v.label}</option>
              ))}
            </select>

            <button
              id="home-search-btn"
              type="submit"
              className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <span>Explore AI Plans</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.form>

          {/* Quick AI Prompt Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs">
            <span className="text-slate-400 text-[11px] font-medium">Try asking AI:</span>
            {[
              '4-day Sindhudurg coastal & scuba alternative to Goa',
              'Pune cultural heritage & authentic Misal Pav trail',
              'Kolhapur royal temples & Chappal artisan workshops',
              'Chettinad heritage mansions & spice gastronomy'
            ].map((prompt, i) => (
              <button
                key={i}
                onClick={() => {
                  onNavigate('ai', { initialPrompt: prompt });
                }}
                className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-emerald-200 border border-white/10 transition-colors text-[11px]"
              >
                ✨ {prompt}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 2. AI TOURISM DEMAND BALANCER SPOTLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-emerald-800/40">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-emerald-800/50">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-bold rounded-full border border-emerald-400/30 uppercase tracking-wider mb-2">
                <TrendingDown className="w-3.5 h-3.5" /> AI Tourism Demand Balancer
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Escape Over-Tourism. Discover India&apos;s Untapped Wonders.
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
                Our algorithmic engine matches your travel vibe to under-visited gems, reducing crowd stress by up to 75% while keeping 85%+ tourism spend inside local village economies.
              </p>
            </div>

            <button
              onClick={() => onNavigate('destinations', { tab: 'demand_balancer' })}
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs sm:text-sm transition-all shadow-md flex items-center gap-2 self-start lg:self-auto shrink-0"
            >
              <span>Launch Full Balancer</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Alternative Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {hiddenGems.map(gem => (
              <div
                key={gem.id}
                onClick={() => onSelectDestination(gem)}
                className="bg-white/10 hover:bg-white/15 p-4 rounded-2xl border border-white/10 cursor-pointer transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-32 rounded-xl overflow-hidden mb-3">
                    <img
                      src={gem.heroImage}
                      alt={gem.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {gem.whyAlternativeBetter && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 bg-emerald-600 text-white text-[10px] font-bold rounded">
                        Replaces {gem.whyAlternativeBetter.replacesFamousSpot}
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-white text-sm group-hover:text-emerald-300 transition-colors">
                    {gem.name}
                  </h3>
                  <p className="text-[11px] text-slate-300 mt-1 line-clamp-2">
                    {gem.whyAlternativeBetter?.headline || gem.tagline}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-white/10 flex items-center justify-between text-[11px]">
                  <span className="text-emerald-300 font-semibold">
                    -{gem.whyAlternativeBetter?.crowdReductionPct || 65}% Crowds
                  </span>
                  <span className="text-amber-300 font-bold">
                    ★ {gem.rating}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. INDIA LOCAL CULTURE & "WHAT'S FAMOUS HERE?" SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 uppercase tracking-wider">
              <Utensils className="w-4 h-4" />
              Regional Gastronomy & Handloom Heritage
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
              What&apos;s Famous Here? Cultural Specialties
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Explore authentic local dishes, GI-tagged textiles, traditional jewellery, and cultural experiences.
            </p>
          </div>

          <button
            onClick={() => onNavigate('destinations', { tab: 'culture_discovery' })}
            className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 group"
          >
            <span>Explore Cultural Directory</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 4 Cultural Pillars Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div 
            onClick={() => onNavigate('destinations', { tab: 'culture_discovery' })}
            className="p-5 bg-amber-50/70 border border-amber-200 rounded-2xl cursor-pointer hover:shadow-md transition-all space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800 text-xl font-bold">
              🍛
            </div>
            <h3 className="font-bold text-slate-900 text-base">Regional Cuisines</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              From Pune&apos;s fiery Kata Kirr Misal Pav and Kolhapuri Tambda-Pandhra Rassa to Malvani Fish Thali and Chettinad Kuzhi Paniyaram.
            </p>
            <div className="text-[11px] font-bold text-amber-800 flex items-center gap-1">
              <span>View Food Map</span> &rarr;
            </div>
          </div>

          <div 
            onClick={() => onNavigate('destinations', { tab: 'culture_discovery' })}
            className="p-5 bg-purple-50/70 border border-purple-200 rounded-2xl cursor-pointer hover:shadow-md transition-all space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-800 text-xl font-bold">
              🧵
            </div>
            <h3 className="font-bold text-slate-900 text-base">GI Textiles & Handlooms</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Support master weavers of Solapuri Jacquard Chadars, Paithani Silk Sarees, Sambalpuri Ikat, and Kullu Handwoven Shawls.
            </p>
            <div className="text-[11px] font-bold text-purple-800 flex items-center gap-1">
              <span>Explore GI Crafts</span> &rarr;
            </div>
          </div>

          <div 
            onClick={() => onNavigate('destinations', { tab: 'culture_discovery' })}
            className="p-5 bg-blue-50/70 border border-blue-200 rounded-2xl cursor-pointer hover:shadow-md transition-all space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-800 text-xl font-bold">
              💍
            </div>
            <h3 className="font-bold text-slate-900 text-base">Jewellery & Leathercraft</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Authentic GI-certified Kolhapuri Chappals, Kolhapuri Saaj gold necklaces, and Bidriware silver inlay artwork.
            </p>
            <div className="text-[11px] font-bold text-blue-800 flex items-center gap-1">
              <span>Artisan Guilds</span> &rarr;
            </div>
          </div>

          <div 
            onClick={() => onNavigate('destinations', { tab: 'culture_discovery' })}
            className="p-5 bg-emerald-50/70 border border-emerald-200 rounded-2xl cursor-pointer hover:shadow-md transition-all space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800 text-xl font-bold">
              🎨
            </div>
            <h3 className="font-bold text-slate-900 text-base">Folk Art & Heritage</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Pattachitra scroll painting in Raghurajpur, Peshwai wada heritage in Pune, and sea-fort scuba expeditions in Sindhudurg.
            </p>
            <div className="text-[11px] font-bold text-emerald-800 flex items-center gap-1">
              <span>Discover Experiences</span> &rarr;
            </div>
          </div>
        </div>
      </section>

      {/* 4. THE EXPLORER CAB BOOKING BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-sky-900 to-indigo-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col lg:flex-row items-center justify-between gap-6 border border-sky-800/40">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-500/20 text-sky-300 text-xs font-semibold rounded-full border border-sky-400/30">
              <Car className="w-3.5 h-3.5" />
              Integrated Micro-Mobility
            </div>
            <h3 className="text-2xl font-bold text-white">Need a ride right now? Try The Explorer</h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Cabs, Auto-rickshaws, Bikes, and E-Scooters with transparent per-km rates, verified drivers, live tracking, and direct itinerary integration.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-xs text-slate-400">Starting from</div>
              <div className="text-xl font-black text-sky-400">₹12 / km</div>
            </div>
            <button
              onClick={() => onNavigate('explorer')}
              className="px-6 py-3 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-2xl shadow-lg transition-all flex items-center gap-2 text-xs sm:text-sm"
            >
              <span>Book Explorer Ride</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 5. TRENDING DESTINATIONS WITH LIVE CROWD & SAFETY PULSE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider">
              <Compass className="w-4 h-4" />
              Verified Destination Catalog
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
              Explore India & Global Hotspots
            </h2>
          </div>

          <button
            onClick={() => onNavigate('destinations')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 group"
          >
            <span>View All Destinations</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(destinations || []).slice(0, 6).map(dest => {
            const isSaved = user?.savedDestinations?.includes(dest.id);
            return (
              <div
                key={dest.id}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  {/* Image & Badges */}
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={dest.heroImage}
                      alt={dest.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                    {/* Top tags */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <span className="px-2.5 py-1 bg-white/90 backdrop-blur-md rounded-full text-[11px] font-bold text-slate-800 shadow-2xs">
                        {dest.state ? `${dest.state}, India` : dest.country}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSaveDestination(dest.id);
                        }}
                        className="p-2 rounded-full bg-white/80 backdrop-blur-md text-slate-700 hover:text-rose-600 transition-colors shadow-2xs"
                      >
                        <Heart className={`w-4 h-4 ${isSaved ? 'text-rose-600 fill-rose-600' : ''}`} />
                      </button>
                    </div>

                    {/* Bottom Image Stats */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                      <div className="flex items-center gap-1.5 bg-slate-900/60 backdrop-blur-md px-2.5 py-1 rounded-lg">
                        <CloudSun className="w-3.5 h-3.5 text-amber-300" />
                        <span>{dest.currentWeather?.tempC || 27}°C {dest.currentWeather?.condition || 'Clear'}</span>
                      </div>

                      <div className="flex items-center gap-1 bg-slate-900/60 backdrop-blur-md px-2.5 py-1 rounded-lg">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span className="font-bold">{dest.rating}</span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-3">
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {dest.name}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                      {dest.tagline || dest.description}
                    </p>

                    {/* Vibe Chips */}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {dest.vibe.slice(0, 3).map(v => (
                        <span key={v} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[10px] font-semibold">
                          {v}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  {/* Pulse Matrix (Crowd + Retention) */}
                  <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-50 p-2 rounded-xl">
                      <div className="text-[10px] text-slate-400 font-medium">Crowd Load</div>
                      <div className="font-bold text-slate-800 capitalize flex items-center gap-1 mt-0.5">
                        <span className={`w-2 h-2 rounded-full ${
                          dest.currentCapacityLoadPct && dest.currentCapacityLoadPct < 50 ? 'bg-emerald-500' :
                          dest.currentCapacityLoadPct && dest.currentCapacityLoadPct < 75 ? 'bg-amber-500' : 'bg-rose-500'
                        }`} />
                        <span>{dest.crowdPrediction?.currentStatus || 'Moderate'}</span>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-2 rounded-xl">
                      <div className="text-[10px] text-slate-400 font-medium">Local Economic Impact</div>
                      <div className="font-bold text-emerald-700 flex items-center gap-1 mt-0.5">
                        <HeartHandshake className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{dest.localEconomicRetentionPct || 85}% Direct</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer Action */}
                  <div className="flex items-center justify-between pt-3 mt-1">
                    <div>
                      <div className="text-[10px] text-slate-400 font-medium">Starting From</div>
                      <div className="text-base font-black text-slate-900">₹{(dest.startingPrice * 75).toLocaleString('en-IN')}</div>
                    </div>

                    <button
                      onClick={() => onSelectDestination(dest)}
                      className="px-4 py-2 bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-700 rounded-xl text-xs font-bold transition-colors"
                    >
                      View Details & AI Plan
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. FEATURED ALL-INCLUSIVE PACKAGES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 uppercase tracking-wider">
              <Zap className="w-4 h-4" />
              All-Inclusive Verified Experiences
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
              Curated Travel Packages
            </h2>
          </div>

          <button
            onClick={() => onNavigate('destinations')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 group"
          >
            <span>Browse All Packages</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {packages.slice(0, 3).map(pkg => (
            <div
              key={pkg.id}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={pkg.image}
                    alt={pkg.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent" />
                  <span className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-xs font-bold text-slate-900 shadow-2xs">
                    ⏱️ {pkg.duration}
                  </span>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {pkg.title}
                    </h3>
                    <span className="text-amber-500 font-bold text-xs flex items-center gap-1">
                      ★ {pkg.rating}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2">{pkg.description}</p>
                </div>
              </div>

              <div className="p-6 pt-0">
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-slate-400 font-medium">All-Inclusive</div>
                    <div className="text-lg font-black text-indigo-600">${pkg.startingPrice}</div>
                  </div>

                  <button
                    onClick={() => onBookPackage(pkg)}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors shadow-md"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
