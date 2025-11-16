

// FIX: Import GoogleGenAI and GenerateContentResponse from @google/genai as per guidelines.
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { CampaignPerformance } from "../types";

// FIX: Initialize the GoogleGenAI client with the API key from environment variables.
// This is updated to use process.env.API_KEY as per the guidelines.
// FIX: Use process.env.API_KEY instead of import.meta.env.VITE_API_KEY to align with the coding guidelines and resolve the TypeScript error.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateSmartReply = async (prompt: string): Promise<string> => {
  console.log(`Generating smart reply for prompt: "${prompt}"`);

  // FIX: Replace the mock implementation with a real API call to the Gemini model.
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate a polite and professional WhatsApp response for the following query: "${prompt}"`,
    });
    // FIX: Access the 'text' property directly from the response object, which is the recommended way to get the text output.
    return response.text;
  } catch (error) {
    console.error("Error generating content with Gemini:", error);
    return "Sorry, I couldn't generate a response right now.";
  }
};


export const analyzeCampaignData = async (data: CampaignPerformance[]): Promise<string> => {
  const prompt = `
    Analyze the following WhatsApp campaign performance data and provide a concise summary of key insights. 
    Focus on overall trends, top-performing campaigns, and potential areas for improvement.
    The response should be in markdown format.

    Data:
    ${JSON.stringify(data, null, 2)}
  `;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro', // Using a more powerful model for analysis
        contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error analyzing campaign data with Gemini:", error);
    throw new Error("Failed to analyze campaign data.");
  }
};


export const generateBroadcastMessage = async (prompt: string): Promise<string> => {
  const fullPrompt = `
    Based on the following goal, write a compelling and effective WhatsApp broadcast message.
    The message should be friendly, clear, and have a strong call to action. Keep it concise.

    Goal: "${prompt}"
  `;
  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: fullPrompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating broadcast message with Gemini:", error);
    throw new Error("Failed to generate message.");
  }
};

export const categorizeSearchQuery = async (query: string): Promise<{ category: string, searchTerm: string }> => {
  const prompt = `
    Analyze the user's search query and classify it into one of the following categories: 'contacts', 'bots', 'campaigns', or 'general'. Also, extract the primary search term.
    User Query: "${query}"
    Respond with a JSON object in the format: { "category": "...", "searchTerm": "..." }
    For example, if the query is "find contacts named John", the response should be { "category": "contacts", "searchTerm": "John" }.
    If the query is "performance of holiday sale", the response should be { "category": "campaigns", "searchTerm": "holiday sale" }.
    If the query is "welcome bot", the response should be { "category": "bots", "searchTerm": "welcome" }.
  `;

  try {
     const response = await ai.models.generateContent({
       model: "gemini-2.5-flash",
       contents: prompt,
       config: {
         responseMimeType: "application/json",
         responseSchema: {
            type: Type.OBJECT,
            properties: {
                category: { type: Type.STRING },
                searchTerm: { type: Type.STRING },
            },
         }
       },
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Error categorizing search query with Gemini:", error);
    // Fallback for safety
    return { category: 'general', searchTerm: query };
  }
};