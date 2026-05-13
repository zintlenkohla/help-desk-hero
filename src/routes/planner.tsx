import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CalendarCheck, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { AIOutput, ResponsibleAINotice } from "@/components/AIOutput";
import { Button } from "@/components/ui/button";
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

export const Route = createFileRoute("/planner")({
  head: () => ({ meta: [{ title: "Task Planner — Workspace AI" }] }),
  component: PlannerPage,
});

function PlannerPage() {
  const [tasks, setTasks] = useState("");
  const [horizon, setHorizon] = useState("day");
  const [hours, setHours] = useState("8");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const plan = async () => {
    if (tasks.trim().length < 10) return toast.error("List a few tasks first.");
    setLoading(true);
    setOutput("");
    try {
      const content = await callAI([
        {
          role: "system",
          content:
            "You are a productivity coach. Given tasks, build a realistic, prioritized schedule. Use the Eisenhower matrix to prioritize. Output markdown with: ## Priorities (P1/P2/P3 buckets), ## Schedule (a time-blocked table), ## Tips (2 short suggestions). Be specific with time blocks.",
        },
        {
          role: "user",
          content: `Build a ${horizon === "day" ? "single-day" : "weekly"} schedule with about ${hours} productive hours per day. Tasks:\n${tasks}`,
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
        icon={<CalendarCheck className="h-6 w-6" />}
        title="AI Task Planner"
        description="Turn a list of tasks into a prioritized, time-blocked plan."
      />
      <div className="grid gap-4 rounded-xl border bg-card p-6 shadow-sm">
        <div className="grid gap-2">
          <Label htmlFor="tasks">Your tasks (one per line)</Label>
          <Textarea
            id="tasks"
            rows={8}
            value={tasks}
            onChange={(e) => setTasks(e.target.value)}
            placeholder={"Finish quarterly report\nReview 3 PRs\nCall supplier about delivery\nPrep slides for Friday"}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label>Horizon</Label>
            <Select value={horizon} onValueChange={setHorizon}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Daily</SelectItem>
                <SelectItem value="week">Weekly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Productive hours / day</Label>
            <Select value={hours} onValueChange={setHours}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {[4, 5, 6, 7, 8, 9, 10].map((h) => (
                  <SelectItem key={h} value={String(h)}>{h} hours</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button onClick={plan} disabled={loading} className="w-full sm:w-auto">
          <Sparkles className="mr-2 h-4 w-4" />
          {loading ? "Planning…" : "Build my schedule"}
        </Button>
      </div>
      <div className="mt-6">
        <AIOutput content={output} loading={loading} />
      </div>
      <ResponsibleAINotice />
    </div>
  );
}
