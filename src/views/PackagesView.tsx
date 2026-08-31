import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Search, 
  Filter, 
  Check, 
  X, 
  Sparkles, 
  Star, 
  Heart, 
  Calendar, 
  DollarSign, 
  ArrowRight, 
  Columns, 
  Info,
  ChevronDown
} from 'lucide-react';
import { TravelPackage } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { NavTab } from '../components/Navbar';

interface PackagesViewProps {
  onNavigate: (tab: NavTab, params?: any) => void;
  onBookPackage: (pkg: TravelPackage) => void;
}

export const PackagesView: React.FC<PackagesViewProps> = ({
  onNavigate,
  onBookPackage
}) => {
  const { user, toggleSavePackage } = useAuth();
  const [packages, setPackages] = useState<TravelPackage[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(3000);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [isComparing, setIsComparing] = useState<boolean>(false);
  const [activeDetailPkg, setActiveDetailPkg] = useState<TravelPackage | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const list = await api.getPackages({ theme: selectedTheme, maxPrice });
        setPackages(list);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, [selectedTheme, maxPrice]);

  const themes = [
    { id: 'all', label: 'All Themes' },
    { id: 'Luxury Escape', label: '✨ Luxury' },
    { id: 'Scenic Alpine', label: '🏔️ Alpine' },
    { id: 'Heritage & Culture', label: '⛩️ Heritage' },
    { id: 'Beach & Wellness', label: '🏖️ Beach' },
    { id: 'Mountain Adventure', label: '🪂 Adventure' }
  ];

  const handleToggleCompare = (id: string) => {
    if (compareIds.includes(id)) {
      setCompareIds(compareIds.filter(i => i !== id));
    } else {
      if (compareIds.length >= 3) {
        return;
      }
      setCompareIds([...compareIds, id]);
    }
  };

  const comparedPackages = packages.filter(p => compareIds.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pb-16">
      {/* Header */}
      <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 uppercase tracking-wider">
            <Package className="w-4 h-4" />
            Curated All-Inclusive Tour Packages
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            Verified Travel Packages & Transparent Pricing
          </h1>
        </div>

        {/* Compare action bar toggle */}
        {compareIds.length > 0 && (
          <div className="flex items-center gap-3 bg-indigo-50 border border-indigo-200 px-4 py-2 rounded-2xl">
            <span className="text-xs font-bold text-indigo-900">
              {compareIds.length} package{compareIds.length > 1 ? 's' : ''} selected
            </span>
            <button
              onClick={() => setIsComparing(true)}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
            >
              Compare Side-by-Side
            </button>
            <button
              onClick={() => setCompareIds([])}
              className="text-xs text-slate-500 hover:text-slate-700"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Filters bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">Holiday Theme</label>
          <select
            value={selectedTheme}
            onChange={e => setSelectedTheme(e.target.value)}
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none"
          >
            {themes.map(t => (
              <option key={t.id} value={t.id}>{t.label}</option>
            ))}
          </select>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-xs font-bold text-slate-700">Max Budget Per Person</label>
            <span className="text-xs font-black text-indigo-600">${maxPrice}</span>
          </div>
          <input
            type="range"
            min={100}
            max={3500}
            step={50}
            value={maxPrice}
            onChange={e => setMaxPrice(Number(e.target.value))}
            className="w-full accent-indigo-600 cursor-pointer"
          />
        </div>

        <div className="flex items-end">
          <button
            onClick={() => onNavigate('ai', { initialPrompt: 'Recommend the best package for a 1-week couple vacation with $1200 budget' })}
            className="w-full py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Match Best Package</span>
          </button>
        </div>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map(pkg => {
          const isSaved = user?.savedPackages?.includes(pkg.id);
          const isSelectedForCompare = compareIds.includes(pkg.id);

          return (
            <div
              key={pkg.id}
              className={`bg-white rounded-3xl border overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between ${
                isSelectedForCompare ? 'border-indigo-500 ring-2 ring-indigo-500/20' : 'border-slate-200'
              }`}
            >
              <div>
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={pkg.heroImage}
                    alt={pkg.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

                  <span className="absolute top-3 left-3 px-3 py-1 bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold rounded-full">
                    ⏱️ {pkg.duration}
                  </span>

                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    <button
                      onClick={() => toggleSavePackage(pkg.id)}
                      className="p-2 rounded-full bg-white/80 backdrop-blur-md text-slate-700 hover:text-rose-600 transition-colors shadow-sm"
                    >
                      <Heart className={`w-3.5 h-3.5 ${isSaved ? 'text-rose-600 fill-rose-600' : ''}`} />
                    </button>
                  </div>

                  <span className="absolute bottom-3 left-3 px-2.5 py-0.5 bg-indigo-600 text-white text-[10px] font-bold rounded-full">
                    {pkg.theme}
                  </span>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 line-clamp-1">{pkg.title}</h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{pkg.description}</p>
                  </div>

                  {/* Highlights list */}
                  <div className="space-y-1.5">
                    {pkg.highlights.map((h, i) => (
                      <div key={i} className="text-xs text-slate-600 flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">{h}</span>
                      </div>
                    ))}
                  </div>

                  {/* Inclusions summary */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px] space-y-1">
                    <div className="flex items-center justify-between text-slate-700">
                      <span>🏨 Accommodation</span>
                      <span className="font-semibold">{pkg.inclusions.hotelTier}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-700">
                      <span>🚗 Local Transport</span>
                      <span className="font-semibold">{pkg.inclusions.transportType}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-6 pt-0 space-y-3">
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Starting From</span>
                    <span className="text-lg font-black text-slate-900">${pkg.startingPrice}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleCompare(pkg.id)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                        isSelectedForCompare
                          ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {isSelectedForCompare ? '✓ Selected' : '+ Compare'}
                    </button>

                    <button
                      onClick={() => setActiveDetailPkg(pkg)}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors"
                    >
                      Details
                    </button>

                    <button
                      onClick={() => onBookPackage(pkg)}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition-all"
                    >
                      Book
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* SIDE-BY-SIDE PACKAGE COMPARISON MODAL */}
      {isComparing && comparedPackages.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95">
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Columns className="w-5 h-5 text-indigo-400" />
                <h3 className="text-lg font-bold">Side-by-Side Package Comparison Matrix</h3>
              </div>
              <button onClick={() => setIsComparing(false)} className="p-1.5 rounded-full bg-white/10 hover:bg-white/20">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-x-auto flex-1">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="p-3 w-40 font-bold text-slate-500 uppercase tracking-wider">Feature</th>
                    {comparedPackages.map(p => (
                      <th key={p.id} className="p-3 font-bold text-slate-900 text-sm">
                        {p.title}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="p-3 font-semibold text-slate-500">Price Per Person</td>
                    {comparedPackages.map(p => (
                      <td key={p.id} className="p-3 font-black text-indigo-600 text-base">
                        ${p.startingPrice}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-500">Duration</td>
                    {comparedPackages.map(p => (
                      <td key={p.id} className="p-3 font-medium text-slate-800">
                        {p.duration}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-500">Hotel Accommodation</td>
                    {comparedPackages.map(p => (
                      <td key={p.id} className="p-3 font-medium text-slate-800">
                        {p.inclusions.hotelTier}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-500">Transport Included</td>
                    {comparedPackages.map(p => (
                      <td key={p.id} className="p-3 font-medium text-slate-800">
                        {p.inclusions.transportType}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-500">Key Highlights</td>
                    {comparedPackages.map(p => (
                      <td key={p.id} className="p-3">
                        <ul className="list-disc pl-4 space-y-1 text-slate-600">
                          {p.highlights.map((h, i) => (
                            <li key={i}>{h}</li>
                          ))}
                        </ul>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-500">Action</td>
                    {comparedPackages.map(p => (
                      <td key={p.id} className="p-3">
                        <button
                          onClick={() => {
                            setIsComparing(false);
                            onBookPackage(p);
                          }}
                          className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md transition-all"
                        >
                          Book this Package
                        </button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* PACKAGE DETAILED ITINERARY MODAL */}
      {activeDetailPkg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95">
            <div className="relative h-56 shrink-0">
              <img src={activeDetailPkg.heroImage} alt={activeDetailPkg.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              <button
                onClick={() => setActiveDetailPkg(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-4 left-6 right-6 text-white">
                <span className="px-2.5 py-0.5 bg-indigo-600 text-[11px] font-bold rounded-full">
                  {activeDetailPkg.theme} • {activeDetailPkg.duration}
                </span>
                <h2 className="text-2xl font-black mt-1">{activeDetailPkg.title}</h2>
              </div>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto flex-1 text-xs">
              {/* Day by Day schedule */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Day-by-Day Itinerary</h3>
                <div className="space-y-3">
                  {activeDetailPkg.itinerary.map(day => (
                    <div key={day.day} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-md">
                          Day {day.day}
                        </span>
                        <h4 className="font-bold text-slate-900 text-sm">{day.title}</h4>
                      </div>
                      <p className="text-slate-600">{day.description}</p>
                      <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-1 font-medium">
                        <span>🏨 {day.stay}</span>
                        <span>🍽️ Meals: {day.mealsIncluded.join(', ')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Inclusions / Exclusions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 space-y-2">
                  <h4 className="font-bold text-emerald-900 uppercase tracking-wider text-[11px]">Included in Package</h4>
                  <ul className="space-y-1 text-emerald-800">
                    {activeDetailPkg.inclusions.guidedTours && <li>✓ Professional English speaking local guide</li>}
                    <li>✓ {activeDetailPkg.inclusions.hotelTier}</li>
                    <li>✓ {activeDetailPkg.inclusions.transportType}</li>
                    <li>✓ All park & monument entrance permits</li>
                  </ul>
                </div>

                <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100 space-y-2">
                  <h4 className="font-bold text-rose-900 uppercase tracking-wider text-[11px]">Exclusions</h4>
                  <ul className="space-y-1 text-rose-800">
                    <li>✗ Personal visa fees (if applicable)</li>
                    <li>✗ Travel insurance premium</li>
                    <li>✗ Discretionary gratuities</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">Grand Total</span>
                <span className="text-xl font-black text-slate-900">${activeDetailPkg.startingPrice} <span className="text-xs font-normal text-slate-500">/ person</span></span>
              </div>
              <button
                onClick={() => {
                  const pkg = activeDetailPkg;
                  setActiveDetailPkg(null);
                  onBookPackage(pkg);
                }}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md transition-all"
              >
                Book Package Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
