import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  FileText,
  Brain,
  Map as MapIcon,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { AppLayout } from "@/components/shared/AppLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { DashboardCard } from "@/components/shared/DashboardCard";
import { api } from "@/lib/api";
import { auth } from "@/lib/auth";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
});

type Stats = {
  documents?: number;
  quizzes_taken?: number;
  average_score?: number;
  roadmap_progress?: number;
  suggestions?: string[];
  recent_activity?: { title: string; time?: string }[];
};

function DashboardPage() {
  return (
    <AppLayout>
      <Dashboard />
    </AppLayout>
  );
}

function Dashboard() {
  const user = auth.getUser();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api
      .getDashboardStats()
      .then((data) => {
        if (!cancelled) setStats(data ?? {});
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const cards = [
    {
      title: "Uploaded Documents",
      value: stats?.documents ?? 0,
      icon: FileText,
      description: "PDFs in your knowledge base",
    },
    {
      title: "Quizzes Taken",
      value: stats?.quizzes_taken ?? 0,
      icon: Brain,
      description: "Your practice attempts so far",
    },
    {
      title: "Average Score",
      value: `${stats?.average_score ?? 0}%`,
      icon: Sparkles,
      description: "Across all completed quizzes",
    },
    {
      title: "Roadmap Progress",
      value: `${stats?.roadmap_progress ?? 0}%`,
      icon: MapIcon,
      description: "Steps completed in your plan",
    },
  ];

  return (
    <>
      <PageHeader
        title={`Welcome back, ${user?.name ?? "there"}`}
        description="Here's a snapshot of your learning journey."
      />

      {error && (
        <div className="mb-6 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          Could not load dashboard stats: {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-32 rounded-2xl shimmer" />
            ))
          : cards.map((c, i) => (
              <DashboardCard key={c.title} index={i} {...c} />
            ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-8">
        <div className="lg:col-span-2 glass border border-border rounded-2xl p-5">
          <h3 className="font-medium mb-4">AI suggestions</h3>
          {loading ? (
            <div className="space-y-2">
              <div className="h-4 rounded shimmer" />
              <div className="h-4 rounded shimmer w-3/4" />
            </div>
          ) : stats?.suggestions && stats.suggestions.length > 0 ? (
            <ul className="space-y-2.5">
              {stats.suggestions.map((s, i) => (
                <li key={i} className="flex gap-3 text-sm">
                  <Sparkles className="size-4 text-primary mt-0.5 shrink-0" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">
              Generate a roadmap or take a quiz to receive personalized AI suggestions.
            </p>
          )}
          <div className="mt-5 flex flex-wrap gap-2">
            <QuickLink to="/roadmap" label="Generate Roadmap" />
            <QuickLink to="/quiz" label="Take a Quiz" />
            <QuickLink to="/chat" label="Ask AI Mentor" />
          </div>
        </div>

        <div className="glass border border-border rounded-2xl p-5">
          <h3 className="font-medium mb-4">Recent activity</h3>
          {loading ? (
            <div className="space-y-2">
              <div className="h-4 rounded shimmer" />
              <div className="h-4 rounded shimmer w-2/3" />
            </div>
          ) : stats?.recent_activity && stats.recent_activity.length > 0 ? (
            <ul className="space-y-3">
              {stats.recent_activity.map((a, i) => (
                <li key={i} className="text-sm">
                  <p>{a.title}</p>
                  {a.time && (
                    <p className="text-xs text-muted-foreground">{a.time}</p>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">
              Nothing yet. Your recent quizzes, uploads and chats will appear here.
            </p>
          )}
        </div>
      </div>
    </>
  );
}

function QuickLink({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to as any}
      className="inline-flex items-center gap-1.5 rounded-xl border border-border px-3 py-1.5 text-xs hover:border-primary/40 hover:text-primary transition-colors"
    >
      {label} <ArrowRight className="size-3" />
    </Link>
  );
}
