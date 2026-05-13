import { useRef, useState, type DragEvent } from "react";
import { UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";

export function UploadBox({
  onFile,
  disabled,
}: {
  onFile: (file: File) => void;
  disabled?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);

  const handleFiles = (files?: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      alert("Only PDF files are supported.");
      return;
    }
    onFile(file);
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDrag(false);
    if (disabled) return;
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setDrag(true);
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={onDrop}
      onClick={() => !disabled && inputRef.current?.click()}
      className={cn(
        "glass border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all",
        drag ? "border-primary bg-primary/10" : "border-border hover:border-primary/40",
        disabled && "opacity-60 cursor-not-allowed",
      )}
    >
      <div className="size-14 mx-auto rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center mb-4">
        <UploadCloud className="size-7 text-primary" />
      </div>
      <p className="font-medium">Drop your PDF here</p>
      <p className="text-sm text-muted-foreground mt-1">
        or click to browse — PDF only
      </p>
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
