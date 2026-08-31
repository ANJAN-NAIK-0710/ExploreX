import { Destination } from '../../src/types';

export const INDIA_EXPANDED_DESTINATIONS: Destination[] = [
  // 1. MAHARASHTRA: SINDHUDURG & TARKARLI (Alternative to Goa)
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
      advisory: 'Extremely peaceful and welcoming coastal villages. Local homestays provide warm hospitality.'
    },
    crowdPrediction: {
      currentStatus: 'Low',
      peakHours: '4:30 PM - 6:30 PM (Sunset at Chivla Beach)',
      quietHours: '6:00 AM - 11:00 AM',
      recommendation: 'Take morning 7:30 AM boat rides to Sindhudurg Fort for calm waters and dolphin sightings.'
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
        description: 'Iconic fortress built directly on a rocky island by Chhatrapati Shivaji Maharaj in 1664 with 3 km of ramparts.',
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
        description: 'Certified PADI scuba diving center and pristine coral banks with 20ft underwater visibility.',
        lat: 15.9877,
        lng: 73.4912,
        crowdLevel: 'Low',
        bestTimeToVisit: '8:30 AM - 12:00 PM',
        isOffbeat: true
      },
      {
        id: 'att-sindhu-3',
        name: 'Sawantwadi Wooden Toys Palace',
        category: 'Sightseeing',
        rating: 4.85,
        reviewCount: 650,
        estimatedTime: '2 hrs',
        entryFee: 40,
        image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80',
        description: 'Royal palace housing the GI-tagged Sawantwadi Lacquerware wooden toy makers and Ganjifa playing card artisans.',
        lat: 15.9042,
        lng: 73.8200,
        crowdLevel: 'Low',
        bestTimeToVisit: '10:00 AM - 1:00 PM',
        isOffbeat: true
      }
    ],
    localCuisines: ['Malvani Surmai Thali', 'Solkadhi', 'Kombdi Vade', 'Ukdiche Modak', 'Ghavane with Coconut Chutney', 'Amboli'],
    startingPrice: 120,

    culturalSpecialties: {
      food: [
        { name: 'Malvani Surmai & Prawn Thali', description: 'Fresh Arabian Sea catch shallow-fried in fiery Malvani masala served with spicy Tisrya gravy.', mustTryAt: 'Chaitanya Restaurant, Malvan / Local Khanavals', isVeg: false, tag: 'Signature Seafood' },
        { name: 'Solkadhi', description: 'Refreshing pink digestive beverage made from freshly pressed coconut milk, wild kokum (Aamsul), garlic, and green chillies.', isVeg: true, tag: 'Traditional Drink' },
        { name: 'Kombdi Vade', description: 'Fluffy multi-grain fried puris (Vade) paired with traditional slow-cooked Konkani chicken curry.', isVeg: false, tag: 'Festive Classic' },
        { name: 'Steamed Ukdiche Modak', description: 'Rice flour dumplings filled with fresh grated coconut, organic jaggery, cardamom, and drizzled with pure A2 ghee.', isVeg: true, tag: 'Sacred Sweet' }
      ],
      clothing: [
        { name: 'Konkani Kashta & Dhoti', description: 'Traditional 9-yard Nauvari saree worn in fisherman Kashta drape for effortless coastal movement.', occasion: 'Festivals & Daily Fishing Traditions', authenticHub: 'Malvan & Kudal' }
      ],
      handicrafts: [
        { name: 'Sawantwadi Lacquerware Wooden Toys (GI Tagged)', description: 'Eco-friendly hand-turned wooden fruits, dolls, and kitchen sets lacquered with natural vegetable dyes.', giTagged: true, artisanCommunity: 'Chitari Craftsmen Community of Sawantwadi' },
        { name: 'Ganjifa Handpainted Cards', description: 'Ancient Persian-Mughal card game preserved in circular hand-painted paper and leather discs depicting Dashavatara.', giTagged: true, artisanCommunity: 'Sawantwadi Royal Guild' }
      ],
      jewellery: [
        { name: 'Konkani Thushi & Kolhapuri Saaj', description: 'Traditional gold bead choker necklace and hand-carved leaf amulet pendants.', material: '22K Gold & Silver', traditionalSignificance: 'Heritage marital ornament worn during Konkan festivals' }
      ],
      artAndCulture: [
        { name: 'Dashavatar Folk Theatre', description: '500-year-old night-long open-air folk theatre enacting the 10 incarnations of Lord Vishnu with vibrant costumes and live harmonium rhythms.', type: 'theatre' }
      ],
      festivals: [
        { name: 'Sindhudurg Ganesh Utsav', monthOrSeason: 'September (Bhadrapada)', culturalSignificance: 'The grandest coastal celebration where every ancestral home hosts clay Ganpati with Malvani feasts.', celebrationHighlights: 'Traditional Aarti, Bhajan, and immersion processions at sea.' }
      ],
      localShopping: [
        { product: 'Devgad Alphonso Mangoes (Hapus)', bestMarket: 'Devgad Cooperative Orchards', priceRange: '₹600 - ₹1200 / Dozen (Seasonal)', tip: 'Look for the official GI hologram tag to ensure 100% authentic Devgad origin.' },
        { product: 'Pure Wild Kokum & Amsul Butter', bestMarket: 'Kankavli Weekly Haat', priceRange: '₹150 - ₹350 / Pack', tip: 'Unsweetened dried rinds are best for culinary curries.' }
      ],
      uniqueExperiences: [
        { title: 'Scuba Diving at Shivaji Sea Fort Ramparts', description: 'Explore shallow reef coral gardens right below the massive stone bastions of Sindhudurg Fort.', bestTime: 'Morning 8:00 AM - 11:00 AM', localImpact: 'Directly supports local certified village scuba instructors and marine preservation.' },
        { title: 'Devbagh Sangam Kayaking & Dolphin Watch', description: 'Paddle where the Karli River meets the Arabian Sea with zero engine noise to spot playful humpback dolphins.', bestTime: 'Sunrise 6:30 AM', localImpact: 'Run by local fisherman youth cooperative.' }
      ]
    },

    alternativeTo: ['Goa', 'dest-goa', 'North Goa', 'Baga'],
    whyAlternativeBetter: {
      headline: 'Replace Overcrowded Goa with the Serene, Untouched Soul of Sindhudurg',
      replacesFamousSpot: 'Goa',
      crowdReductionPct: 74,
      costSavingsPct: 45,
      localAuthenticityScore: 96,
      keyAdvantage: 'Pristine turquoise waters, zero commercial touts, authentic home-cooked Malvani cuisine, and 89% direct local economic retention.',
      comparisonHighlights: [
        { metric: 'Beach Atmosphere', famousSpot: 'Noisy commercial shacks & jet-ski fumes', hiddenGem: 'Pristine white sand, coconut palm canopy & quiet waves' },
        { metric: 'Underwater Visibility', famousSpot: 'Murky near tourist beaches (2-4 ft)', hiddenGem: 'Crystal clear reefs at Tarkarli (15-20 ft visibility)' },
        { metric: 'Average Cost / Day', famousSpot: '₹4,500 - ₹8,000 per couple', hiddenGem: '₹2,200 - ₹3,800 per couple in authentic sea-view homestays' }
      ]
    },

    localEconomy: {
      localImpactScore: 92,
      economicRetentionExplainer: '89% of traveler spending directly empowers local fishing families, authentic village homestay hosts, and GI-craft toy woodcarvers.',
      authenticHomestays: [
        { name: 'Kinnara Konkan Homestay', hostName: 'Suresh & Shubhangi Pednekar', village: 'Tarkarli Beach Road', pricePerNight: 1800, specialties: ['Beachfront coconut garden', 'Homemade Malvani fish thali', 'Bicycle rentals'], rating: 4.95, contactInfo: '+91 94224 81920' },
        { name: 'Devbagh Sangam Village Villa', hostName: 'Anil Tandel', village: 'Devbagh Spit', pricePerNight: 2200, specialties: ['River & sea confluence view', 'Private wooden boat rides', 'Fresh crab curry'], rating: 4.9 }
      ],
      traditionalKhanavals: [
        { name: 'Atithi Bamboo Khanaval', signatureDish: 'Surmai Masala Thali with Solkadhi', location: 'Malvan Main Bazaar', avgMealCost: 280, isFamilyRun: true },
        { name: 'Gajalee Malvan Dhaba', signatureDish: 'Crab Sukka & Amboli', location: 'Chivla Beach', avgMealCost: 320, isFamilyRun: true }
      ],
      communityGuides: [
        { name: 'Santosh Sawant', expertise: 'Sindhudurg Fort Historian & Marine Naturalist', languages: ['Marathi', 'Hindi', 'English'], badge: 'State Tourism Certified', dailyRate: 1000 },
        { name: 'Mangesh Tarkar', expertise: 'PADI Scuba Master & Coral Reef Guide', languages: ['Marathi', 'Hindi', 'English'], badge: 'Certified Diver', dailyRate: 1500 }
      ],
      artisanCooperatives: [
        { craft: 'Sawantwadi Lacquered Toys & Ganjifa', guildName: 'Sawantwadi Artisans Guild', village: 'Moti Talav, Sawantwadi', directBuyingContact: '+91 2363 272010' }
      ],
      localTransportOptions: [
        { mode: 'Eco Auto Rickshaw', typicalRoute: 'Malvan Bazaar to Tarkarli / Devbagh', approxFare: '₹120 - ₹180', ecoFriendly: true },
        { mode: 'Traditional Wooden Ferry', typicalRoute: 'Malvan Jetty to Sindhudurg Fort', approxFare: '₹90 per person return', ecoFriendly: true }
      ]
    },

    bestTimeEngine: {
      bestSeasonDescription: 'Winter & Post-Monsoon (October to March) — Crisp ocean breeze, calm waters for scuba diving, and mild 26°C daytime temperatures.',
      idealMonths: ['October', 'November', 'December', 'January', 'February', 'March'],
      timeOfDayGuide: {
        morning: { hours: '06:00 AM - 10:00 AM', recommendation: 'Boat ride to Shivaji Sea Fort and scuba diving sessions when water is crystal clear and calm.', crowd: 'Low' },
        afternoon: { hours: '12:00 PM - 03:30 PM', recommendation: 'Indulge in a traditional Malvani seafood thali at a family khanaval followed by a visit to Sawantwadi toy palace.', crowd: 'Low' },
        evening: { hours: '04:30 PM - 07:00 PM', recommendation: 'Sunset walk at Chivla Beach or Devbagh Sangam sandbar with Solkadhi.', crowd: 'Moderate' },
        night: { hours: '08:00 PM - 10:30 PM', recommendation: 'Watch village Dashavatar folk theatre or stargaze on quiet beaches.', crowd: 'Low' }
      },
      weatherIndexCurrent: 92,
      weatherForecastNarrative: 'Ideal coastal weather with gentle Arabian Sea winds and negligible rainfall.',
      budgetEstimator: {
        budgetTier: { stayPerDay: 1200, foodPerDay: 500, transitPerDay: 300, totalDaily: 2000 },
        moderateTier: { stayPerDay: 2500, foodPerDay: 900, transitPerDay: 600, totalDaily: 4000 },
        luxuryTier: { stayPerDay: 5500, foodPerDay: 1800, transitPerDay: 1200, totalDaily: 8500 }
      },
      upcomingEvents: [
        { name: 'Anganewadi Bharadi Devi Jatra', dateRange: 'February (Annual Fair)', type: 'Pilgrimage Fair', significance: 'Famous coastal temple festival drawing thousands for rural prasad and cultural rituals.' },
        { name: 'Malvan Scuba & Marine Fest', dateRange: 'November 15 - 20', type: 'Adventure & Eco-tourism', significance: 'Promoting marine biodiversity conservation and local boatman livelihood.' }
      ]
    }
  },

  // 2. MAHARASHTRA: PUNE (Cultural Capital & Heritage Hub)
  {
    id: 'dest-pune',
    name: 'Pune',
    stateOrRegion: 'Western Maharashtra',
    country: 'India',
    isInternational: false,
    state: 'Maharashtra',
    region: 'Desh / Western Maharashtra',
    district: 'Pune',
    thematicTags: ['food', 'culture', 'clothing', 'heritage', 'shopping', 'adventure'],
    tierCategory: 'Tier-2',
    popularityTier: 'emerging',
    carryingCapacityDaily: 25000,
    currentCapacityLoadPct: 58,
    isOvertouristed: false,
    localEconomicRetentionPct: 82,
    sustainabilityScore: 88,
    affordabilityIndex: 86,
    tagline: 'The Cultural Epicenter of Maharashtra: Peshwa Heritage, Misal Trails & Sahyadri Forts',
    description: 'Pune harmoniously blends Maratha and Peshwa imperial heritage, world-renowned street gastronomy, bustling traditional peths for handlooms, and rugged Sahyadri hill fort treks like Sinhagad and Rajgad.',
    heroImage: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80'
    ],
    vibe: ['heritage', 'culinary', 'urban', 'adventure', 'wellness'],
    rating: 4.86,
    reviewCount: 3100,
    lat: 18.5204,
    lng: 73.8567,
    bestMonths: ['July', 'August', 'September', 'October', 'November', 'December', 'January', 'February'],
    currentWeather: {
      tempC: 25,
      condition: 'Pleasant & Breezy',
      icon: 'CloudSun',
      forecast: 'Mild cool morning with comfortable daytime breeze',
      airQualityIndex: 58
    },
    safetyScore: {
      overall: 95,
      daySafety: 97,
      nightSafety: 92,
      emergencyContact: '112 / Pune Police Control Room (+91 20 2612 2880)',
      advisory: 'One of the safest educational and cultural cities in India. Ideal for solo women and family heritage travelers.'
    },
    crowdPrediction: {
      currentStatus: 'Moderate',
      peakHours: '11:00 AM - 1:30 PM (Katta / Food joints), 5:30 PM - 8:30 PM (Laxmi Road)',
      quietHours: '6:30 AM - 9:30 AM',
      recommendation: 'Climb Sinhagad Fort early at 6:30 AM for breathtaking cloud inversions and steaming Pithla Bhakri.'
    },
    popularAttractions: [
      {
        id: 'att-pune-1',
        name: 'Shaniwar Wada Fort Palace',
        category: 'Heritage',
        rating: 4.82,
        reviewCount: 2100,
        estimatedTime: '2 hrs',
        entryFee: 25,
        image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=600&q=80',
        description: 'Seat of the Peshwa rulers of the Maratha Empire built in 1732 with majestic Dilli Darwaza gates.',
        lat: 18.5196,
        lng: 73.8553,
        crowdLevel: 'Moderate',
        bestTimeToVisit: '9:00 AM - 11:30 AM'
      },
      {
        id: 'att-pune-2',
        name: 'Sinhagad Fort',
        category: 'Adventure',
        rating: 4.92,
        reviewCount: 2890,
        estimatedTime: '4 hrs',
        entryFee: 50,
        image: 'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=600&q=80',
        description: 'Historic Sahyadri hill fortress associated with Tanaji Malusare, offering sweeping views of Khadakwasla Dam.',
        lat: 18.3663,
        lng: 73.7558,
        crowdLevel: 'Moderate',
        bestTimeToVisit: '6:30 AM - 10:00 AM'
      },
      {
        id: 'att-pune-3',
        name: 'Aga Khan Palace & Gandhi Memorial',
        category: 'Heritage',
        rating: 4.8,
        reviewCount: 1450,
        estimatedTime: '2 hrs',
        entryFee: 25,
        image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80',
        description: 'Majestic Italian-arched palace where Mahatma Gandhi and Kasturba Gandhi were interned during the Quit India Movement.',
        lat: 18.5524,
        lng: 73.9015,
        crowdLevel: 'Low',
        bestTimeToVisit: '10:00 AM - 1:00 PM'
      }
    ],
    localCuisines: ['Puneri Misal Pav', 'Katakirr Misal', 'Chitale Bandhu Bakarwadi', 'Sujata Mastani Ice Cream Milkshake', 'Puran Poli with Ghee', 'Kanda Bhaji at Sinhagad'],
    startingPrice: 90,

    culturalSpecialties: {
      food: [
        { name: 'Puneri Misal Pav (Spicy Sprouts Curry)', description: 'Iconic spicy sprouted moth bean gravy garnished with crunchy farsan, raw onions, lemon, and served with buttery pav and fiery Tarri.', mustTryAt: 'Katakirr Misal (Karve Road) / Bedekar Tea Stall (Narayan Peth)', isVeg: true, tag: 'World-Famous Street Food' },
        { name: 'Chitale Bandhu Bakarwadi', description: 'Crispy fried spiral rolls stuffed with spicy-sweet poppy seed, sesame, and dried coconut masala.', mustTryAt: 'Chitale Bandhu, Bajirao Road', isVeg: true, tag: 'Heritage Snack' },
        { name: 'Sujata Mango Mastani', description: 'Legendary Pune dessert named after Peshwa Mastani Bai — thick Alphonso mango milkshake topped with rich ice cream, dry fruits, and tutty fruity.', mustTryAt: 'Sujata Mastani, Sadashiv Peth', isVeg: true, tag: 'Signature Dessert' },
        { name: 'Pithla Bhakri & Thecha', description: 'Fresh hot gram-flour curry with jowar flatbread and hand-pounded green chili-garlic chutney served atop Sinhagad Fort.', isVeg: true, tag: 'Fort Culinary Tradition' }
      ],
      clothing: [
        { name: 'Peshwai Paithani Saree', description: 'Exquisite mulberry silk sarees with pure gold and silver Zari borders featuring peacock (Mor) and parrot (Tota) motifs.', occasion: 'Weddings & Festive Occasions', authenticHub: 'Laxmi Road & Narayan Peth Handloom Houses' },
        { name: 'Puneri Pagadi & Kurta', description: 'Traditional crimson and gold headgear worn by intellectuals, scholars, and Maratha leaders as a mark of honor.', occasion: 'Cultural Felicitations & Heritage Events', authenticHub: 'Appa Balwant Chowk' }
      ],
      handicrafts: [
        { name: 'Tambat Ali Copper & Brass Craft (GI Heritage)', description: 'Centuries-old beaten copperware (Mathar-kaam) hand-hammered by traditional Tambat coppersmiths in historic alleys.', giTagged: true, artisanCommunity: 'Tambat Ali Coppersmiths of Kasba Peth' }
      ],
      jewellery: [
        { name: 'Peshwai Thushi, Kolhapuri Saaj & Marathi Nath', description: 'Brahmin and Peshwa-style pearl nose ring (Nath) studded with rubies, and handcrafted choker necklace.', material: 'Basra Pearls, Ruby & 22K Gold', traditionalSignificance: 'Emblem of regal Maharashtrian heritage' }
      ],
      artAndCulture: [
        { name: 'Sawai Gandharva Bhimsen Mahotsav', description: 'India’s premier Indian Classical Music festival founded by Bharat Ratna Pandit Bhimsen Joshi.', type: 'music' },
        { name: 'Powada & Shahiri Heritage', description: 'Traditional ballad poetry and energetic percussion celebrating the bravery of Chhatrapati Shivaji Maharaj.', type: 'folk_dance' }
      ],
      festivals: [
        { name: 'Pune Ganeshotsav', monthOrSeason: 'August / September', culturalSignificance: 'Birthplace of public Ganesh festival started by Lokmanya Tilak in 1893 with the iconic 5 Manache Ganpati.', celebrationHighlights: 'Dhol Tasha Pathaks (traditional percussion troupes) with 500+ synchronized youth drummers.' }
      ],
      localShopping: [
        { product: 'Authentic Chitale Sweets & Amba Barfi', bestMarket: 'Bajirao Road & Deccan Gymkhana', priceRange: '₹300 - ₹800 / kg', tip: 'Arrive before 11:00 AM or after 4:00 PM (traditional afternoon siesta hours!).' },
        { product: 'Hand-beaten Copper Water Bottles & Vessels', bestMarket: 'Tambat Ali, Kasba Peth', priceRange: '₹500 - ₹2,500', tip: 'Buying directly from Tambat Ali gives 100% earnings to master artisans.' }
      ],
      uniqueExperiences: [
        { title: 'Heritage Peth Walk & 5 Manache Ganpati Trail', description: 'Explore Kasba Peth, Shaniwar Peth, and Narayan Peth on foot with local historians.', bestTime: 'Morning 7:00 AM - 9:30 AM', localImpact: 'Supports local heritage walking guilds and heritage preservation.' },
        { title: 'Sunrise Trek to Sinhagad with Steaming Matka Dahi', description: 'Hike through Sahyadri morning mist to enjoy fresh clay-pot curd, Pithla Bhakri, and raw onion Thecha from village women.', bestTime: '06:00 AM', localImpact: 'Direct income for local hilltop village households.' }
      ]
    },

    localEconomy: {
      localImpactScore: 88,
      economicRetentionExplainer: '82% of spend stays with local family-run eateries, century-old textile weavers, and mountain village hospitality providers.',
      authenticHomestays: [
        { name: 'Peshwa Heritage Wada Retreat', hostName: 'Adv. Raghavendra Joshi', village: 'Near Shaniwar Wada, Kasba Peth', pricePerNight: 2400, specialties: ['Restored 150-year-old wooden Wada', 'Authentic Marathi breakfast', 'Guided Peth walks'], rating: 4.9 },
        { name: 'Sinhagad Foothills Agro Eco-Stay', hostName: 'Kailas & Sunita Thakar', village: 'Donje, Sinhagad Foothills', pricePerNight: 1600, specialties: ['Organic farm-to-table meals', 'Campfire & astronomy', 'Trek assistance'], rating: 4.88 }
      ],
      traditionalKhanavals: [
        { name: 'Bedekar Tea Stall & Misal', signatureDish: 'Sweet-spicy Puneri Misal with brown bread', location: 'Narayan Peth', avgMealCost: 120, isFamilyRun: true },
        { name: 'Janseva Dining Hall', signatureDish: 'Grand Maharashtrian Thali with Puran Poli & Aamras', location: 'Garware Bridge, Deccan', avgMealCost: 290, isFamilyRun: true }
      ],
      communityGuides: [
        { name: 'Dr. Anand Deshmukh', expertise: 'Maratha Fort Architecture & Peshwa Epigraphy', languages: ['Marathi', 'Hindi', 'English'], badge: 'Heritage Scholar', dailyRate: 1200 }
      ],
      artisanCooperatives: [
        { craft: 'Tambat Hand-hammered Copperware', guildName: 'Kasba Tambat Co-op Guild', village: 'Tambat Ali, Pune', directBuyingContact: '+91 20 2445 8810' }
      ],
      localTransportOptions: [
        { mode: 'The Explorer Pune Eco Auto', typicalRoute: 'Pune Station to Deccan / Kothrud', approxFare: '₹80 - ₹160', ecoFriendly: true },
        { mode: 'Pune Metro Line', typicalRoute: 'Civil Court to Vanaz / PCMC', approxFare: '₹20 - ₹35', ecoFriendly: true }
      ]
    },

    bestTimeEngine: {
      bestSeasonDescription: 'Monsoon & Winter (July to February) — Lush green Sahyadri hills, gushing waterfalls at Sinhagad, and cool 18°C-26°C weather.',
      idealMonths: ['July', 'August', 'September', 'October', 'November', 'December', 'January', 'February'],
      timeOfDayGuide: {
        morning: { hours: '06:30 AM - 10:00 AM', recommendation: 'Early hill trek at Sinhagad Fort or morning walk in historic Kasba Peth.', crowd: 'Low' },
        afternoon: { hours: '12:00 PM - 03:30 PM', recommendation: 'Visit Raja Dinkar Kelkar Museum and Aga Khan Palace memorial gardens.', crowd: 'Moderate' },
        evening: { hours: '05:00 PM - 08:30 PM', recommendation: 'Shopping for Paithani sarees on Laxmi Road followed by Sujata Mastani.', crowd: 'High' },
        night: { hours: '08:30 PM - 10:30 PM', recommendation: 'Dinner at a traditional Khanaval or cultural performance at Bal Gandharva Ranga Mandir.', crowd: 'Moderate' }
      },
      weatherIndexCurrent: 94,
      weatherForecastNarrative: 'Crisp, breezy weather ideal for outdoor cultural walks and hill fortress hiking.',
      budgetEstimator: {
        budgetTier: { stayPerDay: 1000, foodPerDay: 400, transitPerDay: 250, totalDaily: 1650 },
        moderateTier: { stayPerDay: 2200, foodPerDay: 800, transitPerDay: 500, totalDaily: 3500 },
        luxuryTier: { stayPerDay: 6000, foodPerDay: 2000, transitPerDay: 1200, totalDaily: 9200 }
      },
      upcomingEvents: [
        { name: 'Pune International Film Festival (PIFF)', dateRange: 'January (Annual)', type: 'Cinema & Arts', significance: 'Global cinematic showcase hosting world-class directors and critics.' },
        { name: 'Vasant Vyakhyanmala', dateRange: 'April - May', type: 'Intellectual Discourse', significance: '145-year-old lecture series started by Justice Ranade at Tilak Smarak Mandir.' }
      ]
    }
  },

  // 3. MAHARASHTRA: KOLHAPUR (Heritage, Food & GI Crafts)
  {
    id: 'dest-kolhapur',
    name: 'Kolhapur',
    stateOrRegion: 'Western Maharashtra',
    country: 'India',
    isInternational: false,
    state: 'Maharashtra',
    region: 'South Maharashtra',
    district: 'Kolhapur',
    thematicTags: ['heritage', 'food', 'clothing', 'shopping', 'spirituality', 'culture'],
    tierCategory: 'Tier-2',
    popularityTier: 'gem',
    carryingCapacityDaily: 12000,
    currentCapacityLoadPct: 44,
    isOvertouristed: false,
    localEconomicRetentionPct: 91,
    sustainabilityScore: 92,
    affordabilityIndex: 94,
    tagline: 'Land of Mahalakshmi, Royal Maratha Chhatrapatis, Tambda-Pandhra Rassa & GI Chappals',
    description: 'Kolhapur is an ancient cultural citadel founded on the banks of Panchganga River. Famous for the sacred 7th-century Mahalakshmi Temple, New Palace royal museum, authentic red and white mutton broth (Tambda-Pandhra Rassa), and world-famous handcrafted leather Kolhapuri Chappals.',
    heroImage: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80'
    ],
    vibe: ['heritage', 'culinary', 'spirituality', 'adventure'],
    rating: 4.88,
    reviewCount: 1680,
    lat: 16.7050,
    lng: 74.2433,
    bestMonths: ['October', 'November', 'December', 'January', 'February', 'March'],
    currentWeather: {
      tempC: 26,
      condition: 'Sunny & Pleasant',
      icon: 'Sun',
      forecast: 'Clear skies with cool evening breeze around Rankala Lake',
      airQualityIndex: 34
    },
    safetyScore: {
      overall: 96,
      daySafety: 98,
      nightSafety: 94,
      emergencyContact: '112 / Kolhapur District Police (+91 231 266 2222)',
      advisory: 'Deeply hospitable royal city. Respect temple sanctum dress codes.'
    },
    crowdPrediction: {
      currentStatus: 'Low',
      peakHours: '10:00 AM - 12:30 PM (Mahalakshmi Temple Darshan)',
      quietHours: '6:00 AM - 8:30 AM',
      recommendation: 'Visit Mahalakshmi Temple during early morning Kakad Aarti at 6:00 AM for tranquil Darshan.'
    },
    popularAttractions: [
      {
        id: 'att-kolhapur-1',
        name: 'Shree Ambabai Mahalakshmi Temple',
        category: 'Heritage',
        rating: 4.95,
        reviewCount: 3200,
        estimatedTime: '2 hrs',
        entryFee: 0,
        image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80',
        description: '7th-century Chalukyan temple dedicated to Goddess Mahalakshmi; twice a year sun rays illuminate the deity directly (Kiranotsav).',
        lat: 16.6946,
        lng: 74.2238,
        crowdLevel: 'Moderate',
        bestTimeToVisit: '6:00 AM - 8:30 AM'
      },
      {
        id: 'att-kolhapur-2',
        name: 'Panhala Fort (The Hill of the Serpent)',
        category: 'Heritage',
        rating: 4.9,
        reviewCount: 2150,
        estimatedTime: '3 hrs',
        entryFee: 30,
        image: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=600&q=80',
        description: 'Largest fort in the Deccan where Chhatrapati Shivaji spent over 500 days and executed his legendary siege escape to Vishalgad.',
        lat: 16.8144,
        lng: 74.1086,
        crowdLevel: 'Low',
        bestTimeToVisit: '8:30 AM - 12:00 PM',
        isOffbeat: true
      },
      {
        id: 'att-kolhapur-3',
        name: 'Shree Chhatrapati Shahu Museum (New Palace)',
        category: 'Heritage',
        rating: 4.84,
        reviewCount: 1400,
        estimatedTime: '2 hrs',
        entryFee: 50,
        image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80',
        description: 'Victorian-Indo-Saracenic royal black stone palace housing the throne, armory, and memorabilia of Rajarshi Shahu Maharaj.',
        lat: 16.7196,
        lng: 74.2386,
        crowdLevel: 'Low',
        bestTimeToVisit: '10:00 AM - 1:00 PM'
      }
    ],
    localCuisines: ['Tambda Rassa (Fiery Red Mutton Broth)', 'Pandhra Rassa (Silky Coconut-Mutton Broth)', 'Kolhapuri Mutton Sukka', 'Kolhapuri Misal', 'Jowar Bhakri', 'Kolhapuri Jaggery (Gul)'],
    startingPrice: 85,

    culturalSpecialties: {
      food: [
        { name: 'Tambda Rassa & Pandhra Rassa Mutton Thali', description: 'The pride of Kolhapur — slow-simmered fiery red broth (Tambda) spiced with Kolhapuri Lavangi chillies, paired with calming white coconut milk broth (Pandhra) infused with whole spices.', mustTryAt: 'Hotel Opal, Hotel Parakh, Dehati Restaurant', isVeg: false, tag: 'Signature Royal Dish' },
        { name: 'Kolhapuri Misal with Thick Farsan & Curd', description: 'Deep red, smoky-spiced sprout gravy cooked in traditional iron kadhais, eaten with onions and pav.', mustTryAt: 'Phadtare Misal, Bawada Misal, Ahar Misal', isVeg: true, tag: 'Spicy Breakfast' },
        { name: 'Pure Organic Kolhapuri Jaggery (Gul)', description: 'Chemical-free golden jaggery made from fresh sugarcane juice in traditional Kolhapur boiling vats (Gurhals).', isVeg: true, tag: 'GI Tagged Sweetener' }
      ],
      clothing: [
        { name: 'Kolhapuri Nauvari Saree & Pagote', description: 'Traditional Maratha nine-yard cotton and silk weaves with broad golden temple border, worn with royal Kolhapuri Pagote (turban).', occasion: 'Royal Dussehra & Mahalakshmi Kiranotsav', authenticHub: 'Bhausinghji Road & Gujri Market' }
      ],
      handicrafts: [
        { name: 'Handcrafted Kolhapuri Chappals (GI Tagged)', description: 'World-renowned vegetable-tanned leather footwear hand-braided and stitched with natural cord, zero nails or synthetic adhesives.', giTagged: true, artisanCommunity: 'Subhashnagar & Chappal Line Leather Artisans' }
      ],
      jewellery: [
        { name: 'Kolhapuri Saaj (Sacred 21-Amulet Gold Necklace)', description: 'Ancient royal gold necklace featuring 21 distinct hand-carved leaves depicting avatars of Vishnu and symbols of prosperity.', material: '22K Gold & Precious Stones', traditionalSignificance: 'Heritage marital heirloom of royal Maharashtra' },
        { name: 'Bugadi, Thushi & Kolhapuri Mohanmal', description: 'Ear top-piercing ornaments and spherical gold-bead strings handmade by local Sonar masters in Gujri.', material: '22K Gold & Silver', traditionalSignificance: 'Traditional Maratha royal jewellery' }
      ],
      artAndCulture: [
        { name: 'Kolhapuri Kushti (Traditional Mud Wrestling)', description: 'Century-old Indian wrestling practiced in sacred red mud pits (Talims) patronized by Rajarshi Shahu Maharaj.', type: 'heritage' }
      ],
      festivals: [
        { name: 'Kolhapur Royal Dussehra (Shilangan)', monthOrSeason: 'October (Ashvin)', culturalSignificance: 'Grand procession of the Kolhapur Royal Family on royal palanquin to Gurumaharaj Palkhi and gold-leaf exchange (Apta leaves).', celebrationHighlights: 'Traditional Maratha warriors, royal elephants, and Talim wrestlers.' }
      ],
      localShopping: [
        { product: 'Authentic Kolhapuri Chappals with Hand-braiding', bestMarket: 'Chappal Line, Mahalakshmi Temple Lane', priceRange: '₹600 - ₹3,500 / Pair', tip: 'Authentic Kolhapuri leather softens and moulds to your foot shape over time.' },
        { product: 'Kolhapuri Kanda-Lasun Masala (Onion-Garlic Spice Blend)', bestMarket: 'Shahupuri Spice Market', priceRange: '₹200 - ₹450 / 500g', tip: 'Essential secret spice for authentic Tambda Rassa at home.' }
      ],
      uniqueExperiences: [
        { title: 'Visit Live Kushti Wrestling at Motibagh Talim', description: 'Watch young Pehlwans (wrestlers) train in sacred red clay pits with oil massage and traditional gada (mace) swinging.', bestTime: 'Morning 06:30 AM - 08:30 AM', localImpact: 'Directly sustains indigenous wrestling gyms and youth athletes.' },
        { title: 'Sunset Boating & Chaupati at Rankala Lake', description: 'Stroll around the 1,000-year-old historic stone lake with evening Ragda Patties and view of Sandhya Math.', bestTime: '05:30 PM - 07:30 PM', localImpact: 'Empowers local lakefront small vendors.' }
      ]
    },

    localEconomy: {
      localImpactScore: 94,
      economicRetentionExplainer: '91% of trip funds directly sustain master leather cobbler guilds, hereditary gold craftsmen, and organic jaggery cane farmers.',
      authenticHomestays: [
        { name: 'Panhala Hilltop Heritage Homestay', hostName: 'Shivaji & Rohini Patil', village: 'Panhala Fort Hilltop', pricePerNight: 1900, specialties: ['Valley view balcony', 'Home-cooked Tambda-Pandhra Rassa', 'Fort walking guide'], rating: 4.92 },
        { name: 'Shahupuri Heritage Residence', hostName: 'Abhay Ghatge', village: 'Shahupuri, Kolhapur', pricePerNight: 2300, specialties: ['Maratha heritage architecture', 'Near Mahalakshmi Temple', 'Private courtyard'], rating: 4.89 }
      ],
      traditionalKhanavals: [
        { name: 'Hotel Parakh Kolhapur', signatureDish: 'Grand Mutton Special Thali with Unlimited Rassa', location: 'Old Pune-Bangalore Road', avgMealCost: 340, isFamilyRun: true },
        { name: 'Phadtare Misal Kendra', signatureDish: 'Special Jain & Kolhapuri Misal', location: 'Udyamnagar', avgMealCost: 110, isFamilyRun: true }
      ],
      communityGuides: [
        { name: 'Mahesh Kamble', expertise: 'Panhala Fort Military History & Maratha Epics', languages: ['Marathi', 'Hindi', 'English'], badge: 'State Fort Guide', dailyRate: 1000 }
      ],
      artisanCooperatives: [
        { craft: 'Handcrafted Kolhapuri Leather Chappals', guildName: 'Kolhapur Charmakar Audyogik Sahakari Sanstha', village: 'Subhashnagar, Kolhapur', directBuyingContact: '+91 231 264 1205' }
      ],
      localTransportOptions: [
        { mode: 'Kolhapur Eco Auto', typicalRoute: 'Railway Station to Mahalakshmi Temple / Rankala', approxFare: '₹60 - ₹120', ecoFriendly: true }
      ]
    },

    bestTimeEngine: {
      bestSeasonDescription: 'Post-Monsoon & Winter (October to March) — Clear weather, pleasant 20°C-28°C temperatures, and grand Dussehra & Diwali festivities.',
      idealMonths: ['October', 'November', 'December', 'January', 'February', 'March'],
      timeOfDayGuide: {
        morning: { hours: '06:00 AM - 09:30 AM', recommendation: 'Early morning Darshan at Shree Ambabai Temple followed by a visit to a live mud wrestling Talim.', crowd: 'Low' },
        afternoon: { hours: '12:00 PM - 03:00 PM', recommendation: 'Feast on authentic Tambda-Pandhra Rassa and explore New Palace Royal Museum.', crowd: 'Moderate' },
        evening: { hours: '04:30 PM - 07:30 PM', recommendation: 'Shop for authentic Kolhapuri Chappals in Chappal Line and enjoy sunset at Rankala Lake.', crowd: 'Moderate' },
        night: { hours: '08:00 PM - 10:00 PM', recommendation: 'Traditional Kolhapuri Misal or light dinner in historic Shahupuri.', crowd: 'Low' }
      },
      weatherIndexCurrent: 91,
      weatherForecastNarrative: 'Crisp sunny days with cool evenings by the lake.',
      budgetEstimator: {
        budgetTier: { stayPerDay: 900, foodPerDay: 400, transitPerDay: 200, totalDaily: 1500 },
        moderateTier: { stayPerDay: 2000, foodPerDay: 750, transitPerDay: 450, totalDaily: 3200 },
        luxuryTier: { stayPerDay: 5000, foodPerDay: 1600, transitPerDay: 1000, totalDaily: 7600 }
      },
      upcomingEvents: [
        { name: 'Mahalakshmi Kiranotsav (Sun Ray Festival)', dateRange: 'November & January 31 - February 2', type: 'Astronomical Temple Phenomenon', significance: 'Setting sun rays pass through temple arches directly touching the deity’s feet, torso, and face.' },
        { name: 'Kolhapur National Wrestling Championship', dateRange: 'December', type: 'Traditional Sports', significance: 'Top wrestlers across India compete in traditional clay arenas.' }
      ]
    }
  },

  // 4. MAHARASHTRA: SOLAPUR & AKKALKOT (Handloom Hub & Spiritual Sanctuary)
  {
    id: 'dest-solapur',
    name: 'Solapur & Akkalkot',
    stateOrRegion: 'Western Maharashtra',
    country: 'India',
    isInternational: false,
    state: 'Maharashtra',
    region: 'South Maharashtra / Marathwada Border',
    district: 'Solapur',
    thematicTags: ['clothing', 'shopping', 'spirituality', 'heritage', 'food', 'nature'],
    tierCategory: 'Tier-2',
    popularityTier: 'gem',
    carryingCapacityDaily: 10000,
    currentCapacityLoadPct: 30,
    isOvertouristed: false,
    localEconomicRetentionPct: 93,
    sustainabilityScore: 95,
    affordabilityIndex: 96,
    tagline: 'Textile Capital of Maharashtra: GI-Tagged Solapuri Chadars, Shenga Chutney & Siddheshwar Lake',
    description: 'Solapur is world-famous as India’s textile handloom capital, renowned for GI-tagged Solapuri Jacquard Chadars (blankets) and Terry towels. Home to the historic Siddheshwar Lake Temple, Bhuikot Fort, Great Indian Bustard Sanctuary, and sacred Akkalkot Swami Samarth Ashram.',
    heroImage: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80'
    ],
    vibe: ['heritage', 'spirituality', 'culinary', 'nature'],
    rating: 4.84,
    reviewCount: 940,
    lat: 17.6599,
    lng: 75.9064,
    bestMonths: ['October', 'November', 'December', 'January', 'February'],
    currentWeather: {
      tempC: 28,
      condition: 'Sunny & Dry',
      icon: 'Sun',
      forecast: 'Clear skies with pleasant morning and evening temperatures',
      airQualityIndex: 28
    },
    safetyScore: {
      overall: 95,
      daySafety: 97,
      nightSafety: 93,
      emergencyContact: '112 / Solapur Police (+91 217 274 4600)',
      advisory: 'Calm and family-friendly industrial-heritage destination.'
    },
    crowdPrediction: {
      currentStatus: 'Low',
      peakHours: '10:00 AM - 1:00 PM (Siddheshwar Temple)',
      quietHours: '6:00 AM - 9:00 AM',
      recommendation: 'Visit the handloom weaving cooperative mills in the morning to see master weavers at work.'
    },
    popularAttractions: [
      {
        id: 'att-solapur-1',
        name: 'Siddheshwar Temple & Lake Fort',
        category: 'Heritage',
        rating: 4.9,
        reviewCount: 1800,
        estimatedTime: '2 hrs',
        entryFee: 0,
        image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80',
        description: 'Sacred island temple dedicated to 12th-century Lingayat saint Siddheshwar, surrounded by tranquil Siddheshwar Lake.',
        lat: 17.6715,
        lng: 75.9042,
        crowdLevel: 'Moderate',
        bestTimeToVisit: '6:30 AM - 9:00 AM'
      },
      {
        id: 'att-solapur-2',
        name: 'Great Indian Bustard Sanctuary (Nannaj)',
        category: 'Nature',
        rating: 4.86,
        reviewCount: 620,
        estimatedTime: '3.5 hrs',
        entryFee: 100,
        image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80',
        description: 'Grassland wildlife reserve preserving the critically endangered Great Indian Bustard (Maldhok), blackbucks, and Indian wolves.',
        lat: 17.8285,
        lng: 75.8712,
        crowdLevel: 'Low',
        bestTimeToVisit: '6:00 AM - 9:30 AM',
        isOffbeat: true
      },
      {
        id: 'att-solapur-3',
        name: 'Akkalkot Swami Samarth Vatavruksha Mandir',
        category: 'Heritage',
        rating: 4.94,
        reviewCount: 2400,
        estimatedTime: '2.5 hrs',
        entryFee: 0,
        image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80',
        description: 'Ancient banyan tree shrine where the 19th-century saint Shri Swami Samarth Maharaj stayed and blessed devotees.',
        lat: 17.5255,
        lng: 76.2045,
        crowdLevel: 'Moderate',
        bestTimeToVisit: '8:00 AM - 11:00 AM'
      }
    ],
    localCuisines: ['Solapuri Shenga Chutney (Peanut Chutney)', 'Jowar Bhakri with Shengsol Gravy', 'Solapuri Dal Khichdi', 'Shengdana Poli', 'Karda Mutton Thali'],
    startingPrice: 75,

    culturalSpecialties: {
      food: [
        { name: 'Solapuri Shenga Chutney (GI Renowned)', description: 'Fiery, dry ground peanut chutney roasted with garlic, red chillies, and cumin — unmatched in crunch and depth.', mustTryAt: 'Local Spice Markets & Siddheshwar Haat', isVeg: true, tag: 'Signature Condiment' },
        { name: 'Jowar Bhakri with Shengsol & Thecha', description: 'Crisp hand-flattened sorghum flatbreads served with garlic peanut gravy and fiery spicy green thecha.', isVeg: true, tag: 'Wholesome Staple' }
      ],
      clothing: [
        { name: 'Solapuri Handloom Jacquard Chadar (GI Tagged)', description: 'World-famous thick cotton jacquard blankets crafted on handlooms and powerlooms with geometric and floral embossed patterns.', occasion: 'Everyday Comfort & Heritage Gifting', authenticHub: 'Solapur Handloom Weavers Cooperative Hub' },
        { name: 'Solapuri Terry Cotton Towels (GI Tagged)', description: 'Super-absorbent, ultra-durable handloom combed cotton towels crafted with traditional Jacquard borders.', occasion: 'Daily Luxury', authenticHub: 'Navi Peth & Shukrawar Peth' }
      ],
      handicrafts: [
        { name: 'Padmashali Weavers Handloom Products', description: 'Traditional cotton bedsheets, dhurries, and curtains crafted by master Padmashali weaver community.', giTagged: true, artisanCommunity: 'Solapur Padmashali Handloom Weavers' }
      ],
      jewellery: [
        { name: 'Traditional Lingayat & Maratha Silver Ornaments', description: 'Handcrafted silver amulet pendants, waist cords (Kardhani), and toe rings.', material: 'Pure Silver', traditionalSignificance: 'Spiritual and everyday cultural jewellery' }
      ],
      artAndCulture: [
        { name: 'Gadda Yatra (Siddheshwar Fair)', description: '900-year-old annual fair celebrating the celestial marriage of Saint Siddheshwar with 68 sacred Kathis (decorated flag poles).', type: 'heritage' }
      ],
      festivals: [
        { name: 'Solapur Siddheshwar Gadda Yatra', monthOrSeason: 'January (Makar Sankranti)', culturalSignificance: 'The biggest cultural and commercial fair of South Maharashtra drawing over 1 million devotees for the Homakund holy fire ceremony.', celebrationHighlights: 'Procession of 7 Nandi Dhwajas and 68 holy flag poles.' }
      ],
      localShopping: [
        { product: 'Direct Loom Solapuri Chadars (Blankets)', bestMarket: 'Solapur Zilla Vinkar Sahakari Sangh, Navi Peth', priceRange: '₹350 - ₹1,400 / Piece', tip: 'Check the official GI tag seal on the hem for 100% pure cotton certification.' },
        { product: 'Freshly Pounded Shenga Chutney Tins', bestMarket: 'Shukrawar Peth Spice Alleys', priceRange: '₹180 - ₹300 / kg', tip: 'Get coarse-ground (Khareda) for the most authentic texture.' }
      ],
      uniqueExperiences: [
        { title: 'Live Weaving Tour at Solapur Handloom Clusters', description: 'Witness master weavers operate giant Jacquard looms to create intricate multi-color relief patterns.', bestTime: '10:00 AM - 1:00 PM', localImpact: 'Direct purchases support weaver families directly without middleman cuts.' },
        { title: 'Dawn Birding for Great Indian Bustard at Nannaj', description: 'Spot India’s rarest avian giants alongside blackbucks and Indian foxes in golden savannah grasslands.', bestTime: '06:00 AM - 08:30 AM', localImpact: 'Aids grassroots grassland eco-conservation.' }
      ]
    },

    localEconomy: {
      localImpactScore: 96,
      economicRetentionExplainer: '93% of tourist expenses go straight to cooperative handloom weavers, peanut farmers, and grassroots rural homestay families.',
      authenticHomestays: [
        { name: 'Akkalkot Swami Heritage Retreat', hostName: 'Gajanan & Meera Kulkarni', village: 'Near Swami Samarth Mandir, Akkalkot', pricePerNight: 1400, specialties: ['Peaceful spiritual ashram ambience', 'Pure vegetarian Maharashtrian meals', 'Temple guidance'], rating: 4.9 },
        { name: 'Nannaj Grasslands Eco-Stay', hostName: 'Baburao Shinde', village: 'Nannaj Eco-Village', pricePerNight: 1600, specialties: ['Birdwatching naturalist host', 'Organic farm meals', 'Tractor village safari'], rating: 4.88 }
      ],
      traditionalKhanavals: [
        { name: 'Hotel City Park Traditional Khanaval', signatureDish: 'Solapuri Shenga Chutney Thali & Shengdana Poli', location: 'Navi Peth', avgMealCost: 180, isFamilyRun: true }
      ],
      communityGuides: [
        { name: 'Dattatraya Birajdar', expertise: 'Solapur Handloom Heritage & Siddheshwar History', languages: ['Marathi', 'Kannada', 'Hindi', 'English'], badge: 'Certified Heritage Guide', dailyRate: 900 }
      ],
      artisanCooperatives: [
        { craft: 'Solapuri Chadars & Terry Towels', guildName: 'Solapur Zilla Handloom Weavers Union', village: 'Navi Peth, Solapur', directBuyingContact: '+91 217 272 3490' }
      ],
      localTransportOptions: [
        { mode: 'Local City Auto', typicalRoute: 'Solapur Railway Station to Siddheshwar Temple / Navi Peth', approxFare: '₹50 - ₹100', ecoFriendly: true }
      ]
    },

    bestTimeEngine: {
      bestSeasonDescription: 'Winter (October to February) — Dry, comfortable sunny days with 18°C-28°C temperatures and the vibrant January Gadda Yatra.',
      idealMonths: ['October', 'November', 'December', 'January', 'February'],
      timeOfDayGuide: {
        morning: { hours: '06:00 AM - 09:30 AM', recommendation: 'Morning bird safari at Nannaj Grasslands or peaceful prayers at Siddheshwar Temple.', crowd: 'Low' },
        afternoon: { hours: '11:00 AM - 03:00 PM', recommendation: 'Explore the Handloom Weavers Co-op and shop for authentic Solapuri Chadars in Navi Peth.', crowd: 'Moderate' },
        evening: { hours: '04:30 PM - 07:30 PM', recommendation: 'Walk along the Siddheshwar Lake Promenade and try Solapuri street delicacies.', crowd: 'Moderate' },
        night: { hours: '08:00 PM - 10:00 PM', recommendation: 'Dinner featuring hot Jowar Bhakri, Shengsol, and restful night in a peaceful homestay.', crowd: 'Low' }
      },
      weatherIndexCurrent: 90,
      weatherForecastNarrative: 'Clear, dry and sunny climate ideal for heritage tourism.',
      budgetEstimator: {
        budgetTier: { stayPerDay: 700, foodPerDay: 300, transitPerDay: 180, totalDaily: 1180 },
        moderateTier: { stayPerDay: 1600, foodPerDay: 600, transitPerDay: 350, totalDaily: 2550 },
        luxuryTier: { stayPerDay: 3800, foodPerDay: 1200, transitPerDay: 800, totalDaily: 5800 }
      },
      upcomingEvents: [
        { name: 'Siddheshwar Gadda Yatra Holy Fire (Homakund)', dateRange: 'January 12 - 16', type: 'Sacred Mega Festival', significance: 'Lighting of the sacred fire and procession of 68 holy poles.' },
        { name: 'National Handloom & Textile Expo Solapur', dateRange: 'November', type: 'Handicraft & Textile', significance: 'Exhibition of direct artisan handloom products from across India.' }
      ]
    }
  },

  // 5. MAHARASHTRA: RATNAGIRI, GANPATIPULE & VELAS (Konkan Coast & Marine Biodiversity)
  {
    id: 'dest-ratnagiri',
    name: 'Ratnagiri & Ganpatipule',
    stateOrRegion: 'Konkan',
    country: 'India',
    isInternational: false,
    state: 'Maharashtra',
    region: 'Konkan Coast',
    district: 'Ratnagiri',
    thematicTags: ['beaches', 'food', 'nature', 'spirituality', 'heritage', 'culture'],
    tierCategory: 'Tier-3',
    popularityTier: 'gem',
    carryingCapacityDaily: 4000,
    currentCapacityLoadPct: 35,
    isOvertouristed: false,
    localEconomicRetentionPct: 92,
    sustainabilityScore: 96,
    affordabilityIndex: 92,
    tagline: 'King of Alphonso Mangoes, 400-Year Swayambhu Ganpati & Olive Ridley Turtle Shores',
    description: 'Ratnagiri is the undisputed global home of GI-tagged Alphonso (Hapus) mangoes, dramatic Arabian Sea cliffs, Jaigad lighthouse, the historic Thibaw Palace, the 400-year-old coastal beach shrine of Ganpatipule, and the eco-conservation village of Velas where Olive Ridley sea turtles hatch.',
    heroImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80'
    ],
    vibe: ['beach', 'nature', 'culinary', 'spirituality', 'wellness'],
    rating: 4.89,
    reviewCount: 1350,
    lat: 16.9902,
    lng: 73.3120,
    bestMonths: ['October', 'November', 'December', 'January', 'February', 'March', 'April', 'May'],
    currentWeather: {
      tempC: 27,
      condition: 'Tropical Coastal Sunshine',
      icon: 'Sun',
      forecast: 'Clear skies with soothing ocean breeze',
      airQualityIndex: 20
    },
    safetyScore: {
      overall: 97,
      daySafety: 99,
      nightSafety: 95,
      emergencyContact: '112 / Ratnagiri Coastal Police (+91 2352 222222)',
      advisory: 'Unspoiled coastal community with very warm homestay culture.'
    },
    crowdPrediction: {
      currentStatus: 'Low',
      peakHours: '5:00 PM - 7:00 PM (Ganpatipule Beach Sunset)',
      quietHours: '6:00 AM - 10:30 AM',
      recommendation: 'Walk the sacred Pradakshina path around Ganpatipule Hill at 7:00 AM for ocean views.'
    },
    popularAttractions: [
      {
        id: 'att-ratna-1',
        name: 'Ganpatipule Swayambhu Beach Temple',
        category: 'Heritage',
        rating: 4.94,
        reviewCount: 2900,
        estimatedTime: '2 hrs',
        entryFee: 0,
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
        description: '400-year-old self-manifested monolith Ganesha idol sitting right on white sand beaches overlooking the Arabian Sea.',
        lat: 17.1472,
        lng: 73.2655,
        crowdLevel: 'Moderate',
        bestTimeToVisit: '6:30 AM - 9:00 AM'
      },
      {
        id: 'att-ratna-2',
        name: 'Jaigad Fort & Coastal Lighthouse',
        category: 'Heritage',
        rating: 4.88,
        reviewCount: 950,
        estimatedTime: '2 hrs',
        entryFee: 20,
        image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80',
        description: '16th-century clifftop fort where Shastri river meets the Arabian Sea, featuring a working Victorian lighthouse.',
        lat: 17.3005,
        lng: 73.2167,
        crowdLevel: 'Low',
        bestTimeToVisit: '9:00 AM - 12:00 PM',
        isOffbeat: true
      },
      {
        id: 'att-ratna-3',
        name: 'Velas Olive Ridley Turtle Conservation Beach',
        category: 'Nature',
        rating: 4.96,
        reviewCount: 1100,
        estimatedTime: '3 hrs',
        entryFee: 50,
        image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80',
        description: 'Community-led eco-village where thousands of Olive Ridley turtle hatchlings crawl to the sea during dawn.',
        lat: 17.9622,
        lng: 73.0336,
        crowdLevel: 'Low',
        bestTimeToVisit: '6:30 AM & 5:30 PM (Hatching release)',
        isOffbeat: true
      }
    ],
    localCuisines: ['Authentic Ratnagiri Alphonso Mangoes', 'Solkadhi', 'Surmai Rawa Fry', 'Phanas Sukka (Jackfruit Curry)', 'Ukdiche Modak', 'Aamsul Sharbat'],
    startingPrice: 110,

    culturalSpecialties: {
      food: [
        { name: 'Ratnagiri Alphonso Mango Platter (Hapus)', description: 'World’s most aromatic mangoes served fresh-sliced, as thick chilled Aamras, or in organic Shrikhand.', isVeg: true, tag: 'GI Tagged King of Fruits' },
        { name: 'Konkani Phanas Sukka & Kaju Curry', description: 'Tender raw jackfruit and fresh wet cashews cooked in coconut-roasted Konkani spices.', isVeg: true, tag: 'Vegetarian Delicacy' }
      ],
      clothing: [
        { name: 'Konkan Kashta & Cotton Kurtas', description: 'Lightweight handloom cotton dhotis and Kashtas suited for coastal humid breezes.', occasion: 'Coastal Daily Life & Temple Rituals', authenticHub: 'Ratnagiri Bazaar' }
      ],
      handicrafts: [
        { name: 'Coconut Shell Craft & Coir Weaving', description: 'Lampshades, bowls, and cutlery carved out of natural polished coconut shells by village women self-help groups.', giTagged: false, artisanCommunity: 'Velas & Ganpatipule SHGs' }
      ],
      jewellery: [
        { name: 'Traditional Kolhapuri Saaj & Chinchpeti', description: 'Pearl-encrusted chokers and gold leaf pendants typical of Konkan coastal nobility.', material: 'Gold & Seed Pearls' }
      ],
      artAndCulture: [
        { name: 'Naman Folk Dance & Song', description: 'Traditional ritualistic Konkan folk performance paying homage to village deities at harvest.', type: 'folk_dance' }
      ],
      festivals: [
        { name: 'Velas Turtle Festival', monthOrSeason: 'February to April', culturalSignificance: 'Global eco-tourism milestone celebrating the birth and release of vulnerable Olive Ridley turtle hatchlings into the ocean.', celebrationHighlights: 'Dawn release of baby turtles and community village homestays.' }
      ],
      localShopping: [
        { product: 'GI Certified Ratnagiri Alphonso Mango Boxes', bestMarket: 'Ratnagiri APMC Mango Mandi', priceRange: '₹700 - ₹1,500 / Dozen (April-May)', tip: 'Check the barcode traceability to verify exact orchard of origin.' },
        { product: 'Cashew Feni & Pure Kokum Syrups', bestMarket: 'Ganpatipule Beach Bazaar', priceRange: '₹120 - ₹280 / Bottle', tip: 'Look for sugar-free pure kokum agal for health benefits.' }
      ],
      uniqueExperiences: [
        { title: 'Witnessing Olive Ridley Baby Turtles Crawling to Sea', description: 'Join village naturalists on Velas beach at sunrise to watch tiny 2-inch hatchlings take their first ocean swim.', bestTime: '06:45 AM (Feb-April)', localImpact: '100% of proceeds fund community-run turtle nest protection.' }
      ]
    },

    alternativeTo: ['Goa', 'dest-goa', 'Alibaug'],
    whyAlternativeBetter: {
      headline: 'Skip the Commercial Noise of North Goa for the Pristine Sands of Ganpatipule & Velas',
      replacesFamousSpot: 'Goa',
      crowdReductionPct: 70,
      costSavingsPct: 40,
      localAuthenticityScore: 95,
      keyAdvantage: 'Tranquil coastal temple beach, Olive Ridley turtle hatcheries, organic mango orchards, and 92% local economic retention.',
      comparisonHighlights: [
        { metric: 'Beach Cleanliness', famousSpot: 'Commercial debris & crowded shacks', hiddenGem: 'Pristine golden sands, clean sea waters & temple serenity' },
        { metric: 'Eco-Conservation', famousSpot: 'Heavy motorized watersports', hiddenGem: 'Protected turtle nesting shores & quiet sailboat ferries' }
      ]
    },

    localEconomy: {
      localImpactScore: 92,
      economicRetentionExplainer: '92% of tourist revenue directly funds turtle conservation village funds, mango farmer families, and local women’s khanavals.',
      authenticHomestays: [
        { name: 'Velas Turtle Conservation Homestay', hostName: 'Omkar & Snehal Joshi', village: 'Velas Eco-Village', pricePerNight: 1200, specialties: ['Traditional Konkani home', 'All meals included (farm fresh)', 'Turtle nest naturalist'], rating: 4.96 },
        { name: 'Ganpatipule Seaview Wadi Stay', hostName: 'Prashant Mayekar', village: 'Ganpatipule Beach Road', pricePerNight: 2100, specialties: ['Coconut grove setting', 'Fresh fish thali', 'Walk to temple'], rating: 4.9 }
      ],
      traditionalKhanavals: [
        { name: 'Sameer Restaurant & Khanaval', signatureDish: 'Fresh Surmai Thali & Solkadhi', location: 'Ganpatipule Temple Arch', avgMealCost: 260, isFamilyRun: true }
      ],
      communityGuides: [
        { name: 'Mohan Upadhye', expertise: 'Olive Ridley Conservation Pioneer & Marine Guide', languages: ['Marathi', 'Hindi', 'English'], badge: 'Sahyadri Nisarga Mitra Awardee', dailyRate: 800 }
      ],
      artisanCooperatives: [
        { craft: 'Coconut Shell & Coir Handcrafts', guildName: 'Konkan Mahila Bachat Gat', village: 'Ganpatipule', directBuyingContact: '+91 2357 235011' }
      ],
      localTransportOptions: [
        { mode: 'Local Coastal Auto', typicalRoute: 'Ratnagiri Station to Ganpatipule / Jaigad', approxFare: '₹250 - ₹400', ecoFriendly: true }
      ]
    },

    bestTimeEngine: {
      bestSeasonDescription: 'Winter to Spring (October to April) — Gentle sun, calm seas, and the famous Turtle Festival (Feb-April) followed by the Alphonso harvest (April-May).',
      idealMonths: ['October', 'November', 'December', 'January', 'February', 'March', 'April', 'May'],
      timeOfDayGuide: {
        morning: { hours: '06:00 AM - 09:00 AM', recommendation: 'Turtle hatching release at Velas or morning Darshan at Ganpatipule beach temple.', crowd: 'Low' },
        afternoon: { hours: '12:00 PM - 03:30 PM', recommendation: 'Relax under coconut trees with fresh Aamras-Puri or Solkadhi feast.', crowd: 'Low' },
        evening: { hours: '04:30 PM - 07:00 PM', recommendation: 'Clifftop sunset at Jaigad Lighthouse or sunset beach walk.', crowd: 'Moderate' },
        night: { hours: '08:00 PM - 10:00 PM', recommendation: 'Dinner at a village Khanaval and stargazing on unpolluted shores.', crowd: 'Low' }
      },
      weatherIndexCurrent: 93,
      weatherForecastNarrative: 'Warm sunny coastal days with breezy evenings.',
      budgetEstimator: {
        budgetTier: { stayPerDay: 1100, foodPerDay: 450, transitPerDay: 250, totalDaily: 1800 },
        moderateTier: { stayPerDay: 2200, foodPerDay: 800, transitPerDay: 500, totalDaily: 3500 },
        luxuryTier: { stayPerDay: 5200, foodPerDay: 1700, transitPerDay: 1100, totalDaily: 8000 }
      },
      upcomingEvents: [
        { name: 'Velas Olive Ridley Turtle Festival', dateRange: 'February 15 - April 10', type: 'Eco-Tourism & Wildlife', significance: 'Annual community-led festival releasing hundreds of baby sea turtles.' },
        { name: 'Ratnagiri Alphonso Mango Festival', dateRange: 'April 20 - May 5', type: 'Culinary Harvest Fair', significance: 'Orchard tours, mango tasting, and direct farmer purchasing.' }
      ]
    }
  },

  // 6. MAHARASHTRA: SATARA & KAAS PLATEAU (Valley of Flowers Maharashtra)
  {
    id: 'dest-satara',
    name: 'Satara & Kaas Plateau',
    stateOrRegion: 'Western Maharashtra',
    country: 'India',
    isInternational: false,
    state: 'Maharashtra',
    region: 'Sahyadri Western Ghats',
    district: 'Satara',
    thematicTags: ['nature', 'adventure', 'heritage', 'food', 'culture'],
    tierCategory: 'Tier-3',
    popularityTier: 'gem',
    carryingCapacityDaily: 3000,
    currentCapacityLoadPct: 38,
    isOvertouristed: false,
    localEconomicRetentionPct: 90,
    sustainabilityScore: 97,
    affordabilityIndex: 93,
    tagline: 'UNESCO World Natural Heritage: Plateau of 850 Wildflower Species & Historic Sajjangad',
    description: 'Satara is nestled in the Sahyadri mountains, crowned by the UNESCO World Heritage Kaas Pathar (Plateau of Flowers) blooming with endemic carnivorous and wildflower carpets. Home to Ajinkyatara Fort, Sajjangad of Samarth Ramdas, Thoseghar Waterfalls, and legendary Satari Kandi Pedha.',
    heroImage: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
    ],
    vibe: ['nature', 'heritage', 'adventure', 'wellness'],
    rating: 4.87,
    reviewCount: 1120,
    lat: 17.6805,
    lng: 73.9997,
    bestMonths: ['August', 'September', 'October', 'November', 'December', 'January', 'February'],
    currentWeather: {
      tempC: 22,
      condition: 'Misty & Pleasant',
      icon: 'CloudRain',
      forecast: 'Cool mountain air with panoramic mist around the plateau',
      airQualityIndex: 18
    },
    safetyScore: {
      overall: 96,
      daySafety: 98,
      nightSafety: 94,
      emergencyContact: '112 / Satara Police (+91 2162 233333)',
      advisory: 'Strict eco-protection zone. Walking off designated trails on Kaas Plateau is strictly prohibited.'
    },
    crowdPrediction: {
      currentStatus: 'Low',
      peakHours: '10:00 AM - 2:00 PM (Kaas Plateau during Bloom Season)',
      quietHours: '6:30 AM - 9:30 AM',
      recommendation: 'Pre-book the official forest eco-pass for early 7:00 AM entry to witness dew-drenched flowers without crowds.'
    },
    popularAttractions: [
      {
        id: 'att-satara-1',
        name: 'Kaas Pathar (Plateau of Flowers - UNESCO)',
        category: 'Nature',
        rating: 4.95,
        reviewCount: 2200,
        estimatedTime: '3 hrs',
        entryFee: 150,
        image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=600&q=80',
        description: 'Volcanic laterite plateau blooming with over 850 endemic floral species like Utricularia, Ceropegia, and Mickey Mouse flowers.',
        lat: 17.7208,
        lng: 73.8189,
        crowdLevel: 'Moderate',
        bestTimeToVisit: '7:00 AM - 10:00 AM',
        isOffbeat: true
      },
      {
        id: 'att-satara-2',
        name: 'Thoseghar Giant Waterfalls',
        category: 'Nature',
        rating: 4.88,
        reviewCount: 1350,
        estimatedTime: '2 hrs',
        entryFee: 40,
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
        description: 'Spectacular series of waterfalls cascading over 200 meters into deep wooded gorges of the Sahyadris.',
        lat: 17.5982,
        lng: 73.8475,
        crowdLevel: 'Low',
        bestTimeToVisit: '9:00 AM - 12:00 PM',
        isOffbeat: true
      },
      {
        id: 'att-satara-3',
        name: 'Sajjangad Fort & Temple of Saint Ramdas',
        category: 'Heritage',
        rating: 4.9,
        reviewCount: 1700,
        estimatedTime: '2.5 hrs',
        entryFee: 0,
        image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80',
        description: 'Fort of the virtuous where spiritual mentor Samarth Ramdas lived; serves traditional community Mahaprasad to all visitors.',
        lat: 17.6536,
        lng: 73.9167,
        crowdLevel: 'Low',
        bestTimeToVisit: '8:00 AM - 11:30 AM'
      }
    ],
    localCuisines: ['Satari Kandi Pedha', 'Pithla Bhakri with Thecha', 'Sajjangad Mahaprasad (Khichdi & Pithla)', 'Gavran Chicken Thali', 'Strawberries of Chalkewadi'],
    startingPrice: 85,

    culturalSpecialties: {
      food: [
        { name: 'Satari Kandi Pedha (GI Heritage Sweet)', description: 'Slow-caramelized milk solids (Khoya) cooked over wood fires into rich brown fudge pedhas sprinkled with pure cardamom.', mustTryAt: 'Modi Sweets / Yashwant Pedha, Satara', isVeg: true, tag: 'Heritage Confectionery' },
        { name: 'Sajjangad Khichdi Mahaprasad', description: 'Steaming sacred rice and moong dal khichdi served on leaf platters with pure cow ghee and spiced buttermilk.', isVeg: true, tag: 'Sacred Ashram Food' }
      ],
      clothing: [
        { name: 'Satari Ghongadi (Handwoven Wool Blanket)', description: 'Coarse, warm, water-resistant black sheep wool blanket handwoven by the Dhangar shepherd community.', occasion: 'Monsoon Sahyadri Shepherding', authenticHub: 'Dhangar Weavers of Satara Hills' }
      ],
      handicrafts: [
        { name: 'Dhangar Wool Blankets & Bamboo Baskets', description: 'Traditional pastoral crafts woven with indigenous loom techniques.', giTagged: false, artisanCommunity: 'Dhangar Pastoral Guilds' }
      ],
      jewellery: [
        { name: 'Kolhapuri Saaj & Bugadi', description: 'Gold ornaments worn by Maratha nobility in Satara royal court.' }
      ],
      artAndCulture: [
        { name: 'Gondhal & Bharud Folk Ballads', description: 'Spiritual narrative folk performance with Sambhal percussion and traditional chanting.', type: 'folk_dance' }
      ],
      festivals: [
        { name: 'Kaas Flower Bloom Season Celebration', monthOrSeason: 'August to October', culturalSignificance: 'Annual natural wonder when the entire plateau turns into pink, purple, and yellow carpets.', celebrationHighlights: 'Eco-nature walks guided by local botanical scholars.' }
      ],
      localShopping: [
        { product: 'Authentic Satari Kandi Pedha Boxes', bestMarket: 'Rajwada Market, Satara', priceRange: '₹320 - ₹600 / kg', tip: 'Look for dark brown wood-fired caramelized variety.' },
        { product: 'Wild Flora Honey from Kaas Forests', bestMarket: 'Kaas Forest Eco-counter', priceRange: '₹350 - ₹650 / Jar', tip: 'Harvested sustainably by local tribal honey gatherers.' }
      ],
      uniqueExperiences: [
        { title: 'Botanical Walk with Village Naturalists on Kaas Plateau', description: 'Discover tiny insectivorous Sundew plants and rare orchids that only bloom on this plateau.', bestTime: '07:30 AM', localImpact: 'Direct income for certified local village eco-guides.' },
        { title: 'Chalkewadi Windmill Plateau Sunset', description: 'Stand amidst hundreds of towering giant wind turbines spinning quietly against a Sahyadri mountain sunset.', bestTime: '05:30 PM', localImpact: 'Eco-tourism development in remote mountain hamlets.' }
      ]
    },

    alternativeTo: ['Mahabaleshwar', 'dest-mahabaleshwar', 'Lonavala'],
    whyAlternativeBetter: {
      headline: 'Replace Overcrowded Mahabaleshwar with UNESCO Wildflower Wonder Kaas & Satara',
      replacesFamousSpot: 'Mahabaleshwar',
      crowdReductionPct: 68,
      costSavingsPct: 38,
      localAuthenticityScore: 94,
      keyAdvantage: 'UNESCO botanical biodiversity, pristine waterfalls with zero commercial touts, sacred forts, and authentic Kandi Pedha.',
      comparisonHighlights: [
        { metric: 'Nature Experience', famousSpot: 'Heavy bumper-to-bumper car traffic on viewpoint roads', hiddenGem: 'Pristine biodiversity walking trails on blooming laterite plateau' },
        { metric: 'Eco-Integrity', famousSpot: 'Commercial stalls every 50 meters', hiddenGem: 'Strict plastic-free protected wilderness' }
      ]
    },

    localEconomy: {
      localImpactScore: 93,
      economicRetentionExplainer: '90% of money spent directly supports Dhangar shepherd weavers, forest eco-guides, and local Satara pedha masters.',
      authenticHomestays: [
        { name: 'Kaas Eco-Village Agro Retreat', hostName: 'Sanjay & Sunanda Babar', village: 'Kaas Plateau Foothills', pricePerNight: 1600, specialties: ['Plateau view balcony', 'Home-grown organic vegetables', 'Kaas pass assistance'], rating: 4.93 },
        { name: 'Sajjangad Mountain Homestay', hostName: 'Prashant Kulkarni', village: 'Sajjangad Foothills', pricePerNight: 1400, specialties: ['Peaceful spiritual stay', 'Satari Pithla Bhakri', 'Fort trekking path'], rating: 4.89 }
      ],
      traditionalKhanavals: [
        { name: 'Rajwada Thali & Khanaval', signatureDish: 'Satari Gavran Chicken & Jowar Bhakri', location: 'Rajwada Chowk, Satara', avgMealCost: 220, isFamilyRun: true }
      ],
      communityGuides: [
        { name: 'Santosh Shinde', expertise: 'Kaas Plateau Endemic Botany & Sahyadri Trekking', languages: ['Marathi', 'Hindi', 'English'], badge: 'Forest Dept Certified Naturalist', dailyRate: 900 }
      ],
      artisanCooperatives: [
        { craft: 'Handwoven Ghongadi Wool Blankets', guildName: 'Satara Dhangar Artisan Samiti', village: 'Satara', directBuyingContact: '+91 2162 245012' }
      ],
      localTransportOptions: [
        { mode: 'The Explorer Eco Cab / Auto', typicalRoute: 'Satara Station to Kaas Pathar / Sajjangad', approxFare: '₹200 - ₹450', ecoFriendly: true }
      ]
    },

    bestTimeEngine: {
      bestSeasonDescription: 'Monsoon & Post-Monsoon (August to November) — Peak flower bloom season on Kaas Plateau, roaring waterfalls, and lush misty valleys.',
      idealMonths: ['August', 'September', 'October', 'November', 'December', 'January', 'February'],
      timeOfDayGuide: {
        morning: { hours: '06:30 AM - 09:30 AM', recommendation: 'Early morning nature trail on Kaas Plateau to see flowers opening in dew light.', crowd: 'Low' },
        afternoon: { hours: '12:00 PM - 03:00 PM', recommendation: 'Visit Sajjangad Fort for peaceful prayers and traditional Mahaprasad.', crowd: 'Low' },
        evening: { hours: '04:30 PM - 06:45 PM', recommendation: 'Catch the sunset at Thoseghar Falls viewpoint or Chalkewadi windmill plateau.', crowd: 'Moderate' },
        night: { hours: '07:30 PM - 09:30 PM', recommendation: 'Dinner in Satara city and buy fresh Satari Kandi Pedha.', crowd: 'Low' }
      },
      weatherIndexCurrent: 94,
      weatherForecastNarrative: 'Cool misty mountain air with refreshing Sahyadri breezes.',
      budgetEstimator: {
        budgetTier: { stayPerDay: 900, foodPerDay: 350, transitPerDay: 220, totalDaily: 1470 },
        moderateTier: { stayPerDay: 1900, foodPerDay: 700, transitPerDay: 450, totalDaily: 3050 },
        luxuryTier: { stayPerDay: 4500, foodPerDay: 1500, transitPerDay: 900, totalDaily: 6900 }
      },
      upcomingEvents: [
        { name: 'Kaas Endemic Flora Week', dateRange: 'September 10 - 25', type: 'Botanical & Eco Festival', significance: 'Peak bloom period for rare insectivorous and purple bladderwort carpets.' }
      ]
    }
  }
];
