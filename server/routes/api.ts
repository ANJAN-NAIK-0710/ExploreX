import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { db } from '../db';
import { askTravelAssistant, generateAutopilotReplan, runWhatIfSimulation } from '../gemini';
import { Booking, ExplorerRide, MagicMomentAlbum, MagicMomentPhoto, Review, GroupTrip, GroupExpense, UserProfile } from '../../src/types';
import { EXPLORER_VEHICLES } from '../data/initialData';
<<<<<<< HEAD
import { balanceTourismDemand, balanceTourismDemandML } from '../services/demandBalancerService';
=======
import { balanceTourismDemand } from '../services/demandBalancerService';
>>>>>>> 5761e1be8e8eb21e40f31a92e4c8a271991f2933
import { searchCulturalSpecialties, getAlternativeRecommendations, getIndiaExplorerHierarchy } from '../services/culturalService';

export const apiRouter = Router();

// Ensure upload directory exists
const UPLOAD_DIR = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, `moment-${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 } // 15MB single file limit
});

// Helper for getting current user ID
const getCurrentUserId = (req: Request): string => {
  return (req.headers['x-user-id'] as string) || 'usr-current';
};

/* ============================================================
   1. AUTH & PROFILE ROUTES
   ============================================================ */

apiRouter.post('/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  const user = db.getUser('usr-current');
  res.json({
    token: 'jwt-simulated-token-99182',
    user
  });
});

apiRouter.post('/auth/signup', (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }
  const newUser = db.updateUser('usr-current', {
    name,
    email,
    joinedDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  });
  res.json({
    token: 'jwt-simulated-token-99182',
    user: newUser
  });
});

apiRouter.post('/auth/logout', (req: Request, res: Response) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

apiRouter.post('/auth/forgot-password', (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });
  res.json({ success: true, message: `Reset link and verification OTP sent to ${email}` });
});

apiRouter.get('/auth/profile', (req: Request, res: Response) => {
  const userId = getCurrentUserId(req);
  const user = db.getUser(userId);
  res.json(user);
});

apiRouter.put('/auth/profile', (req: Request, res: Response) => {
  const userId = getCurrentUserId(req);
  const updates = req.body;
  const updated = db.updateUser(userId, updates);
  res.json(updated);
});

apiRouter.post('/auth/preferences', (req: Request, res: Response) => {
  const userId = getCurrentUserId(req);
  const { preferences } = req.body;
  const user = db.updateUser(userId, { preferences });
  res.json(user);
});

apiRouter.post('/auth/toggle-save-destination', (req: Request, res: Response) => {
  const userId = getCurrentUserId(req);
  const { destinationId } = req.body;
  const user = db.getUser(userId);
  let saved = user.savedDestinations || [];
  if (saved.includes(destinationId)) {
    saved = saved.filter(id => id !== destinationId);
  } else {
    saved.push(destinationId);
  }
  const updated = db.updateUser(userId, { savedDestinations: saved });
  res.json(updated);
});

apiRouter.post('/auth/toggle-save-package', (req: Request, res: Response) => {
  const userId = getCurrentUserId(req);
  const { packageId } = req.body;
  const user = db.getUser(userId);
  let saved = user.savedPackages || [];
  if (saved.includes(packageId)) {
    saved = saved.filter(id => id !== packageId);
  } else {
    saved.push(packageId);
  }
  const updated = db.updateUser(userId, { savedPackages: saved });
  res.json(updated);
});

apiRouter.delete('/auth/account', (req: Request, res: Response) => {
  const userId = getCurrentUserId(req);
  db.deleteUser(userId);
  res.json({ success: true, message: 'Account permanently deleted.' });
});

/* ============================================================
   2. DESTINATIONS
   ============================================================ */

apiRouter.get('/destinations', (req: Request, res: Response) => {
  const { search, vibe, type } = req.query;
  let list = db.getDestinations();

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    list = list.filter(d => 
      d.name.toLowerCase().includes(q) || 
      d.country.toLowerCase().includes(q) ||
      d.tagline.toLowerCase().includes(q)
    );
  }

  if (vibe && typeof vibe === 'string' && vibe !== 'all') {
    list = list.filter(d => d.vibe.includes(vibe as any));
  }

  if (type === 'domestic') {
    list = list.filter(d => !d.isInternational);
  } else if (type === 'international') {
    list = list.filter(d => d.isInternational);
  }

  res.json(list);
});

apiRouter.get('/destinations/:id', (req: Request, res: Response) => {
  const dest = db.getDestinationById(req.params.id);
  if (!dest) return res.status(404).json({ error: 'Destination not found' });
  res.json(dest);
});

apiRouter.post('/destinations', (req: Request, res: Response) => {
  const newDest = db.createDestination(req.body);
  res.status(201).json(newDest);
});

apiRouter.put('/destinations/:id', (req: Request, res: Response) => {
  const updated = db.updateDestination(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Destination not found' });
  res.json(updated);
});

apiRouter.delete('/destinations/:id', (req: Request, res: Response) => {
  const deleted = db.deleteDestination(req.params.id);
  res.json({ success: deleted });
});

/* ============================================================
   3. PACKAGES
   ============================================================ */

apiRouter.get('/packages', (req: Request, res: Response) => {
  const { destinationId, theme, maxPrice } = req.query;
  let list = db.getPackages();

  if (destinationId && typeof destinationId === 'string') {
    list = list.filter(p => p.destinationId === destinationId);
  }

  if (theme && typeof theme === 'string' && theme !== 'all') {
    list = list.filter(p => p.theme === theme);
  }

  if (maxPrice) {
    const priceNum = Number(maxPrice);
    if (!isNaN(priceNum)) {
      list = list.filter(p => p.startingPrice <= priceNum);
    }
  }

  res.json(list);
});

apiRouter.get('/packages/:id', (req: Request, res: Response) => {
  const pkg = db.getPackageById(req.params.id);
  if (!pkg) return res.status(404).json({ error: 'Package not found' });
  res.json(pkg);
});

apiRouter.post('/packages/compare', (req: Request, res: Response) => {
  const { packageIds } = req.body;
  if (!Array.isArray(packageIds)) {
    return res.status(400).json({ error: 'packageIds array required' });
  }
  const packages = packageIds.map(id => db.getPackageById(id)).filter(Boolean);
  res.json(packages);
});

apiRouter.post('/packages', (req: Request, res: Response) => {
  const newPkg = db.createPackage(req.body);
  res.status(201).json(newPkg);
});

apiRouter.put('/packages/:id', (req: Request, res: Response) => {
  const updated = db.updatePackage(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Package not found' });
  res.json(updated);
});

apiRouter.delete('/packages/:id', (req: Request, res: Response) => {
  const deleted = db.deletePackage(req.params.id);
  res.json({ success: deleted });
});

/* ============================================================
   4. THE EXPLORER (MICRO-MOBILITY & CABS)
   ============================================================ */

apiRouter.get('/explorer/vehicles', (req: Request, res: Response) => {
  res.json(EXPLORER_VEHICLES);
});

apiRouter.post('/explorer/fare-estimate', (req: Request, res: Response) => {
  const { pickupCoords, dropCoords, vehicleType } = req.body;
  
  // Calculate approximate distance in km using Haversine formula
  let distKm = 8.5; // fallback
  if (pickupCoords && dropCoords) {
    const R = 6371; // Earth's radius in km
    const dLat = ((dropCoords.lat - pickupCoords.lat) * Math.PI) / 180;
    const dLon = ((dropCoords.lng - pickupCoords.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((pickupCoords.lat * Math.PI) / 180) *
        Math.cos((dropCoords.lat * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    distKm = Math.max(1.2, Number((R * c).toFixed(1)));
  }

  const vehicle = EXPLORER_VEHICLES.find(v => v.type === vehicleType) || EXPLORER_VEHICLES[0];
  const fare = Number((vehicle.baseFare + distKm * vehicle.perKmRate).toFixed(2));
  const durationMins = Math.round(distKm * 2.8 + 4);
  const etaMins = vehicle.etaMins;

  res.json({
    distanceKm: distKm,
    fare,
    durationMins,
    etaMins,
    vehicle
  });
});

apiRouter.post('/explorer/book', (req: Request, res: Response) => {
  const userId = getCurrentUserId(req);
  const { vehicleType, pickupAddress, dropAddress, pickupCoords, dropCoords, fare, distanceKm, durationMins } = req.body;

  const vehicle = EXPLORER_VEHICLES.find(v => v.type === vehicleType) || EXPLORER_VEHICLES[0];

  const drivers = [
    { name: 'Vikram Singh', phone: '+91 98210 44912', rating: 4.95, vehicleNumber: 'GA-03-K-9812', vehicleModel: 'White Dzire Prime', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80' },
    { name: 'Made Wardana', phone: '+62 812 3910 882', rating: 4.92, vehicleNumber: 'DK-4921-AZ', vehicleModel: 'Silver Innova Reborn', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80' },
    { name: 'Rajesh Sharma', phone: '+91 99120 77319', rating: 4.88, vehicleNumber: 'HP-01-M-4411', vehicleModel: 'Electric Scooter EV-40', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80' }
  ];

  const assignedDriver = drivers[Math.floor(Math.random() * drivers.length)];

  const newRide: ExplorerRide = {
    id: `RID-${Date.now()}`,
    userId,
    vehicleType,
    vehicleName: vehicle.name,
    pickupAddress: pickupAddress || 'Current Location',
    dropAddress: dropAddress || 'Destination Point',
    pickupCoords: pickupCoords || { lat: 15.2993, lng: 74.1240 },
    dropCoords: dropCoords || { lat: 15.4989, lng: 73.8278 },
    distanceKm: distanceKm || 8.5,
    fare: fare || vehicle.baseFare + 8.5 * vehicle.perKmRate,
    durationMins: durationMins || 25,
    status: 'driver_assigned',
    createdAt: new Date().toISOString(),
    driver: assignedDriver,
    otp: `${Math.floor(1000 + Math.random() * 9000)}`
  };

  db.createRide(newRide);

  // Also record in booking history
  db.createBooking({
    id: `BKG-EXP-${newRide.id}`,
    userId,
    serviceType: 'explorer',
    title: `The Explorer Ride: ${vehicle.name}`,
    destinationName: pickupAddress || 'Local City Ride',
    bookingDate: new Date().toISOString(),
    travelDate: new Date().toISOString().split('T')[0],
    passengersCount: 1,
    passengerDetails: [{ name: 'Traveler', age: 28, gender: 'Any' }],
    totalAmount: newRide.fare,
    status: 'confirmed',
    paymentMethod: 'wallet',
    paymentStatus: 'paid',
    isSimulation: true,
    details: {
      providerName: 'The Explorer Micro-Mobility',
      boardingPoint: newRide.pickupAddress,
      droppingPoint: newRide.dropAddress,
      pnrNumber: `OTP: ${newRide.otp}`
    },
    invoice: {
      invoiceNo: `INV-EXP-${Date.now()}`,
      baseFare: newRide.fare,
      taxes: 0,
      discounts: 0,
      grandTotal: newRide.fare,
      generatedAt: new Date().toISOString()
    }
  });

  res.status(201).json(newRide);
});

apiRouter.get('/explorer/rides', (req: Request, res: Response) => {
  const userId = getCurrentUserId(req);
  res.json(db.getRides(userId));
});

apiRouter.get('/explorer/rides/:id', (req: Request, res: Response) => {
  const ride = db.getRideById(req.params.id);
  if (!ride) return res.status(404).json({ error: 'Ride not found' });
  res.json(ride);
});

apiRouter.post('/explorer/rides/:id/status-advance', (req: Request, res: Response) => {
  const ride = db.getRideById(req.params.id);
  if (!ride) return res.status(404).json({ error: 'Ride not found' });

  const statusProgression: Record<string, ExplorerRide['status']> = {
    'searching': 'driver_assigned',
    'driver_assigned': 'arrived',
    'arrived': 'in_progress',
    'in_progress': 'completed'
  };

  const nextStatus = statusProgression[ride.status] || ride.status;
  const updated = db.updateRide(ride.id, { status: nextStatus });
  res.json(updated);
});

apiRouter.post('/explorer/rides/:id/cancel', (req: Request, res: Response) => {
  const ride = db.getRideById(req.params.id);
  if (!ride) return res.status(404).json({ error: 'Ride not found' });
  if (ride.status === 'completed' || ride.status === 'cancelled') {
    return res.status(400).json({ error: 'Ride cannot be cancelled at this stage' });
  }

  const updated = db.updateRide(ride.id, { status: 'cancelled' });

  // Refund fare to wallet
  const user = db.getUser(ride.userId);
  user.walletBalance += ride.fare;
  db.updateUser(ride.userId, { walletBalance: user.walletBalance });

  db.createWalletTransaction({
    id: `txn-exp-ref-${Date.now()}`,
    userId: ride.userId,
    amount: ride.fare,
    type: 'credit',
    source: 'refund',
    description: `Refund for cancelled Explorer ride #${ride.id}`,
    timestamp: new Date().toISOString(),
    status: 'success',
    referenceId: ride.id
  });

  res.json({ success: true, ride: updated });
});

/* ============================================================
   5. BOOKINGS (FLIGHTS, TRAINS, BUSES, HOTELS, PACKAGES)
   ============================================================ */

apiRouter.get('/bookings', (req: Request, res: Response) => {
  const userId = getCurrentUserId(req);
  res.json(db.getBookings(userId));
});

apiRouter.get('/bookings/:id', (req: Request, res: Response) => {
  const bkg = db.getBookingById(req.params.id);
  if (!bkg) return res.status(404).json({ error: 'Booking not found' });
  res.json(bkg);
});

apiRouter.post('/bookings', (req: Request, res: Response) => {
  const userId = getCurrentUserId(req);
  const { 
    serviceType, 
    title, 
    destinationName, 
    travelDate, 
    returnDate, 
    passengersCount, 
    passengerDetails, 
    totalAmount, 
    paymentMethod, 
    details, 
    promoCode 
  } = req.body;

  let discount = 0;
  if (promoCode === 'WANDER20') {
    discount = Math.min(150, Math.round(totalAmount * 0.2));
  } else if (promoCode === 'AIPEAK10') {
    discount = Math.min(75, Math.round(totalAmount * 0.1));
  }

  const finalAmount = Math.max(10, totalAmount - discount);
  const taxes = Math.round(finalAmount * 0.08);
  const baseFare = finalAmount - taxes;

  const newBooking: Booking = {
    id: `BKG-${Date.now().toString().slice(-6)}`,
    userId,
    serviceType: serviceType || 'hotel',
    title: title || 'Custom Travel Booking',
    destinationName: destinationName || 'Featured City',
    bookingDate: new Date().toISOString(),
    travelDate: travelDate || new Date().toISOString().split('T')[0],
    returnDate,
    passengersCount: passengersCount || 1,
    passengerDetails: passengerDetails || [{ name: 'Traveler', age: 28, gender: 'Any' }],
    totalAmount: finalAmount,
    status: 'confirmed',
    paymentMethod: paymentMethod || 'wallet',
    paymentStatus: 'paid',
    isSimulation: true, // Transparent simulation indicator per requirements
    details: details || {},
    invoice: {
      invoiceNo: `INV-${Math.floor(100000 + Math.random() * 900000)}`,
      baseFare,
      taxes,
      discounts: discount,
      grandTotal: finalAmount,
      generatedAt: new Date().toISOString()
    }
  };

  const created = db.createBooking(newBooking);
  res.status(201).json(created);
});

apiRouter.post('/bookings/:id/cancel', (req: Request, res: Response) => {
  const userId = getCurrentUserId(req);
  const result = db.cancelBooking(req.params.id, userId);
  if (!result) return res.status(404).json({ error: 'Booking not found or already cancelled' });
  res.json(result);
});

/* ============================================================
   6. MAGIC MOMENTS (PRIVATE GALLERY & 20MB QUOTA)
   ============================================================ */

apiRouter.get('/moments/albums', (req: Request, res: Response) => {
  const userId = getCurrentUserId(req);
  res.json(db.getAlbums(userId));
});

apiRouter.post('/moments/albums', (req: Request, res: Response) => {
  const userId = getCurrentUserId(req);
  const { title, destinationName, tripStartDate, tripEndDate } = req.body;

  if (!title) return res.status(400).json({ error: 'Album title is required' });

  const newAlbum: MagicMomentAlbum = {
    id: `alb-${Date.now()}`,
    userId,
    title,
    destinationName: destinationName || 'My Journey',
    tripStartDate: tripStartDate || new Date().toISOString().split('T')[0],
    tripEndDate: tripEndDate || new Date().toISOString().split('T')[0],
    photosCount: 0,
    totalSizeBytes: 0
  };

  const created = db.createAlbum(newAlbum);
  res.status(201).json(created);
});

apiRouter.delete('/moments/albums/:id', (req: Request, res: Response) => {
  const userId = getCurrentUserId(req);
  db.deleteAlbum(req.params.id, userId);
  res.json({ success: true, message: 'Album deleted' });
});

apiRouter.get('/moments/albums/:id/photos', (req: Request, res: Response) => {
  const userId = getCurrentUserId(req);
  res.json(db.getPhotosByAlbum(req.params.id, userId));
});

apiRouter.get('/moments/usage', (req: Request, res: Response) => {
  const userId = getCurrentUserId(req);
  res.json(db.getUserStorageUsage(userId));
});

apiRouter.post('/moments/upload', upload.single('file'), (req: Request, res: Response) => {
  const userId = getCurrentUserId(req);
  const { albumId, caption, locationName, tags, directUrl } = req.body;

  const usage = db.getUserStorageUsage(userId);
  const file = req.file;

  const fileSize = file ? file.size : 1200000; // ~1.2MB if URL

  // Strict 20 MB quota check per Requirement 7
  if (usage.usedBytes + fileSize > usage.quotaBytes) {
    if (file && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
    return res.status(400).json({
      error: `Storage quota exceeded! You have used ${(usage.usedBytes / (1024 * 1024)).toFixed(1)} MB of your strict 20 MB quota.`
    });
  }

  const photoUrl = file 
    ? `/uploads/${file.filename}` 
    : (directUrl || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80');

  const photo: MagicMomentPhoto = {
    id: `pho-${Date.now()}`,
    userId,
    albumId: albumId || 'alb-1',
    url: photoUrl,
    caption: caption || 'Unforgettable travel memory',
    locationName: locationName || 'Scenic Location',
    takenAt: new Date().toISOString(),
    fileSizeBytes: fileSize,
    mediaType: 'image',
    tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map((t: string) => t.trim())) : ['Travel']
  };

  const created = db.createPhoto(photo);
  res.status(201).json(created);
});

apiRouter.delete('/moments/photos/:id', (req: Request, res: Response) => {
  const userId = getCurrentUserId(req);
  const deleted = db.deletePhoto(req.params.id, userId);
  res.json({ success: deleted });
});

/* ============================================================
   7. REVIEWS & FEEDBACK (1-5 STARS, <= 100 WORDS, DUPLICATE CHECK)
   ============================================================ */

apiRouter.get('/reviews', (req: Request, res: Response) => {
  const { targetType, targetId } = req.query;
  res.json(db.getReviews(targetType as string, targetId as string));
});

apiRouter.post('/reviews', (req: Request, res: Response) => {
  const userId = getCurrentUserId(req);
  const { targetType, targetId, targetName, rating, reviewText } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Rating must be between 1 and 5 stars' });
  }

  // Word count validation (<= 100 words per requirement 8)
  const words = (reviewText || '').trim().split(/\s+/).filter(Boolean);
  if (words.length > 100) {
    return res.status(400).json({ error: `Review is too long (${words.length} words). Maximum allowed is 100 words.` });
  }

  const user = db.getUser(userId);

  const review: Review = {
    id: `rev-${Date.now()}`,
    userId,
    userName: user.name || 'Verified Traveler',
    userAvatar: user.avatar,
    targetType,
    targetId,
    targetName: targetName || 'Travel Service',
    rating: Number(rating),
    reviewText,
    createdAt: new Date().toISOString(),
    verifiedBooking: true,
    likes: 0
  };

  const result = db.createReview(review);
  if (!result.success) {
    return res.status(400).json({ error: result.message });
  }
  res.status(201).json(result.review);
});

apiRouter.put('/reviews/:id', (req: Request, res: Response) => {
  const userId = getCurrentUserId(req);
  const { rating, reviewText } = req.body;

  if (rating && (rating < 1 || rating > 5)) {
    return res.status(400).json({ error: 'Rating must be between 1 and 5 stars' });
  }

  if (reviewText) {
    const words = reviewText.trim().split(/\s+/).filter(Boolean);
    if (words.length > 100) {
      return res.status(400).json({ error: `Review is too long (${words.length} words). Maximum allowed is 100 words.` });
    }
  }

  const updated = db.updateReview(req.params.id, userId, { rating, reviewText });
  if (!updated) return res.status(404).json({ error: 'Review not found or unauthorized' });
  res.json(updated);
});

apiRouter.delete('/reviews/:id', (req: Request, res: Response) => {
  const userId = getCurrentUserId(req);
  const deleted = db.deleteReview(req.params.id, userId);
  res.json({ success: deleted });
});

/* ============================================================
   8. WALLET & TRANSACTIONS
   ============================================================ */

apiRouter.get('/wallet', (req: Request, res: Response) => {
  const userId = getCurrentUserId(req);
  const user = db.getUser(userId);
  const transactions = db.getWalletTransactions(userId);
  res.json({
    balance: user.walletBalance,
    transactions
  });
});

apiRouter.post('/wallet/topup', (req: Request, res: Response) => {
  const userId = getCurrentUserId(req);
  const { amount, method } = req.body;
  const numAmount = Number(amount);

  if (isNaN(numAmount) || numAmount <= 0) {
    return res.status(400).json({ error: 'Invalid top-up amount' });
  }

  const result = db.topupWallet(userId, numAmount, method || 'UPI / Card (Simulation)');
  res.json(result);
});

/* ============================================================
   9. GROUP EXPENSES & SPLITTING MATRIX
   ============================================================ */

apiRouter.get('/expenses/groups', (req: Request, res: Response) => {
  const userId = getCurrentUserId(req);
  res.json(db.getGroupTrips(userId));
});

apiRouter.get('/expenses/groups/:id', (req: Request, res: Response) => {
  const trip = db.getGroupTripById(req.params.id);
  if (!trip) return res.status(404).json({ error: 'Group trip not found' });
  const settlement = db.calculateGroupSettlement(req.params.id);
  res.json({ trip, settlement });
});

apiRouter.post('/expenses/groups', (req: Request, res: Response) => {
  const userId = getCurrentUserId(req);
  const { title, destinationName, members } = req.body;

  if (!title) return res.status(400).json({ error: 'Group title is required' });

  const defaultUser = db.getUser(userId);
  const allMembers = [
    { id: userId, name: `${defaultUser.name} (You)`, email: defaultUser.email, avatar: defaultUser.avatar },
    ...(members || [])
  ];

  const newGroup: GroupTrip = {
    id: `grp-${Date.now()}`,
    userId,
    title,
    destinationName: destinationName || 'Group Trip',
    members: allMembers,
    expenses: [],
    createdAt: new Date().toISOString()
  };

  const created = db.createGroupTrip(newGroup);
  res.status(201).json(created);
});

apiRouter.post('/expenses/groups/:id/expenses', (req: Request, res: Response) => {
  const { title, category, amount, paidById, paidByName, splitAmongIds, notes } = req.body;

  if (!title || !amount || !paidById) {
    return res.status(400).json({ error: 'Title, amount, and payer are required' });
  }

  const expense: GroupExpense = {
    id: `exp-${Date.now()}`,
    groupId: req.params.id,
    title,
    category: category || 'Other',
    amount: Number(amount),
    paidById,
    paidByName: paidByName || 'Member',
    splitAmongIds: splitAmongIds || [],
    splitType: 'equal',
    date: new Date().toISOString().split('T')[0],
    notes
  };

  const updatedTrip = db.addExpenseToGroup(req.params.id, expense);
  if (!updatedTrip) return res.status(404).json({ error: 'Group trip not found' });
  const settlement = db.calculateGroupSettlement(req.params.id);

  res.status(201).json({ trip: updatedTrip, settlement });
});

apiRouter.delete('/expenses/groups/:id/expenses/:expId', (req: Request, res: Response) => {
  const updatedTrip = db.deleteExpenseFromGroup(req.params.id, req.params.expId);
  if (!updatedTrip) return res.status(404).json({ error: 'Group trip not found' });
  const settlement = db.calculateGroupSettlement(req.params.id);
  res.json({ trip: updatedTrip, settlement });
});

/* ============================================================
   10. AI TRAVEL ENGINE & INTELLIGENCE
   ============================================================ */

apiRouter.post('/ai/chat', async (req: Request, res: Response) => {
  try {
    const userId = getCurrentUserId(req);
    const user = db.getUser(userId);
    const { message, destinationId, history } = req.body;

<<<<<<< HEAD
    const result = await askTravelAssistant({
=======
    const reply = await askTravelAssistant({
>>>>>>> 5761e1be8e8eb21e40f31a92e4c8a271991f2933
      message,
      history,
      destinationId,
      userContext: {
        name: user.name,
        budget: user.preferences?.budgetLevel,
        vibes: user.preferences?.vibes
      }
    });

<<<<<<< HEAD
    res.json({ reply: result.reply, grounding: result.grounding });
=======
    res.json({ reply });
>>>>>>> 5761e1be8e8eb21e40f31a92e4c8a271991f2933
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'AI Assistant service error' });
  }
});

apiRouter.post('/ai/autopilot/replan', async (req: Request, res: Response) => {
  try {
    const { destinationName, trigger, currentSchedule } = req.body;
    const result = await generateAutopilotReplan({
      destinationName: destinationName || 'Bali',
      trigger: trigger || 'rain_storm',
      currentSchedule: currentSchedule || ['Morning Beach Visit', 'Midday Terrace Hike', 'Evening Cliff Sunset']
    });
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.post('/ai/what-if', async (req: Request, res: Response) => {
  try {
    const { scenario, destinationName, baseBudget, groupSize, durationDays } = req.body;
    const result = await runWhatIfSimulation({
      scenario: scenario || 'What if it rains on Day 2?',
      destinationName: destinationName || 'Swiss Alps',
      baseBudget: Number(baseBudget) || 1200,
      groupSize: Number(groupSize) || 2,
      durationDays: Number(durationDays) || 5
    });
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.post('/ai/travel-dna', (req: Request, res: Response) => {
  const userId = getCurrentUserId(req);
  const { answers } = req.body; // e.g. { adventure: 85, culture: 90, ... }

  const updatedDNA = {
    culturalExplorer: answers?.culturalExplorer || 85,
    adventureSeeker: answers?.adventureSeeker || 75,
    gastronomyLover: answers?.gastronomyLover || 90,
    relaxationScore: answers?.relaxationScore || 80,
    ecoConscious: answers?.ecoConscious || 88,
    spontaneity: answers?.spontaneity || 70,
    primaryArchetype: 'Authentic Heritage & Epicurean Explorer',
    secondaryArchetype: 'Scenic Alpine & Coastal Trailblazer',
    description: 'You prioritize deep cultural resonance, hyper-local gastronomy, and panoramic natural wonders with a strong preference for sustainable transport and boutique accommodations.'
  };

  const updatedUser = db.updateUser(userId, { travelDNA: updatedDNA });
  res.json(updatedUser.travelDNA);
});

apiRouter.get('/ai/contextual-suggestions', (req: Request, res: Response) => {
  const { destinationId, timeOfDay } = req.query;
  const dest = destinationId ? db.getDestinationById(destinationId as string) : db.getDestinations()[0];

  const suggestions = [
    {
      title: 'Optimal Photo Lighting Window',
      detail: `Current soft sunlight at ${dest?.name || 'your destination'} is ideal for panoramic photography.`,
      icon: 'Camera',
      action: 'View Recommended Viewpoints'
    },
    {
      title: 'Low Crowd Window Active',
      detail: 'Local attractions currently report 40% below average crowd levels for the next 90 minutes.',
      icon: 'Users',
      action: 'Book Fast-Track Entry'
    },
    {
      title: 'The Explorer Cab Nearby',
      detail: '3 Explorer Sedan cabs currently cruising within 4 minutes of your location.',
      icon: 'Car',
      action: 'Call Explorer Ride'
    }
  ];

  res.json(suggestions);
});

/* ============================================================
   11. ADMIN & BUSINESS ANALYTICS
   ============================================================ */

apiRouter.get('/admin/analytics', (req: Request, res: Response) => {
  res.json(db.getAdminAnalytics());
});

apiRouter.get('/admin/offers', (req: Request, res: Response) => {
  res.json(db.getOffers());
});

apiRouter.post('/admin/reset-db', (req: Request, res: Response) => {
  db.resetToDefaults();
  res.json({ success: true, message: 'Database reset to initial factory seed.' });
});

apiRouter.post('/moments/enhance', (req: Request, res: Response) => {
  const { photoId, style } = req.body;
  // Simulating AI photo enhancement filter
  res.json({
    success: true,
    filterApplied: style || 'Vivid HDR',
    enhancedUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=90'
  });
});

apiRouter.post('/expenses/groups/:id/settle', (req: Request, res: Response) => {
  const { debtorId, creditorId, amount } = req.body;
  const trip = db.getGroupTripById(req.params.id);
  if (!trip) return res.status(404).json({ error: 'Group trip not found' });

  // Add settlement expense
  const settleExp: GroupExpense = {
    id: `exp-settle-${Date.now()}`,
    groupId: trip.id,
    title: `Wallet Settlement to ${creditorId}`,
    category: 'Other',
    amount: Number(amount) || 0,
    paidById: debtorId,
    paidByName: debtorId,
    splitAmongIds: [creditorId],
    splitType: 'exact',
    date: new Date().toISOString().split('T')[0],
    notes: 'Direct Wander Wallet peer transfer'
  };

  const updatedTrip = db.addExpenseToGroup(trip.id, settleExp);
  const settlement = db.calculateGroupSettlement(trip.id);
  res.json({ trip: updatedTrip, settlement });
});

/* ============================================================
   12. INDIA AI TOURISM DEMAND BALANCER & LOCAL CULTURE ENGINE
   ============================================================ */

<<<<<<< HEAD
// 1. AI Tourism Demand Balancer (ML-enhanced with rule-based fallback)
apiRouter.post('/ai/demand-balancer', async (req: Request, res: Response) => {
  try {
    const query = req.body || {};
    let results;
    try {
      results = await balanceTourismDemandML(query);
    } catch (mlErr) {
      console.warn('ML demand balancer unavailable, using rule-based fallback:', (mlErr as Error).message);
      results = balanceTourismDemand(query);
    }
=======
// 1. AI Tourism Demand Balancer
apiRouter.post('/ai/demand-balancer', (req: Request, res: Response) => {
  try {
    const query = req.body || {};
    const results = balanceTourismDemand(query);
>>>>>>> 5761e1be8e8eb21e40f31a92e4c8a271991f2933
    res.json(results);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error executing AI Demand Balancer' });
  }
});

<<<<<<< HEAD
// 1b. Dynamic Pricing — ML Service (INTEGRATION.md §4)
apiRouter.get('/destinations/:id/dynamic-price', async (req: Request, res: Response) => {
  try {
    const ML_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';
    const { date } = req.query;
    const response = await fetch(`${ML_URL}/price/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        destinationId: req.params.id,
        date: date || new Date().toISOString().split('T')[0],
      }),
    });
    if (!response.ok) throw new Error('Price prediction failed');
    const prediction = await response.json();
    res.json(prediction);
  } catch (error) {
    res.status(503).json({ error: 'Dynamic pricing unavailable', fallback: true });
  }
});

// 1c. Itinerary Optimization — ML Service (INTEGRATION.md §6)
apiRouter.post('/packages/:id/optimize-itinerary', async (req: Request, res: Response) => {
  try {
    const ML_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';
    const pkg = db.getPackageById(req.params.id);
    if (!pkg) return res.status(404).json({ error: 'Package not found' });

    const { numDays, maxHoursPerDay, categoryPreferences } = req.body;
    const response = await fetch(`${ML_URL}/itinerary/optimize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        destinationId: pkg.destinationId,
        numDays: numDays || pkg.durationDays,
        maxHoursPerDay: maxHoursPerDay || 8,
        categoryPreferences: categoryPreferences || undefined,
      }),
    });
    if (!response.ok) throw new Error('Itinerary optimization failed');
    const optimized = await response.json();
    res.json(optimized);
  } catch (error) {
    res.status(503).json({ error: 'Itinerary optimization unavailable', fallback: true });
  }
});

=======
>>>>>>> 5761e1be8e8eb21e40f31a92e4c8a271991f2933
// 2. India Culture & Specialty Discovery Search
apiRouter.get('/culture/search', (req: Request, res: Response) => {
  try {
    const { q, category, state } = req.query;
    const items = searchCulturalSpecialties(
      q as string, 
      category as string, 
      state as string
    );
    res.json(items);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error searching cultural specialties' });
  }
});

// 3. India Travel Explorer State -> Region -> District Hierarchy
apiRouter.get('/culture/hierarchy', (req: Request, res: Response) => {
  try {
    const hierarchy = getIndiaExplorerHierarchy();
    res.json(hierarchy);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error retrieving hierarchy' });
  }
});

// 4. AI Hidden Gem Alternatives Dispenser
apiRouter.get('/destinations/:id/alternatives', (req: Request, res: Response) => {
  try {
    const data = getAlternativeRecommendations(req.params.id);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error finding alternatives' });
  }
});

// 5. Destination Best Time & Timing Engine
apiRouter.get('/destinations/:id/best-time', (req: Request, res: Response) => {
  const dest = db.getDestinationById(req.params.id);
  if (!dest) return res.status(404).json({ error: 'Destination not found' });
  res.json({
    destinationId: dest.id,
    destinationName: dest.name,
    bestMonths: dest.bestMonths,
    currentWeather: dest.currentWeather,
    crowdPrediction: dest.crowdPrediction,
    bestTimeEngine: dest.bestTimeEngine
  });
});

// 6. Destination Local Economy & Impact Directory
apiRouter.get('/destinations/:id/local-economy', (req: Request, res: Response) => {
  const dest = db.getDestinationById(req.params.id);
  if (!dest) return res.status(404).json({ error: 'Destination not found' });
  res.json({
    destinationId: dest.id,
    destinationName: dest.name,
    localImpactScore: dest.localEconomy?.localImpactScore || dest.sustainabilityScore || 90,
    localEconomicRetentionPct: dest.localEconomicRetentionPct || 85,
    localEconomy: dest.localEconomy
  });
});

