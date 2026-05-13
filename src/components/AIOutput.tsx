import ReactMarkdown from "react-markdown";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function AIOutput({
  content,
  loading,
  editable = false,
  onChange,
}: {
  content: string;
  loading?: boolean;
  editable?: boolean;
  onChange?: (v: string) => void;
}) {
  const [copied, setCopied] = useState(false);

  if (loading) {
    return (
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
          Generating with Lovable AI…
        </div>
      </div>
    );
  }

  if (!content) return null;

  const copy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="rounded-xl border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b px-4 py-2">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          AI Output
        </span>
        <Button variant="ghost" size="sm" onClick={copy}>
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          <span className="ml-1.5 text-xs">{copied ? "Copied" : "Copy"}</span>
        </Button>
      </div>
      <div className="p-5">
        {editable && onChange ? (
          <textarea
            value={content}
            onChange={(e) => onChange(e.target.value)}
            className="min-h-[260px] w-full resize-y bg-transparent text-sm leading-relaxed outline-none"
          />
        ) : (
          <div className="prose prose-sm max-w-none text-foreground prose-headings:text-foreground prose-strong:text-foreground prose-a:text-primary">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}

export function ResponsibleAINotice() {
  return (
    <p className="mt-6 rounded-lg border border-dashed bg-muted/40 p-3 text-xs text-muted-foreground">
      <strong className="text-foreground">Responsible AI:</strong> Outputs are AI-generated and
      may contain inaccuracies. Always review for sensitive information, bias, and accuracy
      before sharing or acting on suggestions.
    </p>
  );
}
