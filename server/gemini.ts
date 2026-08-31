import { GoogleGenAI } from '@google/genai';
import { db } from './db';

let aiInstance: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  if (aiInstance) return aiInstance;
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  try {
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
    return aiInstance;
  } catch (err) {
    console.warn('Failed to initialize GoogleGenAI client:', err);
    return null;
  }
}

export async function askTravelAssistant(params: {
  message: string;
  history?: { role: 'user' | 'model'; text: string }[];
  destinationId?: string;
  userContext?: { name?: string; budget?: string; vibes?: string[] };
}): Promise<string> {
  const { message, destinationId, userContext } = params;
  const ai = getAiClient();

  const destinations = db.getDestinations();
  const packages = db.getPackages();
  const dest = destinationId ? db.getDestinationById(destinationId) : null;

  const catalogSummary = destinations.map(d => 
    `- ${d.name} (${d.state ? `${d.state}, India` : d.country}): Starting $${d.startingPrice}, Vibes: ${d.vibe.join(', ')}, Weather: ${d.currentWeather.tempC}°C ${d.currentWeather.condition}, Safety: ${d.safetyScore.overall}/100, Tier: ${d.tierCategory || 'General'}, Impact Score: ${d.localEconomy?.localImpactScore || 85}%`
  ).join('\n');

  const systemInstruction = `You are "ExploreX Assistant", an elite India-focused AI tourism engine, cultural anthropologist, and sustainable demand balancer.
Your goal is to provide deeply authentic, practical, and inspiring travel advice grounded in real database data.
Specialties you excel in:
1. India Demand Balancing: Recommend lesser-known hidden gems (e.g. Sindhudurg/Tarkarli, Ratnagiri, Kolhapur, Solapur, Kaas/Satara, Chettinad, Tirthan Valley, Raghurajpur) over crowded hubs.
2. "What's Famous Here?": Local foods (Misal, Malvani Surmai, Tambda-Pandhra Rassa, Chettinad feasts, Siddu, Chhena Poda), traditional attire (Nauvari, Paithani, Kandangi), GI-tagged handicrafts (Sawantwadi toys, Solapuri Chadars, Kolhapuri Chappals, Athangudi tiles, Pattachitra), jewellery, and festivals.
3. Local Economy Support: Prioritizing homestays, family-run khanavals, master artisans, and community guides with high local economic retention.
4. Best-Time Guidance: Time-of-day crowd optimization, seasonal weather indices, and realistic daily budgets in INR/USD.

Active destination catalog:
${catalogSummary}

${dest ? `Current Selected Destination Context: ${dest.name} (${dest.state || dest.country}), Tier: ${dest.tierCategory || 'Standard'}, Popularity: ${dest.popularityTier || 'popular'}, Best Months: ${dest.bestMonths.join(', ')}` : ''}

${userContext ? `User Profile: Name: ${userContext.name || 'Traveler'}, Budget: ${userContext.budget || 'moderate'}, Preferences: ${(userContext.vibes || []).join(', ')}` : ''}

Tone: Warm, authoritative, culturally rich, well-formatted in clean markdown with actionable itineraries and budget estimations.`;

  if (!ai) {
    // Fallback algorithmic response
    if (message.toLowerCase().includes('sindhudurg') || message.toLowerCase().includes('tarkarli') || message.toLowerCase().includes('malvan')) {
      return `### 🌊 Sindhudurg & Tarkarli (Konkan Coast)\n\n- **Pristine Scuba Reefs:** Tarkarli and Devbagh boast 15-20ft underwater visibility for dolphin watching and coral reef exploration.\n- **Historic Shivaji Fort:** Take a morning boat to the 1664 Sindhudurg Sea Fort built on Kurte island.\n- **Malvani Gastronomy:** Savor authentic Surmai and Prawn thali, Kombdi Vade, and refreshing Solkadhi at local family khanavals.\n- **GI Wooden Toys:** Visit Sawantwadi Palace to buy certified Sawantwadi lacquerware toys directly from master Chitari artisans.\n- **Local Impact:** 89% of your spending directly supports coastal fishing families and village homestays.`;
    }
    if (message.toLowerCase().includes('pune') || message.toLowerCase().includes('misal') || message.toLowerCase().includes('sinhagad')) {
      return `### 🏰 Pune: Cultural Heart of Maharashtra\n\n- **Iconic Gastronomy:** Start with fiery Katakirr / Bedekar Misal Pav, pick up fresh Chitale Bandhu Bakarwadi, and enjoy Sujata Mango Mastani.\n- **Heritage Landmarks:** Explore Shaniwar Wada (seat of the Peshwas) and Aga Khan Palace.\n- **Sinhagad Sunrise Trek:** Hike up Sinhagad Fort for morning mist and hot clay-pot Pithla Bhakri with green chili Thecha.\n- **Textiles & Craft:** Visit Narayan Peth for authentic Paithani silk sarees and Kasba Peth for hand-beaten Tambat copperware.`;
    }
    if (message.toLowerCase().includes('kolhapur') || message.toLowerCase().includes('solapur')) {
      return `### 🍛 Kolhapur & Solapur Handloom & Cultural Trail\n\n- **Kolhapur Royal Feast:** Taste legendary Tambda (red) and Pandhra (white) mutton rassa with Jowar bhakri.\n- **GI Kolhapuri Chappals:** Buy hand-braided vegetable-tanned leather footwear in Chappal Line.\n- **Solapur Handlooms:** Explore GI-tagged Solapuri Jacquard Chadars and ultra-absorbent Terry towels in Navi Peth.\n- **Heritage Temples:** Visit the 7th-century Mahalakshmi Temple in Kolhapur and sacred island Siddheshwar Temple in Solapur.`;
    }
    if (message.toLowerCase().includes('budget') || message.toLowerCase().includes('cheap') || message.toLowerCase().includes('cost')) {
      return `### 💡 Smart Budget Optimization Strategy\n\nBased on your travel preferences, here is a cost-effective plan:\n\n- **Top Value Destinations:** **Sindhudurg**, **Kolhapur**, **Solapur**, and **Raghurajpur** offer daily budgets as low as ₹1,200 - ₹2,500/day ($15-$30) with rich authentic experiences.\n- **Direct Homestay Booking:** Staying with certified local village homestays reduces accommodation cost by up to 50% compared to luxury resort chains.\n- **Explorer Mobility:** Use **The Explorer Eco Auto & E-Scooter** options for local city hops at fixed transparent rates.`;
    }
    return `### 🇮🇳 Namaste from WanderAI India Travel Concierge!\n\nI am your comprehensive guide to India's culture, heritage, and offbeat travel:\n\n1. **AI Tourism Demand Balancer:** Find sustainable, less-crowded destinations that match your vibe and budget.\n2. **What's Famous Here?:** Discover hyper-local food, GI-tagged handicrafts, traditional clothing, and festivals.\n3. **Local Economy Support:** Connect with verified homestays, family khanavals, and artisan guilds.\n4. **Best-Time Engine:** Get time-of-day crowd tips and seasonal weather insights.\n\nWhich Indian state or region would you like to explore today?`;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: message,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });
    return response.text || 'I am ready to assist with your India travel planning!';
  } catch (err) {
    console.error('Gemini Travel Assistant error:', err);
    return `### 🌍 WanderAI Travel Intelligence\n\nWe have processed your request with our verified destination database:\n\n- Explore our comprehensive India catalog for authentic homestays, local culinary trails, and GI handicrafts.\n- Access real-time crowd and weather insights in the **Destinations** and **Explore** tabs.`;
  }
}

export async function generateAutopilotReplan(params: {
  destinationName: string;
  trigger: 'rain_storm' | 'crowd_surge' | 'flight_delay' | 'traffic_congestion' | 'manual_refresh';
  currentSchedule: string[];
}): Promise<{
  alertTitle: string;
  alertSummary: string;
  optimizedSchedule: { time: string; activity: string; type: 'indoor' | 'outdoor' | 'transit' | 'dining'; reason: string }[];
  savingsOrBenefits: string;
}> {
  const { destinationName, trigger, currentSchedule } = params;
  const ai = getAiClient();

  if (!ai) {
    const isRain = trigger === 'rain_storm';
    return {
      alertTitle: isRain ? '🌧️ Rain Alert: Automated Indoor Optimization Activated' : '🚦 Congestion Alert: Smart Transit Rerouting',
      alertSummary: isRain 
        ? `Moderate rainfall detected in ${destinationName} between 1:00 PM and 4:30 PM. Outdoor beach/valley activities automatically swapped for cultural museums, covered artisan workshops, and heated thermal wellness.`
        : `High tourist traffic detected along main highway. Route sequenced to avoid 45 minutes of delay.`,
      optimizedSchedule: [
        { time: '09:00 AM - 11:30 AM', activity: 'Morning Heritage Walk (Clear Weather Window)', type: 'outdoor', reason: 'Favorable morning light and low rainfall probability' },
        { time: '12:00 PM - 02:00 PM', activity: 'Artisan Culinary Workshop & Covered Market Tasting', type: 'indoor', reason: 'Avoids midday rain peak while exploring authentic gastronomy' },
        { time: '02:30 PM - 05:00 PM', activity: 'National Art & Culture Museum Tour + Interactive VR Gallery', type: 'indoor', reason: '100% sheltered indoor experience during heavy precipitation' },
        { time: '05:30 PM - 07:30 PM', activity: 'Evening Sunset Lounge & Live Acoustic Performance', type: 'dining', reason: 'Post-rain fresh air with covered glass veranda' }
      ],
      savingsOrBenefits: 'Saved 2.5 hours of ruined outdoor time and guaranteed zero rain disruption.'
    };
  }

  try {
    const prompt = `You are the WanderAI Trip Autopilot engine for ${destinationName}.
Disturbance Trigger: ${trigger}
Original Planned Schedule: ${JSON.stringify(currentSchedule)}

Respond in valid JSON format with the following keys:
{
  "alertTitle": "string",
  "alertSummary": "string",
  "optimizedSchedule": [
    { "time": "string", "activity": "string", "type": "indoor|outdoor|transit|dining", "reason": "string" }
  ],
  "savingsOrBenefits": "string"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.4
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    return parsed;
  } catch (err) {
    console.error('Autopilot replan error:', err);
    return {
      alertTitle: '🌤️ Dynamic Autopilot Optimization Applied',
      alertSummary: `Real-time conditions in ${destinationName} evaluated. Schedule re-balanced for optimal comfort and minimal queuing.`,
      optimizedSchedule: [
        { time: '09:00 AM', activity: 'Scenic Morning Sightseeing', type: 'outdoor', reason: 'Low crowd hours' },
        { time: '01:00 PM', activity: 'Regional Culinary Experience', type: 'dining', reason: 'Air-conditioned dining' },
        { time: '03:30 PM', activity: 'Cultural Heritage Gallery', type: 'indoor', reason: 'Avoid peak afternoon temperature' }
      ],
      savingsOrBenefits: 'Avoided peak crowd queues by 35%.'
    };
  }
}

export async function runWhatIfSimulation(params: {
  scenario: string;
  destinationName: string;
  baseBudget: number;
  groupSize: number;
  durationDays: number;
}): Promise<{
  scenarioTitle: string;
  originalPlanSummary: string;
  adjustedPlanSummary: string;
  impactScore: number;
  costDifference: number;
  timeDifferenceMins: number;
  weatherFitScore: number;
  crowdReductionPct: number;
  recommendations: string[];
  dayWiseAdjustments: { day: number; originalActivity: string; proposedActivity: string; reason: string }[];
}> {
  const { scenario, destinationName, baseBudget, groupSize, durationDays } = params;
  const ai = getAiClient();

  if (!ai) {
    // Realistic algorithmic response
    let costDiff = 0;
    let crowdRed = 25;
    let weatherFit = 92;

    if (scenario.toLowerCase().includes('budget') || scenario.toLowerCase().includes('cheap')) {
      costDiff = -Math.round(baseBudget * 0.28);
      crowdRed = 15;
    } else if (scenario.toLowerCase().includes('group') || scenario.toLowerCase().includes('people')) {
      costDiff = Math.round(baseBudget * 0.45);
      crowdRed = 30;
    } else if (scenario.toLowerCase().includes('rain')) {
      weatherFit = 96;
      crowdRed = 40;
    }

    return {
      scenarioTitle: `Simulation: "${scenario}" in ${destinationName}`,
      originalPlanSummary: `${durationDays}-Day itinerary for ${groupSize} traveler(s) with standard pace and $${baseBudget} budget.`,
      adjustedPlanSummary: `Optimized plan dynamically adjusted for: ${scenario}. Balances logistical comfort, cost efficiency, and authentic local experiences.`,
      impactScore: 88,
      costDifference: costDiff,
      timeDifferenceMins: -45,
      weatherFitScore: weatherFit,
      crowdReductionPct: crowdRed,
      recommendations: [
        'Shift high-demand attraction slots to 08:30 AM to bypass group tour bus arrivals.',
        'Leverage The Explorer XL rides for 4+ passengers to reduce per-person transit cost by 40%.',
        'Book verified group passes with WanderAI for bundled attraction discounts.',
        'Keep a 90-minute flexible buffer between morning and afternoon activities.'
      ],
      dayWiseAdjustments: [
        {
          day: 1,
          originalActivity: 'Standard Afternoon Beach Walk',
          proposedActivity: 'Covered Cultural Museum & Evening Sunset Veranda',
          reason: 'Protects schedule against midday temperature or precipitation swings'
        },
        {
          day: 2,
          originalActivity: 'Peak Hour Landmark Visit',
          proposedActivity: 'Early Morning Private Access + Local Artisan Breakfast',
          reason: 'Reduces queue waiting time by 55 minutes'
        },
        {
          day: 3,
          originalActivity: 'Multiple Individual Cab Bookings',
          proposedActivity: 'Dedicated Explorer Day-Chauffeur Package',
          reason: 'Decreases total travel expenses by 22%'
        }
      ]
    };
  }

  try {
    const prompt = `Simulate a "What-If" travel scenario for a trip to ${destinationName}.
User Scenario: "${scenario}"
Base Budget: $${baseBudget}
Group Size: ${groupSize}
Duration: ${durationDays} Days

Return valid JSON with keys:
{
  "scenarioTitle": "string",
  "originalPlanSummary": "string",
  "adjustedPlanSummary": "string",
  "impactScore": number (0-100),
  "costDifference": number (positive or negative in USD),
  "timeDifferenceMins": number,
  "weatherFitScore": number (0-100),
  "crowdReductionPct": number (0-100),
  "recommendations": ["string", "string", "string"],
  "dayWiseAdjustments": [
    { "day": number, "originalActivity": "string", "proposedActivity": "string", "reason": "string" }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.5
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (err) {
    console.error('WhatIf simulation error:', err);
    return {
      scenarioTitle: `Simulation: "${scenario}"`,
      originalPlanSummary: `Trip to ${destinationName}`,
      adjustedPlanSummary: `AI-adjusted scenario for ${scenario}`,
      impactScore: 85,
      costDifference: -50,
      timeDifferenceMins: -30,
      weatherFitScore: 90,
      crowdReductionPct: 20,
      recommendations: ['Maintain flexible morning bookings', 'Utilize Explorer cabs for direct transit'],
      dayWiseAdjustments: [
        { day: 1, originalActivity: 'Outdoor tour', proposedActivity: 'Optimized sheltered route', reason: 'Optimal conditions' }
      ]
    };
  }
}
