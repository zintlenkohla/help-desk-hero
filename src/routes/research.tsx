import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BookOpen, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { AIOutput, ResponsibleAINotice } from "@/components/AIOutput";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { callAI } from "@/lib/ai-client";
import { toast } from "sonner";

export const Route = createFileRoute("/research")({
  head: () => ({ meta: [{ title: "Research Assistant — Stunning Zintle" }] }),
  component: ResearchPage,
});

function ResearchPage() {
  const [topic, setTopic] = useState("");
  const [context, setContext] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const research = async () => {
    if (!topic.trim()) return toast.error("Enter a research topic.");
    setLoading(true);
    setOutput("");
    try {
      const content = await callAI([
        {
          role: "system",
          content:
            "You are a research analyst. Produce a brief in markdown with: ## Overview, ## Key Insights (5 bullets), ## Pros & Cons (table), ## Recommendations (3 actionable bullets), ## Further Reading (5 specific search queries the user can run). Be neutral and cite reasoning, not invented sources.",
        },
        {
          role: "user",
          content: `Topic: ${topic}\n\n${context ? `Context / focus: ${context}` : ""}`,
        },
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
        icon={<BookOpen className="h-6 w-6" />}
        title="AI Research Assistant"
        description="Get a structured brief on any workplace topic — with insights and recommendations."
      />
      <div className="grid gap-4 rounded-xl border bg-card p-6 shadow-sm">
        <div className="grid gap-2">
          <Label htmlFor="topic">Topic</Label>
          <Input id="topic" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. Switching our team from Jira to Linear" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="context">Context (optional)</Label>
          <Textarea id="context" rows={4} value={context} onChange={(e) => setContext(e.target.value)} placeholder="Team size, constraints, what you're trying to decide…" />
        </div>
        <Button onClick={research} disabled={loading} className="w-full sm:w-auto">
          <Sparkles className="mr-2 h-4 w-4" />
          {loading ? "Researching…" : "Generate brief"}
        </Button>
      </div>
      <div className="mt-6">
        <AIOutput content={output} loading={loading} />
      </div>
      <ResponsibleAINotice />
    </div>
  );
}
