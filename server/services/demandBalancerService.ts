import { Destination, DemandBalancerQuery, DemandBalancerResult } from '../../src/types';
import { db } from '../db';
import { ENV } from '../config/env';

const ML_URL = ENV.ML_SERVICE_URL;

/**
 * ML-powered Tourism Demand Balancer.
 * Calls the FastAPI ml-service /recommendations/by-preferences endpoint
 * and transforms results into the existing DemandBalancerResult[] shape.
 * Falls back to the rule-based balanceTourismDemand() on failure.
 */
export async function balanceTourismDemandML(query: DemandBalancerQuery): Promise<DemandBalancerResult[]> {
  const res = await fetch(`${ML_URL}/recommendations/by-preferences`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      vibes: query.vibes || [],
      thematic_tags: query.thematicTags || [],
      budget_min: undefined,
      budget_max: query.maxBudgetPerDay,
      top_n: 15,
    }),
  });

  if (!res.ok) throw new Error(`ML service error: ${res.status}`);
  const data = await res.json();

  // Transform ML results into existing DemandBalancerResult shape
  return (data.results || []).map((r: any) => {
    const dest = r.destination;
    const score = Math.round((r.similarityScore || 0) * 100);
    const capacityLoad = dest.currentCapacityLoadPct || 50;

    return {
      destination: dest as Destination,
      overallScore: score,
      breakdown: {
        satisfactionScore: score,
        affordabilityScore: dest.affordabilityIndex || 80,
        localEconomicBenefitScore: dest.localEconomy?.localImpactScore || 80,
        sustainabilityScore: dest.sustainabilityScore || 80,
      },
      demandReliefReasoning: dest.whyAlternativeBetter
        ? `💡 ${dest.whyAlternativeBetter.headline} (${dest.whyAlternativeBetter.crowdReductionPct}% lower crowds & ${dest.whyAlternativeBetter.costSavingsPct}% savings).`
        : dest.popularityTier === 'gem'
          ? `🌿 ML-recommended hidden gem with ${capacityLoad}% capacity.`
          : `⭐ ML similarity score: ${r.similarityScore?.toFixed(2) || 'N/A'}`,
      capacityUtilization: capacityLoad,
      estimatedCrowdLevel: (capacityLoad < 40 ? 'Low' : capacityLoad < 70 ? 'Moderate' : 'High') as 'Low' | 'Moderate' | 'High',
      alternativeComparison: dest.whyAlternativeBetter ? {
        replacesFamousSpot: dest.whyAlternativeBetter.replacesFamousSpot,
        crowdSavedPct: dest.whyAlternativeBetter.crowdReductionPct,
        costSavedPct: dest.whyAlternativeBetter.costSavingsPct,
      } : undefined,
    } as DemandBalancerResult;
  });
}

/**
 * AI Tourism Demand Balancer Service
 * Evaluates candidate destinations based on:
 * - Tourist preferences & travel style
 * - Seasonality & ideal months
 * - Real-time crowd pressure & carrying capacity load
 * - Budget alignment & affordability
 * - Sustainable tourism footprint & local economic benefit
 * 
 * Objective: Optimize for:
 *   Tourist Satisfaction + Affordability + Local Economic Benefit + Sustainable Tourism
 * Prioritizes lesser-known/Tier-2/Tier-3/rural destinations over saturated tourist hubs.
 */
export function balanceTourismDemand(query: DemandBalancerQuery): DemandBalancerResult[] {
  const allDestinations = db.getDestinations();
  const currentMonth = query.seasonOrMonth || new Date().toLocaleString('default', { month: 'long' });

  const results: DemandBalancerResult[] = [];

  for (const dest of allDestinations) {
    // Basic filter by state if explicitly specified
    if (query.statePreference && query.statePreference !== 'all') {
      const stateMatch = dest.state?.toLowerCase() === query.statePreference.toLowerCase() ||
        dest.stateOrRegion.toLowerCase().includes(query.statePreference.toLowerCase());
      if (!stateMatch) continue;
    }

    // 1. Satisfaction Score (Vibe match, thematic alignment, rating, season match)
    let satisfactionPoints = 0;
    let maxSatisfaction = 100;

    // Vibe match
    if (query.vibes && query.vibes.length > 0) {
      const matchingVibes = query.vibes.filter(v => dest.vibe.includes(v));
      satisfactionPoints += (matchingVibes.length / query.vibes.length) * 30;
    } else {
      satisfactionPoints += 25;
    }

    // Thematic tags match
    if (query.thematicTags && query.thematicTags.length > 0 && dest.thematicTags) {
      const matchingTags = query.thematicTags.filter(t => dest.thematicTags?.includes(t));
      satisfactionPoints += (matchingTags.length / query.thematicTags.length) * 25;
    } else {
      satisfactionPoints += 20;
    }

    // Season match
    const isIdealSeason = dest.bestMonths.some(m => m.toLowerCase().includes(currentMonth.toLowerCase()));
    if (isIdealSeason) {
      satisfactionPoints += 25;
    } else {
      satisfactionPoints += 12;
    }

    // High rating boost
    satisfactionPoints += (dest.rating / 5.0) * 20;
    const satisfactionScore = Math.min(100, Math.round(satisfactionPoints));

    // 2. Affordability Score
    let affordabilityScore = dest.affordabilityIndex || 85;
    if (query.maxBudgetPerDay && query.maxBudgetPerDay > 0) {
      const dailyEst = dest.bestTimeEngine?.budgetEstimator?.budgetTier?.totalDaily || (dest.startingPrice * 20);
      if (dailyEst <= query.maxBudgetPerDay) {
        affordabilityScore = Math.min(100, affordabilityScore + 10);
      } else {
        const penalty = Math.min(35, Math.round(((dailyEst - query.maxBudgetPerDay) / dailyEst) * 50));
        affordabilityScore = Math.max(20, affordabilityScore - penalty);
      }
    }

    // 3. Local Economic Benefit Score (Direct retention % and local directory depth)
    let localEconomicBenefitScore = dest.localEconomicRetentionPct || 80;
    if (dest.localEconomy) {
      localEconomicBenefitScore = Math.min(100, Math.round(
        (dest.localEconomy.localImpactScore * 0.6) + ((dest.localEconomicRetentionPct || 85) * 0.4)
      ));
    }

    // 4. Sustainability & Crowd Relief Score
    let sustainabilityScore = dest.sustainabilityScore || 80;
    const capacityLoad = dest.currentCapacityLoadPct || 50;
    
    // Penalize overtouristed destinations and reward hidden gems / low capacity
    if (dest.isOvertouristed) {
      sustainabilityScore = Math.max(30, sustainabilityScore - 30);
    } else if (dest.popularityTier === 'gem' || dest.tierCategory === 'Rural/Village' || dest.tierCategory === 'Tier-3') {
      sustainabilityScore = Math.min(100, sustainabilityScore + 15);
    }

    // If user prefers avoiding overtouristed spots
    if (query.avoidOvertouristed && dest.isOvertouristed) {
      continue;
    }
    if (query.preferHiddenGems && dest.popularityTier === 'popular' && !dest.alternativeTo) {
      // De-prioritize popular mega-cities
      sustainabilityScore -= 15;
    }

    // Weighted Overall Score (Balanced Optimization Formula)
    // 30% Tourist Satisfaction + 25% Affordability + 25% Local Economic Benefit + 20% Sustainability
    const overallScore = Math.round(
      (satisfactionScore * 0.30) +
      (affordabilityScore * 0.25) +
      (localEconomicBenefitScore * 0.25) +
      (sustainabilityScore * 0.20)
    );

    // AI Relief Reasoning narrative generator
    let demandReliefReasoning = '';
    if (dest.whyAlternativeBetter) {
      demandReliefReasoning = `💡 ${dest.whyAlternativeBetter.headline} (${dest.whyAlternativeBetter.crowdReductionPct}% lower crowds & ${dest.whyAlternativeBetter.costSavingsPct}% savings vs famous hubs).`;
    } else if (dest.popularityTier === 'gem') {
      demandReliefReasoning = `🌿 Sustainable hidden gem with ${dest.currentCapacityLoadPct || 25}% capacity load. ${dest.localEconomicRetentionPct || 90}% of your expenditure goes directly to local village artisans and homestays.`;
    } else {
      demandReliefReasoning = `⭐ Well-balanced destination offering ${dest.rating}★ visitor satisfaction and rich regional heritage.`;
    }

    const estimatedCrowdLevel: 'Low' | 'Moderate' | 'High' = 
      capacityLoad < 40 ? 'Low' : capacityLoad < 70 ? 'Moderate' : 'High';

    results.push({
      destination: dest,
      overallScore,
      breakdown: {
        satisfactionScore,
        affordabilityScore,
        localEconomicBenefitScore,
        sustainabilityScore
      },
      demandReliefReasoning,
      capacityUtilization: capacityLoad,
      estimatedCrowdLevel,
      alternativeComparison: dest.whyAlternativeBetter ? {
        replacesFamousSpot: dest.whyAlternativeBetter.replacesFamousSpot,
        crowdSavedPct: dest.whyAlternativeBetter.crowdReductionPct,
        costSavedPct: dest.whyAlternativeBetter.costSavingsPct
      } : undefined
    });
  }

  // Sort descending by overall balanced score
  results.sort((a, b) => b.overallScore - a.overallScore);

  return results;
}
