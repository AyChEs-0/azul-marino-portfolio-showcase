// Claude API integration — reemplaza Genkit/Gemini
// La API key se pasa via variable de entorno EXPO_PUBLIC_ANTHROPIC_API_KEY
// IMPORTANTE: Para producción usar un backend proxy (Expo API Routes / Vercel function)
// para que la API key no quede expuesta en el bundle del cliente.
import Anthropic from "@anthropic-ai/sdk";
import type { Language } from "./types";

interface FeedbackInput {
  question: string;
  correctAnswer: string;
  userAnswer: string;
  language: Language;
}

const LANGUAGE_NAMES: Record<Language, string> = {
  es: "Spanish",
  en: "English",
  ma: "Moroccan Arabic (Darija)",
};

export const getAIFeedback = async (input: FeedbackInput): Promise<string> => {
  const apiKey = process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY;
  if (!apiKey) return "";

  const client = new Anthropic({
    apiKey,
    // dangerouslyAllowBrowser: true — needed only for client-side calls
    // In production, route through a server endpoint
    dangerouslyAllowBrowser: true,
  });

  const langName = LANGUAGE_NAMES[input.language];
  const isRTL = input.language === "ma";

  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 256,
    messages: [
      {
        role: "user",
        content: `You are a warm and knowledgeable Islamic trivia teacher.
A student just answered an Islamic knowledge question incorrectly.
Provide a brief, educational explanation (2-3 sentences max) that:
1. Acknowledges their mistake kindly
2. Explains why the correct answer is right with Islamic context
3. Adds a helpful memory aid or related fact

CRITICAL: Respond ONLY in ${langName}.${isRTL ? " Write in right-to-left Darija Arabic." : ""}
Do NOT invent hadith, Quranic verses, or citations you are unsure of.
Be warm, educational, and concise.

Question: ${input.question}
Correct answer: ${input.correctAnswer}
Student's answer: ${input.userAnswer}`,
      },
    ],
  });

  const block = message.content[0];
  return block.type === "text" ? block.text.trim() : "";
};
