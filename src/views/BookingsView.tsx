import React, { useState, useEffect } from 'react';
import { 
  Ticket, 
  Plane, 
  Train, 
  Bus, 
  Hotel, 
  Package, 
  Car, 
  Search, 
  Calendar, 
  User, 
  CreditCard, 
  ShieldCheck, 
  CheckCircle2, 
  X, 
  AlertCircle, 
  Download, 
  Printer, 
  FileText,
  Clock
} from 'lucide-react';
import { Booking } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { BookingCheckoutModal } from '../components/BookingCheckoutModal';
import { InvoiceModal } from '../components/InvoiceModal';
import { NavTab } from '../components/Navbar';

interface BookingsViewProps {
  onNavigate: (tab: NavTab, params?: any) => void;
}

export const BookingsView: React.FC<BookingsViewProps> = ({ onNavigate }) => {
  const { user, refreshProfile } = useAuth();
  const { success, error } = useToast();

  const [activeServiceTab, setActiveServiceTab] = useState<'flight' | 'train' | 'bus' | 'hotel' | 'package' | 'explorer'>('flight');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [historyFilter, setHistoryFilter] = useState<'all' | 'confirmed' | 'completed' | 'cancelled'>('all');
  const [selectedInvoiceBooking, setSelectedInvoiceBooking] = useState<Booking | null>(null);

  // Search form state
  const [origin, setOrigin] = useState('New Delhi (DEL)');
  const [destination, setDestination] = useState('Goa (GOI)');
  const [departureDate, setDepartureDate] = useState(new Date().toISOString().split('T')[0]);
  const [passengers, setPassengers] = useState(1);
  const [travelClass, setTravelClass] = useState('Economy');
  const [hotelRoomType, setHotelRoomType] = useState('Deluxe King View');

  // Checkout modal state
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [checkoutPayload, setCheckoutPayload] = useState<{
    serviceType: Booking['serviceType'];
    title: string;
    destinationName: string;
    basePrice: number;
    details: Record<string, any>;
  }>({
    serviceType: 'flight',
    title: '',
    destinationName: '',
    basePrice: 120,
    details: {}
  });

  const loadBookings = async () => {
    try {
      const list = await api.getBookings();
      setBookings(list);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleSearchAndBook = (e: React.FormEvent) => {
    e.preventDefault();

    let basePrice = 140;
    let title = '';
    let details: Record<string, any> = {};

    if (activeServiceTab === 'flight') {
      basePrice = travelClass === 'Business' ? 380 : 120;
      title = `Air Explorer Flight: ${origin.split(' ')[0]} ➔ ${destination.split(' ')[0]}`;
      details = { flightNumber: 'AX-402', seatClass: travelClass, baggage: '15kg Check-in + 7kg Cabin' };
    } else if (activeServiceTab === 'train') {
      basePrice = 45;
      title = `Vande Express Superfast: ${origin.split(' ')[0]} ➔ ${destination.split(' ')[0]}`;
      details = { trainNumber: '12004', coach: 'Executive Chair Car', departureStation: origin };
    } else if (activeServiceTab === 'bus') {
      basePrice = 28;
      title = `WanderAir AC Sleeper Multi-Axle: ${origin.split(' ')[0]} ➔ ${destination.split(' ')[0]}`;
      details = { busType: 'Volvo 9600 Multi-Axle AC Sleeper', boardingPoint: 'Main Central Terminal' };
    } else if (activeServiceTab === 'hotel') {
      basePrice = 180;
      title = `Grand Heritage Resort & Spa (${hotelRoomType})`;
      details = { hotelName: 'Grand Heritage Resort & Spa', roomType: hotelRoomType, checkInTime: '14:00' };
    } else if (activeServiceTab === 'explorer') {
      onNavigate('explorer');
      return;
    } else if (activeServiceTab === 'package') {
      onNavigate('packages');
      return;
    }

    setCheckoutPayload({
      serviceType: activeServiceTab,
      title,
      destinationName: destination,
      basePrice,
      details
    });
    setCheckoutModalOpen(true);
  };

  const filteredBookings = bookings.filter(b => {
    if (historyFilter === 'all') return true;
    return b.status === historyFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 pb-16">
      {/* Header */}
      <div className="pt-4">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 uppercase tracking-wider">
          <Ticket className="w-4 h-4" />
          Multi-Modal Booking Portal
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
          Instant Reservations, E-Tickets & Tax Invoices
        </h1>
      </div>

      {/* 1. Multi-Modal Booking Form Box */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Service Type Tabs */}
        <div className="grid grid-cols-3 sm:grid-cols-6 border-b border-slate-100 bg-slate-50/50 p-2 gap-1 text-xs">
          {[
            { id: 'flight', label: 'Flights', icon: Plane },
            { id: 'hotel', label: 'Hotels', icon: Hotel },
            { id: 'train', label: 'Trains', icon: Train },
            { id: 'bus', label: 'Buses', icon: Bus },
            { id: 'explorer', label: 'Explorer Cabs', icon: Car },
            { id: 'package', label: 'Packages', icon: Package }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeServiceTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveServiceTab(tab.id as any)}
                className={`py-3 px-2 rounded-xl font-bold flex flex-col sm:flex-row items-center justify-center gap-2 transition-all ${
                  isActive
                    ? 'bg-white text-sky-700 shadow-sm border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-sky-600' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search & Booking Input Panel */}
        <form onSubmit={handleSearchAndBook} className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">From / Origin City</label>
              <input
                type="text"
                required
                value={origin}
                onChange={e => setOrigin(e.target.value)}
                placeholder="e.g. New Delhi, Mumbai, London"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">To / Destination</label>
              <input
                type="text"
                required
                value={destination}
                onChange={e => setDestination(e.target.value)}
                placeholder="e.g. Goa, Bali, Interlaken, Kyoto"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-sky-600" />
                Travel Date
              </label>
              <input
                type="date"
                required
                value={departureDate}
                onChange={e => setDepartureDate(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {activeServiceTab === 'hotel' ? 'Room Category' : 'Cabin / Seat Class'}
              </label>
              {activeServiceTab === 'hotel' ? (
                <select
                  value={hotelRoomType}
                  onChange={e => setHotelRoomType(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-sky-500 focus:outline-none"
                >
                  <option value="Superior Mountain View">Superior Mountain View ($140/night)</option>
                  <option value="Deluxe King View">Deluxe King View ($180/night)</option>
                  <option value="Presidential Suite Villa">Presidential Suite Villa ($320/night)</option>
                </select>
              ) : (
                <select
                  value={travelClass}
                  onChange={e => setTravelClass(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-sky-500 focus:outline-none"
                >
                  <option value="Economy">Economy Class</option>
                  <option value="Premium Economy">Premium Economy</option>
                  <option value="Business">Business Class</option>
                </select>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Instant electronic confirmation • 100% Wallet Refund on 24h Cancellation</span>
            </div>

            <button
              type="submit"
              className="px-8 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <span>Search & Instant Reserve</span>
              <Ticket className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>

      {/* 2. Unified Booking History & Invoices */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-xl font-bold text-slate-900">Your Booking Records & E-Tickets</h2>

          {/* Status filter chips */}
          <div className="flex gap-1.5 overflow-x-auto">
            {(['all', 'confirmed', 'completed', 'cancelled'] as const).map(f => (
              <button
                key={f}
                onClick={() => setHistoryFilter(f)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-colors ${
                  historyFilter === f
                    ? 'bg-slate-900 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {filteredBookings.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
            <Ticket className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">No bookings in this category</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Book a verified flight, hotel, package, or Explorer ride above to see your electronic tickets here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredBookings.map(b => (
              <div
                key={b.id}
                className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-sky-300 transition-colors"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      b.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' :
                      b.status === 'completed' ? 'bg-sky-100 text-sky-800' :
                      'bg-rose-100 text-rose-800'
                    }`}>
                      {b.status}
                    </span>
                    <span className="text-xs font-bold text-slate-400 font-mono">#{b.id}</span>
                    <span className="text-xs font-semibold text-sky-700 capitalize bg-sky-50 px-2 py-0.5 rounded-md">
                      {b.serviceType}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900">{b.title}</h3>
                  <div className="text-xs text-slate-500 flex flex-wrap items-center gap-3">
                    <span>📍 {b.destinationName}</span>
                    <span>📅 Travel: {b.travelDate}</span>
                    <span>👥 {b.passengersCount} Guest(s)</span>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-3 sm:pt-0 gap-2">
                  <div className="text-left sm:text-right">
                    <div className="text-[10px] text-slate-400 font-medium">Grand Total</div>
                    <div className="text-base font-black text-slate-900">${b.totalAmount}</div>
                  </div>

                  <button
                    onClick={() => setSelectedInvoiceBooking(b)}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>View E-Ticket & Invoice</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Booking Checkout Modal */}
      <BookingCheckoutModal
        isOpen={checkoutModalOpen}
        onClose={() => setCheckoutModalOpen(false)}
        serviceType={checkoutPayload.serviceType}
        title={checkoutPayload.title}
        destinationName={checkoutPayload.destinationName}
        basePrice={checkoutPayload.basePrice}
        details={checkoutPayload.details}
        onBookingSuccess={(b) => {
          setBookings(prev => [b, ...prev]);
          loadBookings();
        }}
      />

      {/* Invoice & Cancellation Modal */}
      <InvoiceModal
        booking={selectedInvoiceBooking}
        isOpen={!!selectedInvoiceBooking}
        onClose={() => setSelectedInvoiceBooking(null)}
        onBookingCancelled={() => {
          loadBookings();
          refreshProfile();
        }}
      />
    </div>
  );
};
