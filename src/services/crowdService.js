// Real-time Dynamic Crowd Intelligence Service
const BASE_RADIUS = 0.015; // Approx 1.5km radius for city points

/**
 * Generates interactive city points around the user's coordinates
 * to simulate real-world data points for the dashboard.
 */
const REAL_LANDMARKS = [
  // --- BANGALORE ---
  { name: 'Silk Board Junction', lat: 12.9177, lng: 77.6238, type: 'traffic' },
  { name: 'Majestic (Kempe Gowda)', lat: 12.9767, lng: 77.5713, type: 'metro' },
  { name: 'MG Road Metro', lat: 12.9750, lng: 77.6050, type: 'metro' },
  { name: 'Commercial Street', lat: 12.9822, lng: 77.6083, type: 'shopping' },
  { name: 'Brigade Road', lat: 12.9740, lng: 77.6074, type: 'shopping' },
  { name: 'Cubbon Park', lat: 12.9738, lng: 77.5906, type: 'park' },
  { name: 'Lalbagh Garden', lat: 12.9507, lng: 77.5847, type: 'park' },
  { name: 'Electronic City Phase 1', lat: 12.8450, lng: 77.6633, type: 'traffic' },
  
  // --- DELHI ---
  { name: 'Chandni Chowk', lat: 28.6506, lng: 77.2300, type: 'shopping' },
  { name: 'Connaught Place', lat: 28.6327, lng: 77.2197, type: 'shopping' },
  { name: 'India Gate', lat: 28.6129, lng: 77.2295, type: 'tourist' },
  { name: 'Sarojini Nagar Market', lat: 28.5750, lng: 77.1990, type: 'shopping' },
  { name: 'Rajiv Chowk Metro', lat: 28.6328, lng: 77.2195, type: 'metro' },
  { name: 'Dhaula Kuan Junction', lat: 28.5919, lng: 77.1616, type: 'traffic' },
  { name: 'Hauz Khas Village', lat: 28.5480, lng: 77.1930, type: 'food' },
  { name: 'Qutub Minar', lat: 28.5244, lng: 77.1855, type: 'tourist' },
  { name: 'ITO Crossing', lat: 28.6284, lng: 77.2407, type: 'traffic' },
  { name: 'Akshardham Temple', lat: 28.6127, lng: 77.2773, type: 'tourist' },

  // --- PUNE ---
  { name: 'Laxmi Road', lat: 18.5175, lng: 73.8580, type: 'shopping' },
  { name: 'FC Road', lat: 18.5204, lng: 73.8407, type: 'food' },
  { name: 'Koregaon Park', lat: 18.5363, lng: 73.8906, type: 'food' },
  { name: 'Janwadi (Senapati Bapat Rd)', lat: 18.5323, lng: 73.8306, type: 'traffic' },
  { name: 'Swargate Junction', lat: 18.4988, lng: 73.8576, type: 'traffic' },
  { name: 'Dagadusheth Temple', lat: 18.5186, lng: 73.8567, type: 'tourist' },
  { name: 'Pune Station', lat: 18.5289, lng: 73.8744, type: 'metro' },
  { name: 'Viman Nagar (Phoenix)', lat: 18.5622, lng: 73.9167, type: 'shopping' },
  { name: 'Hinjewadi IT Park Ph1', lat: 18.5907, lng: 73.7371, type: 'traffic' },
  { name: 'Magarpatta City', lat: 18.5144, lng: 73.9262, type: 'traffic' },

  // --- HYDERABAD ---
  { name: 'Charminar', lat: 17.3616, lng: 78.4747, type: 'tourist' },
  { name: 'HITEC City', lat: 17.4435, lng: 78.3772, type: 'traffic' },
  { name: 'Gachibowli Junction', lat: 17.4401, lng: 78.3489, type: 'traffic' },
  { name: 'Hussain Sagar', lat: 17.4239, lng: 78.4738, type: 'tourist' },
  { name: 'Banjara Hills Rd 1', lat: 17.4162, lng: 78.4506, type: 'shopping' },
  { name: 'Paradise Circle', lat: 17.4434, lng: 78.4855, type: 'food' },
  { name: 'Jubilee Hills Checkpost', lat: 17.4265, lng: 78.4116, type: 'traffic' },

  // --- KOLKATA ---
  { name: 'Victoria Memorial', lat: 22.5448, lng: 88.3426, type: 'tourist' },
  { name: 'Howrah Bridge', lat: 22.5851, lng: 88.3468, type: 'traffic' },
  { name: 'Park Street', lat: 22.5529, lng: 88.3524, type: 'shopping' },
  { name: 'Salt Lake Sector V', lat: 22.5735, lng: 88.4331, type: 'traffic' },
  { name: 'Kolkata Airport', lat: 22.6517, lng: 88.4467, type: 'metro' },
  { name: 'Esplanade', lat: 22.5645, lng: 88.3522, type: 'shopping' },
  { name: 'Eden Gardens', lat: 22.5646, lng: 88.3433, type: 'tourist' },

  // --- CHENNAI ---
  { name: 'Marina Beach', lat: 13.0475, lng: 80.2824, type: 'tourist' },
  { name: 'T. Nagar (Panagal Park)', lat: 13.0405, lng: 80.2337, type: 'shopping' },
  { name: 'Adyar Circle', lat: 13.0064, lng: 80.2573, type: 'shopping' },
  { name: 'OMR IT Corridor', lat: 12.9150, lng: 80.2300, type: 'traffic' },
  { name: 'Chennai Central', lat: 13.0827, lng: 80.2707, type: 'metro' },
  { name: 'Anna Salai', lat: 13.0617, lng: 80.2600, type: 'traffic' },
  { name: 'Spencer Plaza', lat: 13.0640, lng: 80.2608, type: 'shopping' },
  { name: 'Anekal Satellite Hub', lat: 12.7100, lng: 77.7000, type: 'traffic' },
  { name: 'Electronic City Toll', lat: 12.8400, lng: 77.6700, type: 'traffic' },
  { name: 'Whitefield IT Sector', lat: 12.9698, lng: 77.7499, type: 'traffic' },
  { name: 'Sarjapur Junction', lat: 12.9135, lng: 77.6740, type: 'traffic' },
  { name: 'Kormangala 5th Block', lat: 12.9344, lng: 77.6192, type: 'food' },

  // --- UNIVERSITIES & COLLEGES (BENGALURU) ---
  { name: 'Alliance University (Anekal)', lat: 12.7233, lng: 77.7050, type: 'university' },
  { name: 'Christ University (Main Campus)', lat: 12.9347, lng: 77.6062, type: 'university' },
  { name: 'IISc Bangalore', lat: 13.0184, lng: 77.5674, type: 'university' },
  { name: 'PES University (RR Campus)', lat: 12.9344, lng: 77.5345, type: 'university' },
  { name: 'Jain University (Jayanagar)', lat: 12.9279, lng: 77.5818, type: 'university' },
  { name: 'RV College of Engineering', lat: 12.9237, lng: 77.5002, type: 'university' },
  { name: 'Alliance University (City Campus)', lat: 12.9100, lng: 77.6300, type: 'university' },
  { name: 'MS Ramaiah Institute', lat: 13.0307, lng: 77.5649, type: 'university' },
  { name: 'BMS College of Engineering', lat: 12.9410, lng: 77.5655, type: 'university' },
  { name: 'Mount Carmel College', lat: 12.9918, lng: 77.5888, type: 'university' },
  { name: 'St. Joseph’s University', lat: 12.9620, lng: 77.5977, type: 'university' },
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
    case 'university':
      // Peaks morning (8:30-10:00), lunch (12:30-14:30), evening (16:30-18:30)
      if ((hour >= 8 && hour <= 10) || (hour >= 12 && hour <= 14) || (hour >= 16 && hour <= 18)) density = 75 + Math.random() * 20;
      else if (hour > 10 && hour < 12) density = 45 + Math.random() * 15;
      else if (hour > 18 && hour < 22) density = 30 + Math.random() * 20;
      else density = 5 + Math.random() * 10;
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

  // 2. Generate 85 Tactical Nodes around these landmarks to reach ~150 points
  for (let i = 0; i < 85; i++) {
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
