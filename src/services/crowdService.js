// Real-time Dynamic Crowd Intelligence Service
const BASE_RADIUS = 0.015; // Approx 1.5km radius for city points

/**
 * Generates interactive city points around the user's coordinates
 * to simulate real-world data points for the dashboard.
 */
const REAL_LANDMARKS = [
  { name: 'Silk Board Junction', lat: 12.9177, lng: 77.6238, type: 'traffic', peakHours: [9, 11, 17, 21] },
  { name: 'Majestic (Kempe Gowda)', lat: 12.9767, lng: 77.5713, type: 'metro', peakHours: [8, 10, 18, 20] },
  { name: 'MG Road Metro', lat: 12.9750, lng: 77.6050, type: 'metro', peakHours: [9, 11, 18, 22] },
  { name: 'Commercial Street', lat: 12.9822, lng: 77.6083, type: 'shopping', peakHours: [11, 21] },
  { name: 'Brigade Road', lat: 12.9740, lng: 77.6074, type: 'shopping', peakHours: [12, 23] },
  { name: 'Cubbon Park', lat: 12.9738, lng: 77.5906, type: 'park', peakHours: [6, 9, 16, 19] },
  { name: 'Lalbagh Botanical Garden', lat: 12.9507, lng: 77.5847, type: 'park', peakHours: [6, 9, 16, 19] },
  { name: 'Electronic City Phase 1', lat: 12.8450, lng: 77.6633, type: 'traffic', peakHours: [8, 10, 17, 19] },
  { name: 'Manyata Tech Park', lat: 13.0451, lng: 77.6266, type: 'traffic', peakHours: [9, 11, 17, 20] },
  { name: 'Phoenix Marketcity', lat: 12.9958, lng: 77.6963, type: 'shopping', peakHours: [11, 22] },
  { name: 'KR Puram Bridge', lat: 13.0163, lng: 77.7045, type: 'traffic', peakHours: [8, 11, 17, 21] },
  { name: 'Hebbal Flyover', lat: 13.0358, lng: 77.5971, type: 'traffic', peakHours: [8, 11, 17, 21] },
  { name: 'ISKCON Temple', lat: 13.0098, lng: 77.5511, type: 'tourist', peakHours: [10, 13, 16, 20] },
  { name: 'Vidhyarthi Bhavan', lat: 12.9450, lng: 77.5714, type: 'food', peakHours: [7, 11, 16, 20] },
  { name: 'Marathahalli Junction', lat: 12.9562, lng: 77.7019, type: 'traffic', peakHours: [9, 11, 17, 21] },
  { name: 'Indiranagar 100ft Road', lat: 12.9622, lng: 77.6381, type: 'shopping', peakHours: [12, 23] },
  { name: 'Koramangala 5th Block', lat: 12.9352, lng: 77.6245, type: 'food', peakHours: [12, 15, 19, 23] },
  { name: 'Whitefield ITPL', lat: 12.9866, lng: 77.7323, type: 'traffic', peakHours: [9, 11, 17, 20] },
  { name: 'Bannerghatta Meenakshi Mall', lat: 12.8757, lng: 77.5955, type: 'shopping', peakHours: [11, 21] },
  { name: 'Jayanagar 4th Block', lat: 12.9284, lng: 77.5833, type: 'shopping', peakHours: [10, 20] },
];

const calculateDensityForType = (type, hour) => {
  // Simple algorithm to simulate real peaks
  let density = 0;
  
  switch(type) {
    case 'traffic':
      // Peaks at 9-11 and 17-21
      if ((hour >= 8 && hour <= 11) || (hour >= 17 && hour <= 21)) density = 70 + Math.random() * 25;
      else if (hour >= 11 && hour <= 16) density = 40 + Math.random() * 20;
      else density = 10 + Math.random() * 20;
      break;
    case 'shopping':
      // Peaks at 11-22, highest on weekends (omitted for simplicity, just hour)
      if (hour >= 11 && hour <= 22) density = 60 + Math.random() * 35;
      else density = 5 + Math.random() * 15;
      break;
    case 'park':
      // Peaks at 6-9 and 16-19
      if ((hour >= 6 && hour <= 10) || (hour >= 16 && hour <= 19)) density = 50 + Math.random() * 30;
      else density = 10 + Math.random() * 20;
      break;
    case 'metro':
      // Peaks at 9-10 and 18-20
      if ((hour >= 8 && hour <= 10) || (hour >= 17 && hour <= 20)) density = 80 + Math.random() * 15;
      else density = 30 + Math.random() * 30;
      break;
    default:
      density = 20 + Math.random() * 40;
  }
  return Math.min(100, density);
};

export const generatePointsAround = (lat, lng) => {
  const currentHour = new Date().getHours();
  const points = [];

  // 1. Add our 20 Real Landmarks
  REAL_LANDMARKS.forEach((loc, idx) => {
    points.push({
      id: `blr-landmark-${idx}`,
      name: loc.name,
      lat: loc.lat,
      lng: loc.lng,
      type: loc.type,
      density: calculateDensityForType(loc.type, currentHour),
      trend: Math.random() > 0.5 ? 'up' : 'down',
      lastUpdate: new Date().toISOString()
    });
  });

  // 2. Generate 35 Tactical Nodes around these landmarks to reach ~55 points
  for (let i = 0; i < 35; i++) {
    const parent = REAL_LANDMARKS[i % REAL_LANDMARKS.length];
    // Spread nodes within 2km of landmarks
    const latOff = (Math.random() - 0.5) * 0.03;
    const lngOff = (Math.random() - 0.5) * 0.03;
    
    points.push({
      id: `tactical-node-${i}`,
      name: `${parent.name} Sector ${String.fromCharCode(65 + (i % 6))}`,
      lat: parent.lat + latOff,
      lng: parent.lng + lngOff,
      type: 'tactical',
      density: calculateDensityForType(parent.type, currentHour) + (Math.random() * 20 - 10),
      trend: Math.random() > 0.5 ? 'up' : 'down',
      lastUpdate: new Date().toISOString()
    });
  }

  return points;
};

class CrowdService {
  async getLocations(lat = 12.9716, lng = 77.5946) {
    // Return our real Bangalore based grid
    return generatePointsAround(lat, lng);
  }

  async getPredictions(locationId, options = {}) {
    await new Promise(r => setTimeout(r, 800));
    
    // Base simulation
    let baseDensity = 30 + Math.random() * 40;
    let reasons = [];

    // Add environmental factors if enabled
    if (options.includeEvents) {
      const eventBonus = 15 + Math.random() * 10;
      baseDensity += eventBonus;
      reasons.push("Upcoming festival event nearby");
    }

    if (options.includeWeather) {
      if (options.weather === 'rain') {
        baseDensity -= 10;
        reasons.push("Decreased density due to light rain");
      } else if (options.weather === 'heat') {
        baseDensity += 5;
        reasons.push("Indoor migration due to heat index");
      }
    }

    const finalDensity = Math.max(0, Math.min(100, baseDensity));
    
    return {
      locationId,
      explanation: reasons.length > 0 ? reasons.join(" • ") : "Stable conditions predicted. No major events detected.",
      chartData: Array.from({ length: 12 }, (_, i) => ({
        time: `${(i + 1) * 5}m`,
        value: Math.max(0, Math.min(100, finalDensity + (Math.random() * 15 - 7) + (i * 0.8)))
      })),
      riskScore: finalDensity > 75 ? 'Busy' : finalDensity > 45 ? 'Elevated' : 'Safe',
      
      // Meta Data
      peakHours: "17:00 - 19:30",
      occupancy: {
        current: Math.floor(finalDensity * 12),
        capacity: 1500,
        percentage: Math.floor(finalDensity)
      },
      composition: [
        { label: 'Commuters', value: 65, color: '#00C2FF' },
        { label: 'Tourists', value: 20, color: '#00FF9C' },
        { label: 'Residents', value: 15, color: '#FFB800' }
      ],
      historicalTrend: finalDensity > 60 ? '+12% vs yesterday' : '-5% vs yesterday',
      liveSensors: 8,
      lastCheck: 'Just now'
    };
  }

  async getSafeRoutes(from, to) {
    await new Promise(r => setTimeout(r, 1200));
    return [
      {
        id: 'r1',
        title: 'Direct Path',
        eta: '12 min',
        distance: '2.4 km',
        safetyScore: 68,
        crowdLevel: 'Busy',
        color: '#FF4D4D',
        reason: 'Shortest but crosses a crowded area.'
      },
      {
        id: 'r2',
        title: 'Quiet Walk',
        eta: '18 min',
        distance: '3.1 km',
        safetyScore: 94,
        crowdLevel: 'Safe',
        color: '#00FF9C',
        reason: 'Avoids main crowds. Highly recommended.'
      },
      {
        id: 'r3',
        title: 'Alternative',
        eta: '15 min',
        distance: '2.8 km',
        safetyScore: 82,
        crowdLevel: 'Moderate',
        color: '#00C2FF',
        reason: 'Balanced path through side streets.'
      }
    ];
  }
}

export const crowdService = new CrowdService();
export const getCrowdData = (lat, lng) => crowdService.getLocations(lat, lng);
