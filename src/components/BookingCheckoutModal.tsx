import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, User, CreditCard, Wallet, ShieldCheck, CheckCircle2, Ticket, Sparkles, Tag, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import { Booking } from '../types';

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
}

export const BookingCheckoutModal: React.FC<BookingCheckoutModalProps> = ({
  isOpen,
  onClose,
  serviceType,
  title,
  destinationName,
  basePrice,
  duration,
  details = {},
  onBookingSuccess
}) => {
  const { user, refreshProfile } = useAuth();
  const { success, error } = useToast();

  const [travelDate, setTravelDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [returnDate, setReturnDate] = useState<string>('');
  const [passengersCount, setPassengersCount] = useState<number>(1);
  const [passengerDetails, setPassengerDetails] = useState<{ name: string; age: number; gender: string }[]>([
    { name: user?.name || 'Primary Traveler', age: 28, gender: 'Male' }
  ]);
  const [promoCode, setPromoCode] = useState<string>('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number } | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'wallet' | 'card_demo' | 'upi_demo'>('razorpay');
  const [loading, setLoading] = useState<boolean>(false);

  if (!isOpen) return null;

  const rawSubtotal = basePrice * passengersCount;
  let promoDiscount = 0;
  if (appliedPromo) {
    if (appliedPromo.code === 'WANDER20') {
      promoDiscount = Math.min(150, Math.round(rawSubtotal * 0.2));
    } else if (appliedPromo.code === 'AIPEAK10') {
      promoDiscount = Math.min(75, Math.round(rawSubtotal * 0.1));
    } else if (appliedPromo.code === 'EXPLOREFREE') {
      promoDiscount = Math.min(15, rawSubtotal);
    }
  }

  const taxAmt = Math.round(rawSubtotal * 0.08);
  const grandTotal = Math.max(0, rawSubtotal + taxAmt - promoDiscount);
  const walletBalance = user?.walletBalance || 0;
  const isWalletInsufficient = paymentMethod === 'wallet' && walletBalance < grandTotal;

  const handlePassengerCountChange = (count: number) => {
    const validCount = Math.max(1, Math.min(10, count));
    setPassengersCount(validCount);
    const updated = [...passengerDetails];
    while (updated.length < validCount) {
      updated.push({ name: `Traveler ${updated.length + 1}`, age: 25, gender: 'Any' });
    }
    while (updated.length > validCount) {
      updated.pop();
    }
    setPassengerDetails(updated);
  };

  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (code === 'WANDER20' || code === 'AIPEAK10' || code === 'EXPLOREFREE') {
      setAppliedPromo({ code, discount: 20 });
      success('Promo Code Applied', `Verified code ${code} active!`);
    } else {
      error('Invalid Promo Code', 'Try WANDER20 or AIPEAK10');
    }
  };

  const executeBooking = async (payMethod: string, rzpDetails?: any) => {
    const created = await api.createBooking({
      serviceType,
      title,
      destinationName,
      travelDate,
      returnDate: returnDate || undefined,
      passengersCount,
      passengerDetails,
      totalAmount: grandTotal,
      paymentMethod: payMethod as any,
      promoCode: appliedPromo?.code,
      details: {
        ...details,
        duration,
        ...(rzpDetails || {})
      }
    });

    await refreshProfile();
    success('Booking Confirmed!', `Booking reference #${created.id} active via ${payMethod.toUpperCase()}.`);
    onBookingSuccess(created);
    onClose();
  };

  const handleConfirmBooking = async () => {
    if (isWalletInsufficient) {
      error('Insufficient Wallet Balance', 'Please top up your wallet or choose Razorpay / UPI.');
      return;
    }

    setLoading(true);
    try {
      if (paymentMethod === 'razorpay') {
        // Step 1: Create Razorpay Order from backend
        const orderRes = await api.createRazorpayOrder(grandTotal, 'INR');
        
        if (!orderRes.success || !orderRes.order) {
          throw new Error('Failed to create Razorpay Order');
        }

        const RazorpaySDK = (window as any).Razorpay;
        if (RazorpaySDK) {
          const options = {
            key: orderRes.keyId,
            amount: orderRes.order.amount,
            currency: orderRes.order.currency,
            name: 'ExploreX Travel Platform',
            description: `${title} - ${destinationName}`,
            order_id: orderRes.order.id,
            handler: async (response: any) => {
              try {
                // Step 2: Verify Payment Signature via Backend
                const verifyRes = await api.verifyRazorpayPayment({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature || 'mock_signature',
                });

                if (verifyRes.verified) {
                  await executeBooking('razorpay', {
                    razorpayPaymentId: response.razorpay_payment_id,
                    razorpayOrderId: response.razorpay_order_id,
                  });
                } else {
                  error('Payment Failed', 'Razorpay signature verification failed.');
                }
              } catch (verifyErr: any) {
                error('Verification Error', verifyErr.message);
              }
            },
            prefill: {
              name: user?.name || 'Traveler',
              email: user?.email || 'traveler@explorex.com',
            },
            theme: {
              color: '#0284c7',
            },
          };

          const rzpInstance = new RazorpaySDK(options);
          rzpInstance.open();
        } else {
          // Sandbox direct completion fallback
          const verifyRes = await api.verifyRazorpayPayment({
            razorpay_order_id: orderRes.order.id,
            razorpay_payment_id: `pay_rzp_${Date.now()}`,
            razorpay_signature: 'mock_signature',
          });

          if (verifyRes.verified) {
            await executeBooking('razorpay', {
              razorpayPaymentId: verifyRes.paymentId,
              razorpayOrderId: orderRes.order.id,
            });
          }
        }
      } else {
        await executeBooking(paymentMethod);
      }
    } catch (err: any) {
      error('Booking Failed', err.message || 'Failed to complete booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8"
        >
          {/* Header */}
          <div className="bg-slate-900 text-white p-6 relative">
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-500/20 text-sky-300 text-xs font-semibold rounded-full border border-sky-400/30 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Verified Multi-Modal Booking Checkout
            </div>
            <h3 className="text-xl font-bold text-white">{title}</h3>
            <p className="text-xs text-slate-300 mt-1 flex items-center gap-2">
              <span>📍 {destinationName}</span>
              {duration && <span>• ⏱️ {duration}</span>}
              <span className="capitalize">• 🏷️ {serviceType}</span>
            </p>
          </div>

          <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
            {/* Travel Dates & Passengers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-sky-600" />
                  Departure / Check-in Date
                </label>
                <input
                  type="date"
                  value={travelDate}
                  onChange={e => setTravelDate(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              {serviceType === 'hotel' || serviceType === 'package' ? (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-sky-600" />
                    Return / Check-out Date
                  </label>
                  <input
                    type="date"
                    value={returnDate}
                    onChange={e => setReturnDate(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-sky-600" />
                    Number of Travelers
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={passengersCount}
                      onChange={e => handlePassengerCountChange(parseInt(e.target.value) || 1)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Passenger Details */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-4 h-4 text-sky-600" />
                Passenger / Guest Details ({passengerDetails.length})
              </h4>
              {passengerDetails.map((p, idx) => (
                <div key={idx} className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder={`Traveler ${idx + 1} Name`}
                    value={p.name}
                    onChange={e => {
                      const updated = [...passengerDetails];
                      updated[idx].name = e.target.value;
                      setPassengerDetails(updated);
                    }}
                    className="p-2 bg-white border border-slate-200 rounded-lg text-xs font-medium focus:ring-1 focus:ring-sky-500"
                  />
                  <input
                    type="number"
                    placeholder="Age"
                    value={p.age}
                    onChange={e => {
                      const updated = [...passengerDetails];
                      updated[idx].age = parseInt(e.target.value) || 20;
                      setPassengerDetails(updated);
                    }}
                    className="p-2 bg-white border border-slate-200 rounded-lg text-xs font-medium focus:ring-1 focus:ring-sky-500"
                  />
                  <select
                    value={p.gender}
                    onChange={e => {
                      const updated = [...passengerDetails];
                      updated[idx].gender = e.target.value;
                      setPassengerDetails(updated);
                    }}
                    className="p-2 bg-white border border-slate-200 rounded-lg text-xs font-medium focus:ring-1 focus:ring-sky-500"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              ))}
            </div>

            {/* Promo Code input */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Promo Code (e.g. WANDER20, AIPEAK10)"
                  value={promoCode}
                  onChange={e => setPromoCode(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs uppercase font-semibold focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>
              <button
                type="button"
                onClick={handleApplyPromo}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold transition-colors"
              >
                Apply
              </button>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">Payment Method</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('razorpay')}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    paymentMethod === 'razorpay'
                      ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <CreditCard className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-bold text-slate-900">Razorpay Gateway</span>
                    <span className="text-[9px] font-extrabold text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded">UPI / Cards</span>
                  </div>
                  <div className="text-[11px] text-slate-500">Live & Test Gateway</div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('wallet')}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    paymentMethod === 'wallet'
                      ? 'border-sky-600 bg-sky-50/60 ring-2 ring-sky-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Wallet className="w-4 h-4 text-sky-600" />
                    <span className="text-xs font-bold text-slate-800">Wander Wallet</span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Balance: <span className="font-semibold text-slate-900">${walletBalance.toFixed(2)}</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Base Fare ({passengersCount} traveler{passengersCount > 1 ? 's' : ''})</span>
                <span className="font-semibold text-slate-900">${rawSubtotal}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Taxes & Verification Fees (8%)</span>
                <span>${taxAmt}</span>
              </div>
              {appliedPromo && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Discount ({appliedPromo.code})</span>
                  <span>-${promoDiscount}</span>
                </div>
              )}
              <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-bold text-slate-900">
                <span>Grand Total</span>
                <span className="text-sky-600">${grandTotal}</span>
              </div>
            </div>

            {/* Simulation Notice per requirement */}
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-2 text-amber-900 text-xs">
              <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">Transparent Demo Simulation:</span> No real payment gateway or credit card debit occurs. All bookings generate verified mock e-Tickets and update your live history.
              </div>
            </div>
          </div>

          {/* Footer actions */}
          <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-500">Amount Due</div>
              <div className="text-xl font-bold text-slate-900">${grandTotal}</div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmBooking}
                disabled={loading || isWalletInsufficient}
                className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Confirm & Pay ${grandTotal}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
