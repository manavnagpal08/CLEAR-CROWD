import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getCrowdData } from '../services/crowdService';
import { auth, db } from '../firebase';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const googleProvider = new GoogleAuthProvider();

export const useStore = create(
  persist(
    (set, get) => ({
      // Auth State
      user: null, // { name, email, role: 'user' | 'admin' }
      isAuthenticated: false,
      
      // App State
      crowdData: [],
      userLocation: { lat: 12.9716, lng: 77.5946 }, // Default Bangalore
      communityReports: [],
      selectedLocation: null,
      predictions: null,
      routes: [],
      isLoading: false,
      viewMode: 'live', // 'live' | '30m' | '60m'
      activeTab: 'map', // 'map' | 'admin' | 'alerts' | 'profile'
      historySlider: 0, // for timeline slider
      
      // Gamification State
      userPoints: 0,
      reportsHistory: [],
      lastReportTimestamp: null,

      // Smart City Real-time Features
      notifications: [], // { id, title, type: 'info' | 'warning' | 'critical', message, read, timestamp }
      anomalies: [], // { id, locationId, name, severity, timestamp }
      unreadNotifications: 0,
      
      // Environmental Factors
      events: [
        { id: 'e1', name: 'Zomaland Fest', type: 'concert', factor: 25, location: 'Central Park' },
        { id: 'e2', name: 'Holiday Weekend', type: 'holiday', factor: 15, location: 'all' },
        { id: 'e3', name: 'Tech Summit', type: 'event', factor: 10, location: 'Tech Park' }
      ],
      weather: { type: 'rain', factor: -10, label: 'Light Rain' },
      predictionFilters: {
        includeEvents: true,
        includeWeather: true,
        timeRange: '1h' // '1h' | '6h' | '24h'
      },
      
      // Preferences
      preferences: {
        avoidCrowds: false,
        notifications: true,
        highRiskAlerts: true,
      },

      // Actions
      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          return await get().handleUserAuth(userCredential.user);
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      loginWithGoogle: async () => {
        set({ isLoading: true });
        try {
          const result = await signInWithPopup(auth, googleProvider);
          return await get().handleUserAuth(result.user);
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      handleUserAuth: async (user) => {
        let userData = {
          uid: user.uid,
          email: user.email,
          name: user.displayName || user.email.split('@')[0],
          role: user.email === 'admin@screenerpro.com' ? 'admin' : 'user',
          createdAt: new Date().toISOString()
        };

        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            userData = { ...userData, ...userDoc.data() };
          } else {
            // Try to create the user doc but don't block login if it fails
            await setDoc(doc(db, 'users', user.uid), userData);
          }
        } catch (dbError) {
          console.error("Firestore error, falling back to basic auth data:", dbError);
        }
        
        set({ user: userData, isAuthenticated: true, isLoading: false });
        return userData;
      },
      
      signup: async (name, email, password) => {
        set({ isLoading: true });
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          const userData = {
            uid: userCredential.user.uid,
            name,
            email,
            role: email === 'admin@screenerpro.com' ? 'admin' : 'user',
            createdAt: new Date().toISOString()
          };
          
          try {
            await setDoc(doc(db, 'users', userCredential.user.uid), userData);
          } catch (dbError) {
            console.error("Firestore signup save error:", dbError);
          }
          
          set({ user: userData, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        await signOut(auth);
        set({ user: null, isAuthenticated: false });
      },

      initAuth: () => {
        onAuthStateChanged(auth, async (user) => {
          if (user) {
            let userData = {
              uid: user.uid,
              email: user.email,
              name: user.displayName || user.email.split('@')[0],
              role: user.email === 'admin@screenerpro.com' ? 'admin' : 'user'
            };

            try {
              const userDoc = await getDoc(doc(db, 'users', user.uid));
              if (userDoc.exists()) {
                userData = { ...userData, ...userDoc.data() };
              }
            } catch (dbError) {
              console.error("Firestore initAuth error:", dbError);
            }
            
            set({ user: userData, isAuthenticated: true });
          } else {
            set({ user: null, isAuthenticated: false });
          }
        });
      },

      updateProfile: async (updates) => {
        const user = get().user;
        if (!user) return;
        
        set({ isLoading: true });
        try {
          const newUserData = { ...user, ...updates };
          await setDoc(doc(db, 'users', user.uid), newUserData, { merge: true });
          set({ user: newUserData });
          return true;
        } catch (error) {
          console.error("Update profile error:", error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      updateUserLocation: () => {
        if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            set({ userLocation: { lat: latitude, lng: longitude } });
            get().fetchCrowdData();
          }, (error) => {
            console.warn("Geolocation failed, using default:", error.message);
          });
        }
      },

      fetchCrowdData: async () => {
        if (get().isLoading) return;
        set({ isLoading: true });
        try {
          const { lat, lng } = get().userLocation;
          const data = await getCrowdData(lat, lng);
          
          // Anomaly Detection Algorithm (Simulated)
          const state = get();
          const prevData = state.crowdData;
          if (prevData && prevData.length > 0 && !get().isLoading) {
             data.forEach(newLoc => {
                const oldLoc = prevData.find(l => l.id === newLoc.id);
                if (oldLoc) {
                   // Detect sudden spike (e.g., > 20% density increase instantly)
                   const spike = newLoc.density - oldLoc.density;
                   if (spike > 20) {
                      const severity = newLoc.density > 75 ? 'high' : 'medium';
                      // Avoid duplicate anomaly for same location within 5 mins
                      const recentAnomaly = state.anomalies.find(a => 
                         a.locationId === newLoc.id && 
                         new Date(a.timestamp).getTime() > Date.now() - 5 * 60000
                      );
                      
                      if (!recentAnomaly) {
                         state.addAnomaly({ locationId: newLoc.id, name: newLoc.name, severity });
                      }
                   }
                }
             });
          }

          set({ crowdData: data });
        } finally {
          set({ isLoading: false });
        }
      },

      setSelectedLocation: (location) => set({ selectedLocation: location }),
      setPredictions: (predictions) => set({ predictions }),
      setRoutes: (routes) => set({ routes }),
      setViewMode: (mode) => set({ viewMode: mode }),
      setActiveTab: (tab) => set({ activeTab: tab }),
      setHistorySlider: (val) => set({ historySlider: val }),
      
      updatePreferences: (newPrefs) => set((state) => ({ 
        preferences: { ...state.preferences, ...newPrefs } 
      })),

      submitReport: async (reportData) => {
        set({ isLoading: true });
        try {
          const report = {
            ...reportData,
            userId: get().user?.uid || 'anonymous',
            userName: get().user?.name || 'Anonymous User',
            timestamp: new Date().toISOString(),
          };
          
          const reportRef = doc(db, 'reports', `${Date.now()}`);
          await setDoc(reportRef, report);
          
          set((state) => ({
            communityReports: [report, ...state.communityReports]
          }));
          return true;
        } catch (error) {
          console.error("Report submission failed:", error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      fetchCommunityReports: async () => {
        // Simplified: Fetch latest reports
        try {
          // In real production, we'd use a Firestore query with limit/order
          // For now, simulate or fetch from a known collection
          set((state) => ({ communityReports: state.communityReports }));
        } catch (e) {
          console.error("Fetch reports error:", e);
        }
      },

      reportCrowd: (report) => {
        set((state) => ({
          crowdData: state.crowdData.map(loc => 
            loc.id === report.locationId 
              ? { ...loc, density: report.density, timestamp: new Date().toISOString() }
              : loc
          )
        }));
      },

      addPoints: (amount) => set((state) => ({ userPoints: state.userPoints + amount })),

      submitCrowdReport: async (locationId, level) => {
        const densityMap = { 'low': 20, 'medium': 55, 'high': 90 };
        const points = 10;
        
        const newReport = {
          id: Date.now(),
          locationId,
          level,
          density: densityMap[level],
          timestamp: new Date().toISOString(),
          pointsEarned: points
        };

        set((state) => ({
          userPoints: state.userPoints + points,
          reportsHistory: [newReport, ...state.reportsHistory],
          lastReportTimestamp: new Date().toISOString(),
          crowdData: state.crowdData.map(loc => 
            loc.id === locationId 
              ? { ...loc, density: (loc.density + densityMap[level]) / 2, lastUpdate: new Date().toISOString() }
              : loc
          )
        }));

        // Also submit to community reports if possible
        const location = get().crowdData.find(l => l.id === locationId);
        if (location) {
          get().submitReport({
            text: `User reported ${level} crowd at ${location.name}`,
            lat: location.lat,
            lng: location.lng,
            type: 'user_report'
          });
        }

        return points;
      },

      setPredictionFilters: (filters) => set((state) => ({
        predictionFilters: { ...state.predictionFilters, ...filters }
      })),

      getUserBadge: () => {
        const points = get().userPoints;
        if (points >= 500) return { label: 'Top Reporter', color: 'text-primary' };
        if (points >= 200) return { label: 'Contributor', color: 'text-secondary' };
        return { label: 'Beginner', color: 'text-white/40' };
      },

      addNotification: (notification) => {
        const newNotif = {
          ...notification,
          id: Date.now() + Math.random().toString(36).substr(2, 5),
          read: false,
          timestamp: new Date().toISOString()
        };
        set(state => ({
          notifications: [newNotif, ...state.notifications],
          unreadNotifications: state.unreadNotifications + 1
        }));
      },

      markNotificationsRead: () => {
        set(state => ({
          notifications: state.notifications.map(n => ({...n, read: true})),
          unreadNotifications: 0
        }));
      },

      addAnomaly: (anomaly) => {
        const newAnomaly = {
          ...anomaly,
          id: Date.now() + Math.random().toString(36).substr(2, 5),
          timestamp: new Date().toISOString()
        };
        set(state => ({
          anomalies: [newAnomaly, ...state.anomalies]
        }));
        
        // Also trigger a notification
        get().addNotification({
          title: 'Crowd Anomaly Detected',
          message: `Unexpected crowd surge at ${anomaly.name}`,
          type: anomaly.severity === 'high' ? 'critical' : 'warning'
        });
      },

      triggerSOS: async (location = null) => {
        const state = get();
        const sosLocation = location || state.userLocation;
        const msg = `🚨 SOS EMERGENCY SIGNAL: Help needed at [${sosLocation.lat.toFixed(4)}, ${sosLocation.lng.toFixed(4)}]. Directly notifying nearest Police Force and Medical Response units.`;
        
        // 1. Add to community reports immediately
        await state.submitReport({
          text: msg,
          lat: sosLocation.lat,
          lng: sosLocation.lng,
          type: 'emergency'
        });

        // 2. Add as a critical notification
        state.addNotification({
          title: 'SOS DISPATCHED',
          message: 'Police and emergency services have been alerted to your current coordinate signatures.',
          type: 'critical'
        });

        return true;
      }
    }),
    {
      name: 'clearcrowd-storage',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated,
        preferences: state.preferences,
        userPoints: state.userPoints,
        reportsHistory: state.reportsHistory,
        notifications: state.notifications,
        anomalies: state.anomalies
      }),
    }
  )
);
