import { motion } from "framer-motion";
import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

export type ChatRole = "user" | "assistant";

export function ChatMessage({
  role,
  content,
}: {
  role: ChatRole;
  content: string;
}) {
  const isUser = role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={cn("flex gap-3 w-full", isUser ? "justify-end" : "justify-start")}
    >
      {!isUser && (
        <div className="size-8 rounded-full gradient-primary flex items-center justify-center shrink-0">
          <Bot className="size-4 text-primary-foreground" />
        </div>
      )}
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap",
          isUser
            ? "bg-primary text-primary-foreground rounded-br-md"
            : "glass border border-border rounded-bl-md",
        )}
      >
        {content}
      </div>
      {isUser && (
        <div className="size-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
          <User className="size-4" />
        </div>
      )}
    </motion.div>
  );
}
