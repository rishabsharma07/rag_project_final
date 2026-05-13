import { useState, type FormEvent, type KeyboardEvent } from "react";
import { Send } from "lucide-react";

export function ChatInput({
  onSend,
  disabled,
}: {
  onSend: (text: string) => void;
  disabled?: boolean;
}) {
  const [value, setValue] = useState("");

  const submit = (e?: FormEvent) => {
    e?.preventDefault();
    const text = value.trim();
    if (!text || disabled) return;
    onSend(text);
    setValue("");
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <form
      onSubmit={submit}
      className="glass border border-border rounded-2xl p-2 flex items-end gap-2"
    >
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Ask your AI mentor anything..."
        rows={1}
        className="flex-1 resize-none bg-transparent px-3 py-2 outline-none text-sm placeholder:text-muted-foreground max-h-40"
      />
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        className="size-10 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 active:scale-95 transition-transform"
        aria-label="Send"
      >
        <Send className="size-4" />
      </button>
    </form>
  );
}
