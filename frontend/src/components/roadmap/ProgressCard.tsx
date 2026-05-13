import { motion } from "framer-motion";

export function ProgressCard({ done, total }: { done: number; total: number }) {
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  return (
    <div className="glass border border-border rounded-2xl p-5">
      <div className="flex items-baseline justify-between mb-3">
        <h3 className="font-medium">Roadmap progress</h3>
        <span className="text-sm text-muted-foreground">
          {done}/{total} steps
        </span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="h-full gradient-primary"
        />
      </div>
      <p className="text-xs text-muted-foreground mt-2">{pct}% complete</p>
    </div>
  );
}
