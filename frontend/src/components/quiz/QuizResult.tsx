import { RotateCcw } from "lucide-react";
import { QuizScore } from "./QuizScore";

export function QuizResult({
  score,
  total,
  onRetry,
}: {
  score: number;
  total: number;
  onRetry: () => void;
}) {
  return (
    <div className="glass border border-border rounded-2xl p-8 space-y-6">
      <QuizScore score={score} total={total} />
      <div className="flex justify-center">
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 gradient-primary text-primary-foreground rounded-xl px-5 py-2.5 text-sm font-medium hover:scale-[1.02] active:scale-[0.98] transition-transform"
        >
          <RotateCcw className="size-4" />
          New quiz
        </button>
      </div>
    </div>
  );
}
