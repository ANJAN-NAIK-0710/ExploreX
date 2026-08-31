import fs from 'fs';
import path from 'path';
import { 
  Destination, 
  TravelPackage, 
  UserProfile, 
  Booking, 
  ExplorerRide, 
  MagicMomentAlbum, 
  MagicMomentPhoto, 
  Review, 
  WalletTransaction, 
  GroupTrip, 
  GroupExpense,
  SettlementDebt
} from '../src/types';
import { 
  INITIAL_DESTINATIONS, 
  INITIAL_PACKAGES, 
  INITIAL_USER_PROFILE, 
  INITIAL_REVIEWS, 
  INITIAL_GROUP_TRIPS 
} from './data/initialData';
import { INDIA_EXPANDED_DESTINATIONS } from './data/indiaDestinationsData';
import { INDIA_REGIONAL_DESTINATIONS } from './data/indiaRegionalDestinations';

export const ALL_COMBINED_INITIAL_DESTINATIONS: Destination[] = [
  ...INDIA_EXPANDED_DESTINATIONS,
  ...INDIA_REGIONAL_DESTINATIONS,
  ...INITIAL_DESTINATIONS.filter(d => 
    !INDIA_EXPANDED_DESTINATIONS.some(i => i.id === d.id) &&
    !INDIA_REGIONAL_DESTINATIONS.some(i => i.id === d.id)
  )
];

export interface AppDatabase {
  users: Record<string, UserProfile>;
  destinations: Destination[];
  packages: TravelPackage[];
  bookings: Booking[];
  explorerRides: ExplorerRide[];
  magicAlbums: MagicMomentAlbum[];
  magicPhotos: MagicMomentPhoto[];
  reviews: Review[];
  walletTransactions: WalletTransaction[];
  groupTrips: GroupTrip[];
  offers: {
    id: string;
    code: string;
    discountPct: number;
    maxDiscount: number;
    title: string;
    description: string;
    validTill: string;
  }[];
}

const DB_FILE_PATH = path.join(process.cwd(), 'data_store.json');

const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'BKG-2026-8812',
    userId: 'usr-current',
    serviceType: 'package',
    title: 'Bali Tropical Luxury & Cultural Odyssey',
    destinationName: 'Bali, Indonesia',
    bookingDate: '2026-08-25T11:00:00Z',
    travelDate: '2026-10-05',
    returnDate: '2026-10-10',
    passengersCount: 2,
    passengerDetails: [
      { name: 'Soham Nemade', age: 28, gender: 'Male', seatNumber: 'Villa 102' },
      { name: 'Priya Sharma', age: 27, gender: 'Female', seatNumber: 'Villa 102' }
    ],
    totalAmount: 1300,
    status: 'confirmed',
    paymentMethod: 'wallet',
    paymentStatus: 'paid',
    isSimulation: true,
    details: {
      providerName: 'WanderAI Luxury Escapes',
      packageId: 'pkg-bali-escape',
      packageDuration: '6 Days / 5 Nights',
      hotelName: 'The Kayon Jungle Resort & W Seminyak',
      pnrNumber: 'WAI-BL-99218'
    },
    invoice: {
      invoiceNo: 'INV-2026-9041',
      baseFare: 1220,
      taxes: 120,
      discounts: 40,
      grandTotal: 1300,
      generatedAt: '2026-08-25T11:05:00Z'
    }
  },
  {
    id: 'BKG-2026-4401',
    userId: 'usr-current',
    serviceType: 'hotel',
    title: 'Victoria-Jungfrau Grand Alpine Suite',
    destinationName: 'Interlaken, Switzerland',
    bookingDate: '2026-08-15T09:30:00Z',
    travelDate: '2026-12-15',
    returnDate: '2026-12-19',
    passengersCount: 2,
    passengerDetails: [
      { name: 'Soham Nemade', age: 28, gender: 'Male' }
    ],
    totalAmount: 760,
    status: 'confirmed',
    paymentMethod: 'card_demo',
    paymentStatus: 'paid',
    isSimulation: true,
    details: {
      hotelName: 'Victoria-Jungfrau Grand Hotel & Spa',
      roomType: 'Superior Alpine View Junior Suite',
      checkInTime: '15:00',
      checkOutTime: '11:00'
    },
    invoice: {
      invoiceNo: 'INV-2026-4401',
      baseFare: 700,
      taxes: 60,
      discounts: 0,
      grandTotal: 760,
      generatedAt: '2026-08-15T09:35:00Z'
    }
  }
];

const INITIAL_MAGIC_ALBUMS: MagicMomentAlbum[] = [
  {
    id: 'alb-1',
    userId: 'usr-current',
    title: 'Kyoto Autumn Memories 2025',
    destinationName: 'Kyoto, Japan',
    tripStartDate: '2025-11-10',
    tripEndDate: '2025-11-18',
    coverPhotoUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80',
    photosCount: 3,
    totalSizeBytes: 3840000 // 3.84 MB
  },
  {
    id: 'alb-2',
    userId: 'usr-current',
    title: 'Amalfi Coast Highlights',
    destinationName: 'Amalfi Coast, Italy',
    tripStartDate: '2024-07-04',
    tripEndDate: '2024-07-10',
    coverPhotoUrl: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=600&q=80',
    photosCount: 2,
    totalSizeBytes: 2400000 // 2.4 MB
  }
];

const INITIAL_MAGIC_PHOTOS: MagicMomentPhoto[] = [
  {
    id: 'pho-1',
    userId: 'usr-current',
    albumId: 'alb-1',
    url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1000&q=80',
    caption: 'Golden morning light filtering through the towering Arashiyama Bamboo Grove',
    locationName: 'Arashiyama, Kyoto',
    takenAt: '2025-11-12T07:15:00Z',
    fileSizeBytes: 1420000,
    mediaType: 'image',
    tags: ['Nature', 'Morning', 'Kyoto']
  },
  {
    id: 'pho-2',
    userId: 'usr-current',
    albumId: 'alb-1',
    url: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1000&q=80',
    caption: 'Traditional red lanterns outside Senso-ji temple during festival week',
    locationName: 'Asakusa, Tokyo',
    takenAt: '2025-11-15T18:30:00Z',
    fileSizeBytes: 1220000,
    mediaType: 'image',
    tags: ['Heritage', 'Lanterns', 'Night']
  },
  {
    id: 'pho-3',
    userId: 'usr-current',
    albumId: 'alb-1',
    url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1000&q=80',
    caption: 'Majestic view of Mount Fuji reflected in Lake Kawaguchiko',
    locationName: 'Lake Kawaguchiko',
    takenAt: '2025-11-16T10:00:00Z',
    fileSizeBytes: 1200000,
    mediaType: 'image',
    tags: ['MtFuji', 'Landscape']
  },
  {
    id: 'pho-4',
    userId: 'usr-current',
    albumId: 'alb-2',
    url: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1000&q=80',
    caption: 'Pastel cliffside villas cascading down to the Mediterranean sea in Positano',
    locationName: 'Positano, Amalfi',
    takenAt: '2024-07-06T19:00:00Z',
    fileSizeBytes: 1350000,
    mediaType: 'image',
    tags: ['Amalfi', 'Sunset', 'Sea']
  },
  {
    id: 'pho-5',
    userId: 'usr-current',
    albumId: 'alb-2',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
    caption: 'Crystal azure waters on a private boat tour along the Capri grottos',
    locationName: 'Capri Island',
    takenAt: '2024-07-08T13:20:00Z',
    fileSizeBytes: 1050000,
    mediaType: 'image',
    tags: ['Capri', 'BoatTour', 'Azure']
  }
];

const INITIAL_WALLET_TXNS: WalletTransaction[] = [
  {
    id: 'txn-101',
    userId: 'usr-current',
    amount: 500,
    type: 'credit',
    source: 'topup_demo',
    description: 'Instant Wallet Top-up (Demo Mode UPI/Card)',
    timestamp: '2026-08-20T10:00:00Z',
    status: 'success',
    referenceId: 'UPI-DEMO-991823'
  },
  {
    id: 'txn-102',
    userId: 'usr-current',
    amount: 50,
    type: 'debit',
    source: 'ride_payment',
    description: 'The Explorer Cab ride - Airport transfer',
    timestamp: '2026-08-22T14:30:00Z',
    status: 'success',
    referenceId: 'RID-88219'
  }
];

const INITIAL_OFFERS = [
  {
    id: 'off-wander20',
    code: 'WANDER20',
    discountPct: 20,
    maxDiscount: 150,
    title: 'First Trip Explorer Welcome',
    description: 'Flat 20% off on all international and domestic holiday packages.',
    validTill: '2026-12-31'
  },
  {
    id: 'off-aipeak',
    code: 'AIPEAK10',
    discountPct: 10,
    maxDiscount: 75,
    title: 'Smart Autumn Travel Special',
    description: '10% instant discount on flights and verified hotel stays.',
    validTill: '2026-11-30'
  },
  {
    id: 'off-rideshare',
    code: 'EXPLOREFREE',
    discountPct: 100,
    maxDiscount: 15,
    title: 'Free First Explorer Cab Ride',
    description: 'Up to $15 off on your first Explorer city ride or e-scooter rental.',
    validTill: '2026-12-31'
  }
];

class DatabaseManager {
  private data: AppDatabase;

  constructor() {
    this.data = this.loadDatabase();
  }

  private loadDatabase(): AppDatabase {
    try {
      if (fs.existsSync(DB_FILE_PATH)) {
        const raw = fs.readFileSync(DB_FILE_PATH, 'utf-8');
        const parsed = JSON.parse(raw);
        
        // Merge stored destinations with any newly added expanded Indian destinations
        const existingDests: Destination[] = parsed.destinations || [];
        const mergedDestinations = [...ALL_COMBINED_INITIAL_DESTINATIONS];
        for (const existing of existingDests) {
          const idx = mergedDestinations.findIndex(d => d.id === existing.id);
          if (idx === -1) {
            mergedDestinations.push(existing);
          }
        }

        return {
          users: parsed.users || { 'usr-current': INITIAL_USER_PROFILE },
          destinations: mergedDestinations,
          packages: parsed.packages?.length ? parsed.packages : INITIAL_PACKAGES,
          bookings: parsed.bookings || INITIAL_BOOKINGS,
          explorerRides: parsed.explorerRides || [],
          magicAlbums: parsed.magicAlbums || INITIAL_MAGIC_ALBUMS,
          magicPhotos: parsed.magicPhotos || INITIAL_MAGIC_PHOTOS,
          reviews: parsed.reviews?.length ? parsed.reviews : INITIAL_REVIEWS,
          walletTransactions: parsed.walletTransactions || INITIAL_WALLET_TXNS,
          groupTrips: parsed.groupTrips?.length ? parsed.groupTrips : INITIAL_GROUP_TRIPS,
          offers: parsed.offers || INITIAL_OFFERS
        };
      }
    } catch (err) {
      console.warn('Could not read existing database file, initializing defaults:', err);
    }

    const defaultDb: AppDatabase = {
      users: { 'usr-current': INITIAL_USER_PROFILE },
      destinations: ALL_COMBINED_INITIAL_DESTINATIONS,
      packages: INITIAL_PACKAGES,
      bookings: INITIAL_BOOKINGS,
      explorerRides: [],
      magicAlbums: INITIAL_MAGIC_ALBUMS,
      magicPhotos: INITIAL_MAGIC_PHOTOS,
      reviews: INITIAL_REVIEWS,
      walletTransactions: INITIAL_WALLET_TXNS,
      groupTrips: INITIAL_GROUP_TRIPS,
      offers: INITIAL_OFFERS
    };
    this.saveDatabase(defaultDb);
    return defaultDb;
  }

  private saveDatabase(db?: AppDatabase) {
    try {
      const dataToSave = db || this.data;
      fs.writeFileSync(DB_FILE_PATH, JSON.stringify(dataToSave, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write database file:', err);
    }
  }

  // Users
  getUser(userId: string = 'usr-current'): UserProfile {
    if (!this.data.users[userId]) {
      this.data.users[userId] = { ...INITIAL_USER_PROFILE, id: userId };
      this.saveDatabase();
    }
    return this.data.users[userId];
  }

  updateUser(userId: string, updates: Partial<UserProfile>): UserProfile {
    const current = this.getUser(userId);
    const updated = { ...current, ...updates };
    this.data.users[userId] = updated;
    this.saveDatabase();
    return updated;
  }

  deleteUser(userId: string): boolean {
    if (this.data.users[userId]) {
      delete this.data.users[userId];
      this.saveDatabase();
      return true;
    }
    return false;
  }

  // Destinations
  getDestinations(): Destination[] {
    return this.data.destinations;
  }

  getDestinationById(id: string): Destination | undefined {
    return this.data.destinations.find(d => d.id === id);
  }

  createDestination(dest: Destination): Destination {
    this.data.destinations.push(dest);
    this.saveDatabase();
    return dest;
  }

  updateDestination(id: string, updates: Partial<Destination>): Destination | null {
    const idx = this.data.destinations.findIndex(d => d.id === id);
    if (idx === -1) return null;
    this.data.destinations[idx] = { ...this.data.destinations[idx], ...updates };
    this.saveDatabase();
    return this.data.destinations[idx];
  }

  deleteDestination(id: string): boolean {
    const initialLen = this.data.destinations.length;
    this.data.destinations = this.data.destinations.filter(d => d.id !== id);
    if (this.data.destinations.length !== initialLen) {
      this.saveDatabase();
      return true;
    }
    return false;
  }

  // Packages
  getPackages(): TravelPackage[] {
    return this.data.packages;
  }

  getPackageById(id: string): TravelPackage | undefined {
    return this.data.packages.find(p => p.id === id);
  }

  createPackage(pkg: TravelPackage): TravelPackage {
    this.data.packages.push(pkg);
    this.saveDatabase();
    return pkg;
  }

  updatePackage(id: string, updates: Partial<TravelPackage>): TravelPackage | null {
    const idx = this.data.packages.findIndex(p => p.id === id);
    if (idx === -1) return null;
    this.data.packages[idx] = { ...this.data.packages[idx], ...updates };
    this.saveDatabase();
    return this.data.packages[idx];
  }

  deletePackage(id: string): boolean {
    const initialLen = this.data.packages.length;
    this.data.packages = this.data.packages.filter(p => p.id !== id);
    if (this.data.packages.length !== initialLen) {
      this.saveDatabase();
      return true;
    }
    return false;
  }

  // Bookings
  getBookings(userId: string = 'usr-current'): Booking[] {
    return this.data.bookings.filter(b => b.userId === userId);
  }

  getAllBookings(): Booking[] {
    return this.data.bookings;
  }

  getBookingById(id: string): Booking | undefined {
    return this.data.bookings.find(b => b.id === id);
  }

  createBooking(booking: Booking): Booking {
    this.data.bookings.unshift(booking);
    
    // If paid by wallet, deduct
    if (booking.paymentMethod === 'wallet') {
      const user = this.getUser(booking.userId);
      user.walletBalance = Math.max(0, user.walletBalance - booking.totalAmount);
      this.updateUser(booking.userId, { walletBalance: user.walletBalance });

      this.createWalletTransaction({
        id: `txn-${Date.now()}`,
        userId: booking.userId,
        amount: booking.totalAmount,
        type: 'debit',
        source: 'booking_payment',
        description: `Booking confirmed: ${booking.title}`,
        timestamp: new Date().toISOString(),
        status: 'success',
        referenceId: booking.id
      });
    }

    this.saveDatabase();
    return booking;
  }

  cancelBooking(id: string, userId: string = 'usr-current'): { booking: Booking; refundAmount: number } | null {
    const bkg = this.data.bookings.find(b => b.id === id && (b.userId === userId || userId === 'admin'));
    if (!bkg) return null;
    if (bkg.status === 'cancelled') return { booking: bkg, refundAmount: 0 };

    bkg.status = 'cancelled';
    bkg.paymentStatus = 'refunded';
    const refundAmount = bkg.totalAmount;

    // Refund directly to user's wallet
    const user = this.getUser(bkg.userId);
    user.walletBalance += refundAmount;
    this.updateUser(bkg.userId, { walletBalance: user.walletBalance });

    this.createWalletTransaction({
      id: `txn-ref-${Date.now()}`,
      userId: bkg.userId,
      amount: refundAmount,
      type: 'credit',
      source: 'refund',
      description: `Full refund for cancelled booking #${bkg.id}`,
      timestamp: new Date().toISOString(),
      status: 'success',
      referenceId: bkg.id
    });

    this.saveDatabase();
    return { booking: bkg, refundAmount };
  }

  // The Explorer Rides
  getRides(userId: string = 'usr-current'): ExplorerRide[] {
    return this.data.explorerRides.filter(r => r.userId === userId);
  }

  getRideById(id: string): ExplorerRide | undefined {
    return this.data.explorerRides.find(r => r.id === id);
  }

  createRide(ride: ExplorerRide): ExplorerRide {
    this.data.explorerRides.unshift(ride);
    this.saveDatabase();
    return ride;
  }

  updateRide(id: string, updates: Partial<ExplorerRide>): ExplorerRide | null {
    const idx = this.data.explorerRides.findIndex(r => r.id === id);
    if (idx === -1) return null;
    this.data.explorerRides[idx] = { ...this.data.explorerRides[idx], ...updates };
    this.saveDatabase();
    return this.data.explorerRides[idx];
  }

  // Magic Moments
  getAlbums(userId: string = 'usr-current'): MagicMomentAlbum[] {
    return this.data.magicAlbums.filter(a => a.userId === userId);
  }

  getPhotosByAlbum(albumId: string, userId: string = 'usr-current'): MagicMomentPhoto[] {
    return this.data.magicPhotos.filter(p => p.albumId === albumId && p.userId === userId);
  }

  getUserStorageUsage(userId: string = 'usr-current'): { usedBytes: number; quotaBytes: number; percentage: number } {
    const photos = this.data.magicPhotos.filter(p => p.userId === userId);
    const usedBytes = photos.reduce((acc, p) => acc + (p.fileSizeBytes || 0), 0);
    const quotaBytes = 20 * 1024 * 1024; // 20 MB strictly per requirement
    const percentage = Math.min(100, Math.round((usedBytes / quotaBytes) * 100));
    return { usedBytes, quotaBytes, percentage };
  }

  createAlbum(album: MagicMomentAlbum): MagicMomentAlbum {
    this.data.magicAlbums.unshift(album);
    this.saveDatabase();
    return album;
  }

  deleteAlbum(albumId: string, userId: string = 'usr-current'): boolean {
    this.data.magicAlbums = this.data.magicAlbums.filter(a => !(a.id === albumId && a.userId === userId));
    this.data.magicPhotos = this.data.magicPhotos.filter(p => !(p.albumId === albumId && p.userId === userId));
    this.saveDatabase();
    return true;
  }

  createPhoto(photo: MagicMomentPhoto): MagicMomentPhoto {
    this.data.magicPhotos.unshift(photo);
    // Update album count and size
    const album = this.data.magicAlbums.find(a => a.id === photo.albumId);
    if (album) {
      album.photosCount += 1;
      album.totalSizeBytes += photo.fileSizeBytes;
      if (!album.coverPhotoUrl) {
        album.coverPhotoUrl = photo.url;
      }
    }
    this.saveDatabase();
    return photo;
  }

  deletePhoto(photoId: string, userId: string = 'usr-current'): boolean {
    const photo = this.data.magicPhotos.find(p => p.id === photoId && p.userId === userId);
    if (!photo) return false;

    const album = this.data.magicAlbums.find(a => a.id === photo.albumId);
    if (album) {
      album.photosCount = Math.max(0, album.photosCount - 1);
      album.totalSizeBytes = Math.max(0, album.totalSizeBytes - photo.fileSizeBytes);
    }

    this.data.magicPhotos = this.data.magicPhotos.filter(p => p.id !== photoId);
    this.saveDatabase();
    return true;
  }

  // Reviews
  getReviews(targetType?: string, targetId?: string): Review[] {
    let list = this.data.reviews;
    if (targetType) list = list.filter(r => r.targetType === targetType);
    if (targetId) list = list.filter(r => r.targetId === targetId);
    return list;
  }

  createReview(review: Review): { success: boolean; message: string; review?: Review } {
    // Check duplicate review by same user for same target
    const existing = this.data.reviews.find(
      r => r.userId === review.userId && r.targetId === review.targetId && r.targetType === review.targetType
    );
    if (existing) {
      return { success: false, message: 'You have already reviewed this item. You can edit your existing review.' };
    }

    this.data.reviews.unshift(review);
    this.saveDatabase();
    return { success: true, message: 'Review published successfully!', review };
  }

  updateReview(reviewId: string, userId: string, updates: Partial<Review>): Review | null {
    const idx = this.data.reviews.findIndex(r => r.id === reviewId && (r.userId === userId || userId === 'admin'));
    if (idx === -1) return null;
    this.data.reviews[idx] = { ...this.data.reviews[idx], ...updates };
    this.saveDatabase();
    return this.data.reviews[idx];
  }

  deleteReview(reviewId: string, userId: string): boolean {
    const initialLen = this.data.reviews.length;
    this.data.reviews = this.data.reviews.filter(r => !(r.id === reviewId && (r.userId === userId || userId === 'admin')));
    if (this.data.reviews.length !== initialLen) {
      this.saveDatabase();
      return true;
    }
    return false;
  }

  // Wallet
  getWalletTransactions(userId: string = 'usr-current'): WalletTransaction[] {
    return this.data.walletTransactions.filter(t => t.userId === userId);
  }

  createWalletTransaction(txn: WalletTransaction): WalletTransaction {
    this.data.walletTransactions.unshift(txn);
    this.saveDatabase();
    return txn;
  }

  topupWallet(userId: string, amount: number, method: string): { user: UserProfile; transaction: WalletTransaction } {
    const user = this.getUser(userId);
    user.walletBalance = Number((user.walletBalance + amount).toFixed(2));
    this.updateUser(userId, { walletBalance: user.walletBalance });

    const transaction: WalletTransaction = {
      id: `txn-${Date.now()}`,
      userId,
      amount,
      type: 'credit',
      source: 'topup_demo',
      description: `Wallet instant reload via ${method} (DEMO SIMULATION)`,
      timestamp: new Date().toISOString(),
      status: 'success',
      referenceId: `SIM-${Math.random().toString(36).substring(2, 9).toUpperCase()}`
    };
    this.createWalletTransaction(transaction);

    return { user, transaction };
  }

  // Group Expenses & Splitter
  getGroupTrips(userId: string = 'usr-current'): GroupTrip[] {
    return this.data.groupTrips.filter(g => g.userId === userId || g.members.some(m => m.id === userId));
  }

  getGroupTripById(id: string): GroupTrip | undefined {
    return this.data.groupTrips.find(g => g.id === id);
  }

  createGroupTrip(trip: GroupTrip): GroupTrip {
    this.data.groupTrips.unshift(trip);
    this.saveDatabase();
    return trip;
  }

  addExpenseToGroup(groupId: string, expense: GroupExpense): GroupTrip | null {
    const trip = this.data.groupTrips.find(g => g.id === groupId);
    if (!trip) return null;
    trip.expenses.unshift(expense);
    this.saveDatabase();
    return trip;
  }

  deleteExpenseFromGroup(groupId: string, expenseId: string): GroupTrip | null {
    const trip = this.data.groupTrips.find(g => g.id === groupId);
    if (!trip) return null;
    trip.expenses = trip.expenses.filter(e => e.id !== expenseId);
    this.saveDatabase();
    return trip;
  }

  // Calculate settlement matrix for group
  calculateGroupSettlement(groupId: string): { balances: Record<string, number>; settlements: SettlementDebt[] } {
    const trip = this.data.groupTrips.find(g => g.id === groupId);
    if (!trip) return { balances: {}, settlements: [] };

    const balances: Record<string, number> = {};
    const memberNameMap: Record<string, string> = {};

    trip.members.forEach(m => {
      balances[m.id] = 0;
      memberNameMap[m.id] = m.name;
    });

    trip.expenses.forEach(exp => {
      const payerId = exp.paidById;
      const splitCount = exp.splitAmongIds.length || 1;
      const splitAmt = exp.amount / splitCount;

      balances[payerId] = (balances[payerId] || 0) + exp.amount;

      exp.splitAmongIds.forEach(memberId => {
        balances[memberId] = (balances[memberId] || 0) - splitAmt;
      });
    });

    // Simplify debts using greedy approach
    const debtors: { id: string; amount: number }[] = [];
    const creditors: { id: string; amount: number }[] = [];

    Object.entries(balances).forEach(([id, amt]) => {
      const rounded = Number(amt.toFixed(2));
      if (rounded < -0.01) {
        debtors.push({ id, amount: -rounded });
      } else if (rounded > 0.01) {
        creditors.push({ id, amount: rounded });
      }
    });

    debtors.sort((a, b) => b.amount - a.amount);
    creditors.sort((a, b) => b.amount - a.amount);

    const settlements: SettlementDebt[] = [];
    let d = 0;
    let c = 0;

    while (d < debtors.length && c < creditors.length) {
      const debtor = debtors[d];
      const creditor = creditors[c];
      const minAmt = Math.min(debtor.amount, creditor.amount);

      if (minAmt > 0.01) {
        settlements.push({
          fromMemberId: debtor.id,
          fromMemberName: memberNameMap[debtor.id] || debtor.id,
          toMemberId: creditor.id,
          toMemberName: memberNameMap[creditor.id] || creditor.id,
          amount: Number(minAmt.toFixed(2))
        });
      }

      debtor.amount -= minAmt;
      creditor.amount -= minAmt;

      if (debtor.amount <= 0.01) d++;
      if (creditor.amount <= 0.01) c++;
    }

    return { balances, settlements };
  }

  // Offers
  getOffers() {
    return this.data.offers;
  }

  // Analytics for Admin
  getAdminAnalytics() {
    const totalBookings = this.data.bookings.length;
    const grossRevenue = this.data.bookings.reduce((sum, b) => b.status !== 'cancelled' ? sum + b.totalAmount : sum, 0);
    const totalUsers = Object.keys(this.data.users).length;
    const totalRides = this.data.explorerRides.length;
    const totalReviews = this.data.reviews.length;
    const avgRating = totalReviews > 0 
      ? Number((this.data.reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(2))
      : 4.8;

    const bookingsByService = {
      packages: this.data.bookings.filter(b => b.serviceType === 'package').length,
      hotels: this.data.bookings.filter(b => b.serviceType === 'hotel').length,
      flights: this.data.bookings.filter(b => b.serviceType === 'flight').length,
      trains: this.data.bookings.filter(b => b.serviceType === 'train').length,
      buses: this.data.bookings.filter(b => b.serviceType === 'bus').length,
      explorer: this.data.bookings.filter(b => b.serviceType === 'explorer').length
    };

    return {
      totalBookings,
      grossRevenue,
      totalUsers,
      totalRides,
      totalReviews,
      avgRating,
      bookingsByService,
      recentBookings: this.data.bookings.slice(0, 10),
      recentRides: this.data.explorerRides.slice(0, 10)
    };
  }

  resetToDefaults() {
    const defaultDb: AppDatabase = {
      users: { 'usr-current': INITIAL_USER_PROFILE },
      destinations: ALL_COMBINED_INITIAL_DESTINATIONS,
      packages: INITIAL_PACKAGES,
      bookings: INITIAL_BOOKINGS,
      explorerRides: [],
      magicAlbums: INITIAL_MAGIC_ALBUMS,
      magicPhotos: INITIAL_MAGIC_PHOTOS,
      reviews: INITIAL_REVIEWS,
      walletTransactions: INITIAL_WALLET_TXNS,
      groupTrips: INITIAL_GROUP_TRIPS,
      offers: INITIAL_OFFERS
    };
    this.data = defaultDb;
    this.saveDatabase(defaultDb);
    return defaultDb;
  }
}

export const db = new DatabaseManager();
