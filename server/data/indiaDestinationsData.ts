import { Destination } from '../../src/types';

export const INDIA_EXPANDED_DESTINATIONS: Destination[] = [
  // 1. MAHARASHTRA: SINDHUDURG & TARKARLI
  {
    id: 'dest-sindhudurg',
    name: 'Sindhudurg & Tarkarli',
    stateOrRegion: 'Konkan',
    country: 'India',
    isInternational: false,
    state: 'Maharashtra',
    region: 'Konkan Coast',
    district: 'Sindhudurg',
    thematicTags: ['beaches', 'food', 'adventure', 'heritage', 'culture'],
    tierCategory: 'Tier-3',
    popularityTier: 'gem',
    carryingCapacityDaily: 3500,
    currentCapacityLoadPct: 32,
    isOvertouristed: false,
    localEconomicRetentionPct: 89,
    sustainabilityScore: 94,
    affordabilityIndex: 91,
    tagline: 'Pristine Scuba Waters, Chhatrapati Shivaji Sea Fort & Authentic Malvani Soul',
    description: 'Sindhudurg and Tarkarli offer crystal-clear Arabian Sea waters, pristine white-sand virgin beaches, vibrant coral reefs for scuba diving, and the formidable 17th-century Sindhudurg Sea Fort. A sustainable, culturally rich alternative to crowded party beaches.',
    heroImage: 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80'
    ],
    vibe: ['beach', 'adventure', 'culinary', 'heritage', 'nature'],
    rating: 4.9,
    reviewCount: 1420,
    lat: 16.0353,
    lng: 73.4735,
    bestMonths: ['October', 'November', 'December', 'January', 'February', 'March'],
    currentWeather: {
      tempC: 27,
      condition: 'Coastal Breeze & Sunny',
      icon: 'Sun',
      forecast: 'Clear skies with calm ocean waters',
      airQualityIndex: 22
    },
    safetyScore: {
      overall: 96,
      daySafety: 98,
      nightSafety: 94,
      emergencyContact: '112 / Sindhudurg Coastal Police (+91 2362 228400)',
      advisory: 'Extremely peaceful and welcoming coastal villages.'
    },
    crowdPrediction: {
      currentStatus: 'Low',
      peakHours: '4:30 PM - 6:30 PM',
      quietHours: '6:00 AM - 11:00 AM',
      recommendation: 'Take morning 7:30 AM boat rides to Sindhudurg Fort.'
    },
    popularAttractions: [
      {
        id: 'att-sindhu-1',
        name: 'Sindhudurg Fort (Sea Fort)',
        category: 'Heritage',
        rating: 4.92,
        reviewCount: 980,
        estimatedTime: '2.5 hrs',
        entryFee: 50,
        image: 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=600&q=80',
        description: 'Iconic fortress built directly on a rocky island by Chhatrapati Shivaji Maharaj in 1664.',
        lat: 16.0416,
        lng: 73.4589,
        crowdLevel: 'Moderate',
        bestTimeToVisit: '8:00 AM - 11:00 AM'
      },
      {
        id: 'att-sindhu-2',
        name: 'Tarkarli & Devbagh Scuba Reef',
        category: 'Adventure',
        rating: 4.88,
        reviewCount: 1240,
        estimatedTime: '3 hrs',
        entryFee: 1200,
        image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80',
        description: 'PADI scuba diving center and pristine coral banks with 20ft underwater visibility.',
        lat: 15.9877,
        lng: 73.4912,
        crowdLevel: 'Low',
        bestTimeToVisit: '8:30 AM - 12:00 PM',
        isOffbeat: true
      }
    ],
    localCuisines: ['Malvani Surmai Thali', 'Solkadhi', 'Kombdi Vade', 'Ukdiche Modak'],
    startingPrice: 6500,
    culturalSpecialties: {
      food: [
        { name: 'Malvani Surmai & Prawn Thali', description: 'Fresh Arabian Sea catch shallow-fried in fiery Malvani masala.', mustTryAt: 'Chaitanya Restaurant, Malvan', isVeg: false, tag: 'Signature Seafood' },
        { name: 'Solkadhi', description: 'Digestive beverage made from coconut milk and kokum.', isVeg: true, tag: 'Traditional Drink' }
      ],
      clothing: [],
      handicrafts: [
        { name: 'Sawantwadi Lacquerware Wooden Toys', description: 'Eco-friendly hand-turned wooden toys.', giTagged: true, artisanCommunity: 'Chitari Guild' }
      ],
      jewellery: [],
      artAndCulture: [],
      festivals: [],
      localShopping: [],
      uniqueExperiences: []
    }
  },

  // 2. MAHARASHTRA: MUMBAI (Financial Capital, Colonial Architecture & Street Food)
  {
    id: 'dest-mumbai',
    name: 'Mumbai',
    stateOrRegion: 'Maharashtra',
    country: 'India',
    isInternational: false,
    state: 'Maharashtra',
    region: 'Konkan / West Coast',
    district: 'Mumbai City',
    thematicTags: ['heritage', 'food', 'shopping', 'culture', 'beaches'],
    tierCategory: 'Tier-1',
    popularityTier: 'popular',
    carryingCapacityDaily: 50000,
    currentCapacityLoadPct: 75,
    isOvertouristed: false,
    localEconomicRetentionPct: 85,
    sustainabilityScore: 82,
    affordabilityIndex: 75,
    tagline: 'The City of Dreams: Gateway of India, Marine Drive Promenade & Street Gastronomy',
    description: 'Mumbai is India’s vibrant financial hub and entertainment capital. Home to UNESCO World Heritage Railway Termini, Victorian Gothic architecture, seaside Queens Necklace promenades, and world-class street food.',
    heroImage: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?auto=format&fit=crop&w=800&q=80'
    ],
    vibe: ['urban', 'heritage', 'culinary', 'shopping'],
    rating: 4.88,
    reviewCount: 3200,
    lat: 18.9220,
    lng: 72.8347,
    bestMonths: ['November', 'December', 'January', 'February', 'March'],
    currentWeather: {
      tempC: 29,
      condition: 'Humid & Sunny',
      icon: 'Sun',
      forecast: 'Pleasant evening sea breeze along the coast',
      airQualityIndex: 45
    },
    safetyScore: {
      overall: 92,
      daySafety: 96,
      nightSafety: 90,
      emergencyContact: '112 / Mumbai Police (+91 22 2262 1855)',
      advisory: 'Safe cosmopolitan megacity. Use local cabs or local trains outside peak rush hours.'
    },
    crowdPrediction: {
      currentStatus: 'Moderate',
      peakHours: '8:30 AM - 10:30 AM & 5:30 PM - 8:30 PM (Local Train Rush)',
      quietHours: '11:00 AM - 4:00 PM',
      recommendation: 'Walk Marine Drive at sunset and visit Gateway of India in early morning hours.'
    },
    popularAttractions: [
      {
        id: 'att-mumbai-1',
        name: 'Gateway of India & Taj Mahal Palace',
        category: 'Heritage',
        rating: 4.92,
        reviewCount: 4500,
        estimatedTime: '2 hrs',
        entryFee: 0,
        image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=600&q=80',
        description: 'Triumphant 26-meter basalt arch facing Mumbai Harbor built for King George V in 1911 alongside the historic Taj Hotel.',
        lat: 18.9220,
        lng: 72.8347,
        crowdLevel: 'High',
        bestTimeToVisit: '7:00 AM - 9:30 AM'
      },
      {
        id: 'att-mumbai-2',
        name: 'Marine Drive (Queens Necklace)',
        category: 'Sightseeing',
        rating: 4.95,
        reviewCount: 3800,
        estimatedTime: '1.5 hrs',
        entryFee: 0,
        image: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=600&q=80',
        description: '3.6 km C-shaped Boulevard along the Arabian Coast resembling a string of sparkling pearls at night.',
        lat: 18.9438,
        lng: 72.8231,
        crowdLevel: 'Moderate',
        bestTimeToVisit: '5:30 PM - 8:00 PM'
      },
      {
        id: 'att-mumbai-3',
        name: 'Chhatrapati Shivaji Maharaj Terminus (CST)',
        category: 'Heritage',
        rating: 4.89,
        reviewCount: 2900,
        estimatedTime: '1 hr',
        entryFee: 0,
        image: 'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?auto=format&fit=crop&w=600&q=80',
        description: 'UNESCO World Heritage High Victorian Gothic revival railway station illuminated beautifully every evening.',
        lat: 18.9398,
        lng: 72.8355,
        crowdLevel: 'High',
        bestTimeToVisit: '7:00 PM - 9:00 PM'
      },
      {
        id: 'att-mumbai-4',
        name: 'Elephanta Caves (UNESCO Island)',
        category: 'Heritage',
        rating: 4.86,
        reviewCount: 2100,
        estimatedTime: '4 hrs',
        entryFee: 40,
        image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80',
        description: '5th-century rock-cut cave temples dedicated to Lord Shiva, accessible by a scenic 1-hour ferry ride from Gateway of India.',
        lat: 18.9633,
        lng: 72.9315,
        crowdLevel: 'Moderate',
        bestTimeToVisit: '9:00 AM - 1:00 PM'
      }
    ],
    localCuisines: ['Vada Pav', 'Pav Bhaji', 'Bombay Duck Fry', 'Bhel Puri at Juhu', 'Bun Maska Chai'],
    startingPrice: 7500,
    culturalSpecialties: {
      food: [
        { name: 'Authentic Bombay Vada Pav', description: 'Spiced potato fritter served in soft white bun with garlic coconut chutney.', mustTryAt: 'Ashok Vada Pav, Dadar / Aram Vada Pav, CST', isVeg: true, tag: 'Iconic Street Food' },
        { name: 'Butter Pav Bhaji', description: 'Mashed spiced vegetable curry cooked on flat iron tawa with toasted butter buns.', mustTryAt: 'Sardar Refreshments, Tardeo / Cannon, CST', isVeg: true, tag: 'Midnight Classic' }
      ],
      clothing: [],
      handicrafts: [],
      jewellery: [],
      artAndCulture: [],
      festivals: [{ name: 'Ganesh Chaturthi', monthOrSeason: 'August-September', culturalSignificance: 'Grand community festival featuring massive eco-friendly idols and Dhol Tasha drums.', celebrationHighlights: 'Visarjan procession at Girgaon Chowpatty' }],
      localShopping: [{ product: 'Colaba Causeway Fashion & Antiques', bestMarket: 'Colaba Causeway Market', priceRange: '₹100 - ₹1,500', tip: 'Friendly bargaining recommended' }],
      uniqueExperiences: []
    }
  },

  // 3. MAHARASHTRA: PUNE (Cultural Capital, Maratha Forts & IT Hub)
  {
    id: 'dest-pune',
    name: 'Pune',
    stateOrRegion: 'Maharashtra',
    country: 'India',
    isInternational: false,
    state: 'Maharashtra',
    region: 'Western Ghats / Desh',
    district: 'Pune',
    thematicTags: ['heritage', 'food', 'nature', 'culture', 'adventure'],
    tierCategory: 'Tier-1',
    popularityTier: 'popular',
    carryingCapacityDaily: 25000,
    currentCapacityLoadPct: 60,
    isOvertouristed: false,
    localEconomicRetentionPct: 88,
    sustainabilityScore: 89,
    affordabilityIndex: 86,
    tagline: 'Cultural Capital of Maharashtra: Shaniwar Wada Palace, Sahyadri Trekking & Misal Pav',
    description: 'Pune blends rich Maratha empire history with vibrant youth culture and pleasant green weather. Gateway to Sahyadri hill forts, historic Peshwa palaces, and legendary Maharashtrian culinary spots.',
    heroImage: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80'
    ],
    vibe: ['heritage', 'mountain', 'culinary', 'cultural'],
    rating: 4.87,
    reviewCount: 2400,
    lat: 18.5204,
    lng: 73.8567,
    bestMonths: ['October', 'November', 'December', 'January', 'February', 'March'],
    currentWeather: {
      tempC: 25,
      condition: 'Pleasant & Breeze',
      icon: 'Sun',
      forecast: 'Cool pleasant weather perfect for hill fort treks',
      airQualityIndex: 30
    },
    safetyScore: {
      overall: 95,
      daySafety: 98,
      nightSafety: 92,
      emergencyContact: '112 / Pune City Police (+91 20 2612 8888)',
      advisory: 'Extremely safe educational and cultural center.'
    },
    crowdPrediction: {
      currentStatus: 'Low',
      peakHours: '5:00 PM - 8:00 PM (FC Road Market)',
      quietHours: '7:00 AM - 11:00 AM',
      recommendation: 'Visit Shaniwar Wada in early morning for cool weather and heritage photography.'
    },
    popularAttractions: [
      {
        id: 'att-pune-1',
        name: 'Shaniwar Wada Palace Fort',
        category: 'Heritage',
        rating: 4.88,
        reviewCount: 3100,
        estimatedTime: '2 hrs',
        entryFee: 25,
        image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=600&q=80',
        description: 'Seat of the Maratha Empire Peshwas built in 1732 featuring massive Delhi Gate ramparts.',
        lat: 18.5196,
        lng: 73.8553,
        crowdLevel: 'Moderate',
        bestTimeToVisit: '9:00 AM - 11:30 AM'
      },
      {
        id: 'att-pune-2',
        name: 'Aga Khan Palace',
        category: 'Heritage',
        rating: 4.91,
        reviewCount: 2100,
        estimatedTime: '1.5 hrs',
        entryFee: 25,
        image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80',
        description: 'Italian arches and sprawling lawns where Mahatma Gandhi was incarcerated during the Quit India movement.',
        lat: 18.5529,
        lng: 73.9015,
        crowdLevel: 'Low',
        bestTimeToVisit: '10:00 AM - 1:00 PM'
      },
      {
        id: 'att-pune-3',
        name: 'Sinhagad Fort (Lion Fort)',
        category: 'Adventure',
        rating: 4.94,
        reviewCount: 4200,
        estimatedTime: '4 hrs',
        entryFee: 50,
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
        description: 'Mountaintop fortress 1,300 meters high, famed for Tanaji Malusare’s historic siege and traditional Pithla Bhakri.',
        lat: 18.3663,
        lng: 73.7558,
        crowdLevel: 'Moderate',
        bestTimeToVisit: '6:30 AM - 10:30 AM'
      }
    ],
    localCuisines: ['Puneri Misal Pav', 'Bakarwadi', 'Pithla Bhakri at Sinhagad', 'Mango Mastani'],
    startingPrice: 5500,
    culturalSpecialties: {
      food: [
        { name: 'Puneri Spicy Misal Pav', description: 'Sprouted moth beans curry topped with crunchy farsan, chopped onions, and lemon.', mustTryAt: 'Bedekar Misal / Katairrurr, Sadashiv Peth', isVeg: true, tag: 'Signature Breakfast' },
        { name: 'Chitale Bakarwadi & Mango Mastani', description: 'Crispy savory rolled pinwheels and thick mango ice-cream shake.', mustTryAt: 'Chitale Bandhu Mithaiwale / Sujata Mastani', isVeg: true, tag: 'Famous Snack' }
      ],
      clothing: [],
      handicrafts: [],
      jewellery: [],
      artAndCulture: [],
      festivals: [],
      localShopping: [],
      uniqueExperiences: []
    }
  },

  // 4. GOA: BEACHES, CHURCHES & HERITAGE
  {
    id: 'dest-goa',
    name: 'Goa',
    stateOrRegion: 'Goa',
    country: 'India',
    isInternational: false,
    state: 'Goa',
    region: 'Konkan Coast',
    district: 'North & South Goa',
    thematicTags: ['beaches', 'food', 'adventure', 'heritage', 'culture'],
    tierCategory: 'Tier-1',
    popularityTier: 'popular',
    carryingCapacityDaily: 40000,
    currentCapacityLoadPct: 65,
    isOvertouristed: false,
    localEconomicRetentionPct: 84,
    sustainabilityScore: 88,
    affordabilityIndex: 82,
    tagline: 'Sun-Kissed Beaches, Portuguese Latin Quarter & Tropical Spice Plantations',
    description: 'Goa features pristine palm-fringed coastlines, UNESCO-listed 16th-century churches of Old Goa, colorful Portuguese heritage quarters in Panjim, water sports, and world-class seafood.',
    heroImage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80'
    ],
    vibe: ['beach', 'adventure', 'culinary', 'heritage'],
    rating: 4.91,
    reviewCount: 4800,
    lat: 15.2993,
    lng: 74.1240,
    bestMonths: ['November', 'December', 'January', 'February', 'March'],
    currentWeather: {
      tempC: 28,
      condition: 'Sunny & Coastal Breeze',
      icon: 'Sun',
      forecast: 'Warm tropical sunshine with pleasant sea breeze',
      airQualityIndex: 20
    },
    safetyScore: {
      overall: 94,
      daySafety: 97,
      nightSafety: 91,
      emergencyContact: '112 / Goa Tourist Police (+91 832 242 8990)',
      advisory: 'Very friendly tourist state. Follow beach lifeguard flags for swimming.'
    },
    crowdPrediction: {
      currentStatus: 'Moderate',
      peakHours: '5:00 PM - 8:00 PM (Baga & Calangute Beach Sunset)',
      quietHours: '7:00 AM - 10:00 AM',
      recommendation: 'Explore Fontainhas Latin Quarter in early morning for quiet photography.'
    },
    popularAttractions: [
      {
        id: 'att-goa-1',
        name: 'Fort Aguada & Lighthouse',
        category: 'Heritage',
        rating: 4.9,
        reviewCount: 3800,
        estimatedTime: '2 hrs',
        entryFee: 50,
        image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80',
        description: '17th-century Portuguese fortress standing at Sinquerim Beach overlooking the Arabian Sea.',
        lat: 15.4920,
        lng: 73.7737,
        crowdLevel: 'Moderate',
        bestTimeToVisit: '8:30 AM - 11:00 AM'
      },
      {
        id: 'att-goa-2',
        name: 'Basilica of Bom Jesus (Old Goa)',
        category: 'Heritage',
        rating: 4.93,
        reviewCount: 4100,
        estimatedTime: '1.5 hrs',
        entryFee: 0,
        image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80',
        description: 'UNESCO World Heritage baroque church housing the sacred mortal remains of St. Francis Xavier.',
        lat: 15.5009,
        lng: 73.9116,
        crowdLevel: 'Moderate',
        bestTimeToVisit: '9:00 AM - 12:00 PM'
      },
      {
        id: 'att-goa-3',
        name: 'Fontainhas (Latin Quarter, Panjim)',
        category: 'Sightseeing',
        rating: 4.92,
        reviewCount: 2900,
        estimatedTime: '2 hrs',
        entryFee: 0,
        image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80',
        description: 'Charming Heritage neighborhood with vibrant yellow, blue, and green Portuguese colonial villas.',
        lat: 15.4989,
        lng: 73.8311,
        crowdLevel: 'Low',
        bestTimeToVisit: '7:30 AM - 10:00 AM'
      }
    ],
    localCuisines: ['Goan Fish Curry Rice', 'Pork Vindaloo', 'Bebinca', 'Goan Feni', 'Poi Bread'],
    startingPrice: 8500,
    culturalSpecialties: {
      food: [
        { name: 'Authentic Goan Fish Curry Rice', description: 'Fresh kingfish cooked in coconut milk, dried red chillies, and kokum.', mustTryAt: 'Fat Fish, Baga / Ritz Classic, Panjim', isVeg: false, tag: 'Iconic Staple' },
        { name: 'Traditional Bebinca', description: '7-layered coconut milk and egg-yolk baked dessert spiced with cardamom.', isVeg: false, tag: 'Festive Dessert' }
      ],
      clothing: [],
      handicrafts: [],
      jewellery: [],
      artAndCulture: [],
      festivals: [],
      localShopping: [],
      uniqueExperiences: []
    }
  },

  // 5. TELANGANA: HYDERABAD (City of Pearls, Charminar & Royal Palaces)
  {
    id: 'dest-hyderabad',
    name: 'Hyderabad',
    stateOrRegion: 'Telangana',
    country: 'India',
    isInternational: false,
    state: 'Telangana',
    region: 'Deccan Plateau',
    district: 'Hyderabad',
    thematicTags: ['heritage', 'food', 'shopping', 'culture'],
    tierCategory: 'Tier-1',
    popularityTier: 'popular',
    carryingCapacityDaily: 30000,
    currentCapacityLoadPct: 62,
    isOvertouristed: false,
    localEconomicRetentionPct: 88,
    sustainabilityScore: 86,
    affordabilityIndex: 85,
    tagline: 'City of Pearls: Historic Charminar, Golconda Acoustic Fort & World-Famous Biryani',
    description: 'Hyderabad combines 400-year-old Qutb Shahi and Nizam royal heritage with a booming IT hub. World-renowned for authentic Hyderabadi Dum Biryani, pearl bazaars, and massive stone fortresses.',
    heroImage: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=800&q=80'
    ],
    vibe: ['heritage', 'culinary', 'urban', 'shopping'],
    rating: 4.89,
    reviewCount: 3100,
    lat: 17.3850,
    lng: 78.4867,
    bestMonths: ['October', 'November', 'December', 'January', 'February', 'March'],
    currentWeather: {
      tempC: 28,
      condition: 'Sunny & Clear',
      icon: 'Sun',
      forecast: 'Clear blue skies with warm sunny afternoon',
      airQualityIndex: 38
    },
    safetyScore: {
      overall: 94,
      daySafety: 97,
      nightSafety: 91,
      emergencyContact: '112 / Hyderabad Police (+91 40 2785 2435)',
      advisory: 'Extremely safe and hospitable city.'
    },
    crowdPrediction: {
      currentStatus: 'Moderate',
      peakHours: '6:00 PM - 9:30 PM (Laad Bazaar & Charminar Night Market)',
      quietHours: '8:00 AM - 11:00 AM',
      recommendation: 'Visit Golconda Fort at 8:30 AM to experience the acoustic clapping hall in peace.'
    },
    popularAttractions: [
      {
        id: 'att-hyd-1',
        name: 'Charminar & Laad Bazaar',
        category: 'Heritage',
        rating: 4.92,
        reviewCount: 5200,
        estimatedTime: '2 hrs',
        entryFee: 25,
        image: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=600&q=80',
        description: '1591 landmark mosque featuring four ornate 56-meter minarets surrounded by traditional pearl and lac bangle markets.',
        lat: 17.3616,
        lng: 78.4747,
        crowdLevel: 'High',
        bestTimeToVisit: '8:00 AM - 10:30 AM'
      },
      {
        id: 'att-hyd-2',
        name: 'Golconda Fort',
        category: 'Heritage',
        rating: 4.93,
        reviewCount: 4100,
        estimatedTime: '3 hrs',
        entryFee: 25,
        image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=600&q=80',
        description: 'Imposing medieval fortress with miraculous acoustic architecture where a handclap at the gate reverberates at the hilltop palace 1 km away.',
        lat: 17.3833,
        lng: 78.4011,
        crowdLevel: 'Moderate',
        bestTimeToVisit: '8:30 AM - 11:30 AM'
      }
    ],
    localCuisines: ['Hyderabadi Dum Biryani', 'Haleem', 'Double Ka Meetha', 'Osmania Biscuits with Irani Chai'],
    startingPrice: 8250,
    culturalSpecialties: {
      food: [
        { name: 'Authentic Hyderabadi Dum Biryani', description: 'Fragrant basmati rice slow-cooked on Dum with marinated meat, saffron, and fried onions.', mustTryAt: 'Bawarchi, RTC X Roads / Paradise / Shadab', isVeg: false, tag: 'World Famous' },
        { name: 'Irani Chai with Osmania Biscuits', description: 'Thick, creamy cardamom tea paired with buttery savory Osmania biscuits.', mustTryAt: 'Nimrah Cafe facing Charminar', isVeg: true, tag: 'Heritage Breakfast' }
      ],
      clothing: [],
      handicrafts: [],
      jewellery: [],
      artAndCulture: [],
      festivals: [],
      localShopping: [],
      uniqueExperiences: []
    }
  },

  // 6. KARNATAKA: BENGALURU (Garden City, Tech Capital & Craft Breweries)
  {
    id: 'dest-bengaluru',
    name: 'Bengaluru',
    stateOrRegion: 'Karnataka',
    country: 'India',
    isInternational: false,
    state: 'Karnataka',
    region: 'Deccan Plateau',
    district: 'Bengaluru Urban',
    thematicTags: ['heritage', 'food', 'nature', 'shopping', 'culture'],
    tierCategory: 'Tier-1',
    popularityTier: 'popular',
    carryingCapacityDaily: 45000,
    currentCapacityLoadPct: 70,
    isOvertouristed: false,
    localEconomicRetentionPct: 86,
    sustainabilityScore: 88,
    affordabilityIndex: 80,
    tagline: 'Garden City & Tech Capital: Royal Bangalore Palace, Lalbagh Gardens & Filter Coffee',
    description: 'Bengaluru features pleasant year-round weather, historic royal palaces, sprawling botanical gardens, iconic South Indian filter coffee joints, and vibrant microbreweries.',
    heroImage: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80'
    ],
    vibe: ['urban', 'nature', 'culinary', 'shopping'],
    rating: 4.88,
    reviewCount: 3400,
    lat: 12.9716,
    lng: 77.5946,
    bestMonths: ['October', 'November', 'December', 'January', 'February', 'March'],
    currentWeather: {
      tempC: 24,
      condition: 'Pleasant & Mild',
      icon: 'Sun',
      forecast: 'Cool pleasant weather with light afternoon breeze',
      airQualityIndex: 28
    },
    safetyScore: {
      overall: 95,
      daySafety: 98,
      nightSafety: 92,
      emergencyContact: '112 / Bengaluru Police (+91 80 2294 2222)',
      advisory: 'Extremely safe tech city with welcoming cosmopolitan culture.'
    },
    crowdPrediction: {
      currentStatus: 'Moderate',
      peakHours: '8:30 AM - 10:30 AM & 5:30 PM - 8:30 PM (Traffic Peak)',
      quietHours: '11:00 AM - 3:30 PM',
      recommendation: 'Visit Lalbagh Botanical Garden at 7:00 AM for fresh air and bird watching.'
    },
    popularAttractions: [
      {
        id: 'att-blr-1',
        name: 'Bangalore Palace',
        category: 'Heritage',
        rating: 4.89,
        reviewCount: 2800,
        estimatedTime: '2 hrs',
        entryFee: 230,
        image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=600&q=80',
        description: '1878 Tudor-style royal palace featuring fortified towers, ornate wood carvings, and royal memorabilia.',
        lat: 13.0003,
        lng: 77.5921,
        crowdLevel: 'Moderate',
        bestTimeToVisit: '10:00 AM - 1:00 PM'
      },
      {
        id: 'att-blr-2',
        name: 'Lalbagh Botanical Garden & Glass House',
        category: 'Nature',
        rating: 4.92,
        reviewCount: 4100,
        estimatedTime: '2 hrs',
        entryFee: 30,
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
        description: '240-acre botanical garden commissioned by Hyder Ali in 1760 featuring a historic London-style Glass House.',
        lat: 12.9507,
        lng: 77.5848,
        crowdLevel: 'Low',
        bestTimeToVisit: '6:30 AM - 9:30 AM'
      }
    ],
    localCuisines: ['Crispy Benne Dosa', 'South Indian Filter Coffee', 'Bisi Bele Bath', 'Rava Idli'],
    startingPrice: 8800,
    culturalSpecialties: {
      food: [
        { name: 'Malleswaram Butter Masala Dosa & Filter Coffee', description: 'Crispy golden rice crepe smeared with white butter served with frothy decoction filter coffee.', mustTryAt: 'CTR (Shri Sagar), Malleswaram / MTR, Lalbagh', isVeg: true, tag: 'Iconic Breakfast' }
      ],
      clothing: [],
      handicrafts: [],
      jewellery: [],
      artAndCulture: [],
      festivals: [],
      localShopping: [],
      uniqueExperiences: []
    }
  },

  // 7. DELHI: CAPITAL CITY, MONUMENTS & CHANDNI CHOWK
  {
    id: 'dest-delhi',
    name: 'Delhi',
    stateOrRegion: 'Delhi NCR',
    country: 'India',
    isInternational: false,
    state: 'Delhi',
    region: 'North India',
    district: 'Central & New Delhi',
    thematicTags: ['heritage', 'food', 'shopping', 'culture'],
    tierCategory: 'Tier-1',
    popularityTier: 'popular',
    carryingCapacityDaily: 60000,
    currentCapacityLoadPct: 75,
    isOvertouristed: false,
    localEconomicRetentionPct: 82,
    sustainabilityScore: 80,
    affordabilityIndex: 78,
    tagline: 'Heart of India: Red Fort, Qutub Minar, Humayun Tomb & Chandni Chowk Food Street',
    description: 'Delhi showcases 1,000+ years of empire history through UNESCO World Heritage monuments, broad ceremonial boulevards of New Delhi, and ancient labyrinth bazaar streets of Chandni Chowk.',
    heroImage: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80'
    ],
    vibe: ['heritage', 'culinary', 'urban', 'shopping'],
    rating: 4.88,
    reviewCount: 5100,
    lat: 28.6139,
    lng: 77.2090,
    bestMonths: ['October', 'November', 'December', 'January', 'February', 'March'],
    currentWeather: {
      tempC: 22,
      condition: 'Sunny & Pleasant',
      icon: 'Sun',
      forecast: 'Crisp autumn weather ideal for outdoor monument walks',
      airQualityIndex: 65
    },
    safetyScore: {
      overall: 88,
      daySafety: 94,
      nightSafety: 82,
      emergencyContact: '112 / Delhi Police (+91 11 2349 0000)',
      advisory: 'Use metro or verified cabs. Stay on well-lit main boulevards at night.'
    },
    crowdPrediction: {
      currentStatus: 'High',
      peakHours: '11:00 AM - 4:00 PM (Chandni Chowk Market)',
      quietHours: '7:00 AM - 10:00 AM',
      recommendation: 'Visit Qutub Minar at 7:30 AM for quiet morning light and low crowds.'
    },
    popularAttractions: [
      {
        id: 'att-delhi-1',
        name: 'Qutub Minar (UNESCO World Heritage)',
        category: 'Heritage',
        rating: 4.93,
        reviewCount: 6100,
        estimatedTime: '2 hrs',
        entryFee: 40,
        image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=600&q=80',
        description: '73-meter soaring fluted red sandstone minaret built in 1192 alongside the rust-resistant 4th-century Iron Pillar.',
        lat: 28.5245,
        lng: 77.1855,
        crowdLevel: 'Moderate',
        bestTimeToVisit: '7:30 AM - 10:30 AM'
      },
      {
        id: 'att-delhi-2',
        name: 'Humayun’s Tomb (Mughal Precursor to Taj)',
        category: 'Heritage',
        rating: 4.95,
        reviewCount: 4800,
        estimatedTime: '2 hrs',
        entryFee: 40,
        image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80',
        description: 'Magnificent 1570 garden tomb featuring double domes and Persian charbagh symmetrical water channels.',
        lat: 28.5933,
        lng: 77.2507,
        crowdLevel: 'Moderate',
        bestTimeToVisit: '8:00 AM - 11:00 AM'
      }
    ],
    localCuisines: ['Delhi Butter Chicken', 'Chandni Chowk Paranthas', 'Chole Bhature', 'Chaat at UPSC'],
    startingPrice: 10450,
    culturalSpecialties: {
      food: [
        { name: 'Old Delhi Chole Bhature & Stuffed Paranthas', description: 'Spiced chickpea curry paired with deep-fried bread and hot stuffed paranthas.', mustTryAt: 'Sita Ram Diwan Chand, Paharganj / Paranthe Wali Gali', isVeg: true, tag: 'Legendary Breakfast' }
      ],
      clothing: [],
      handicrafts: [],
      jewellery: [],
      artAndCulture: [],
      festivals: [],
      localShopping: [],
      uniqueExperiences: []
    }
  },

  // 8. RAJASTHAN: JAIPUR (Pink City, Royal Forts & Palaces)
  {
    id: 'dest-jaipur',
    name: 'Jaipur',
    stateOrRegion: 'Rajasthan',
    country: 'India',
    isInternational: false,
    state: 'Rajasthan',
    region: 'Dhundhar / Royal Rajasthan',
    district: 'Jaipur',
    thematicTags: ['heritage', 'food', 'shopping', 'culture'],
    tierCategory: 'Tier-1',
    popularityTier: 'popular',
    carryingCapacityDaily: 35000,
    currentCapacityLoadPct: 65,
    isOvertouristed: false,
    localEconomicRetentionPct: 87,
    sustainabilityScore: 89,
    affordabilityIndex: 82,
    tagline: 'The Pink City: Amber Fort, Honeycomb Hawa Mahal & Royal Rajput Palaces',
    description: 'Jaipur is the royal capital of Rajasthan, world-famed for pink sandstone architecture, hilltop Amber Fort, honeycomb Hawa Mahal facade, and exquisite block-print textiles and gemstone jewelry.',
    heroImage: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80'
    ],
    vibe: ['heritage', 'culinary', 'cultural', 'shopping'],
    rating: 4.92,
    reviewCount: 4200,
    lat: 26.9124,
    lng: 75.7873,
    bestMonths: ['October', 'November', 'December', 'January', 'February', 'March'],
    currentWeather: {
      tempC: 26,
      condition: 'Sunny & Warm',
      icon: 'Sun',
      forecast: 'Pleasant desert sunshine with cool evening breezes',
      airQualityIndex: 32
    },
    safetyScore: {
      overall: 95,
      daySafety: 98,
      nightSafety: 91,
      emergencyContact: '112 / Jaipur Tourist Police (+91 141 257 4000)',
      advisory: 'Extremely safe and hospitable royal heritage destination.'
    },
    crowdPrediction: {
      currentStatus: 'Moderate',
      peakHours: '10:00 AM - 1:00 PM (Amber Fort Elephant Gate)',
      quietHours: '7:30 AM - 9:30 AM',
      recommendation: 'Visit Amber Fort at 8:00 AM for cool morning light and effortless entry.'
    },
    popularAttractions: [
      {
        id: 'att-jaipur-1',
        name: 'Amber Fort (Amer Fort)',
        category: 'Heritage',
        rating: 4.96,
        reviewCount: 6500,
        estimatedTime: '3 hrs',
        entryFee: 100,
        image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80',
        description: 'Majestic 1592 hilltop fortress crafted from yellow and pink sandstone featuring the breathtaking Sheesh Mahal (Mirror Palace).',
        lat: 26.9855,
        lng: 75.8513,
        crowdLevel: 'Moderate',
        bestTimeToVisit: '8:00 AM - 11:00 AM'
      },
      {
        id: 'att-jaipur-2',
        name: 'Hawa Mahal (Palace of Winds)',
        category: 'Heritage',
        rating: 4.91,
        reviewCount: 5100,
        estimatedTime: '1 hr',
        entryFee: 50,
        image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80',
        description: '5-story honeycomb facade constructed in 1799 with 953 intricate Jharokha latticed windows.',
        lat: 26.9239,
        lng: 75.8267,
        crowdLevel: 'High',
        bestTimeToVisit: '8:30 AM - 10:30 AM'
      }
    ],
    localCuisines: ['Dal Baati Churma', 'Gatte Ki Sabzi', 'Pyaaz Kachori', 'Ghevar'],
    startingPrice: 6800,
    culturalSpecialties: {
      food: [
        { name: 'Royal Rajasthani Dal Baati Churma', description: 'Hard wheat balls baked over cow dung embers served with ghee and five-lentil Panchmel dal.', mustTryAt: 'Chokhi Dhani / Laxmi Mishthan Bhandar (LMB)', isVeg: true, tag: 'Royal Feast' }
      ],
      clothing: [],
      handicrafts: [
        { name: 'Jaipur Blue Pottery & Block Print (GI Tagged)', description: 'Traditional quartz glaze blue pottery and Sanganeri woodblock textiles.', giTagged: true, artisanCommunity: 'Sanganer Guild' }
      ],
      jewellery: [],
      artAndCulture: [],
      festivals: [],
      localShopping: [],
      uniqueExperiences: []
    }
  }
];
