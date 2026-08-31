import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider, useToast } from './context/ToastContext';
import { Navbar, NavTab } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { BookingCheckoutModal } from './components/BookingCheckoutModal';

// Views
import { HomeView } from './views/HomeView';
import { DestinationsView } from './views/DestinationsView';
import { PackagesView } from './views/PackagesView';
import { ExploreView } from './views/ExploreView';
import { TheExplorerView } from './views/TheExplorerView';
import { AIAssistantView } from './views/AIAssistantView';
import { BookingsView } from './views/BookingsView';
import { MyTripsDashboardView } from './views/MyTripsDashboardView';
import { MagicMomentsView } from './views/MagicMomentsView';
import { WalletView } from './views/WalletView';
import { ProfileView } from './views/ProfileView';
import { AdminView } from './views/AdminView';
import { Destination, TravelPackage } from './types';

const MainAppContent: React.FC = () => {
  const { user } = useAuth();
  const { success, error } = useToast();

  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');

  // Navigation parameters passed across views
  const [navParams, setNavParams] = useState<Record<string, any>>({});

  // Direct package booking modal state
  const [bookingPkgModalOpen, setBookingPkgModalOpen] = useState<boolean>(false);
  const [selectedPkgForBooking, setSelectedPkgForBooking] = useState<TravelPackage | null>(null);

  // Selected destination for deep-linking into destination detail
  const [selectedDestinationForModal, setSelectedDestinationForModal] = useState<Destination | null>(null);

  const handleNavigate = (tab: NavTab, params?: Record<string, any>) => {
    setActiveTab(tab);
    if (params) {
      setNavParams(params);
    } else {
      setNavParams({});
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBookPackage = (pkg: TravelPackage) => {
    setSelectedPkgForBooking(pkg);
    setBookingPkgModalOpen(true);
  };

  const handleSelectDestination = (dest: Destination) => {
    setSelectedDestinationForModal(dest);
    setActiveTab('destinations');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-sky-500 selection:text-white">
      {/* Top Main Navigation */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={handleNavigate}
        onOpenAuth={(mode) => {
          setAuthModalMode(mode);
          setAuthModalOpen(true);
        }}
      />

      {/* Main Content View Switcher */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <HomeView
            onNavigate={handleNavigate}
            onBookPackage={handleBookPackage}
            onSelectDestination={handleSelectDestination}
          />
        )}

        {activeTab === 'destinations' && (
          <DestinationsView
            initialSearch={navParams.search || ''}
            initialVibe={navParams.vibe || 'all'}
            onNavigate={handleNavigate}
            onBookPackage={handleBookPackage}
            selectedDestinationFromParent={selectedDestinationForModal}
            onClearSelectedDestination={() => setSelectedDestinationForModal(null)}
          />
        )}

        {activeTab === 'packages' && (
          <PackagesView
            onNavigate={handleNavigate}
            onBookPackage={handleBookPackage}
          />
        )}

        {activeTab === 'explore' && (
          <ExploreView
            onNavigate={handleNavigate}
            onSelectDestination={handleSelectDestination}
          />
        )}

        {activeTab === 'explorer' && (
          <TheExplorerView
            initialDestination={navParams.destination || ''}
            onNavigate={handleNavigate}
          />
        )}

        {activeTab === 'ai' && (
          <AIAssistantView
            initialPrompt={navParams.initialPrompt || ''}
            initialDestinationId={navParams.destinationId || ''}
            onNavigate={handleNavigate}
          />
        )}

        {activeTab === 'bookings' && (
          <BookingsView onNavigate={handleNavigate} />
        )}

        {activeTab === 'mytrips' && (
          <MyTripsDashboardView onNavigate={handleNavigate} />
        )}

        {activeTab === 'moments' && (
          <MagicMomentsView />
        )}

        {activeTab === 'wallet' && (
          <WalletView />
        )}

        {activeTab === 'profile' && (
          <ProfileView onNavigate={handleNavigate} />
        )}

        {activeTab === 'admin' && (
          <AdminView />
        )}
      </main>

      {/* Footer */}
      <Footer onSelectTab={handleNavigate} />

      {/* Global Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authModalMode}
      />

      {/* Direct Package Booking Checkout Modal */}
      {selectedPkgForBooking && (
        <BookingCheckoutModal
          isOpen={bookingPkgModalOpen}
          onClose={() => {
            setBookingPkgModalOpen(false);
            setSelectedPkgForBooking(null);
          }}
          serviceType="package"
          title={selectedPkgForBooking.title}
          destinationName={selectedPkgForBooking.title}
          basePrice={selectedPkgForBooking.startingPrice}
          details={{
            packageId: selectedPkgForBooking.id,
            duration: selectedPkgForBooking.duration,
            hotelTier: selectedPkgForBooking.inclusions.hotelTier,
            transport: selectedPkgForBooking.inclusions.transportType
          }}
          onBookingSuccess={(b) => {
            success('Package Confirmed!', `Booking #${b.id} reserved. Check My Trips for details.`);
            setActiveTab('bookings');
          }}
        />
      )}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ToastProvider>
      <AuthProvider>
        <MainAppContent />
      </AuthProvider>
    </ToastProvider>
  );
};

export default App;
