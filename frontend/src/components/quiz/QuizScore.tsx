import { motion } from "framer-motion";

export function QuizScore({ score, total }: { score: number; total: number }) {
  const pct = total === 0 ? 0 : Math.round((score / total) * 100);
  return (
    <div className="text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="text-6xl font-semibold gradient-text"
      >
        {pct}%
      </motion.div>
      <p className="text-muted-foreground mt-2">
        You scored {score} / {total}
      </p>
    </div>
  );
}
