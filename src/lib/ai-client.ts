export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export async function callAI(messages: ChatMessage[]): Promise<string> {
  const res = await fetch("/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });
  const data = (await res.json().catch(() => ({}))) as { content?: string; error?: string };
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data.content || "";
}
