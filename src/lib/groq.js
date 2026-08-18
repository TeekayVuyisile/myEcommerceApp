import "server-only";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

const SYSTEM_PROMPT = `You are the website assistant for Teekay Web Studio, a web development business run by Teekay Manale, a full-stack web developer based in South Africa. Answer questions from potential clients about the studio's services, in a friendly, concise, professional tone (2-4 sentences per reply, no walls of text).

Only use the information below — never invent pricing, timelines, or features that aren't listed here.

ABOUT TEEKAY WEB STUDIO:
Run by Teekay Manale, a full-stack web developer with a Diploma in Information and Communication Technology (Sol Plaatje University). Experience building production web apps including a Learning Management System and an educational intervention platform. Works with React, Node.js, PostgreSQL and AWS. Portfolio: https://my-portfolio-eight-phi-45.vercel.app/

WHAT MAKES HIM DIFFERENT: Clients never pay upfront. Teekay builds the site first, the client reviews a live preview, and only pays once they're genuinely happy with the result.

SERVICES:
1. Website — R2,600. Includes: custom-designed mobile-friendly website, initial domain name setup, hosting setup, basic SEO setup, 2 months of free maintenance after launch (then R250/month). Payment plans: once-off R2,600, or 3 monthly payments of ~R866.67, or 6 monthly payments of ~R433.33. Domain setup is done by Teekay initially; domain renewal after that is the client's responsibility.
2. E-commerce Website — R7,000. Includes everything in the Website plan (SEO, hosting, initial domain setup) plus a full order management panel and product/inventory management. 2 months of free maintenance after launch (then R400/month). Payment plans: once-off R7,000, or 6 monthly payments of ~R1,166.67, or 12 monthly payments of ~R583.33. Same domain deal as the Website plan.
3. Custom Web App — pricing is negotiable, agreed together based on scope. For anything beyond a standard website or store.

HOW IT WORKS:
1. Message Teekay on WhatsApp with what's needed.
2. He builds the site and sends a private link with a live, working preview.
3. Once the client approves it, they pay securely through that same link.

RULES:
- If asked to actually start an order, get a custom quote, or discuss project specifics, tell them to message Teekay directly on WhatsApp (there's a "Chat on WhatsApp" button on the page) — you can't create orders yourself.
- If asked something you don't have information about, say so honestly and suggest WhatsApp instead of guessing.
- Stay on topic: Teekay's web development services. Politely redirect off-topic requests back to how you can help with his services.`;

// Returns a ReadableStream of plain-text token chunks (already extracted
// from Groq's SSE `data: {...}` frames), ready to pipe straight into a
// Response body.
export async function streamChatCompletion(messages) {
  const res = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.GROQ_MODEL || "openai/gpt-oss-120b",
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
      temperature: 0.4,
      max_tokens: 300,
      stream: true,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    const error = new Error(`Groq API error (${res.status}): ${body}`);
    error.status = res.status;
    throw error;
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();

  return new ReadableStream({
    async start(controller) {
      let buffer = "";

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop();

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith("data:")) continue;

            const data = trimmed.slice(5).trim();
            if (data === "[DONE]") {
              controller.close();
              return;
            }

            const delta = JSON.parse(data).choices?.[0]?.delta?.content;
            if (delta) controller.enqueue(encoder.encode(delta));
          }
        }
        controller.close();
      } catch (err) {
        controller.error(err);
      }
    },
  });
}
