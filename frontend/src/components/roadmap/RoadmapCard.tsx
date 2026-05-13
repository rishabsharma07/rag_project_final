import { motion } from "framer-motion";
import { CheckCircle2, Circle } from "lucide-react";

export type RoadmapStep = {
  title: string;
  description?: string;
  done?: boolean;
};

export function RoadmapCard({
  step,
  index,
  onToggle,
}: {
  step: RoadmapStep;
  index: number;
  onToggle?: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="glass border border-border rounded-2xl p-5 flex gap-4 hover:border-primary/40 transition-colors"
    >
      <button
        onClick={onToggle}
        className="shrink-0 mt-0.5"
        aria-label={step.done ? "Mark incomplete" : "Mark complete"}
      >
        {step.done ? (
          <CheckCircle2 className="size-6 text-primary" />
        ) : (
          <Circle className="size-6 text-muted-foreground hover:text-primary transition-colors" />
        )}
      </button>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <span className="text-xs text-muted-foreground">Step {index + 1}</span>
        </div>
        <h3 className={`font-medium mt-1 ${step.done ? "line-through text-muted-foreground" : ""}`}>
          {step.title}
        </h3>
        {step.description && (
          <p className="text-sm text-muted-foreground mt-1.5 whitespace-pre-wrap">
            {step.description}
          </p>
        )}
      </div>
    </motion.div>
  );
}
