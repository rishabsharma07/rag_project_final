import { FileText } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";

export type ChatDoc = { id: string | number; name: string };

export function ChatSidebar({ docs }: { docs: ChatDoc[] }) {
  return (
    <aside className="hidden lg:flex flex-col w-72 shrink-0 glass border border-border rounded-2xl p-4 h-full">
      <h3 className="text-xs uppercase tracking-wide text-muted-foreground mb-3">
        Your Documents
      </h3>
      {docs.length === 0 ? (
        <div className="flex-1 flex items-center">
          <EmptyState
            icon={FileText}
            title="No documents yet"
            description="Upload a PDF to ground your AI mentor in your own notes."
          />
        </div>
      ) : (
        <ul className="space-y-1.5 overflow-auto">
          {docs.map((d) => (
            <li
              key={d.id}
              className="flex items-center gap-2 rounded-xl px-3 py-2 hover:bg-muted text-sm"
            >
              <FileText className="size-4 text-primary shrink-0" />
              <span className="truncate">{d.name}</span>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
