
// FIX: Import GoogleGenAI and GenerateContentResponse from @google/genai as per guidelines.
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { CampaignPerformance } from "../types";

// A singleton instance of the GoogleGenAI client.
// It will be initialized only when it's first needed.
let aiInstance: GoogleGenAI | null = null;

/**
 * Initializes and returns the GoogleGenAI client instance.
 * Throws an error if the API key is not configured.
 * This prevents the entire application from crashing on startup if the key is missing.
 */
const getAiClient = (): GoogleGenAI => {
    if (!aiInstance) {
        const apiKey = process.env.API_KEY;
        if (!apiKey) {
            console.error("Gemini API key is not configured. Please set the API_KEY environment variable.");
            throw new Error("Gemini API key is not configured.");
        }
        aiInstance = new GoogleGenAI({ apiKey });
    }
    return aiInstance;
};

// All exported functions will now call getAiClient() to ensure the client is initialized.
// They will also include a try-catch block to handle initialization failures gracefully.

export const generateSmartReply = async (prompt: string): Promise<string> => {
  console.log(`Generating smart reply for prompt: "${prompt}"`);

  try {
    const ai = getAiClient();
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate a polite and professional WhatsApp response for the following query: "${prompt}"`,
    });
    // FIX: Access the 'text' property directly from the response object, which is the recommended way to get the text output.
    return response.text;
  } catch (error) {
    console.error("Error generating content with Gemini:", error);
    if (error instanceof Error && error.message.includes("API key is not configured")) {
        return "AI features are currently unavailable. Please contact support.";
    }
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
    const ai = getAiClient();
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro', // Using a more powerful model for analysis
        contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error analyzing campaign data with Gemini:", error);
    throw new Error("Failed to analyze campaign data. Please check configuration.");
  }
};


export const generateBroadcastMessage = async (prompt: string): Promise<string> => {
  const fullPrompt = `
    Based on the following goal, write a compelling and effective WhatsApp broadcast message.
    The message should be friendly, clear, and have a strong call to action. Keep it concise.

    Goal: "${prompt}"
  `;
  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: fullPrompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating broadcast message with Gemini:", error);
    throw new Error("Failed to generate message. Please check configuration.");
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
     const ai = getAiClient();
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
