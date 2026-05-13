import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
}: {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="glass border border-border rounded-2xl p-10 flex flex-col items-center text-center">
      <div className="size-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
        <Icon className="size-7 text-primary" />
      </div>
      <h3 className="font-medium">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground mt-1.5 max-w-sm">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
