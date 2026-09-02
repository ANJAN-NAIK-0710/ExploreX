import React from 'react';
import { Compass, ShieldCheck, Heart, Sparkles, MapPin, Phone, Mail, Globe } from 'lucide-react';
import { NavTab } from './Navbar';

interface FooterProps {
  onSelectTab: (tab: NavTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => onSelectTab('home')}>
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-base shadow-sm">
<<<<<<< HEAD
                W
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xl font-bold text-white tracking-tight">WANDER<span className="text-blue-400">.AI</span></span>
=======
                E
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xl font-bold text-white tracking-tight">EXPLORE<span className="text-blue-400">X</span></span>
>>>>>>> 5761e1be8e8eb21e40f31a92e4c8a271991f2933
                <span className="px-1.5 py-0.5 text-[9px] font-bold bg-blue-950 text-blue-300 rounded border border-blue-800 uppercase tracking-wider">
                  Pro
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Next-generation AI-Powered Personalized Tourism & Travel Optimization Platform. Real-time dynamic replanning, integrated micro-mobility, crowd prediction, and seamless group expense settlements.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              All 11 Core AI Travel Microservices Operational
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Explore & Book</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><button onClick={() => onSelectTab('destinations')} className="hover:text-blue-400 transition-colors">Curated Destinations</button></li>
              <li><button onClick={() => onSelectTab('packages')} className="hover:text-blue-400 transition-colors">Tour Packages & Pricing</button></li>
              <li><button onClick={() => onSelectTab('bookings')} className="hover:text-blue-400 transition-colors">Multi-Modal Bookings</button></li>
              <li><button onClick={() => onSelectTab('explore')} className="hover:text-blue-400 transition-colors">Interactive Global Map</button></li>
              <li><button onClick={() => onSelectTab('explorer')} className="hover:text-blue-400 transition-colors">The Explorer Cabs & Bikes</button></li>
            </ul>
          </div>

          {/* AI Travel Engine */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">AI Intelligence</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><button onClick={() => onSelectTab('ai')} className="hover:text-blue-400 transition-colors">AI Travel Assistant</button></li>
              <li><button onClick={() => onSelectTab('ai')} className="hover:text-blue-400 transition-colors">AI Trip Autopilot</button></li>
              <li><button onClick={() => onSelectTab('ai')} className="hover:text-blue-400 transition-colors">What-If Trip Simulator</button></li>
              <li><button onClick={() => onSelectTab('profile')} className="hover:text-blue-400 transition-colors">Travel DNA Profiler</button></li>
              <li><button onClick={() => onSelectTab('moments')} className="hover:text-blue-400 transition-colors">Magic Moments (20MB Quota)</button></li>
            </ul>
          </div>

          {/* Account & Administration */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Services & Tools</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><button onClick={() => onSelectTab('mytrips')} className="hover:text-blue-400 transition-colors">My Trips Dashboard</button></li>
<<<<<<< HEAD
              <li><button onClick={() => onSelectTab('wallet')} className="hover:text-blue-400 transition-colors">Wander Wallet & Reload</button></li>
=======
              <li><button onClick={() => onSelectTab('wallet')} className="hover:text-blue-400 transition-colors">ExploreX Wallet & Reload</button></li>
>>>>>>> 5761e1be8e8eb21e40f31a92e4c8a271991f2933
              <li><button onClick={() => onSelectTab('wallet')} className="hover:text-blue-400 transition-colors">Group Expense Splitter</button></li>
              <li><button onClick={() => onSelectTab('profile')} className="hover:text-blue-400 transition-colors">Profile & Preferences</button></li>
              <li><button onClick={() => onSelectTab('admin')} className="hover:text-blue-400 transition-colors font-medium text-slate-300">Admin Control Center</button></li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright & disclaimer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
<<<<<<< HEAD
          <p>© 2026 WanderAI Platform. Built for Next-Generation Tourism Optimization.</p>
=======
          <p>© 2026 ExploreX Platform. Built for Next-Generation Tourism Optimization.</p>
>>>>>>> 5761e1be8e8eb21e40f31a92e4c8a271991f2933
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Safety Guidelines</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
