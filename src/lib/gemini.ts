
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyBHonTiqsLavSzIEbW_W_ZwkrPR_aAOHF8");

export const geminiModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function generateAIResponse(prompt: string, context?: string): Promise<string> {
  try {
    const fullPrompt = context ? `${context}\n\nUser: ${prompt}` : prompt;
    const result = await geminiModel.generateContent(fullPrompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating AI response:", error);
    return "I'm sorry, I'm having trouble processing your request right now. Please try again later.";
  }
}

export const shopingAssistantContext = `
You are an AI shopping assistant avatar for AIShopmate. You are helpful, friendly, and knowledgeable about products, budgets, and shopping preferences. 

Your role is to:
- Help users find products within their budget
- Provide personalized recommendations
- Suggest complementary items
- Offer style and shopping advice
- Help with product comparisons
- Provide information about deals and offers

Keep responses concise, friendly, and shopping-focused. Always consider the user's budget constraints and preferences.
`;
