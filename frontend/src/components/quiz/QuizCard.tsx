import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export type QuizQuestion = {
  question: string;
  options: string[];
  answer: string; // correct option text or letter
};

export function QuizOption({
  label,
  text,
  selected,
  correct,
  revealed,
  onClick,
}: {
  label: string;
  text: string;
  selected?: boolean;
  correct?: boolean;
  revealed?: boolean;
  onClick?: () => void;
}) {
  const showCorrect = revealed && correct;
  const showWrong = revealed && selected && !correct;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={revealed}
      className={cn(
        "w-full text-left rounded-xl border px-4 py-3 flex gap-3 items-start transition-all",
        "hover:border-primary/40 disabled:cursor-default",
        selected && !revealed && "border-primary bg-primary/10",
        !selected && "border-border bg-muted/40",
        showCorrect && "border-green-500/60 bg-green-500/10",
        showWrong && "border-destructive/60 bg-destructive/10",
      )}
    >
      <span className="size-7 rounded-lg bg-secondary text-xs font-semibold flex items-center justify-center shrink-0">
        {label}
      </span>
      <span className="text-sm leading-relaxed">{text}</span>
    </button>
  );
}

export function QuizCard({
  question,
  index,
  total,
  selected,
  revealed,
  onSelect,
}: {
  question: QuizQuestion;
  index: number;
  total: number;
  selected?: string;
  revealed?: boolean;
  onSelect: (option: string) => void;
}) {
  return (
    <motion.div
      key={index}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="glass border border-border rounded-2xl p-6 space-y-5"
    >
      <div className="flex items-baseline justify-between">
        <span className="text-xs uppercase tracking-wide text-muted-foreground">
          Question {index + 1} of {total}
        </span>
      </div>
      <h2 className="text-lg sm:text-xl font-medium leading-snug">
        {question.question}
      </h2>
      <div className="space-y-2.5">
        {question.options.map((opt, i) => {
          const label = String.fromCharCode(65 + i);
          const isCorrect =
            opt === question.answer ||
            label === question.answer ||
            opt.startsWith(question.answer);
          return (
            <QuizOption
              key={i}
              label={label}
              text={opt}
              selected={selected === opt}
              correct={isCorrect}
              revealed={revealed}
              onClick={() => onSelect(opt)}
            />
          );
        })}
      </div>
    </motion.div>
  );
}
