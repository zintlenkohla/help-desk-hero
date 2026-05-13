import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { MessageSquare, Send } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { callAI, type ChatMessage } from "@/lib/ai-client";
import { toast } from "sonner";

export const Route = createFileRoute("/chat")({
  head: () => ({ meta: [{ title: "AI Chat — Workspace AI" }] }),
  component: ChatPage,
});

const SYSTEM: ChatMessage = {
  role: "system",
  content:
    "You are Workspace AI, a helpful, concise workplace assistant. Use markdown. Ask a clarifying question only when truly necessary.",
};

function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const next = [...messages, { role: "user", content: text } as ChatMessage];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const reply = await callAI([SYSTEM, ...next]);
      setMessages([...next, { role: "assistant", content: reply }]);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Chat failed");
      setMessages(next);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-3.5rem)] w-full max-w-4xl flex-col px-6 py-6">
      <PageHeader
        icon={<MessageSquare className="h-6 w-6" />}
        title="AI Chatbot"
        description="Your always-on workplace assistant."
      />

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto rounded-xl border bg-card p-4 shadow-sm"
      >
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center text-sm text-muted-foreground">
            <MessageSquare className="mb-3 h-8 w-8 opacity-50" />
            <p>Ask anything — drafting, brainstorming, summarizing, planning.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                    m.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  }`}
                >
                  {m.role === "assistant" ? (
                    <div className="prose prose-sm max-w-none text-foreground prose-headings:text-foreground prose-strong:text-foreground prose-a:text-primary">
                      <ReactMarkdown>{m.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap">{m.content}</p>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl bg-muted px-4 py-2.5 text-sm text-muted-foreground">
                  <span className="inline-flex gap-1">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current [animation-delay:0.15s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current [animation-delay:0.3s]" />
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-4 flex gap-2">
        <Textarea
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          placeholder="Message Workspace AI…"
          className="min-h-[48px] resize-none"
        />
        <Button onClick={send} disabled={loading || !input.trim()} size="lg">
          <Send className="h-4 w-4" />
        </Button>
      </div>
      <p className="mt-3 text-center text-xs text-muted-foreground">
        Responsible AI: outputs may be inaccurate. Verify before relying on them.
      </p>
    </div>
  );
}
