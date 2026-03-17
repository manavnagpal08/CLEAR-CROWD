import { GoogleGenerativeAI } from "@google/generative-ai";

// Using the provided API key (Assuming it has Gemini permissions as it's a standard Firebase/Google Cloud key often reusable for these hackathons)
const API_KEY = "AIzaSyC3ixQita-pwTtVvwoGVPRpaAac3nEjG5I";
const genAI = new GoogleGenerativeAI(API_KEY);

export const getAIResponse = async (userQuery, crowdContext) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are "ClearCrowd AI Tactical Assistant". 
      Your goal is to help users navigate the city and find the best time to visit places based on real-time neural grid data.
      Today is ${new Date().toLocaleDateString()} (${new Date().toLocaleDateString('en-US', { weekday: 'long' })}).
      
      Current Crowd Data for nearby locations:
      ${crowdContext.map(c => `- ${c.name}: ${Math.round(c.density)}% busy`).join('\n')}
      
      User Question: "${userQuery}"
      
      Instructions:
      1. Analyze the user's request.
      2. If they ask about a specific time (e.g., Friday), provide a prediction based on typical city patterns (Fridays are usually busy in evening).
      3. Use the "Current Crowd Data" provided to give real-time advice if they are asking about "now".
      4. Keep the tone helpful, professional, and concise.
      5. Suggest "Quiet Walk" routes if it seems appropriate.
      
      Response:
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini AI Error:", error);
    return "I'm having trouble connecting to my central brain right now. Based on my local data, I'd suggest checking the map for the green 'Safe' zones!";
  }
};
