// Claude API integration — servidor proxy en producción, cliente en dev.
//
// SEGURIDAD:
//   - En producción nativa (APK/IPA): EXPO_PUBLIC_ANTHROPIC_API_KEY NO debe estar
//     configurada. Todo el tráfico debe pasar por el proxy /api/feedback.
//   - En Expo Go / desarrollo: se acepta la clave pública para iterar rápido.
//   - La clave ANTHROPIC_API_KEY (sin EXPO_PUBLIC_) solo existe en el servidor.
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

// ── Input sanitization (client side) ─────────────────────────────────────────
// Defense-in-depth: also sanitized server-side, but sanitize before sending too.

const INJECTION_PATTERNS = [
  /ignore\s+previous\s+instructions?/gi,
  /ignore\s+all\s+instructions?/gi,
  /you\s+are\s+now\s+(a|an)\s+/gi,
  /forget\s+(everything|all|previous)/gi,
  /system\s+prompt/gi,
];

function sanitize(raw: string, maxLen: number): string {
  let s = raw
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
    .slice(0, maxLen)
    .trim();
  for (const p of INJECTION_PATTERNS) s = s.replace(p, "[redacted]");
  return s;
}

function sanitizeInput(input: FeedbackInput): FeedbackInput {
  return {
    question: sanitize(input.question, 500),
    correctAnswer: sanitize(input.correctAnswer, 200),
    userAnswer: sanitize(input.userAnswer, 200),
    language: input.language,
  };
}

// ── Proxy path (web / Expo server rendering) ──────────────────────────────────

async function fetchViaProxy(input: FeedbackInput): Promise<string> {
  const res = await fetch("/api/feedback", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) return "";
  const data = (await res.json()) as { feedback?: string };
  return typeof data.feedback === "string" ? data.feedback : "";
}

// ── Direct path (Expo Go / development only) ──────────────────────────────────

async function fetchDirectly(input: FeedbackInput): Promise<string> {
  // Only allowed in development. Production APKs/IPAs must NOT set this key.
  if (!__DEV__) return "";

  const apiKey = process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY;
  if (!apiKey) return "";

  const client = new Anthropic({
    apiKey,
    // Required for the SDK to work in React Native (not a real browser)
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
        content: `You are Noor, a warm and knowledgeable Islamic trivia teacher.
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
}

// ── Public API ────────────────────────────────────────────────────────────────

export const getAIFeedback = async (input: FeedbackInput): Promise<string> => {
  try {
    const safe = sanitizeInput(input);
    if (
      typeof window !== "undefined" &&
      window.location?.origin?.startsWith("http")
    ) {
      return await fetchViaProxy(safe);
    }
    return await fetchDirectly(safe);
  } catch {
    return "";
  }
};
