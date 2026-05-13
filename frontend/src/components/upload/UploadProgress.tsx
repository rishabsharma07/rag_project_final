import { motion } from "framer-motion";

export function UploadProgress({ value }: { value: number }) {
  return (
    <div className="glass border border-border rounded-xl p-4 space-y-2">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Uploading...</span>
        <span>{value}%</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <motion.div
          className="h-full gradient-primary"
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  );
}
