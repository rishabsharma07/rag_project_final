import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Sparkles,
  Map,
  Brain,
  Upload,
  MessageSquare,
  ArrowRight,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: Landing,
});

const FEATURES = [
  { icon: Map, title: "AI Roadmaps", desc: "Personalized step-by-step learning plans for any role." },
  { icon: Brain, title: "Adaptive Quizzes", desc: "Generate MCQs by topic and difficulty in seconds." },
  { icon: Upload, title: "PDF Knowledge", desc: "Upload notes & documents to ground your AI mentor." },
  { icon: MessageSquare, title: "RAG Chatbot", desc: "Ask anything — answers grounded in your own material." },
];

function Landing() {
  return (
    <div className="min-h-screen">
      <header className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="size-9 rounded-xl gradient-primary flex items-center justify-center glow-shadow">
            <Sparkles className="size-5 text-primary-foreground" />
          </div>
          <span className="font-semibold">AI Career Copilot</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground">
            Login
          </Link>
          <Link
            to="/signup"
            className="text-sm gradient-primary text-primary-foreground rounded-xl px-4 py-2 hover:scale-[1.03] transition-transform"
          >
            Sign up
          </Link>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 pt-16 pb-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full glass border border-primary/30 text-primary mb-6">
            <Sparkles className="size-3" />
            AI-powered learning mentor
          </span>
          <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight">
            Your <span className="gradient-text">personal AI mentor</span>
            <br /> for landing the next role.
          </h1>
          <p className="text-muted-foreground mt-6 max-w-xl mx-auto text-base sm:text-lg">
            Generate roadmaps, quiz yourself, and chat with an AI grounded in your
            own notes — all in one polished workspace.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link
              to="/signup"
              className="gradient-primary text-primary-foreground rounded-xl px-6 py-3 inline-flex items-center gap-2 font-medium hover:scale-[1.03] transition-transform glow-shadow"
            >
              Get started <ArrowRight className="size-4" />
            </Link>
            <Link
              to="/login"
              className="rounded-xl px-6 py-3 border border-border hover:border-primary/40 transition-colors text-sm"
            >
              I have an account
            </Link>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-20 text-left">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.1 + i * 0.07 }}
              className="glass border border-border rounded-2xl p-5 hover:border-primary/40 transition-colors"
            >
              <div className="size-10 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center mb-3">
                <f.icon className="size-5 text-primary" />
              </div>
              <h3 className="font-medium">{f.title}</h3>
              <p className="text-sm text-muted-foreground mt-1.5">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
