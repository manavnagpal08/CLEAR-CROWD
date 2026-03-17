// Real-time Dynamic Crowd Intelligence Service
const BASE_RADIUS = 0.015; // Approx 1.5km radius for city points

/**
 * Generates interactive city points around the user's coordinates
 * to simulate real-world data points for the dashboard.
 */
export const generatePointsAround = (lat, lng) => {
  const basePoints = [
    { name: 'Central Station', latOffset: 0.005, lngOffset: -0.008 },
    { name: 'Skyline Mall', latOffset: 0.008, lngOffset: 0.012 },
    { name: 'Silicon Tech Park', latOffset: -0.012, lngOffset: 0.005 },
    { name: 'Memorial Park', latOffset: -0.008, lngOffset: -0.015 },
    { name: 'City University', latOffset: 0.015, lngOffset: -0.005 },
    { name: 'Financial District', latOffset: -0.005, lngOffset: 0.008 },
  ];

  const generatedPoints = [];
  
  // Add the 6 base landmarks
  basePoints.forEach((p, idx) => {
    generatedPoints.push({
      id: `base-${idx}`,
      name: p.name,
      lat: lat + p.latOffset,
      lng: lng + p.lngOffset,
      density: 30 + Math.random() * 60,
      trend: Math.random() > 0.5 ? 'up' : 'down',
      lastUpdate: new Date().toISOString()
    });
  });

  // Generate 50 more tactical nodes
  const sectors = ['North', 'South', 'East', 'West', 'Central', 'Urban', 'Industrial', 'Green'];
  const sites = ['Hub', 'Plaza', 'Crossing', 'Avenue', 'Way', 'Junction', 'Point', 'Zone'];

  for (let i = 0; i < 50; i++) {
    const sector = sectors[Math.floor(Math.random() * sectors.length)];
    const site = sites[Math.floor(Math.random() * sites.length)];
    
    // Spread points within a ~4km radius
    const latOff = (Math.random() - 0.5) * 0.06;
    const lngOff = (Math.random() - 0.5) * 0.06;

    generatedPoints.push({
      id: `node-${i}`,
      name: `${sector} ${site} ${i + 101}`,
      lat: lat + latOff,
      lng: lng + lngOff,
      density: 10 + Math.random() * 85,
      trend: Math.random() > 0.5 ? 'up' : 'down',
      lastUpdate: new Date().toISOString()
    });
  }

  return generatedPoints;
};

class CrowdService {
  async getLocations(lat = 12.9716, lng = 77.5946) {
    // Simulate real network delay
    await new Promise(r => setTimeout(r, 600));
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
