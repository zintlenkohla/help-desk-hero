import { createFileRoute } from "@tanstack/react-router";
import "@tanstack/react-start";

type Msg = { role: "system" | "user" | "assistant"; content: string };

export const Route = createFileRoute("/api/ai")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        const apiKey = process.env.LOVABLE_API_KEY;
        if (!apiKey) {
          return new Response(JSON.stringify({ error: "Missing LOVABLE_API_KEY" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }

        let body: { messages?: Msg[]; model?: string };
        try {
          body = await request.json();
        } catch {
          return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400 });
        }
        const messages = Array.isArray(body.messages) ? body.messages : null;
        if (!messages || messages.length === 0) {
          return new Response(JSON.stringify({ error: "messages required" }), { status: 400 });
        }

        const model = body.model || "google/gemini-3-flash-preview";

        const upstream = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Lovable-API-Key": apiKey,
          },
          body: JSON.stringify({ model, messages }),
        });

        if (!upstream.ok) {
          const text = await upstream.text();
          if (upstream.status === 429) {
            return new Response(
              JSON.stringify({ error: "Rate limit reached. Please try again shortly." }),
              { status: 429, headers: { "Content-Type": "application/json" } },
            );
          }
          if (upstream.status === 402) {
            return new Response(
              JSON.stringify({ error: "AI credits exhausted. Add credits in Settings → Workspace → Usage." }),
              { status: 402, headers: { "Content-Type": "application/json" } },
            );
          }
          return new Response(
            JSON.stringify({ error: "AI gateway error", detail: text.slice(0, 500) }),
            { status: 500, headers: { "Content-Type": "application/json" } },
          );
        }

        const data = (await upstream.json()) as {
          choices?: { message?: { content?: string } }[];
        };
        const content = data.choices?.[0]?.message?.content ?? "";
        return new Response(JSON.stringify({ content }), {
          headers: { "Content-Type": "application/json" },
        });
      },
    },
  },
});
