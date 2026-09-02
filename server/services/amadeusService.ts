import { Request, Response } from 'express';

// Amadeus Self-Service API URLs
const AMADEUS_TEST_BASE_URL = 'https://test.api.amadeus.com';

interface AmadeusToken {
  accessToken: string;
  expiresAt: number;
}

let cachedToken: AmadeusToken | null = null;

/**
 * Get OAuth2 Access Token from Amadeus Test Environment.
 * Returns token string or null if credentials are not configured or invalid.
 */
async function getAmadeusAccessToken(): Promise<string | null> {
  const clientId = process.env.AMADEUS_CLIENT_ID;
  const clientSecret = process.env.AMADEUS_CLIENT_SECRET;

  if (!clientId || !clientSecret || clientId.includes('your_amadeus_client_id') || clientId.includes('mock_amadeus')) {
    return null;
  }

  if (cachedToken && cachedToken.expiresAt > Date.now() + 60000) {
    return cachedToken.accessToken;
  }

  try {
    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    params.append('client_id', clientId);
    params.append('client_secret', clientSecret);

    const response = await fetch(`${AMADEUS_TEST_BASE_URL}/v1/security/oauth2/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });

    if (!response.ok) {
      console.warn(`⚠️ Amadeus Auth Failed (${response.status}): Falling back to realistic sandbox data.`);
      return null;
    }

    const data = await response.json();
    cachedToken = {
      accessToken: data.access_token,
      expiresAt: Date.now() + data.expires_in * 1000,
    };
    return cachedToken.accessToken;
  } catch (err) {
    console.warn('⚠️ Amadeus Token Error: Falling back to sandbox mode.', err);
    return null;
  }
}

/**
 * Search Flight Offers via Amadeus API (or sandbox fallback).
 */
export async function searchFlights(req: Request, res: Response) {
  try {
    const { originCode = 'BOM', destinationCode = 'DEL', departureDate = new Date().toISOString().split('T')[0], adults = '1' } = req.query;
    const token = await getAmadeusAccessToken();

    if (token) {
      const url = `${AMADEUS_TEST_BASE_URL}/v2/shopping/flight-offers?originLocationCode=${originCode}&destinationLocationCode=${destinationCode}&departureDate=${departureDate}&adults=${adults}&max=5`;
      const apiRes = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (apiRes.ok) {
        const data = await apiRes.json();
        return res.json({ source: 'amadeus_live_test_api', data: data.data || [] });
      }
    }

    // Realistic Sandbox Fallback Data for Indian Airports
    const mockFlights = [
      {
        id: 'FL-6E204',
        airline: 'IndiGo (6E-204)',
        origin: originCode,
        destination: destinationCode,
        departureTime: `${departureDate}T06:15:00`,
        arrivalTime: `${departureDate}T08:25:00`,
        duration: '2h 10m',
        priceINR: 4850,
        availableSeats: 9,
        cabinClass: 'ECONOMY',
        isDirect: true
      },
      {
        id: 'FL-AI502',
        airline: 'Air India (AI-502)',
        origin: originCode,
        destination: destinationCode,
        departureTime: `${departureDate}T10:45:00`,
        arrivalTime: `${departureDate}T13:05:00`,
        duration: '2h 20m',
        priceINR: 5400,
        availableSeats: 5,
        cabinClass: 'ECONOMY',
        isDirect: true
      },
      {
        id: 'FL-QP1102',
        airline: 'Akasa Air (QP-1102)',
        origin: originCode,
        destination: destinationCode,
        departureTime: `${departureDate}T16:30:00`,
        arrivalTime: `${departureDate}T18:45:00`,
        duration: '2h 15m',
        priceINR: 4299,
        availableSeats: 12,
        cabinClass: 'ECONOMY',
        isDirect: true
      }
    ];

    res.json({ source: 'amadeus_sandbox_fallback', data: mockFlights });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error searching flight offers' });
  }
}

/**
 * Search Hotel Offers by City Code via Amadeus API (or sandbox fallback).
 */
export async function searchHotels(req: Request, res: Response) {
  try {
    const { cityCode = 'BOM' } = req.query;
    const token = await getAmadeusAccessToken();

    if (token) {
      const url = `${AMADEUS_TEST_BASE_URL}/v1/reference-data/locations/hotels/by-city?cityCode=${cityCode}`;
      const apiRes = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (apiRes.ok) {
        const data = await apiRes.json();
        return res.json({ source: 'amadeus_live_test_api', data: data.data || [] });
      }
    }

    // Sandbox Hotel Fallback
    const mockHotels = [
      {
        hotelId: 'HTL-BOM01',
        name: 'Taj Mahal Palace & Tower',
        cityCode: cityCode,
        rating: 5,
        startingPriceINR: 14500,
        amenities: ['Pool', 'Spa', 'Sea View', 'Free WiFi', 'Heritage Fine Dining'],
        location: 'Colaba, Mumbai'
      },
      {
        hotelId: 'HTL-BOM02',
        name: 'The Oberoi Beach Resort',
        cityCode: cityCode,
        rating: 5,
        startingPriceINR: 12800,
        amenities: ['Private Beach', 'Infinity Pool', 'Spa'],
        location: 'Marine Drive'
      },
      {
        hotelId: 'HTL-BOM03',
        name: 'Konkan Eco Village Homestay',
        cityCode: cityCode,
        rating: 4.8,
        startingPriceINR: 2800,
        amenities: ['Organic Meals', 'Artisan Guided Tours', 'Homestay Experience'],
        location: 'Coastal Region'
      }
    ];

    res.json({ source: 'amadeus_sandbox_fallback', data: mockHotels });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error searching hotel offers' });
  }
}
