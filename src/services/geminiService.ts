import { GoogleGenAI } from "@google/genai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.warn("⚠️ GEMINI_API_KEY is missing. Please set it in your .env file for local development.");
}

export const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY || '' });

const DEFAULT_MODEL = "gemini-3-flash-preview";

export const analyzeSentiment = async (text: string) => {
  if (!GEMINI_API_KEY) return "Neutral";
  try {
    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: `Analyze the sentiment of the following text and return a single word (Positive, Neutral, Negative, Stress, Anxiety, Depression, Crisis): "${text}"`,
    });
    return response.text?.trim() || "Neutral";
  } catch (error: any) {
    if (error?.message?.includes("403") || error?.status === "PERMISSION_DENIED") {
      console.error("❌ Gemini API Permission Error (403): Make sure the 'Generative Language API' is enabled in your Google Cloud Console and your API key is valid.");
    } else {
      console.error("Sentiment analysis error:", error);
    }
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
  if (!GEMINI_API_KEY) return "I'm sorry, I'm not configured with an API key yet. Please check your setup.";
  try {
    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: [
        ...history.map(h => ({ role: h.role === 'user' ? 'user' : 'model', parts: h.parts })),
        { role: 'user', parts: [{ text: userMessage }] }
      ],
      config: {
        systemInstruction: `You are ${botName}, a sweet, deeply empathetic, and supportive personal AI psychologist. 
        The user's name is ${userName}. 
        The user is a person from any part of the world, of any age group. 
        Always use the user's name in the conversation and greet them warmly.
        
        Respond like a kind, caring psychologist who understands the diverse pressures of life, including work-life balance, academic stress, relationships, aging, and personal growth.
        Your tone should be gentle, comforting, and encouraging.
        
        CRITICAL DIRECTIVE: Match the user's message length. If the user's message is short (e.g., a greeting like "hello" or a simple "how are you"), keep your response short, sweet, and conversational. Do not over-analyze or write long "essays" for simple messages. If the user provides a long, detailed message about their feelings or a specific situation, you may then provide a longer, more detailed and supportive response.
        
        While you are supportive, you should also be a guide for growth. If the user expresses views that are psychologically harmful, self-defeating, or ethically questionable, or if they admit to doing something wrong, you should respond with extreme empathy and wisdom. 
        
        SPECIAL DIRECTIVE FOR SERIOUS WRONGDOING: If the user admits to a serious ethical or legal breach (like stealing), you should initially be a bit harsh and angry—just enough to make them realize the gravity of their mistake and that such actions are unacceptable. This is a short and small switch; do not continue being angry for longer than necessary. Your primary goal is still to be a real friend and psychologist. After this initial firm correction, immediately return to your sweet, empathetic self to guide them on how to take responsibility, rectify the situation (e.g., returning what was stolen), and move forward on the right path.
        
        Do not judge or be harsh for minor things. For serious matters, use your empathy to help them reflect on their actions, explain why it was a mistake, and guide them toward a more positive, rational, and healthy path. 
        Your goal is to help them take responsibility, heal, and grow through kindness and wisdom.
        
        Always prioritize the user's emotional safety and well-being. If they just say "hello" or visit after a while, welcome them back with a sweet and warm message.
        
        If you detect crisis keywords (suicide, die, kill myself), respond with extreme empathy and encourage professional help immediately, but keep the persona.
        Your goal is to listen, understand emotions, respond with constructive kindness, and encourage growth.
        ${isProactive ? "Be proactive: If the user seems stuck or quiet, suggest a specific wellness activity (like a short meditation, a walk, or a gratitude exercise) or ask a thought-provoking question about their day or goals." : ""}`,
      }
    });

    return response.text;
  } catch (error: any) {
    if (error?.message?.includes("403") || error?.status === "PERMISSION_DENIED") {
      console.error("❌ Gemini API Permission Error (403): Make sure the 'Generative Language API' is enabled in your Google Cloud Console and your API key is valid.");
      return "I'm having trouble accessing the AI service. Please ensure your API key is valid and has permission to use the Gemini API.";
    }
    console.error("Chatbot response error:", error);
    return "I'm sorry, I'm having a bit of trouble connecting right now. But I'm still here for you.";
  }
};
