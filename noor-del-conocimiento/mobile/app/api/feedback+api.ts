// Expo API Route — server-side proxy for Anthropic Claude
// This keeps the API key out of the client bundle in production.
// Deploy with: eas build --profile production (requires Expo server rendering)
import Anthropic from "@anthropic-ai/sdk";

const LANGUAGE_NAMES: Record<string, string> = {
  es: "Spanish",
  en: "English",
  ma: "Moroccan Arabic (Darija)",
};

interface FeedbackRequest {
  question: string;
  correctAnswer: string;
  userAnswer: string;
  language: string;
}

interface FeedbackResponse {
  feedback: string;
}

interface ErrorResponse {
  error: string;
}

export async function POST(
  request: Request
): Promise<Response> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    const body: ErrorResponse = { error: "API key not configured" };
    return Response.json(body, { status: 500 });
  }

  let body: FeedbackRequest;
  try {
    body = await request.json() as FeedbackRequest;
  } catch {
    const err: ErrorResponse = { error: "Invalid request body" };
    return Response.json(err, { status: 400 });
  }

  const { question, correctAnswer, userAnswer, language } = body;
  if (!question || !correctAnswer || !userAnswer || !language) {
    const err: ErrorResponse = { error: "Missing required fields" };
    return Response.json(err, { status: 400 });
  }

  const langName = LANGUAGE_NAMES[language] ?? "Spanish";

  const client = new Anthropic({ apiKey });

  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 256,
      messages: [
        {
          role: "user",
          content: `You are Noor, a knowledgeable and encouraging Islamic studies tutor.
The student answered an Islamic trivia question incorrectly.

Question: ${question}
Correct answer: ${correctAnswer}
Student's answer: ${userAnswer}

Respond in ${langName}. Give a brief, warm explanation (2-3 sentences) of why the correct answer is right, citing the relevant Quranic verse or hadith source if applicable. Be encouraging, never condescending.`,
        },
      ],
    });

    const text =
      message.content[0].type === "text" ? message.content[0].text : "";
    const response: FeedbackResponse = { feedback: text };
    return Response.json(response);
  } catch (err) {
    console.error("Anthropic API error:", err);
    const error: ErrorResponse = { error: "Failed to generate feedback" };
    return Response.json(error, { status: 502 });
  }
}
