import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function DashboardCard({
  title,
  value,
  description,
  icon: Icon,
  index = 0,
  className,
  children,
}: {
  title: string;
  value?: string | number;
  description?: string;
  icon?: LucideIcon;
  index?: number;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      whileHover={{ y: -2 }}
      className={cn(
        "glass card-shadow rounded-2xl p-5 border border-border",
        "hover:border-primary/40 transition-colors",
        className,
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            {title}
          </p>
          {value !== undefined && (
            <p className="text-3xl font-semibold mt-2 gradient-text">{value}</p>
          )}
          {description && (
            <p className="text-xs text-muted-foreground mt-2">{description}</p>
          )}
        </div>
        {Icon && (
          <div className="size-10 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center">
            <Icon className="size-5 text-primary" />
          </div>
        )}
      </div>
      {children}
    </motion.div>
  );
}
