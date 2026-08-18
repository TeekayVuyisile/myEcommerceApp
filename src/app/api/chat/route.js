import { streamChatCompletion } from "@/lib/groq";

const MAX_MESSAGES = 20;
const MAX_MESSAGE_LENGTH = 1000;

export async function POST(request) {
  const body = await request.json().catch(() => null);
  const messages = body?.messages;

  if (!Array.isArray(messages) || messages.length === 0) {
    return Response.json({ error: "messages is required" }, { status: 400 });
  }

  if (messages.length > MAX_MESSAGES) {
    return Response.json({ error: "Too many messages" }, { status: 400 });
  }

  const isValid = messages.every(
    (m) =>
      m &&
      (m.role === "user" || m.role === "assistant") &&
      typeof m.content === "string" &&
      m.content.length > 0 &&
      m.content.length <= MAX_MESSAGE_LENGTH
  );

  if (!isValid) {
    return Response.json({ error: "Invalid message format" }, { status: 400 });
  }

  try {
    const stream = await streamChatCompletion(messages);
    return new Response(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (error) {
    if (error.status === 429) {
      return Response.json(
        { error: "The chat is busy right now — please try WhatsApp instead." },
        { status: 429 }
      );
    }
    console.error("Chat API error:", error);
    return Response.json(
      { error: "Something went wrong — please try WhatsApp instead." },
      { status: 500 }
    );
  }
}
