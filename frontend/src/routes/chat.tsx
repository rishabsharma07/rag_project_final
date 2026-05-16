import {
  useEffect,
  useRef,
  useState
} from "react";

import {
  createFileRoute
} from "@tanstack/react-router";

import {
  toast
} from "sonner";

import {
  Sparkles
} from "lucide-react";

import {
  AppLayout
} from "@/components/shared/AppLayout";

import {
  ChatMessage,
  type ChatRole
} from "@/components/chat/ChatMessage";

import {
  ChatInput
} from "@/components/chat/ChatInput";

import {
  ChatSidebar,
  type ChatDoc
} from "@/components/chat/ChatSidebar";

import {
  TypingIndicator
} from "@/components/chat/TypingIndicator";

import {
  api
} from "@/lib/api";

import {
  auth
} from "@/lib/auth";

export const Route =
  createFileRoute("/chat")({

    component: () => (

      <AppLayout>
        <ChatPage />
      </AppLayout>

    ),
  });

type Msg = {

  role: ChatRole;

  content: string;
};

function ChatPage() {

  const user =
    auth.getUser();

  // ---------------- CHAT MESSAGES ---------------- //

  const [messages, setMessages] =
    useState<Msg[]>([
      {
        role: "assistant",

        content:
          `Hi ${user?.name ?? "there"} 👋 ` +
          `I'm your AI mentor. ` +
          `Ask me anything — I can ground answers in PDFs you've uploaded.`,
      },
    ]);

  // ---------------- CHAT STATE ---------------- //

  const [sending, setSending] =
    useState(false);

  // ---------------- DOCUMENTS ---------------- //

  const [docs, setDocs] =
    useState<ChatDoc[]>([]);

  // ---------------- SCROLL REF ---------------- //

  const scrollRef =
    useRef<HTMLDivElement>(null);

  // ---------------- AUTO SCROLL ---------------- //

  useEffect(() => {

    scrollRef.current?.scrollTo({

      top:
        scrollRef.current
          .scrollHeight,

      behavior:
        "smooth",
    });

  }, [messages, sending]);

  // ---------------- LOAD CHAT HISTORY ---------------- //

  useEffect(() => {

    api.getChatHistory()

      .then((data) => {

        if (

          data?.messages &&

          data.messages.length > 0
        ) {

          setMessages(
            data.messages as Msg[]
          );
        }

      })

      .catch(console.error);

  }, []);

  // ---------------- LOAD DOCUMENTS ---------------- //

  useEffect(() => {

    api.getDocuments()

      .then((data) => {

        if (data) {

          const formattedDocs =
            data.map((doc) => ({

              id: doc.id,

              name: doc.filename,
            }));

          setDocs(
            formattedDocs
          );
        }

      })

      .catch(console.error);

  }, []);

  // ---------------- SEND MESSAGE ---------------- //

  const send =
    async (
      text: string
    ) => {

      // USER MESSAGE

      setMessages((prev) => [

        ...prev,

        {
          role: "user",

          content: text,
        },
      ]);

      setSending(true);

      try {

        const res =
          await api.sendChatMessage(
            text
          );

        const reply =

          (
            typeof res ===
              "string" && res
          ) ||

          res?.response ||

          "(no response)";

        // AI RESPONSE

        setMessages((prev) => [

          ...prev,

          {
            role: "assistant",

            content:
              String(reply),
          },
        ]);

      } catch (err: any) {

        toast.error(

          err?.message ||

          "Chat failed"
        );

        setMessages((prev) => [

          ...prev,

          {
            role: "assistant",

            content:
              "Sorry — I couldn't reach the AI service. Please try again.",
          },
        ]);

      } finally {

        setSending(false);
      }
    };

  return (

    <div className="flex gap-6 h-[calc(100vh-8rem)]">

      {/* SIDEBAR */}

      <ChatSidebar
        docs={docs}
      />

      {/* CHAT AREA */}

      <div className="flex-1 flex flex-col glass border border-border rounded-2xl overflow-hidden">

        {/* HEADER */}

        <div className="px-5 py-3 border-b border-border flex items-center gap-2">

          <Sparkles className="size-4 text-primary" />

          <span className="font-medium text-sm">

            AI Mentor

          </span>

        </div>

        {/* CHAT MESSAGES */}

        <div
          ref={scrollRef}

          className="flex-1 overflow-y-auto p-5 space-y-4"
        >

          {messages.map(
            (m, i) => (

              <ChatMessage
                key={i}

                role={m.role}

                content={m.content}
              />

            )
          )}

          {sending && (
            <TypingIndicator />
          )}

        </div>

        {/* INPUT */}

        <div className="p-3 border-t border-border">

          <ChatInput
            onSend={send}

            disabled={sending}
          />

        </div>

      </div>

    </div>
  );
}