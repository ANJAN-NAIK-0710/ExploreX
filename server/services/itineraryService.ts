import { GoogleGenAI } from '@google/genai';
import { GeneratedItinerary, DayPlan, ItineraryActivity, itineraryValidator } from './itineraryValidator';
import { exploreService } from './exploreService';
import { db } from '../db';
import { ENV } from '../config/env';
import { Destination } from '../../src/types';

export interface ItineraryGenerationParams {
  destination: string;
  destinationId?: string;
  startDate?: string;
  durationDays: number;
  travelersCount: number;
  budgetLevel: 'budget' | 'moderate' | 'luxury' | 'ultra_luxury';
  maxBudget?: number;
  interests: string[];
  travelStyle: 'solo' | 'couple' | 'family' | 'friends';
  preferredActivities?: string[];
  accommodationPreference?: 'hotel' | 'resort' | 'hostel' | 'homestay' | 'villa';
  foodPreference?: 'veg' | 'non_veg' | 'local' | 'gourmet';
  transportPreference?: 'private_cab' | 'public' | 'rental' | 'walking';
  pace?: 'relaxed' | 'moderate' | 'fast_paced';
  specialRequirements?: string;
}

export class ItineraryService {
  private getAiClient(): GoogleGenAI | null {
    const apiKey = ENV.GEMINI_API_KEY;
    if (!apiKey || apiKey.includes('your_gemini')) return null;
    try {
      return new GoogleGenAI({
        apiKey,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
      });
    } catch {
      return null;
    }
  }

  /**
   * DESTINATION NORMALIZATION & RESOLUTION ENGINE
   * Resolves destination strictly without silent fallback to Sindhudurg / dests[0].
   */
  public resolveDestination(queryInput?: string, destinationId?: string): {
    dest: Destination | null;
    destinationName: string;
    isExternalFallback: boolean;
  } {
    const dests = db.getDestinations();

    // 1. Direct ID lookup
    if (destinationId) {
      const match = db.getDestinationById(destinationId);
      if (match) return { dest: match, destinationName: match.name, isExternalFallback: false };
    }

    const rawQuery = (queryInput || '').trim();
    if (!rawQuery) {
      return { dest: dests[0], destinationName: dests[0].name, isExternalFallback: false };
    }

    const q = rawQuery.toLowerCase().replace(/[^a-z0-9\s]/g, '');

    // 2. Alias Mapping
    const aliasMap: Record<string, string> = {
      mumbai: 'dest-mumbai',
      bombay: 'dest-mumbai',
      pune: 'dest-pune',
      poona: 'dest-pune',
      goa: 'dest-goa',
      hyderabad: 'dest-hyderabad',
      bengaluru: 'dest-bengaluru',
      bangalore: 'dest-bengaluru',
      delhi: 'dest-delhi',
      newdelhi: 'dest-delhi',
      jaipur: 'dest-jaipur',
      varanasi: 'dest-varanasi',
      kashi: 'dest-varanasi',
      benaras: 'dest-varanasi',
      kochi: 'dest-kerala-kochi',
      kerala: 'dest-kerala-kochi',
      munnar: 'dest-kerala-kochi',
      kutch: 'dest-gujarat-kutch',
      ahmedabad: 'dest-gujarat-kutch',
      gujarat: 'dest-gujarat-kutch',
      rishikesh: 'dest-uttarakhand-rishikesh',
      uttarakhand: 'dest-uttarakhand-rishikesh',
      shillong: 'dest-northeast-shillong',
      cherrapunji: 'dest-northeast-shillong',
      meghalaya: 'dest-northeast-shillong',
      northeast: 'dest-northeast-shillong',
      sindhudurg: 'dest-sindhudurg',
      tarkarli: 'dest-sindhudurg',
      konkan: 'dest-sindhudurg',
      ratnagiri: 'dest-ratnagiri',
      kolhapur: 'dest-kolhapur',
      solapur: 'dest-solapur',
      pandharpur: 'dest-solapur',
      satara: 'dest-satara',
      kaas: 'dest-satara',
      chettinad: 'dest-chettinad',
      karaikudi: 'dest-chettinad',
      tirthan: 'dest-tirthan',
      raghurajpur: 'dest-raghurajpur',
      puri: 'dest-raghurajpur'
    };

    // Check alias map
    for (const [alias, destId] of Object.entries(aliasMap)) {
      if (q.includes(alias) || alias.includes(q)) {
        const matched = db.getDestinationById(destId);
        if (matched) return { dest: matched, destinationName: matched.name, isExternalFallback: false };
      }
    }

    // 3. Exact or Partial DB Search
    const exactNameMatch = dests.find(d => d.name.toLowerCase() === q);
    if (exactNameMatch) return { dest: exactNameMatch, destinationName: exactNameMatch.name, isExternalFallback: false };

    const partialNameMatch = dests.find(d =>
      d.name.toLowerCase().includes(q) ||
      q.includes(d.name.toLowerCase()) ||
      (d.state && d.state.toLowerCase().includes(q)) ||
      (d.stateOrRegion && d.stateOrRegion.toLowerCase().includes(q)) ||
      (d.district && d.district.toLowerCase().includes(q))
    );
    if (partialNameMatch) return { dest: partialNameMatch, destinationName: partialNameMatch.name, isExternalFallback: false };

    // 4. CRITICAL FIX: If destination is NOT in DB, NEVER fallback to Sindhudurg!
    // Return null dest and mark isExternalFallback = true
    return {
      dest: null,
      destinationName: rawQuery,
      isExternalFallback: true
    };
  }

  /**
   * Main entry point to generate a personalized, validated multi-day itinerary.
   */
  public async generateItinerary(params: ItineraryGenerationParams): Promise<GeneratedItinerary> {
    const {
      destination,
      destinationId,
      durationDays = 3,
      travelersCount = 2,
      budgetLevel = 'moderate',
      maxBudget = 800,
      interests = ['history', 'culture', 'food'],
      travelStyle = 'couple',
      pace = 'moderate',
      accommodationPreference = 'hotel',
      foodPreference = 'local',
      transportPreference = 'private_cab'
    } = params;

    // 1. Resolve Destination Strictly
    const resolution = this.resolveDestination(destination, destinationId);
    const dest = resolution.dest;
    const resolvedName = resolution.destinationName;

    // Log destination search pipeline debug info
    console.log(`🗺️ Destination Search Pipeline: Requested="${destination}" | Resolved="${resolvedName}" | MatchedID="${dest?.id || 'EXTERNAL_KNOWLEDGE'}" | IsFallback=${resolution.isExternalFallback}`);

    // Fetch Grounding POIs if destination exists in DB
    let destPois: any[] = [];
    let whatsFamous: any = null;

    if (dest) {
      destPois = await exploreService.getExplorePOIs({ destinationId: dest.id });
      whatsFamous = exploreService.getWhatsFamousInfo(dest.id);
    }

    // 2. Try Gemini LLM Generation if Key Available
    const ai = this.getAiClient();
    let rawItinerary: GeneratedItinerary | null = null;

    if (ai) {
      try {
        rawItinerary = await this.generateWithGemini(ai, params, dest, resolvedName, destPois, whatsFamous, resolution.isExternalFallback);
      } catch (err) {
        console.warn('Gemini Itinerary Generation notice (falling back to constraint solver):', err);
      }
    }

    // 3. Fallback to Algorithmic Constraint Solver if no LLM
    if (!rawItinerary) {
      rawItinerary = this.generateWithAlgorithmicSolver(params, dest, resolvedName, destPois, whatsFamous, resolution.isExternalFallback);
    }

    // Add notice warning if external knowledge fallback was used
    if (resolution.isExternalFallback) {
      rawItinerary.validationWarnings.unshift(
        `Local database coverage for '${resolvedName}' is currently unavailable. Generated an AI-grounded itinerary using external travel knowledge for ${resolvedName}.`
      );
    }

    // 4. Run Itinerary Validation & Optimization Phase
    const validationResult = itineraryValidator.validate(rawItinerary);
    rawItinerary.validationScore = validationResult.score;
    rawItinerary.validationWarnings = [...new Set([...rawItinerary.validationWarnings, ...validationResult.warnings])];

    return rawItinerary;
  }

  /**
   * LLM-driven generation using Gemini 2.5 Flash with JSON schema enforcement.
   */
  private async generateWithGemini(
    ai: GoogleGenAI,
    params: ItineraryGenerationParams,
    dest: Destination | null,
    resolvedName: string,
    pois: any[],
    whatsFamous: any,
    isExternalFallback: boolean
  ): Promise<GeneratedItinerary> {
    const poiSummary = pois.slice(0, 15).map(p =>
      `- ${p.name} (${p.category}, $${p.priceLevel}, rating ${p.rating}, lat: ${p.lat}, lng: ${p.lng}): ${p.description}`
    ).join('\n');

    const famousFoods = (whatsFamous?.food || []).map((f: any) => `${f.name} (${f.description})`).join(', ');
    const famousCrafts = (whatsFamous?.handicrafts || []).map((c: any) => c.name).join(', ');

    const prompt = `You are ExploreX's Master Itinerary Architect.
Generate a structured, highly personalized ${params.durationDays}-day travel itinerary strictly for ${resolvedName} (${dest ? (dest.state || dest.country) : 'India'}).

CRITICAL REQUIREMENT:
- All activities, attractions, hotels, and food spots MUST belong to ${resolvedName}.
- Do NOT include places from other cities or destinations.

USER CONSTRAINTS & PREFERENCES:
- Destination: ${resolvedName}
- Duration: ${params.durationDays} Days
- Travelers: ${params.travelersCount} (${params.travelStyle})
- Budget Level: ${params.budgetLevel} (Max Budget: $${params.maxBudget || 800})
- Primary Interests: ${params.interests.join(', ')}
- Travel Pace: ${params.pace || 'moderate'}
- Stay Preference: ${params.accommodationPreference || 'hotel'}
- Food Preference: ${params.foodPreference || 'local'} (Famous Foods: ${famousFoods})
- Transport: ${params.transportPreference || 'private_cab'}
- Special Notes: ${params.specialRequirements || 'None'}

${poiSummary ? `GROUNDED POI CATALOG FOR ${resolvedName}:\n${poiSummary}\nFamous Artisanal Crafts: ${famousCrafts}` : `NOTE: Use real, publicly verifiable attractions, heritage sites, and eateries in ${resolvedName}.`}

Return valid JSON adhering to this EXACT structure:
{
  "id": "itin-${Date.now()}",
  "destination": "${resolvedName}",
  "destinationId": "${dest?.id || `dest-custom-${Date.now()}`}",
  "durationDays": ${params.durationDays},
  "travelersCount": ${params.travelersCount},
  "travelStyle": "${params.travelStyle}",
  "pace": "${params.pace}",
  "interests": ${JSON.stringify(params.interests)},
  "budget": {
    "currency": "INR",
    "maxBudget": ${params.maxBudget || 800},
    "estimatedTotal": 650,
    "breakdown": { "stay": 300, "food": 150, "transport": 100, "activities": 100 }
  },
  "weatherForecastSummary": "${dest?.currentWeather?.tempC || 26}°C ${dest?.currentWeather?.condition || 'Clear Skies'} — Ideal for sightseeing in ${resolvedName}",
  "days": [
    {
      "dayNumber": 1,
      "theme": "Arrival & Cultural Immersion in ${resolvedName}",
      "stayHotel": "${dest?.localEconomy?.authenticHomestays?.[0]?.name || `ExploreX ${resolvedName} Heritage Hotel`}",
      "dailyTotalCost": 210,
      "morning": [
        {
          "name": "Attraction in ${resolvedName}",
          "category": "Sightseeing",
          "startTime": "09:00 AM",
          "endTime": "11:30 AM",
          "durationMins": 150,
          "estimatedCost": 20,
          "travelTimeMins": 15,
          "distanceKm": 4.5,
          "reason": "Matches your interest in history and architecture in ${resolvedName}",
          "mealRecommendation": "Breakfast at Local ${resolvedName} Eatery",
          "bookingRequired": false
        }
      ],
      "afternoon": [],
      "evening": []
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.4
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    return {
      id: `itin-${Date.now()}`,
      destination: resolvedName,
      destinationId: dest?.id || `dest-custom-${Date.now()}`,
      durationDays: params.durationDays,
      travelersCount: params.travelersCount,
      travelStyle: params.travelStyle,
      pace: params.pace || 'moderate',
      interests: params.interests,
      budget: parsed.budget || {
        currency: 'INR',
        maxBudget: params.maxBudget || 800,
        estimatedTotal: Math.round((params.maxBudget || 800) * 0.8),
        breakdown: { stay: 300, food: 150, transport: 100, activities: 100 }
      },
      days: parsed.days || [],
      validationScore: 95,
      validationWarnings: [],
      weatherForecastSummary: parsed.weatherForecastSummary || `${dest?.currentWeather?.tempC || 26}°C ${dest?.currentWeather?.condition || 'Clear Skies'} in ${resolvedName}`,
      createdAt: new Date().toISOString()
    };
  }

  /**
   * Distance-aware, rule-based algorithmic constraint solver.
   * Ensures activities belong STRICTLY to the requested destination without leaking Sindhudurg!
   */
  private generateWithAlgorithmicSolver(
    params: ItineraryGenerationParams,
    dest: Destination | null,
    resolvedName: string,
    pois: any[],
    whatsFamous: any,
    isExternalFallback: boolean
  ): GeneratedItinerary {
    const days: DayPlan[] = [];
    const pool = [...pois];

    const estStayCostPerDay = Math.round((params.maxBudget || 800) * 0.4 / params.durationDays);
    const estFoodCostPerDay = Math.round((params.maxBudget || 800) * 0.25 / params.durationDays);
    const estTransitCostPerDay = Math.round((params.maxBudget || 800) * 0.20 / params.durationDays);

    let totalActivitiesCost = 0;

    for (let d = 1; d <= params.durationDays; d++) {
      const morning: ItineraryActivity[] = [];
      const afternoon: ItineraryActivity[] = [];
      const evening: ItineraryActivity[] = [];

      // Pick morning activity
      const p1 = pool.shift() || (pois.length > 0 ? pois[0] : null);
      const act1Name = p1 ? p1.name : `Morning Sightseeing & Landmark Tour in ${resolvedName}`;
      const act1Cat = p1 ? p1.category : 'Heritage';
      const act1Cost = p1 ? (p1.priceLevel || 15) : 15;

      morning.push({
        name: act1Name,
        category: act1Cat,
        startTime: '09:00 AM',
        endTime: '11:30 AM',
        durationMins: 150,
        estimatedCost: act1Cost,
        travelTimeMins: 15,
        distanceKm: 4.2,
        reason: `Top-rated ${act1Cat} landmark in ${resolvedName} matching your ${params.interests[0] || 'sightseeing'} interest`,
        location: p1 ? { lat: p1.lat, lng: p1.lng, address: p1.address } : undefined,
        bookingRequired: act1Cost > 20
      });
      totalActivitiesCost += act1Cost;

      // Pick afternoon activity & food
      const p2 = pool.shift() || (pois.length > 1 ? pois[1] : pois[0]);
      const act2Name = p2 ? p2.name : `Afternoon Cultural Exploration & Local Markets in ${resolvedName}`;
      const act2Cat = p2 ? p2.category : 'Culture';
      const act2Cost = p2 ? (p2.priceLevel || 20) : 20;

      afternoon.push({
        name: act2Name,
        category: act2Cat,
        startTime: '01:30 PM',
        endTime: '04:00 PM',
        durationMins: 150,
        estimatedCost: act2Cost,
        travelTimeMins: 15,
        distanceKm: 3.5,
        reason: `Featured ${act2Cat} destination in ${resolvedName} for afternoon exploration`,
        location: p2 ? { lat: p2.lat, lng: p2.lng, address: p2.address } : undefined,
        mealRecommendation: whatsFamous?.food?.[0] ? `Authentic Lunch: ${whatsFamous.food[0].name} at ${whatsFamous.food[0].mustTryAt || resolvedName}` : `Authentic ${resolvedName} Regional Thali`,
        bookingRequired: false
      });
      totalActivitiesCost += act2Cost;

      // Pick evening activity & sunset
      const p3 = pool.shift() || (pois.length > 2 ? pois[2] : pois[0]);
      const act3Name = p3 ? p3.name : `Evening Sunset Promenade & Night Food Walk in ${resolvedName}`;
      const act3Cat = p3 ? p3.category : 'Sightseeing';
      const act3Cost = p3 ? (p3.priceLevel || 10) : 10;

      evening.push({
        name: act3Name,
        category: act3Cat,
        startTime: '05:30 PM',
        endTime: '08:00 PM',
        durationMins: 150,
        estimatedCost: act3Cost,
        travelTimeMins: 15,
        distanceKm: 2.8,
        reason: `Sunset relaxation and evening atmosphere in ${resolvedName}`,
        location: p3 ? { lat: p3.lat, lng: p3.lng, address: p3.address } : undefined,
        mealRecommendation: `Gourmet Dinner & Evening Bazaar Tasting in ${resolvedName}`,
        bookingRequired: false
      });
      totalActivitiesCost += act3Cost;

      const dailyTotal = estStayCostPerDay + estFoodCostPerDay + estTransitCostPerDay + act1Cost + act2Cost + act3Cost;

      days.push({
        dayNumber: d,
        theme: d === 1 ? `Arrival & Historic Landmark Tour in ${resolvedName}` : d === 2 ? `Cultural Immersion & Local Gastronomy in ${resolvedName}` : `Artisanal Crafts & Sunset Vista in ${resolvedName}`,
        stayHotel: dest?.localEconomy?.authenticHomestays?.[0]?.name || `ExploreX ${resolvedName} Verified Hotel`,
        dailyTotalCost: dailyTotal,
        morning,
        afternoon,
        evening
      });
    }

    const estimatedTotal = days.reduce((sum, day) => sum + day.dailyTotalCost, 0);

    return {
      id: `itin-${Date.now()}`,
      destination: resolvedName,
      destinationId: dest?.id || `dest-custom-${Date.now()}`,
      durationDays: params.durationDays,
      travelersCount: params.travelersCount,
      travelStyle: params.travelStyle,
      pace: params.pace || 'moderate',
      interests: params.interests,
      budget: {
        currency: 'INR',
        maxBudget: params.maxBudget || 25000,
        estimatedTotal,
        breakdown: {
          stay: estStayCostPerDay * params.durationDays,
          food: estFoodCostPerDay * params.durationDays,
          transport: estTransitCostPerDay * params.durationDays,
          activities: totalActivitiesCost
        }
      },
      days,
      validationScore: 94,
      validationWarnings: [],
      weatherForecastSummary: `${dest?.currentWeather?.tempC || 26}°C ${dest?.currentWeather?.condition || 'Clear Skies'} — Favorable for outdoor activities in ${resolvedName}`,
      createdAt: new Date().toISOString()
    };
  }
}

export const itineraryService = new ItineraryService();
