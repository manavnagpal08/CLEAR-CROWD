import { GoogleGenerativeAI } from "@google/generative-ai";

// Using the provided API key (Assuming it has Gemini permissions as it's a standard Firebase/Google Cloud key often reusable for these hackathons)
const API_KEY = "AIzaSyC3ixQita-pwTtVvwoGVPRpaAac3nEjG5I";
const genAI = new GoogleGenerativeAI(API_KEY);

export const getAIResponse = async (userQuery, crowdContext, anomalies = [], communityReports = []) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are "ClearCrowd AI Tactical Assistant". 
      Your goal is to help users navigate the city and avoid congestion using real-time intelligent grid data.
      Today is ${new Date().toLocaleDateString()} (${new Date().toLocaleDateString('en-US', { weekday: 'long' })}).
      
      Current Tactical Intel:
      - Locations: ${crowdContext.map(c => `- ${c.name}: ${Math.round(c.density)}% busy`).join('\n')}
      
      Active Anomalies (Sudden surges):
      ${anomalies.length > 0 ? anomalies.map(a => `- ${a.name} (${a.severity} risk)`).join('\n') : "None detected."}
      
      Community Intel:
      ${communityReports.length > 0 ? communityReports.slice(0, 3).map(r => `- ${r.text}`).join('\n') : "No active reports."}
      
      User Question: "${userQuery}"
      
      Tactical Objectives:
      1. Provide a direct, concise response using a mix of real data and urban patterns.
      2. If asked about MG Road or Mall, check the Current Tactical Intel above.
      3. Highlight ANY active anomalies if they are related to the user's query.
      4. Suggest safer alternatives or quieter paths if the requested zone is over 70% capacity.
      5. Sound like an advanced urban AI assistant—intelligent, fast, and precise.
      
      Response:
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini AI Error:", error);
    return "Tactical uplink intermittent. Local sensor sweep suggests following green 'Stable' zones on your map for optimal transit.";
  }
};
