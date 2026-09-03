import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Calendar, 
  User, 
  CreditCard, 
  Wallet, 
  ShieldCheck, 
  CheckCircle2, 
  Ticket, 
  Sparkles, 
  Tag, 
  ArrowRight, 
  ArrowLeft,
  QrCode, 
  Building2, 
  Smartphone, 
  Clock, 
  RefreshCw, 
  AlertCircle,
  FileText,
  Download,
  Share2,
  CalendarPlus,
  Navigation,
  Check,
  ChevronDown,
  ChevronUp,
  Plane,
  Train,
  Bus,
  Building,
  Info,
  Percent,
  Plus,
  Trash2,
  Lock,
  Compass
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import { Booking } from '../types';
import { formatINR } from '../utils/currency';
import { Button } from './ui/Button';
import { downloadCalendarEvent } from '../utils/calendar';

export type CheckoutStep = 'traveler' | 'review' | 'payment' | 'processing' | 'confirmation';

interface BookingCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceType: 'hotel' | 'package' | 'flight' | 'train' | 'bus' | 'explorer';
  title: string;
  destinationName: string;
  basePrice: number;
  duration?: string;
  details?: Record<string, any>;
  onBookingSuccess: (booking: Booking) => void;
  onNavigateToMyTrips?: () => void;
}

const POPULAR_INDIAN_BANKS = [
  { id: 'sbi', name: 'State Bank of India', code: 'SBIN' },
  { id: 'hdfc', name: 'HDFC Bank', code: 'HDFC' },
  { id: 'icici', name: 'ICICI Bank', code: 'ICIC' },
  { id: 'axis', name: 'Axis Bank', code: 'UTIB' },
  { id: 'kotak', name: 'Kotak Mahindra Bank', code: 'KKBK' },
  { id: 'pnb', name: 'Punjab National Bank', code: 'PUNB' }
];

export const BookingCheckoutModal: React.FC<BookingCheckoutModalProps> = ({
  isOpen,
  onClose,
  serviceType,
  title,
  destinationName,
  basePrice,
  duration,
  details = {},
  onBookingSuccess,
  onNavigateToMyTrips
}) => {
  const { user, refreshProfile } = useAuth();
  const { success, error, info } = useToast();

  // 1. Multi-Step Stepper State
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('traveler');

  // 2. Dates and Passenger Manifest State
  const [travelDate, setTravelDate] = useState<string>(() => {
    return (details as any)?.departureDate || (details as any)?.checkInDate || new Date().toISOString().split('T')[0];
  });
  const [returnDate, setReturnDate] = useState<string>(() => {
    if ((details as any)?.returnDate || (details as any)?.checkOutDate) {
      return (details as any).returnDate || (details as any).checkOutDate;
    }
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  });

  const [passengersCount, setPassengersCount] = useState<number>(1);
  const [passengerDetails, setPassengerDetails] = useState<Array<{
    name: string;
    age: number;
    gender: 'Male' | 'Female' | 'Other';
    idType: string;
    idNumber: string;
    seatPreference?: string;
  }>>([
    {
      name: user?.name || 'Primary Traveler',
      age: 28,
      gender: 'Male',
      idType: 'Aadhaar / Govt ID',
      idNumber: '••••-••••-8812',
      seatPreference: 'Window / Lower'
    }
  ]);

  // Primary Contact
  const [contactEmail, setContactEmail] = useState<string>(user?.email || 'traveler@explorex.com');
  const [contactPhone, setContactPhone] = useState<string>(user?.phone || '9876543210');
  const [specialRequests, setSpecialRequests] = useState<string>('');

  // 3. Add-ons & Upsells
  const [includeInsurance, setIncludeInsurance] = useState<boolean>(true); // ₹199/person
  const [includeCarbonOffset, setIncludeCarbonOffset] = useState<boolean>(false); // ₹49/person
  const [includeFreeCancelShield, setIncludeFreeCancelShield] = useState<boolean>(false); // ₹299 total

  // 4. Coupons & Pricing
  const [promoCodeInput, setPromoCodeInput] = useState<string>('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discountPct?: number; fixedDiscount?: number } | null>({
    code: 'WANDER20',
    discountPct: 20
  });

  // 5. Payment Selection State (Amazon/Flipkart Style breadth)
  const [paymentCategory, setPaymentCategory] = useState<'upi' | 'card' | 'netbanking' | 'wallet' | 'emi'>('upi');
  
  // UPI Sub-options
  const [upiOption, setUpiOption] = useState<'app' | 'vpa' | 'qr'>('app');
  const [selectedUpiApp, setSelectedUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'bhim'>('gpay');
  const [upiVpa, setUpiVpa] = useState<string>('traveler@okhdfcbank');
  
  // Card Sub-options
  const [cardNumber, setCardNumber] = useState<string>('4111 1111 1111 1111');
  const [cardExpiry, setCardExpiry] = useState<string>('12/30');
  const [cardCvv, setCardCvv] = useState<string>('123');
  const [cardName, setCardName] = useState<string>(user?.name || 'Primary Traveler');
  const [saveCard, setSaveCard] = useState<boolean>(true);

  // Net Banking Sub-options
  const [selectedBank, setSelectedBank] = useState<string>('HDFC');

  // Wallet Sub-options
  const [useWalletBalance, setUseWalletBalance] = useState<boolean>(true);

  // EMI Sub-options
  const [selectedEmiTenure, setSelectedEmiTenure] = useState<number>(3); // 3, 6, 9, 12 months

  // 6. Processing & Outcome States
  const [processingStatus, setProcessingStatus] = useState<'initiating' | 'verifying' | 'failed' | 'cancelled'>('initiating');
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [paymentErrorMessage, setPaymentErrorMessage] = useState<string>('');
  
  // 10-minute Fare-Hold Countdown Timer (for review/payment resilience)
  const [fareHoldSeconds, setFareHoldSeconds] = useState<number>(600); // 10:00 mins

  // Amazon-style auto-redirect countdown timer (5 seconds)
  const [redirectCountdown, setRedirectCountdown] = useState<number>(5);

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setFareHoldSeconds(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  useEffect(() => {
    if (currentStep !== 'confirmation' || !confirmedBooking) return;
    setRedirectCountdown(5);
    const interval = setInterval(() => {
      setRedirectCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          onClose();
          if (onNavigateToMyTrips) onNavigateToMyTrips();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [currentStep, confirmedBooking, onClose, onNavigateToMyTrips]);

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Synchronize passenger count with passenger list
  const handlePassengerCountChange = (count: number) => {
    const validCount = Math.max(1, Math.min(8, count));
    setPassengersCount(validCount);
    setPassengerDetails(prev => {
      const updated = [...prev];
      while (updated.length < validCount) {
        updated.push({
          name: `Passenger ${updated.length + 1}`,
          age: 26,
          gender: 'Male',
          idType: 'Aadhaar / Govt ID',
          idNumber: '••••-••••-9012',
          seatPreference: 'Window'
        });
      }
      while (updated.length > validCount) {
        updated.pop();
      }
      return updated;
    });
  };

  // Pricing calculations
  const rawSubtotal = basePrice * passengersCount;
  
  let promoDiscount = 0;
  if (appliedPromo) {
    if (appliedPromo.code === 'WANDER20') {
      promoDiscount = Math.round(rawSubtotal * 0.2); // 20% discount
    } else if (appliedPromo.code === 'EXPLORE10') {
      promoDiscount = Math.round(rawSubtotal * 0.1);
    } else if (appliedPromo.code === 'FIRSTTRIP') {
      promoDiscount = 500;
    }
  }

  // Add-ons subtotal
  const insuranceTotal = includeInsurance ? 199 * passengersCount : 0;
  const carbonOffsetTotal = includeCarbonOffset ? 49 * passengersCount : 0;
  const cancellationShieldTotal = includeFreeCancelShield ? 299 : 0;
  const addOnsTotal = insuranceTotal + carbonOffsetTotal + cancellationShieldTotal;

  // Taxes (18% GST on base minus discount)
  const taxableAmount = Math.max(0, rawSubtotal - promoDiscount);
  const taxAmount = Math.round(taxableAmount * 0.18);
  const convenienceFee = 149;

  const grandTotal = Math.max(0, taxableAmount + taxAmount + addOnsTotal + convenienceFee);
  
  const walletBalance = user?.walletBalance || 0;
  const walletDeduction = useWalletBalance ? Math.min(walletBalance, grandTotal) : 0;
  const remainingPayableAfterWallet = Math.max(0, grandTotal - walletDeduction);

  // Auto detect card brand
  const cardBrand = useMemo(() => {
    const clean = cardNumber.replace(/\s/g, '');
    if (clean.startsWith('4')) return 'Visa';
    if (/^5[1-5]/.test(clean) || /^2[2-7]/.test(clean)) return 'Mastercard';
    if (/^3[47]/.test(clean)) return 'American Express';
    if (/^(60|65|81|82|508)/.test(clean)) return 'RuPay';
    return 'Card';
  }, [cardNumber]);

  // Handle promo code application
  const handleApplyCoupon = (codeToApply?: string) => {
    const code = (codeToApply || promoCodeInput).trim().toUpperCase();
    if (code === 'WANDER20') {
      setAppliedPromo({ code: 'WANDER20', discountPct: 20 });
      success('Coupon Applied!', 'WANDER20: 20% savings applied to your fare.');
    } else if (code === 'EXPLORE10') {
      setAppliedPromo({ code: 'EXPLORE10', discountPct: 10 });
      success('Coupon Applied!', 'EXPLORE10: 10% discount added.');
    } else if (code === 'FIRSTTRIP') {
      setAppliedPromo({ code: 'FIRSTTRIP', fixedDiscount: 500 });
      success('Coupon Applied!', 'FIRSTTRIP: ₹500 flat discount applied.');
    } else {
      error('Invalid Promo Code', 'Try WANDER20, EXPLORE10, or FIRSTTRIP');
    }
  };

  // Step 1 Validation
  const validateTravelerDetails = (): boolean => {
    if (!contactEmail.trim() || !contactEmail.includes('@')) {
      error('Invalid Contact Email', 'Please provide a valid email address for your E-Ticket.');
      return false;
    }
    if (!contactPhone.trim() || contactPhone.length < 10) {
      error('Invalid Mobile Number', 'Please enter a 10-digit mobile number for journey SMS alerts.');
      return false;
    }
    for (let i = 0; i < passengerDetails.length; i++) {
      if (!passengerDetails[i].name.trim()) {
        error('Passenger Name Required', `Please enter the full name for Traveler #${i + 1}`);
        return false;
      }
      if (passengerDetails[i].age <= 0) {
        error('Invalid Age', `Please provide a valid age for Traveler #${i + 1}`);
        return false;
      }
    }
    return true;
  };

  // Step Trigger: Execute Real Razorpay Payment with Multi-Method Fallback
  const handleProceedToPayment = async () => {
    // If 100% covered by wallet, process directly
    if (paymentCategory === 'wallet' && walletDeduction >= grandTotal) {
      setCurrentStep('processing');
      setProcessingStatus('initiating');
      try {
        const created = await api.createBooking({
          serviceType,
          title,
          destinationName,
          travelDate,
          returnDate: returnDate || undefined,
          passengersCount,
          passengerDetails,
          totalAmount: grandTotal,
          paymentMethod: 'wallet',
          promoCode: appliedPromo?.code,
          details: {
            ...details,
            duration,
            contactEmail,
            contactPhone,
            insuranceActive: includeInsurance,
            carbonNeutral: includeCarbonOffset,
            freeCancellationShield: includeFreeCancelShield,
            specialRequests
          }
        });

        await refreshProfile();
        setConfirmedBooking(created);
        onBookingSuccess(created);
        setCurrentStep('confirmation');
        
        const refId = created.details?.pnrNumber || created.id;
        const paidFormatted = formatINR(grandTotal);
        success(
          'Payment Verified & Booking Confirmed',
          `Your reservation has been confirmed.\n${paidFormatted} paid successfully via Wallet.\nBooking Reference: ${refId}`,
          6000
        );
      } catch (err: any) {
        setPaymentErrorMessage(err.message || 'Failed to complete wallet transaction');
        setCurrentStep('payment');
        error('Payment Failed', err.message);
      }
      return;
    }

    // Otherwise, initiate server-side Razorpay Order
    setCurrentStep('processing');
    setProcessingStatus('initiating');

    try {
      const intent = await api.createPaymentIntent({
        serviceType,
        title,
        destinationName,
        basePrice,
        travelDate,
        returnDate: returnDate || undefined,
        passengersCount,
        passengerDetails,
        details: {
          ...details,
          duration,
          contactEmail,
          contactPhone,
          insuranceActive: includeInsurance,
          carbonNeutral: includeCarbonOffset,
          freeCancellationShield: includeFreeCancelShield,
          specialRequests
        },
        promoCode: appliedPromo?.code
      });

      if (!intent.success || !intent.orderId) {
        throw new Error((intent as any).message || 'Failed to initialize Razorpay checkout intent');
      }

      const RazorpaySDK = (window as any).Razorpay;
      if (RazorpaySDK) {
        const options = {
          key: intent.keyId,
          amount: intent.amountInPaise,
          currency: intent.currency || 'INR',
          name: 'ExploreX Travel Platform',
          description: `${title} • ${destinationName}`,
          order_id: intent.orderId,
          modal: {
            ondismiss: () => {
              setCurrentStep('payment');
              setPaymentErrorMessage('Payment window was closed by the user. You can retry with Card, UPI, or NetBanking below.');
              info('Checkout Dismissed', 'Your fare is held for 10 minutes. Complete payment to secure your reservation.');
            }
          },
          handler: async (response: any) => {
            setProcessingStatus('verifying');
            try {
              const verifyRes = await api.verifyPaymentIntent({
                bookingId: intent.bookingId,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature || 'mock_signature'
              });

              if (verifyRes.verified) {
                await refreshProfile();
                setConfirmedBooking(verifyRes.booking || null);
                if (verifyRes.booking) onBookingSuccess(verifyRes.booking);
                setCurrentStep('confirmation');
                
                const refId = verifyRes.booking?.details?.pnrNumber || verifyRes.booking?.id || intent.bookingId;
                const paidFormatted = formatINR(grandTotal);
                success(
                  'Payment Verified & Booking Confirmed',
                  `Your reservation has been confirmed.\n${paidFormatted} paid successfully.\nBooking Reference: ${refId}`,
                  6000
                );
              } else {
                setCurrentStep('payment');
                setPaymentErrorMessage(verifyRes.message || 'Signature verification failed. Please try again.');
                error('Verification Failed', 'Could not verify payment signature.');
              }
            } catch (verifyErr: any) {
              setCurrentStep('payment');
              setPaymentErrorMessage(verifyErr.message || 'Network error occurred during verification.');
              error('Network Error', verifyErr.message);
            }
          },
          prefill: {
            name: passengerDetails[0]?.name || user?.name || 'Traveler',
            email: contactEmail,
            contact: contactPhone
          },
          theme: { color: '#242424' }
        };

        const rzpInstance = new RazorpaySDK(options);
        rzpInstance.open();
      } else {
        // Fallback simulation for sandbox if script is blocked
        const verifyRes = await api.verifyPaymentIntent({
          bookingId: intent.bookingId,
          razorpay_order_id: intent.orderId,
          razorpay_payment_id: `pay_rzp_test_${Date.now()}`,
          razorpay_signature: 'mock_signature'
        });

        if (verifyRes.verified) {
          await refreshProfile();
          setConfirmedBooking(verifyRes.booking || null);
          if (verifyRes.booking) onBookingSuccess(verifyRes.booking);
          setCurrentStep('confirmation');
          
          const refId = verifyRes.booking?.details?.pnrNumber || verifyRes.booking?.id || intent.bookingId;
          const paidFormatted = formatINR(grandTotal);
          success(
            'Payment Verified & Booking Confirmed',
            `Your reservation has been confirmed.\n${paidFormatted} paid successfully.\nBooking Reference: ${refId}`,
            6000
          );
        }
      }
    } catch (err: any) {
      setCurrentStep('payment');
      setPaymentErrorMessage(err.message || 'Unable to open payment gateway. Please retry.');
      error('Gateway Error', err.message);
    }
  };

  // Generate Service Icon
  const ServiceIcon = serviceType === 'flight' ? Plane :
    serviceType === 'train' ? Train :
    serviceType === 'bus' ? Bus : Building;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-4 sm:my-8 flex flex-col max-h-[94vh] animate-in fade-in zoom-in-95">
        
        {/* TOP OTA STEPPER HEADER */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-600/30 border border-sky-400/40 text-sky-300 flex items-center justify-center font-bold shrink-0">
              <ServiceIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30">
                  {serviceType.toUpperCase()} BOOKING
                </span>
                {fareHoldSeconds > 0 && currentStep !== 'confirmation' && (
                  <span className="text-[11px] text-amber-300 font-mono font-bold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    Fare Held: {formatTimer(fareHoldSeconds)}
                  </span>
                )}
              </div>
              <h2 className="text-sm sm:text-base font-black truncate max-w-md mt-0.5">{title}</h2>
            </div>
          </div>

          {/* Stepper Progress Indicator (MakeMyTrip / Cleartrip OTA Stepper) */}
          <div className="flex items-center gap-1.5 sm:gap-2 text-xs font-semibold self-start sm:self-center">
            <div className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
              currentStep === 'traveler' ? 'bg-sky-600 text-white font-bold' : 'text-slate-400'
            }`}>
              <span className="w-4 h-4 rounded-full bg-white/20 text-[10px] flex items-center justify-center">1</span>
              <span className="hidden sm:inline">Travelers</span>
            </div>

            <span className="text-slate-600">&bull;</span>

            <div className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
              currentStep === 'review' ? 'bg-sky-600 text-white font-bold' : 'text-slate-400'
            }`}>
              <span className="w-4 h-4 rounded-full bg-white/20 text-[10px] flex items-center justify-center">2</span>
              <span className="hidden sm:inline">Review</span>
            </div>

            <span className="text-slate-600">&bull;</span>

            <div className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
              currentStep === 'payment' || currentStep === 'processing' ? 'bg-sky-600 text-white font-bold' : 'text-slate-400'
            }`}>
              <span className="w-4 h-4 rounded-full bg-white/20 text-[10px] flex items-center justify-center">3</span>
              <span className="hidden sm:inline">Payment</span>
            </div>

            <span className="text-slate-600">&bull;</span>

            <div className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
              currentStep === 'confirmation' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400'
            }`}>
              <span className="w-4 h-4 rounded-full bg-white/20 text-[10px] flex items-center justify-center">✓</span>
              <span className="hidden sm:inline">Confirmed</span>
            </div>

            <button
              onClick={onClose}
              className="ml-2 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* MAIN BODY: 2-Column Responsive Workspace with Sticky Trip Summary */}
        <div className="flex-1 overflow-y-auto flex flex-col lg:flex-row">
          
          {/* LEFT COLUMN: ACTIVE STEP FORM (Scrollable) */}
          <div className="flex-1 p-5 sm:p-7 space-y-6 overflow-y-auto">
            
            {/* ---------------------------------------------------- */}
            {/* STEP 1: TRAVELER / GUEST DETAILS                     */}
            {/* ---------------------------------------------------- */}
            {currentStep === 'traveler' && (
              <div className="space-y-6 animate-in fade-in">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <User className="w-5 h-5 text-sky-600" />
                    {serviceType === 'hotel' ? 'Guest Details & Room Configuration' : 'Traveler Manifest & Contact Info'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Enter names exactly as they appear on government-issued photo IDs (Aadhaar / Passport / Voter ID).
                  </p>
                </div>

                {/* Number of Passengers / Guests Selector */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      {serviceType === 'hotel' ? 'Number of Guests' : 'Total Travelers'}
                    </span>
                    <span className="text-[11px] text-slate-500">Includes seat allocation and passenger insurance</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4].map(num => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => handlePassengerCountChange(num)}
                        className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                          passengersCount === num
                            ? 'bg-slate-900 text-white shadow-sm'
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Primary Contact Details for E-Ticket Delivery */}
                <div className="p-4 bg-sky-50/60 rounded-2xl border border-sky-100 space-y-3">
                  <h4 className="text-xs font-bold text-sky-950 uppercase tracking-wider flex items-center gap-1.5">
                    <Ticket className="w-3.5 h-3.5 text-sky-600" />
                    E-Ticket & SMS Booking Updates Delivery
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">Email Address *</label>
                      <input
                        type="email"
                        value={contactEmail}
                        onChange={e => setContactEmail(e.target.value)}
                        placeholder="you@domain.com"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">Mobile Number (India) *</label>
                      <div className="flex">
                        <span className="px-2.5 py-2 bg-slate-100 border border-r-0 border-slate-200 rounded-l-xl text-xs font-semibold text-slate-600">+91</span>
                        <input
                          type="tel"
                          value={contactPhone}
                          onChange={e => setContactPhone(e.target.value)}
                          placeholder="9876543210"
                          maxLength={10}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-r-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Passenger Cards */}
                <div className="space-y-4">
                  {passengerDetails.map((p, idx) => (
                    <div key={idx} className="p-4 bg-white rounded-2xl border border-slate-200 space-y-3 shadow-xs">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] flex items-center justify-center font-bold">
                            {idx + 1}
                          </span>
                          {idx === 0 ? 'Primary Passenger (Lead)' : `Traveler #${idx + 1}`}
                        </span>
                        <span className="text-[11px] font-medium text-slate-400">Govt ID Match Required</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div className="sm:col-span-2">
                          <label className="block text-[11px] font-medium text-slate-600 mb-1">Full Name *</label>
                          <input
                            type="text"
                            value={p.name}
                            onChange={e => {
                              const updated = [...passengerDetails];
                              updated[idx].name = e.target.value;
                              setPassengerDetails(updated);
                            }}
                            placeholder="e.g. Soham Naik"
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-medium text-slate-600 mb-1">Age</label>
                          <input
                            type="number"
                            value={p.age}
                            onChange={e => {
                              const updated = [...passengerDetails];
                              updated[idx].age = parseInt(e.target.value) || 25;
                              setPassengerDetails(updated);
                            }}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-medium text-slate-600 mb-1">Gender</label>
                          <select
                            value={p.gender}
                            onChange={e => {
                              const updated = [...passengerDetails];
                              updated[idx].gender = e.target.value as any;
                              setPassengerDetails(updated);
                            }}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none"
                          >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-medium text-slate-600 mb-1">ID Type</label>
                          <select
                            value={p.idType}
                            onChange={e => {
                              const updated = [...passengerDetails];
                              updated[idx].idType = e.target.value;
                              setPassengerDetails(updated);
                            }}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none"
                          >
                            <option value="Aadhaar">Aadhaar Card</option>
                            <option value="Passport">Passport</option>
                            <option value="Driving License">Driving License</option>
                            <option value="Voter ID">Voter ID</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-medium text-slate-600 mb-1">Seat / Berth Preference</label>
                          <select
                            value={p.seatPreference}
                            onChange={e => {
                              const updated = [...passengerDetails];
                              updated[idx].seatPreference = e.target.value;
                              setPassengerDetails(updated);
                            }}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none"
                          >
                            <option value="Window / Lower">Window / Lower Berth</option>
                            <option value="Aisle / Middle">Aisle / Middle</option>
                            <option value="Any Available">No Preference</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Special Requests */}
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">Special Requests (Optional)</label>
                  <input
                    type="text"
                    value={specialRequests}
                    onChange={e => setSpecialRequests(e.target.value)}
                    placeholder="e.g. Vegetarian meal, Quiet room, Wheelchair assistance"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => {
                      if (validateTravelerDetails()) {
                        setCurrentStep('review');
                      }
                    }}
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    Proceed to Review & Fare Rules
                  </Button>
                </div>
              </div>
            )}

            {/* ---------------------------------------------------- */}
            {/* STEP 2: REVIEW & ADD-ONS & FARE RULES                */}
            {/* ---------------------------------------------------- */}
            {currentStep === 'review' && (
              <div className="space-y-6 animate-in fade-in">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-sky-600" />
                    Review Trip Details & Fare Policy
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Please verify your route, baggage allowances, and cancellation policies before making payment.
                  </p>
                </div>

                {/* Route & Passenger Confirmation Summary */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs">
                  <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-slate-900 text-sm">{title}</span>
                      <span className="px-2 py-0.5 bg-slate-200 text-slate-700 rounded-md font-bold text-[10px] uppercase">
                        {(details as any)?.seatClass || (details as any)?.roomType || 'Confirmed Class'}
                      </span>
                    </div>
                    <span className="font-bold text-sky-700">📍 {destinationName}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-slate-700">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Travel Date</span>
                      <span className="font-bold text-slate-900">{travelDate}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Passengers / Guests</span>
                      <span className="font-bold text-slate-900">{passengerDetails.map(p => p.name).join(', ')}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">E-Ticket Delivery</span>
                      <span className="font-bold text-slate-900">{contactEmail}</span>
                    </div>
                  </div>
                </div>

                {/* 🛡️ Inline Cancellation Policy & Fare Rules (Hard OTA Requirement) */}
                <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-950 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      Fare Rules & Cancellation Policy
                    </span>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded-md text-[10px]">
                      100% Refundable Guarantee
                    </span>
                  </div>
                  <p className="text-emerald-900 leading-relaxed">
                    <strong>Cancellation Window:</strong> Free cancellation up to 24 hours prior to travel. 
                    Cancelled bookings trigger an automatic 100% wallet refund credited instantly to your ExploreX Wallet.
                  </p>
                </div>

                {/* 🎁 Travel Add-on Upsells (Travel OTA Presentation) */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                    Recommended Travel Enhancements
                  </h4>

                  <div className="space-y-2">
                    {/* Insurance Add-on */}
                    <div 
                      onClick={() => setIncludeInsurance(!includeInsurance)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between text-xs ${
                        includeInsurance ? 'bg-sky-50 border-sky-300 ring-1 ring-sky-400/30' : 'bg-white border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-lg flex items-center justify-center border text-xs font-bold ${
                          includeInsurance ? 'bg-sky-600 text-white border-sky-600' : 'border-slate-300 bg-white'
                        }`}>
                          {includeInsurance && '✓'}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block">Comprehensive Travel & Medical Insurance</span>
                          <span className="text-[11px] text-slate-500">₹5,00,000 emergency cover, baggage loss & flight delay protection</span>
                        </div>
                      </div>
                      <span className="font-black text-slate-900">{formatINR(199 * passengersCount)}</span>
                    </div>

                    {/* Carbon Offset Add-on */}
                    <div 
                      onClick={() => setIncludeCarbonOffset(!includeCarbonOffset)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between text-xs ${
                        includeCarbonOffset ? 'bg-emerald-50 border-emerald-300 ring-1 ring-emerald-400/30' : 'bg-white border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-lg flex items-center justify-center border text-xs font-bold ${
                          includeCarbonOffset ? 'bg-emerald-600 text-white border-emerald-600' : 'border-slate-300 bg-white'
                        }`}>
                          {includeCarbonOffset && '✓'}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block">100% Certified Carbon-Neutral Travel Offset</span>
                          <span className="text-[11px] text-slate-500">Supports native reforestation in Western Ghats & Himalayan trails</span>
                        </div>
                      </div>
                      <span className="font-black text-slate-900">{formatINR(49 * passengersCount)}</span>
                    </div>
                  </div>
                </div>

                {/* Coupon Code Section */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Percent className="w-3.5 h-3.5 text-sky-600" />
                      Apply Promo Code
                    </span>
                    {appliedPromo && (
                      <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {appliedPromo.code} Active (-{formatINR(promoDiscount)})
                      </span>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCodeInput}
                      onChange={e => setPromoCodeInput(e.target.value)}
                      placeholder="Try WANDER20, EXPLORE10, FIRSTTRIP"
                      className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 uppercase focus:outline-none"
                    />
                    <Button variant="secondary" size="sm" onClick={() => handleApplyCoupon()}>
                      Apply
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentStep('traveler')}
                    leftIcon={<ArrowLeft className="w-4 h-4" />}
                  >
                    Back to Travelers
                  </Button>

                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => setCurrentStep('payment')}
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    Proceed to Payment ({formatINR(grandTotal)})
                  </Button>
                </div>
              </div>
            )}

            {/* ---------------------------------------------------- */}
            {/* STEP 3: PAYMENT METHOD SELECTION (Amazon/Flipkart)    */}
            {/* ---------------------------------------------------- */}
            {currentStep === 'payment' && (
              <div className="space-y-6 animate-in fade-in">
                <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-sky-600" />
                      Select Payment Method
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      100% Encrypted & Verified by Razorpay PCI-DSS Level 1 Gateway
                    </p>
                  </div>

                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-bold text-[11px] rounded-lg border border-emerald-200 flex items-center gap-1">
                    <Lock className="w-3 h-3 text-emerald-600" />
                    256-bit SSL
                  </span>
                </div>

                {/* Error Banner if dismissed or failed */}
                {paymentErrorMessage && (
                  <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 space-y-1">
                    <div className="font-bold flex items-center gap-1.5 text-rose-900">
                      <AlertCircle className="w-4 h-4 text-rose-600" />
                      <span>Payment Status Update</span>
                    </div>
                    <p className="text-[11px] leading-relaxed">{paymentErrorMessage}</p>
                  </div>
                )}

                {/* Vertical Category Accordion List (Amazon / Flipkart Style Breadth) */}
                <div className="space-y-3">
                  
                  {/* CATEGORY 1: UPI (Recommended) */}
                  <div className={`rounded-2xl border transition-all overflow-hidden ${
                    paymentCategory === 'upi' ? 'border-sky-500 bg-sky-50/30 ring-2 ring-sky-500/20' : 'border-slate-200 bg-white'
                  }`}>
                    <div 
                      onClick={() => setPaymentCategory('upi')}
                      className="p-4 flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          paymentCategory === 'upi' ? 'border-sky-600 bg-sky-600 text-white' : 'border-slate-300'
                        }`}>
                          {paymentCategory === 'upi' && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-slate-900">UPI (Google Pay, PhonePe, Paytm, BHIM)</span>
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[9px] rounded uppercase tracking-wider">
                              Recommended
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-500">Instant Authorization & 0% Payment Gateway Fee</span>
                        </div>
                      </div>
                      <Smartphone className="w-5 h-5 text-sky-600" />
                    </div>

                    {paymentCategory === 'upi' && (
                      <div className="p-4 pt-0 border-t border-sky-100/60 space-y-3 text-xs">
                        {/* Quick UPI App Selectors */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                          {[
                            { id: 'gpay', name: 'Google Pay', icon: '🟢' },
                            { id: 'phonepe', name: 'PhonePe', icon: '🟣' },
                            { id: 'paytm', name: 'Paytm UPI', icon: '🔵' },
                            { id: 'bhim', name: 'BHIM UPI', icon: '🟠' }
                          ].map(app => (
                            <button
                              key={app.id}
                              type="button"
                              onClick={() => {
                                setUpiOption('app');
                                setSelectedUpiApp(app.id as any);
                              }}
                              className={`p-2.5 rounded-xl border text-center font-bold text-xs transition-all ${
                                selectedUpiApp === app.id
                                  ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                              }`}
                            >
                              <span className="mr-1">{app.icon}</span> {app.name}
                            </button>
                          ))}
                        </div>

                        {/* UPI ID input */}
                        <div className="pt-2">
                          <label className="block text-[11px] font-semibold text-slate-700 mb-1">Enter UPI ID / VPA</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={upiVpa}
                              onChange={e => setUpiVpa(e.target.value)}
                              placeholder="username@okhdfcbank"
                              className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* CATEGORY 2: CREDIT / DEBIT CARDS */}
                  <div className={`rounded-2xl border transition-all overflow-hidden ${
                    paymentCategory === 'card' ? 'border-sky-500 bg-sky-50/30 ring-2 ring-sky-500/20' : 'border-slate-200 bg-white'
                  }`}>
                    <div 
                      onClick={() => setPaymentCategory('card')}
                      className="p-4 flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          paymentCategory === 'card' ? 'border-sky-600 bg-sky-600 text-white' : 'border-slate-300'
                        }`}>
                          {paymentCategory === 'card' && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                        <div>
                          <span className="font-bold text-xs text-slate-900 block">Credit / Debit Card</span>
                          <span className="text-[11px] text-slate-500">Visa, Mastercard, RuPay, American Express, Diners</span>
                        </div>
                      </div>
                      <CreditCard className="w-5 h-5 text-indigo-600" />
                    </div>

                    {paymentCategory === 'card' && (
                      <div className="p-4 pt-0 border-t border-sky-100/60 space-y-3 text-xs">
                        {/* Test Card Callout */}
                        <div className="p-2.5 bg-sky-50 rounded-xl border border-sky-200 text-[11px] text-sky-900 flex items-center justify-between">
                          <span>💳 <strong>Test Card:</strong> <code className="font-mono font-bold">4111 1111 1111 1111</code> (Exp: 12/30, CVV: 123)</span>
                          <span className="font-bold bg-white px-2 py-0.5 rounded text-sky-800">{cardBrand}</span>
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-1">Card Number</label>
                          <input
                            type="text"
                            value={cardNumber}
                            onChange={e => setCardNumber(e.target.value)}
                            placeholder="4111 1111 1111 1111"
                            maxLength={19}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Expiry Date (MM/YY)</label>
                            <input
                              type="text"
                              value={cardExpiry}
                              onChange={e => setCardExpiry(e.target.value)}
                              placeholder="12/30"
                              maxLength={5}
                              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-700 mb-1">CVV / Security Code</label>
                            <input
                              type="password"
                              value={cardCvv}
                              onChange={e => setCardCvv(e.target.value)}
                              placeholder="123"
                              maxLength={4}
                              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-1">Cardholder Name</label>
                          <input
                            type="text"
                            value={cardName}
                            onChange={e => setCardName(e.target.value)}
                            placeholder="Soham Naik"
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
                          />
                        </div>

                        <label className="flex items-center gap-2 cursor-pointer pt-1">
                          <input
                            type="checkbox"
                            checked={saveCard}
                            onChange={e => setSaveCard(e.target.checked)}
                            className="rounded text-sky-600 focus:ring-sky-500"
                          />
                          <span className="text-[11px] text-slate-600">Save card securely for future bookings under RBI Tokenization guidelines</span>
                        </label>
                      </div>
                    )}
                  </div>

                  {/* CATEGORY 3: NET BANKING */}
                  <div className={`rounded-2xl border transition-all overflow-hidden ${
                    paymentCategory === 'netbanking' ? 'border-sky-500 bg-sky-50/30 ring-2 ring-sky-500/20' : 'border-slate-200 bg-white'
                  }`}>
                    <div 
                      onClick={() => setPaymentCategory('netbanking')}
                      className="p-4 flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          paymentCategory === 'netbanking' ? 'border-sky-600 bg-sky-600 text-white' : 'border-slate-300'
                        }`}>
                          {paymentCategory === 'netbanking' && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                        <div>
                          <span className="font-bold text-xs text-slate-900 block">Net Banking</span>
                          <span className="text-[11px] text-slate-500">SBI, HDFC, ICICI, Axis, Kotak, PNB & 50+ Banks</span>
                        </div>
                      </div>
                      <Building2 className="w-5 h-5 text-purple-600" />
                    </div>

                    {paymentCategory === 'netbanking' && (
                      <div className="p-4 pt-0 border-t border-sky-100/60 space-y-3 text-xs">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2">
                          {POPULAR_INDIAN_BANKS.map(bank => (
                            <button
                              key={bank.id}
                              type="button"
                              onClick={() => setSelectedBank(bank.code)}
                              className={`p-2.5 rounded-xl border text-center font-bold text-xs transition-all ${
                                selectedBank === bank.code
                                  ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                              }`}
                            >
                              🏦 {bank.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* CATEGORY 4: WALLETS (ExploreX In-App Wallet + 3rd Party) */}
                  <div className={`rounded-2xl border transition-all overflow-hidden ${
                    paymentCategory === 'wallet' ? 'border-sky-500 bg-sky-50/30 ring-2 ring-sky-500/20' : 'border-slate-200 bg-white'
                  }`}>
                    <div 
                      onClick={() => setPaymentCategory('wallet')}
                      className="p-4 flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          paymentCategory === 'wallet' ? 'border-sky-600 bg-sky-600 text-white' : 'border-slate-300'
                        }`}>
                          {paymentCategory === 'wallet' && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-slate-900">ExploreX Wallet & Rewards</span>
                            <span className="px-2 py-0.5 bg-amber-100 text-amber-900 font-black text-[10px] rounded">
                              Balance: {formatINR(walletBalance)}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-500">Direct 1-Click Deduction with instant refund security</span>
                        </div>
                      </div>
                      <Wallet className="w-5 h-5 text-amber-600" />
                    </div>

                    {paymentCategory === 'wallet' && (
                      <div className="p-4 pt-0 border-t border-sky-100/60 space-y-2 text-xs">
                        <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                          <div>
                            <span className="font-bold text-slate-900 block">Available ExploreX Balance</span>
                            <span className="text-[11px] text-slate-500">
                              {walletBalance >= grandTotal
                                ? '✓ Full booking amount covered by wallet balance'
                                : `Covers ${formatINR(walletDeduction)} • Remaining ₹${remainingPayableAfterWallet} payable via Razorpay`}
                            </span>
                          </div>
                          <span className="font-black text-base text-emerald-600">{formatINR(walletBalance)}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* CATEGORY 5: EMI (Eligible for bookings >= ₹10,000) */}
                  {grandTotal >= 10000 && (
                    <div className={`rounded-2xl border transition-all overflow-hidden ${
                      paymentCategory === 'emi' ? 'border-sky-500 bg-sky-50/30 ring-2 ring-sky-500/20' : 'border-slate-200 bg-white'
                    }`}>
                      <div 
                        onClick={() => setPaymentCategory('emi')}
                        className="p-4 flex items-center justify-between cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                            paymentCategory === 'emi' ? 'border-sky-600 bg-sky-600 text-white' : 'border-slate-300'
                          }`}>
                            {paymentCategory === 'emi' && <div className="w-2 h-2 rounded-full bg-white" />}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-xs text-slate-900">EMI (Easy Monthly Installments)</span>
                              <span className="px-2 py-0.5 bg-purple-100 text-purple-800 font-bold text-[9px] rounded uppercase">
                                Low Cost EMI
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-500">Starting from {formatINR(Math.round(grandTotal / 12))}/month</span>
                          </div>
                        </div>
                        <Percent className="w-5 h-5 text-purple-600" />
                      </div>

                      {paymentCategory === 'emi' && (
                        <div className="p-4 pt-0 border-t border-sky-100/60 space-y-2 text-xs">
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                            {[3, 6, 9, 12].map(months => {
                              const monthly = Math.round(grandTotal / months);
                              return (
                                <button
                                  key={months}
                                  type="button"
                                  onClick={() => setSelectedEmiTenure(months)}
                                  className={`p-2.5 rounded-xl border text-center transition-all ${
                                    selectedEmiTenure === months
                                      ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                                  }`}
                                >
                                  <div className="font-bold text-xs">{months} Months</div>
                                  <div className="text-[10px] font-black">{formatINR(monthly)}/mo</div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                </div>

                <div className="flex items-center justify-between pt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentStep('review')}
                    leftIcon={<ArrowLeft className="w-4 h-4" />}
                  >
                    Back to Review
                  </Button>

                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleProceedToPayment}
                    rightIcon={<Lock className="w-4 h-4" />}
                    className="font-black shadow-lg"
                  >
                    Pay {formatINR(grandTotal)} via Razorpay
                  </Button>
                </div>
              </div>
            )}

            {/* ---------------------------------------------------- */}
            {/* STEP 4: PROCESSING STATE                             */}
            {/* ---------------------------------------------------- */}
            {currentStep === 'processing' && (
              <div className="py-16 text-center space-y-4 animate-in fade-in">
                <div className="w-16 h-16 rounded-full border-4 border-sky-600 border-t-transparent animate-spin mx-auto" />
                <h3 className="text-xl font-bold text-slate-900">
                  {processingStatus === 'verifying'
                    ? 'Verifying Payment Signature with Razorpay...'
                    : `Confirming Reservation with ${serviceType.toUpperCase()} Provider...`}
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                  Securing seats, generating official PNR and GST tax invoices. Please do not refresh or press back.
                </p>
              </div>
            )}

            {/* ---------------------------------------------------- */}
            {/* STEP 5: AMAZON-STYLE TRAVEL CONFIRMATION             */}
            {/* ---------------------------------------------------- */}
            {currentStep === 'confirmation' && confirmedBooking && (
              <div className="space-y-6 animate-in fade-in">
                {/* Amazon-Style Main Booking Confirmed Card */}
                <div className="bg-[#FFFFFF] border border-[#E4E4DF] rounded-2xl p-6 sm:p-8 text-center space-y-4 shadow-editorial">
                  <div className="w-16 h-16 bg-[#EEF2ED] text-[#242424] rounded-full flex items-center justify-center mx-auto border-2 border-[#242424]/20">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono tracking-widest uppercase text-[#242424] font-bold block">
                      Booking Confirmed
                    </span>
                    <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#242424] mt-1">
                      Your trip is confirmed!
                    </h3>
                    <p className="font-prose text-sm text-[#6B6B67] mt-1">
                      Your trip to <strong className="text-[#242424] font-semibold">{confirmedBooking.destinationName}</strong> is confirmed.
                    </p>
                  </div>

                  {/* Clean Structured Receipt Box */}
                  <div className="bg-white rounded-xl border border-[#E4E4DF] p-4 sm:p-5 text-left space-y-2.5 text-xs font-mono">
                    <div className="flex justify-between border-b border-[#F7F7F4] pb-2">
                      <span className="text-[#6B6B67] uppercase text-[10px]">Booking ID</span>
                      <span className="font-bold text-[#242424]">
                        {confirmedBooking.details?.pnrNumber || `EXX-${confirmedBooking.id.slice(0, 8).toUpperCase()}`}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-[#F7F7F4] pb-2">
                      <span className="text-[#6B6B67] uppercase text-[10px]">Destination</span>
                      <span className="font-bold text-[#242424] font-sans">{confirmedBooking.destinationName}</span>
                    </div>
                    <div className="flex justify-between border-b border-[#F7F7F4] pb-2">
                      <span className="text-[#6B6B67] uppercase text-[10px]">Payment</span>
                      <span className="font-bold text-[#242424]">{formatINR(confirmedBooking.totalAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#6B6B67] uppercase text-[10px]">Status</span>
                      <span className="font-bold text-[#242424] inline-flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#242424] inline-block" />
                        Payment Successful
                      </span>
                    </div>
                  </div>

                  <p className="font-prose text-xs text-[#6B6B67] italic">
                    Your trip has been added to <strong>My Trips</strong>.
                  </p>

                  <div className="pt-1 flex flex-col sm:flex-row items-center gap-2">
                    <Button
                      variant="primary"
                      size="md"
                      fullWidth
                      onClick={() => {
                        onClose();
                        if (onNavigateToMyTrips) onNavigateToMyTrips();
                      }}
                      rightIcon={<ArrowRight className="w-4 h-4" />}
                      className="bg-[#242424] hover:bg-[#91482D]"
                    >
                      View My Trips {redirectCountdown > 0 && `(${redirectCountdown}s)`}
                    </Button>
                  </div>

                  {redirectCountdown > 0 && (
                    <div className="text-[11px] font-mono text-[#6B6B67]">
                      Redirecting automatically to My Trips in {redirectCountdown} second{redirectCountdown === 1 ? '' : 's'}...
                    </div>
                  )}
                </div>

                {/* Confirmed Trip Summary Card */}
                <div className="p-5 bg-white rounded-2xl border border-[#E4E4DF] text-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-[#F7F7F4] pb-3">
                    <div>
                      <span className="font-display font-bold text-[#242424] text-sm block">{confirmedBooking.title}</span>
                      <span className="text-[#6B6B67] text-[11px]">Travel Date: <strong className="font-mono text-[#242424]">{confirmedBooking.travelDate}</strong></span>
                    </div>
                    <span className="px-2.5 py-1 bg-[#F7F7F4] text-[#242424] font-mono font-bold rounded-lg uppercase text-[10px] border border-[#E4E4DF]">
                      ● Confirmed
                    </span>
                  </div>

                  {/* Passenger Manifest Table */}
                  <div className="pt-1 space-y-2">
                    <span className="text-[10px] font-mono uppercase text-[#6B6B67] tracking-wider block">
                      Confirmed Passenger Manifest
                    </span>
                    <div className="space-y-1.5">
                      {passengerDetails.map((p, i) => (
                        <div key={i} className="flex items-center justify-between p-2.5 bg-[#FFFFFF] rounded-xl border border-[#E4E4DF] text-[11px]">
                          <div className="flex items-center gap-2">
                            <span className="w-4 h-4 rounded-full bg-[#242424] text-[#FFFFFF] text-[9px] flex items-center justify-center font-bold">
                              {i + 1}
                            </span>
                            <span className="font-bold text-[#242424]">{p.name}</span>
                            <span className="text-[#6B6B67]">({p.gender}, {p.age} yrs)</span>
                          </div>
                          <div className="flex items-center gap-2 text-[#6B6B67]">
                            <span className="bg-[#F7F7F4] text-[#242424] px-2 py-0.5 rounded font-mono text-[10px] border border-[#E4E4DF]">
                              Seat: {p.seatPreference || 'Assigned'}
                            </span>
                            <span className="text-[#6B6B67] text-[10px]">{p.idType}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ✈️ Web Check-in Reminder Notice for Flights */}
                {serviceType === 'flight' && (
                  <div className="p-3.5 bg-[#F7F7F4] rounded-xl border border-[#E4E4DF] text-xs text-[#242424] space-y-1">
                    <div className="font-bold flex items-center gap-1.5 text-[#242424]">
                      <Plane className="w-3.5 h-3.5 text-[#91482D]" />
                      <span>Web Check-In Notice</span>
                    </div>
                    <p className="text-[11px] text-[#6B6B67] leading-relaxed">
                      Web check-in opens <strong>48 hours</strong> before departure. Boarding passes and seat confirmation have been queued for <strong>{contactEmail}</strong>.
                    </p>
                  </div>
                )}

                {/* Next Step Actions */}
                <div className="space-y-2.5 pt-1">
                  <h4 className="text-xs font-mono font-bold text-[#242424] uppercase tracking-wider">Travel Management & Documents</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {/* Action 1: Print / Download Official E-Ticket & GST Invoice */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        window.print();
                      }}
                      leftIcon={<FileText className="w-3.5 h-3.5 text-[#242424]" />}
                    >
                      Print E-Ticket & Tax Invoice
                    </Button>

                    {/* Action 2: Download Calendar Event */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        downloadCalendarEvent({
                          title: confirmedBooking.title,
                          description: `ExploreX Travel Booking: ${confirmedBooking.destinationName}`,
                          location: confirmedBooking.destinationName,
                          startDate: confirmedBooking.travelDate,
                          endDate: confirmedBooking.returnDate,
                          pnr: confirmedBooking.details?.pnrNumber || confirmedBooking.id
                        });
                        success('Calendar Event Exported', 'Added to your calendar (.ics file downloaded).');
                      }}
                      leftIcon={<CalendarPlus className="w-3.5 h-3.5 text-[#91482D]" />}
                    >
                      Add to Calendar (.ics)
                    </Button>

                    {/* Action 3: Share Itinerary */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (navigator.clipboard) {
                          navigator.clipboard.writeText(
                            `ExploreX Booking Confirmed: ${confirmedBooking.title} on ${confirmedBooking.travelDate}. PNR: ${confirmedBooking.details?.pnrNumber || confirmedBooking.id}`
                          );
                          success('Itinerary Copied', 'Booking summary and reference copied to clipboard.');
                        }
                      }}
                      leftIcon={<Share2 className="w-3.5 h-3.5 text-[#6B6B67]" />}
                    >
                      Share Itinerary
                    </Button>

                    {/* Action 4: Get Directions to Transit Point */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const query = encodeURIComponent(`${confirmedBooking.destinationName} airport railway station`);
                        window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
                      }}
                      leftIcon={<Navigation className="w-3.5 h-3.5 text-[#242424]" />}
                    >
                      Get Directions on Maps
                    </Button>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* RIGHT COLUMN: STICKY TRIP SUMMARY SIDEBAR (MakeMyTrip / Cleartrip OTA Style) */}
          {currentStep !== 'confirmation' && currentStep !== 'processing' && (
            <div className="w-full lg:w-80 bg-slate-50 border-t lg:border-t-0 lg:border-l border-slate-200 p-5 space-y-4 shrink-0">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Ticket className="w-3.5 h-3.5 text-sky-600" />
                Fare & Journey Summary
              </h4>

              {/* Trip details pill */}
              <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-1">
                <span className="font-bold text-slate-900 block truncate">{title}</span>
                <span className="text-[11px] text-slate-500">📍 {destinationName}</span>
                <span className="text-[11px] text-slate-500 block">📅 Date: {travelDate}</span>
                <span className="text-[11px] text-slate-500 block">👥 {passengersCount} Passenger(s)</span>
              </div>

              {/* Detailed Itemized Fare Breakdown */}
              <div className="space-y-2 text-xs border-t border-slate-200 pt-3">
                <div className="flex justify-between text-slate-600">
                  <span>Base Fare ({formatINR(basePrice)} × {passengersCount})</span>
                  <span className="font-semibold text-slate-800">{formatINR(rawSubtotal)}</span>
                </div>

                {appliedPromo && promoDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Promo ({appliedPromo.code})</span>
                    <span>-{formatINR(promoDiscount)}</span>
                  </div>
                )}

                {includeInsurance && (
                  <div className="flex justify-between text-slate-600">
                    <span>Travel Insurance</span>
                    <span className="text-slate-800">+{formatINR(insuranceTotal)}</span>
                  </div>
                )}

                {includeCarbonOffset && (
                  <div className="flex justify-between text-slate-600">
                    <span>Carbon Offset</span>
                    <span className="text-slate-800">+{formatINR(carbonOffsetTotal)}</span>
                  </div>
                )}

                {includeFreeCancelShield && (
                  <div className="flex justify-between text-slate-600">
                    <span>Free Cancel Shield</span>
                    <span className="text-slate-800">+{formatINR(cancellationShieldTotal)}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-600">
                  <span>Taxes & GST (18%)</span>
                  <span>+{formatINR(taxAmount)}</span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>Convenience Fee</span>
                  <span>+{formatINR(convenienceFee)}</span>
                </div>

                {paymentCategory === 'wallet' && walletDeduction > 0 && (
                  <div className="flex justify-between text-amber-700 font-semibold pt-1 border-t border-slate-100">
                    <span>Wallet Applied</span>
                    <span>-{formatINR(walletDeduction)}</span>
                  </div>
                )}

                <div className="flex justify-between pt-3 border-t border-slate-200 text-sm font-black text-slate-900">
                  <span>Grand Total</span>
                  <span className="text-sky-600 text-base">{formatINR(grandTotal)}</span>
                </div>
              </div>

              {/* Free Cancellation Badge */}
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-900 flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Instant 100% Wallet Refund Guarantee on Cancellation</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
