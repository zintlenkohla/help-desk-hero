import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { AIOutput, ResponsibleAINotice } from "@/components/AIOutput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { callAI } from "@/lib/ai-client";
import { toast } from "sonner";

export const Route = createFileRoute("/email")({
  head: () => ({ meta: [{ title: "Email Generator — Workspace AI" }] }),
  component: EmailPage,
});

function EmailPage() {
  const [recipient, setRecipient] = useState("");
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("professional");
  const [length, setLength] = useState("medium");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!topic.trim()) return toast.error("Describe what the email is about.");
    setLoading(true);
    setOutput("");
    try {
      const content = await callAI([
        {
          role: "system",
          content:
            "You are a senior executive assistant. Write clear, well-structured emails. Output only the email with a subject line, greeting, body, and sign-off. Use markdown.",
        },
        {
          role: "user",
          content: `Write a ${length} ${tone} email${recipient ? ` to ${recipient}` : ""} about: ${topic}`,
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
        icon={<Mail className="h-6 w-6" />}
        title="Smart Email Generator"
        description="Draft professional emails in any tone — in seconds."
      />

      <div className="grid gap-4 rounded-xl border bg-card p-6 shadow-sm">
        <div className="grid gap-2">
          <Label htmlFor="recipient">Recipient (optional)</Label>
          <Input id="recipient" value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="e.g. Hiring manager at Acme" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="topic">What is this email about?</Label>
          <Textarea id="topic" rows={4} value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Decline a meeting politely and propose Friday at 3pm instead." />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label>Tone</Label>
            <Select value={tone} onValueChange={setTone}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="formal">Formal</SelectItem>
                <SelectItem value="friendly">Friendly</SelectItem>
                <SelectItem value="persuasive">Persuasive</SelectItem>
                <SelectItem value="apologetic">Apologetic</SelectItem>
                <SelectItem value="concise">Concise & direct</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Length</Label>
            <Select value={length} onValueChange={setLength}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="short">Short</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="long">Detailed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button onClick={generate} disabled={loading} className="mt-2 w-full sm:w-auto">
          <Sparkles className="mr-2 h-4 w-4" />
          {loading ? "Generating…" : "Generate email"}
        </Button>
      </div>

      <div className="mt-6">
        <AIOutput content={output} loading={loading} editable onChange={setOutput} />
      </div>
      <ResponsibleAINotice />
    </div>
  );
}
