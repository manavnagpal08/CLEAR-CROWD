export const LOCATIONS = [
  { id: '1', name: 'MG Road', lat: 12.9716, lng: 77.5946, density: 85 },
  { id: '2', name: 'Indiranagar', lat: 12.9784, lng: 77.6408, density: 45 },
  { id: '3', name: 'Koramangala', lat: 12.9352, lng: 77.6245, density: 65 },
  { id: '4', name: 'Whitefield', lat: 12.9698, lng: 77.7500, density: 30 },
  { id: '5', name: 'Electronic City', lat: 12.8452, lng: 77.6632, density: 20 },
  { id: '6', name: 'Jayanagar', lat: 12.9250, lng: 77.5938, density: 55 },
  { id: '7', name: 'Malleshwaram', lat: 13.0031, lng: 77.5702, density: 75 },
];

export const getCrowdData = () => {
  // Simulate API fetch
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(LOCATIONS.map(loc => ({
        ...loc,
        density: Math.max(0, Math.min(100, loc.density + (Math.random() * 20 - 10))),
        timestamp: new Date().toISOString()
      })));
    }, 500);
  });
};

export const getPredictions = (locationId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const baseDensity = LOCATIONS.find(l => l.id === locationId)?.density || 50;
      const predictions = Array.from({ length: 12 }, (_, i) => ({
        time: `${(i + 1) * 5}m`,
        value: Math.max(0, Math.min(100, baseDensity + (Math.random() * 30 - 15) + (i * 2)))
      }));
      
      const lastValue = predictions[predictions.length - 1].value;
      let risk = "Low";
      if (lastValue > 75) risk = "High";
      else if (lastValue > 40) risk = "Medium";

      resolve({
        locationId,
        predictions,
        risk
      });
    }, 800);
  });
};

export const getRoutes = (from, to) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 'route-1',
          name: 'Fastest Route',
          time: '25 min',
          crowdLevel: 'High',
          distance: '5.2 km',
          color: '#FF4D4D',
          coordinates: [[77.5946, 12.9716], [77.6408, 12.9784]]
        },
        {
          id: 'route-2',
          name: 'Balanced Route',
          time: '32 min',
          crowdLevel: 'Medium',
          distance: '6.1 km',
          color: '#00C2FF',
          coordinates: [[77.5946, 12.9716], [77.6245, 12.9352], [77.6408, 12.9784]]
        },
        {
          id: 'route-3',
          name: 'Safest Route',
          time: '40 min',
          crowdLevel: 'Low',
          distance: '7.5 km',
          color: '#00FF9C',
          coordinates: [[77.5946, 12.9716], [77.5938, 12.9250], [77.6408, 12.9784]]
        }
      ]);
    }, 1000);
  });
};
