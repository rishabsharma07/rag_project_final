import { motion } from "framer-motion";
import { FileText, Trash2 } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";

export type UploadedFile = {
  id: string | number;
  name: string;
  size?: number;
};

export function UploadedFiles({
  files,
  onDelete,
}: {
  files: UploadedFile[];
  onDelete?: (id: string | number) => void;
}) {
  if (files.length === 0) {
    return (
      <EmptyState
        icon={FileText}
        title="No files yet"
        description="Upload your first PDF to enable RAG-powered chat with your notes."
      />
    );
  }

  return (
    <ul className="space-y-2">
      {files.map((f, i) => (
        <motion.li
          key={f.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: i * 0.04 }}
          className="glass border border-border rounded-xl px-4 py-3 flex items-center gap-3"
        >
          <FileText className="size-5 text-primary shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{f.name}</p>
            {f.size !== undefined && (
              <p className="text-xs text-muted-foreground">
                {(f.size / 1024).toFixed(1)} KB
              </p>
            )}
          </div>
          {onDelete && (
            <button
              onClick={() => onDelete(f.id)}
              className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
              aria-label="Delete"
            >
              <Trash2 className="size-4" />
            </button>
          )}
        </motion.li>
      ))}
    </ul>
  );
}
