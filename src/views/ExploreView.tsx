import React, { useState, useEffect } from 'react';
import { 
  Map, 
  Search, 
  Filter, 
  Compass, 
  CloudSun, 
  ShieldCheck, 
  Users, 
  Car, 
  ArrowRight, 
  Star, 
  Layers,
  MapPin
} from 'lucide-react';
import { Destination, Attraction } from '../types';
import { api } from '../services/api';
import { MapComponent, MapMarker } from '../components/MapComponent';
import { NavTab } from '../components/Navbar';

interface ExploreViewProps {
  onNavigate: (tab: NavTab, params?: any) => void;
  onSelectDestination: (dest: Destination) => void;
}

export const ExploreView: React.FC<ExploreViewProps> = ({
  onNavigate,
  onSelectDestination
}) => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [selectedDestId, setSelectedDestId] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const list = await api.getDestinations();
        setDestinations(list);
        if (list.length > 0) {
          setSelectedDestId(list[0].id);
        }
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, []);

  const currentDest = destinations.find(d => d.id === selectedDestId) || destinations[0];

  // Convert attractions into map markers
  const markers: MapMarker[] = [];

  if (currentDest) {
    // Add primary destination marker
    markers.push({
      id: `dest-${currentDest.id}`,
      lat: currentDest.coordinates.lat,
      lng: currentDest.coordinates.lng,
      title: `${currentDest.name} Center`,
      category: 'Destination',
      rating: currentDest.rating,
      image: currentDest.heroImage,
      description: currentDest.tagline
    });

    // Add attractions
    (currentDest.popularAttractions || []).forEach(attr => {
      if (selectedCategory === 'all' || attr.category === selectedCategory) {
        markers.push({
          id: attr.id,
          lat: attr.coordinates.lat,
          lng: attr.coordinates.lng,
          title: attr.name,
          category: attr.category,
          rating: attr.rating,
          image: attr.image,
          price: attr.entryFee,
          description: attr.description
        });
      }
    });
  }

  const categories = [
    { id: 'all', label: 'All Markers' },
    { id: 'Sightseeing', label: '🏛️ Sightseeing' },
    { id: 'Heritage', label: '⛩️ Heritage & Temples' },
    { id: 'Nature', label: '🌲 Nature & Hikes' },
    { id: 'Beach', label: '🏖️ Beaches' },
    { id: 'Adventure', label: '🪂 Adventure' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 uppercase tracking-wider">
            <Map className="w-4 h-4" />
            Interactive Spatial Exploration
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            Global Travel Map & Real-Time POI Engine
          </h1>
        </div>

        {/* Destination Switcher Dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-600">Focus Region:</label>
          <select
            value={selectedDestId}
            onChange={e => setSelectedDestId(e.target.value)}
            className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 shadow-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
          >
            {destinations.map(d => (
              <option key={d.id} value={d.id}>
                {d.name} ({d.country})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === cat.id
                ? 'bg-sky-600 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Main Map Container & Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Map */}
        <div className="lg:col-span-2 bg-white p-3 rounded-3xl border border-slate-200 shadow-sm flex flex-col">
          {currentDest ? (
            <MapComponent
              center={[currentDest.coordinates.lat, currentDest.coordinates.lng]}
              zoom={11}
              markers={markers}
              className="h-[520px] w-full rounded-2xl overflow-hidden"
              onMarkerClick={m => setSelectedMarker(m)}
            />
          ) : (
            <div className="h-[520px] flex items-center justify-center text-slate-400 text-sm">
              Loading Map View...
            </div>
          )}

          {/* Map bottom bar */}
          <div className="pt-3 px-2 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 font-semibold text-slate-800">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                {markers.length} Verified POIs Loaded
              </span>
              <span className="flex items-center gap-1">
                <CloudSun className="w-3.5 h-3.5 text-amber-500" />
                {currentDest?.currentWeather.tempC}°C {currentDest?.currentWeather.condition}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate('explorer', { destination: currentDest?.name })}
                className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <Car className="w-3.5 h-3.5 text-sky-400" />
                <span>Call Explorer Cab to Marker</span>
              </button>
            </div>
          </div>
        </div>

        {/* Selected POI Details / Destination Snapshot */}
        <div className="space-y-4">
          {currentDest && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="relative h-40 rounded-2xl overflow-hidden">
                <img
                  src={selectedMarker?.image || currentDest.heroImage}
                  alt={selectedMarker?.title || currentDest.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 px-2.5 py-1 bg-slate-900/80 backdrop-blur-md rounded-full text-white text-[10px] font-bold">
                  {selectedMarker ? (selectedMarker.category || 'Point of Interest') : 'Selected Region'}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-900">
                    {selectedMarker ? selectedMarker.title : currentDest.name}
                  </h3>
                  <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{selectedMarker?.rating || currentDest.rating}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {selectedMarker?.description || currentDest.overview}
                </p>
              </div>

              {/* Highlights & Stats */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-[10px] text-slate-400 block font-medium">Safety Score</span>
                  <span className="font-bold text-emerald-700">{currentDest.safetyScore.overall}/100</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-[10px] text-slate-400 block font-medium">Crowd Rating</span>
                  <span className="font-bold text-slate-800 capitalize">{currentDest.crowdPrediction.currentLevel}</span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={() => onSelectDestination(currentDest)}
                  className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Explore Full Guide & Packages</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => onNavigate('ai', { destinationId: currentDest.id, initialPrompt: `Create an optimized itinerary for visiting ${selectedMarker ? selectedMarker.title : currentDest.name}` })}
                  className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
                >
                  Ask AI About This Spot
                </button>
              </div>
            </div>
          )}

          {/* Nearby Attractions List */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Must-Visit Highlights in {currentDest?.name || 'Destination'}
            </h4>
            <div className="space-y-2.5">
              {(currentDest?.popularAttractions || []).slice(0, 4).map(attr => (
                <div
                  key={attr.id}
                  onClick={() => {
                    setSelectedMarker({
                      id: attr.id,
                      lat: attr.coordinates.lat,
                      lng: attr.coordinates.lng,
                      title: attr.name,
                      category: attr.category,
                      rating: attr.rating,
                      image: attr.image,
                      price: attr.entryFee,
                      description: attr.description
                    });
                  }}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors border border-transparent hover:border-slate-200"
                >
                  <img
                    src={attr.image}
                    alt={attr.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-bold text-slate-800 truncate">{attr.name}</h5>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                      <span>{attr.category}</span>
                      <span>•</span>
                      <span className="text-amber-600 font-semibold">★ {attr.rating}</span>
                      <span>•</span>
                      <span>⏱️ {attr.recommendedDuration}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
