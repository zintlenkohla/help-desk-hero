import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FileText, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { AIOutput, ResponsibleAINotice } from "@/components/AIOutput";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { callAI } from "@/lib/ai-client";
import { toast } from "sonner";

export const Route = createFileRoute("/summarizer")({
  head: () => ({ meta: [{ title: "Notes Summarizer — Stunning Zintle" }] }),
  component: SummarizerPage,
});

function SummarizerPage() {
  const [notes, setNotes] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const summarize = async () => {
    if (notes.trim().length < 30) return toast.error("Paste a longer set of notes.");
    setLoading(true);
    setOutput("");
    try {
      const content = await callAI([
        {
          role: "system",
          content:
            "You summarize meeting notes for busy professionals. Respond in markdown with these sections in this order: ## Summary (3 sentences), ## Key Decisions, ## Action Items (bulleted with owner if mentioned, and deadline if mentioned), ## Open Questions. Be concise.",
        },
        { role: "user", content: `Meeting notes:\n\n${notes}` },
      ]);
      setOutput(content);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Generation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-10">
      <PageHeader
        icon={<FileText className="h-6 w-6" />}
        title="Meeting Notes Summarizer"
        description="Extract decisions, action items, and deadlines from long notes."
      />
      <div className="grid gap-4 rounded-xl border bg-card p-6 shadow-sm">
        <div className="grid gap-2">
          <Label htmlFor="notes">Paste your meeting notes</Label>
          <Textarea
            id="notes"
            rows={12}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Paste raw meeting transcript or rough notes here…"
          />
        </div>
        <Button onClick={summarize} disabled={loading} className="w-full sm:w-auto">
          <Sparkles className="mr-2 h-4 w-4" />
          {loading ? "Summarizing…" : "Summarize"}
        </Button>
      </div>
      <div className="mt-6">
        <AIOutput content={output} loading={loading} />
      </div>
      <ResponsibleAINotice />
    </div>
  );
}
