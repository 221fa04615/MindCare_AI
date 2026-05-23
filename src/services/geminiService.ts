import { GoogleGenAI, ThinkingLevel } from "@google/genai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.warn("⚠️ GEMINI_API_KEY is missing. If you are running locally, check your .env file. If deployed, ensure it's set in your environment variables.");
}

export const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY || '' });

const DEFAULT_MODEL = "gemini-3-flash-preview";

export const analyzeSentiment = async (text: string) => {
  if (!GEMINI_API_KEY) return "Neutral";
  try {
    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: [{ role: 'user', parts: [{ text: `Analyze the sentiment of the following text and return a single word (Positive, Neutral, Negative, Stress, Anxiety, Depression, Crisis): "${text}"` }] }],
      config: {
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW }
      }
    });
    return response.text?.trim() || "Neutral";
  } catch (error: any) {
    console.error("Sentiment analysis error:", error);
    return "Neutral";
  }
};

export const getChatbotResponse = async (
  userName: string,
  botName: string,
  userMessage: string,
  history: { role: string; parts: { text: string }[] }[],
  isProactive: boolean = false
) => {
  if (!GEMINI_API_KEY) {
    console.error("❌ Gemini API Key is missing in the browser environment.");
    return {
      text: "I'm sorry, I'm not configured with an API key yet. Please ensure GEMINI_API_KEY is set in your deployment environment variables.",
      sentiment: "Neutral"
    };
  }
  
  try {
    console.log(`🤖 Requesting response from ${DEFAULT_MODEL}...`);
    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: [
        ...history,
        { role: 'user', parts: [{ text: userMessage }] }
      ],
      config: {
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            text: { type: "string", description: "The chatbot's empathetic response" },
            sentiment: { 
              type: "string", 
              enum: ["Positive", "Neutral", "Negative", "Stress", "Anxiety", "Depression", "Crisis"],
              description: "The detected sentiment of the user's latest message"
            }
          },
          required: ["text", "sentiment"]
        },
        systemInstruction: `You are ${botName}, a sweet, deeply empathetic, and supportive personal AI psychologist. 
        The user's name is ${userName}. 
        Always use the user's name in the conversation and greet them warmly.
        
        Respond like a kind, caring psychologist who understands the diverse pressures of life.
        Your tone should be gentle, comforting, and encouraging.
        
        CRITICAL DIRECTIVE: Match the user's message length. If the user's message is short, keep your response short and sweet. If long, be detailed.
        
        SPECIAL DIRECTIVE FOR SERIOUS WRONGDOING: If the user admits to a serious ethical breach, be initially firm/harsh to show gravity, then return to empathy to guide them.
        
        SENTIMENT ANALYSIS: Analyze the user's latest message and categorize it into one of: Positive, Neutral, Negative, Stress, Anxiety, Depression, Crisis.
        
        If you detect crisis keywords (suicide, die, kill myself), set sentiment to "Crisis" and respond with extreme empathy and encourage professional help.
        
        OUTPUT FORMAT: You MUST return a JSON object with "text" and "sentiment" fields.
        ${isProactive ? "Be proactive: Suggest a wellness activity or ask a thought-provoking question." : ""}`,
      }
    });

    const result = JSON.parse(response.text || '{"text": "I\'m listening...", "sentiment": "Neutral"}');
    return {
      text: result.text || "I'm listening, please tell me more.",
      sentiment: result.sentiment || "Neutral"
    };
  } catch (error: any) {
    console.error("❌ Chatbot response error:", error);
    
    let fallbackText = "I'm sorry, I'm having a bit of trouble connecting right now. But I'm still here for you.";
    
    if (error?.message?.includes("503") || error?.status === "UNAVAILABLE") {
      fallbackText = "The AI service is currently very busy (503 Service Unavailable). Please try again in a few moments.";
    } else if (error?.message?.includes("429") || error?.status === "RESOURCE_EXHAUSTED") {
      fallbackText = "I've reached my daily limit for free messages (429 Quota Exceeded). Please wait a while or try again tomorrow.";
    } else if (error?.message?.includes("403") || error?.status === "PERMISSION_DENIED") {
      fallbackText = "I'm having trouble with my API key permissions (403 Forbidden).";
    }

    return {
      text: fallbackText,
      sentiment: "Neutral"
    };
  }
};
