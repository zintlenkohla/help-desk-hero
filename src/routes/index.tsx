import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Mail,
  FileText,
  CalendarCheck,
  BookOpen,
  MessageSquare,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Stunning Zintle" },
      { name: "description", content: "Your AI-powered productivity dashboard." },
    ],
  }),
  component: Dashboard,
});

const tools = [
  { url: "/email", icon: Mail, title: "Smart Email Generator", desc: "Draft professional emails in any tone in seconds." },
  { url: "/summarizer", icon: FileText, title: "Notes Summarizer", desc: "Turn long meeting notes into action items and decisions." },
  { url: "/planner", icon: CalendarCheck, title: "AI Task Planner", desc: "Generate prioritized daily and weekly schedules." },
  { url: "/research", icon: BookOpen, title: "Research Assistant", desc: "Summarize topics with insights and recommendations." },
  { url: "/chat", icon: MessageSquare, title: "AI Chatbot", desc: "Your always-on workplace assistant." },
];

function Dashboard() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10">
      <section
        className="relative mb-10 overflow-hidden rounded-2xl border p-8 text-primary-foreground"
        style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-elegant)" }}
      >
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider opacity-80">
          <Sparkles className="h-4 w-4" /> Powered by Lovable AI
        </div>
        <h1 className="mt-3 text-4xl font-bold tracking-tight">
          Automate your workday.
        </h1>
        <p className="mt-2 max-w-xl text-sm opacity-90">
          Five AI tools to draft emails, summarize meetings, plan tasks, research topics, and answer questions — all in one workspace.
        </p>
      </section>

      <h2 className="mb-4 text-lg font-semibold">AI Tools</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((t) => (
          <Link
            key={t.url}
            to={t.url}
            className="group rounded-xl border bg-card p-5 transition-all hover:-translate-y-0.5 hover:shadow-lg"
            style={{ boxShadow: "var(--shadow-soft)" }}
          >
            <div className="flex items-start justify-between">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground"
              >
                <t.icon className="h-5 w-5" />
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </div>
            <h3 className="mt-4 font-semibold">{t.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{t.desc}</p>
          </Link>
        ))}
      </div>

      <p className="mt-10 rounded-lg border border-dashed bg-muted/40 p-3 text-xs text-muted-foreground">
        <strong className="text-foreground">Responsible AI:</strong> Outputs are AI-generated and
        may contain inaccuracies. Review all content before sharing.
      </p>
    </div>
  );
}
