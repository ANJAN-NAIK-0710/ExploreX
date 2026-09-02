import React, { useState } from 'react';
import { 
  Compass, 
  Map, 
  Package, 
  Ticket, 
  Briefcase, 
  Car, 
  Sparkles, 
  User, 
  Wallet, 
  ShieldCheck, 
  Menu, 
  X, 
  Camera, 
  Heart, 
  LogOut,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export type NavTab = 
  | 'home' 
  | 'explore' 
  | 'destinations' 
  | 'packages' 
  | 'bookings' 
  | 'mytrips' 
  | 'explorer' 
  | 'ai' 
  | 'moments' 
  | 'wallet' 
  | 'profile' 
  | 'admin';

interface NavbarProps {
  currentTab?: NavTab;
  activeTab?: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenAuth?: (mode: 'login' | 'signup') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, activeTab, onSelectTab, onOpenAuth }) => {
  const effectiveTab = currentTab || activeTab || 'home';
  const { user, isAuthenticated, openAuthModal, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const handleOpenAuth = (mode: 'login' | 'signup') => {
    if (onOpenAuth) {
      onOpenAuth(mode);
    } else {
      openAuthModal(mode);
    }
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: Compass },
    { id: 'explore', label: 'Explore', icon: Map },
    { id: 'destinations', label: 'Destinations', icon: Compass },
    { id: 'packages', label: 'Packages', icon: Package },
    { id: 'bookings', label: 'Bookings', icon: Ticket },
    { id: 'mytrips', label: 'My Trips', icon: Briefcase },
    { id: 'explorer', label: 'The Explorer', icon: Car },
    { id: 'ai', label: 'AI Assistant', icon: Sparkles, badge: 'AI' },
    { id: 'moments', label: 'Moments', icon: Camera }
  ];

  const handleNavClick = (tabId: string) => {
    onSelectTab(tabId as NavTab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer group shrink-0"
          >
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-base shadow-sm shadow-blue-500/20 group-hover:scale-105 transition-transform">
              W
            </div>
            <div className="flex items-center gap-1">
              <span className="font-bold text-lg tracking-tight text-slate-900">WANDER<span className="text-blue-600">.AI</span></span>
              <span className="hidden sm:inline-block ml-1 px-1.5 py-0.5 text-[9px] font-bold bg-blue-50 text-blue-700 rounded border border-blue-100 uppercase tracking-wider">
                Pro
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = effectiveTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`h-16 px-3 flex items-center gap-1.5 text-xs font-semibold transition-all relative ${
                    isActive
                      ? 'text-blue-600 font-bold border-b-2 border-blue-600 bg-blue-50/40'
                      : 'text-slate-500 hover:text-blue-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-blue-600'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="px-1.5 py-0.2 bg-blue-600 text-white text-[9px] font-bold rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Bar */}
          <div className="hidden sm:flex items-center gap-3">
            {/* AI Autopilot Live Pill */}
            <div className="bg-slate-100 rounded-full px-3.5 py-1.5 flex items-center gap-2 border border-slate-200/80">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-[11px] font-bold text-slate-600 tracking-wide uppercase">AI Autopilot On</span>
            </div>

            {/* Wallet Balance Chip */}
            <button
              onClick={() => handleNavClick('wallet')}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 transition-all group"
            >
              <div className="w-6 h-6 rounded-md bg-blue-100 text-blue-700 flex items-center justify-center">
                <Wallet className="w-3.5 h-3.5" />
              </div>
              <div className="text-left">
                <div className="text-[9px] text-slate-400 font-semibold uppercase leading-none">Wallet</div>
                <div className="text-xs font-bold text-slate-800 group-hover:text-blue-700 leading-tight">
                  ${(user?.walletBalance || 0).toFixed(2)}
                </div>
              </div>
            </button>

            {/* Admin Badge link */}
            <button
              onClick={() => handleNavClick('admin')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 border transition-all ${
                effectiveTab === 'admin'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900 shadow-xs'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>

            {/* User Profile or Sign In */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-1 pl-2 pr-3 rounded-full hover:bg-slate-50 border border-slate-200 transition-colors"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-7 h-7 rounded-full object-cover border border-blue-300"
                  />
                  <span className="text-xs font-semibold text-slate-800 max-w-[90px] truncate">{user.name}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <div className="text-xs font-bold text-slate-900">{user.name}</div>
                      <div className="text-[11px] text-slate-400 truncate">{user.email}</div>
                    </div>

                    <button
                      onClick={() => {
                        handleNavClick('profile');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2 font-medium"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      View Profile & Travel DNA
                    </button>

                    <button
                      onClick={() => {
                        handleNavClick('mytrips');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2 font-medium"
                    >
                      <Briefcase className="w-4 h-4 text-slate-400" />
                      My Trips & Active Bookings
                    </button>

                    <button
                      onClick={() => {
                        handleNavClick('wallet');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2 font-medium"
                    >
                      <Wallet className="w-4 h-4 text-slate-400" />
                      Wander Wallet & Splitter
                    </button>

                    <div className="border-t border-slate-100 my-1" />

                    <button
                      onClick={() => {
                        logout();
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-semibold"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => handleOpenAuth('login')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm shadow-blue-500/20 transition-all"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile menu hamburger */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => handleNavClick('wallet')}
              className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-700"
            >
              <Wallet className="w-4 h-4 text-blue-600" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-1 animate-in slide-in-from-top-4">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = effectiveTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full px-4 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-between ${
                  isActive ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-2 py-0.5 bg-blue-600 text-white text-[10px] font-bold rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-3 border-t border-slate-100 space-y-1">
            <button
              onClick={() => handleNavClick('profile')}
              className="w-full px-4 py-2.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"
            >
              <User className="w-4 h-4 text-slate-400" />
              <span>Profile & Travel DNA</span>
            </button>
            <button
              onClick={() => handleNavClick('admin')}
              className="w-full px-4 py-2.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"
            >
              <ShieldCheck className="w-4 h-4 text-slate-400" />
              <span>Admin Management Dashboard</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
