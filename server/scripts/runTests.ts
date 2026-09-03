import { itineraryService } from '../services/itineraryService';
import { paymentService } from '../services/paymentService';
import { exploreService } from '../services/exploreService';

async function runAutomatedVerificationSuite() {
  console.log('======================================================');
  console.log('🧪 ExploreX Comprehensive Verification & Test Suite');
  console.log('======================================================\n');

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    totalTests++;
    if (condition) {
      passedTests++;
      console.log(`✅ [PASS] ${testName} ${detail ? `(${detail})` : ''}`);
    } else {
      console.error(`❌ [FAIL] ${testName} ${detail ? `(${detail})` : ''}`);
    }
  }

  // TEST 1: Destination Normalization & Isolation (Mumbai Request)
  console.log('--- 1. Testing Destination Isolation (Mumbai Request) ---');
  const mumbaiItin = await itineraryService.generateItinerary({
    destination: 'Mumbai',
    durationDays: 3,
    travelersCount: 2,
    budgetLevel: 'moderate',
    interests: ['heritage', 'culture', 'food'],
    travelStyle: 'couple'
  });
  assert(mumbaiItin.destination === 'Mumbai', 'Mumbai destination name preserved');
  assert(mumbaiItin.destinationId === 'dest-mumbai', 'Matched exact Mumbai DB ID (dest-mumbai)');
  const hasSindhudurgLeakInMumbai = (mumbaiItin.days || []).some(d =>
    [...(d.morning || []), ...(d.afternoon || []), ...(d.evening || [])].some(a => a.name.toLowerCase().includes('sindhudurg') || a.name.toLowerCase().includes('tarkarli'))
  );
  assert(!hasSindhudurgLeakInMumbai, 'Zero Sindhudurg POI leakage in Mumbai itinerary');

  // TEST 2: Destination Normalization & Isolation (Pune Request)
  console.log('\n--- 2. Testing Destination Isolation (Pune Request) ---');
  const puneItin = await itineraryService.generateItinerary({
    destination: 'Pune',
    durationDays: 2,
    travelersCount: 1,
    budgetLevel: 'moderate',
    interests: ['forts', 'food'],
    travelStyle: 'solo'
  });
  assert(puneItin.destination === 'Pune', 'Pune destination name preserved');
  assert(puneItin.destinationId === 'dest-pune', 'Matched exact Pune DB ID (dest-pune)');
  const hasSindhudurgLeakInPune = (puneItin.days || []).some(d =>
    [...(d.morning || []), ...(d.afternoon || []), ...(d.evening || [])].some(a => a.name.toLowerCase().includes('sindhudurg'))
  );
  assert(!hasSindhudurgLeakInPune, 'Zero Sindhudurg POI leakage in Pune itinerary');

  // TEST 3: Destination Isolation (Sindhudurg Request)
  console.log('\n--- 3. Testing Destination Isolation (Sindhudurg Request) ---');
  const sindhuItin = await itineraryService.generateItinerary({
    destination: 'Sindhudurg',
    durationDays: 2,
    travelersCount: 2,
    budgetLevel: 'moderate',
    interests: ['beach', 'scuba'],
    travelStyle: 'friends'
  });
  assert(sindhuItin.destination === 'Sindhudurg & Tarkarli', 'Sindhudurg destination name resolved');
  assert(sindhuItin.destinationId === 'dest-sindhudurg', 'Matched exact Sindhudurg DB ID');

  // TEST 4: Destination Isolation (Goa Request)
  console.log('\n--- 4. Testing Destination Isolation (Goa Request) ---');
  const goaItin = await itineraryService.generateItinerary({
    destination: 'Goa',
    durationDays: 3,
    travelersCount: 2,
    budgetLevel: 'moderate',
    interests: ['beaches', 'culture'],
    travelStyle: 'couple'
  });
  assert(goaItin.destination === 'Goa', 'Goa destination name resolved');
  assert(goaItin.destinationId === 'dest-goa', 'Matched exact Goa DB ID (dest-goa)');

  // TEST 5: Graceful Handling for Unknown Destination (No Silent Sindhudurg Fallback!)
  console.log('\n--- 5. Testing Unknown Destination Handling (Reykjavik Request) ---');
  const unknownItin = await itineraryService.generateItinerary({
    destination: 'Reykjavik',
    durationDays: 2,
    travelersCount: 1,
    budgetLevel: 'moderate',
    interests: ['geysers', 'glaciers'],
    travelStyle: 'solo'
  });
  assert(unknownItin.destination === 'Reykjavik', 'Preserved requested unseeded destination (Reykjavik)');
  assert(unknownItin.destinationId !== 'dest-sindhudurg', 'Did NOT silently fallback to Sindhudurg!');
  assert(unknownItin.validationWarnings.some(w => w.includes('Local database coverage')), 'Warning properly signals external knowledge fallback');

  // TEST 6: Server-Side Payment Calculation & Razorpay Order Intent
  console.log('\n--- 6. Testing Server-Side Payment Intent & Calculation ---');
  const intent = await paymentService.createPaymentIntent({
    userId: 'usr-test',
    serviceType: 'package',
    title: 'Goa Coastal & Heritage Tour',
    destinationName: 'Goa',
    basePrice: 20000,
    travelDate: '2026-11-01',
    passengersCount: 2,
    passengerDetails: [{ name: 'Test User', age: 28, gender: 'Male' }],
    promoCode: 'WANDER20'
  });
  assert(intent.success === true, 'Payment intent created successfully');
  assert(intent.amountInPaise > 0, 'Amount correctly converted to paise', `₹${intent.amountInINR} INR = ${intent.amountInPaise} paise`);
  assert(intent.grandTotalINR === 39200, 'Server calculated price with 18% GST & WANDER20 discount correctly', `₹39,200 INR`);

  // TEST 7: Razorpay Signature Verification & Booking Status
  console.log('\n--- 7. Testing Razorpay Payment Verification & Safety Net ---');
  const verifyRes = await paymentService.verifyPayment({
    bookingId: intent.bookingId,
    razorpay_order_id: intent.orderId,
    razorpay_payment_id: `pay_rzp_test_${Date.now()}`,
    razorpay_signature: 'mock_signature',
    userId: 'usr-test'
  });
  assert(verifyRes.verified === true, 'Payment signature verified');
  assert(verifyRes.bookingStatus === 'confirmed', 'Booking status updated to confirmed');

  // TEST 8: Explore POI Engine Coverage
  console.log('\n--- 8. Testing Explore POI Engine ---');
  const pois = await exploreService.getExplorePOIs();
  assert(pois.length > 50, 'Explore POI Engine returned comprehensive dataset', `${pois.length} POIs loaded`);

  console.log('\n======================================================');
  console.log(`📊 TEST SUITE SUMMARY: ${passedTests} / ${totalTests} PASSED`);
  console.log('======================================================\n');

  if (passedTests !== totalTests) {
    process.exit(1);
  }
}

runAutomatedVerificationSuite().catch(err => {
  console.error('Test Suite Exception:', err);
  process.exit(1);
});
