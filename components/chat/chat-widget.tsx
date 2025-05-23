"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useInvoiceDraftStore } from "@/stores/invoiceStore";
import { useChat } from "@ai-sdk/react";
import { MessageCircle, Send, X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

import { cn } from "@/lib/utils";

import VoiceRecorder from "./voice-recorder";

export default function ChatWidget() {
  const router = useRouter();
  const pathname = usePathname();
  // const { invoiceId } = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const [draftLastUpdated, setDraftLastUpdated] = useState();
  // const [currentInvoiceId, setCurrentInvoiceId] = useState(false);
  // const [isDraftComplete, setIsDraftComplete] = useState(false);
  // const [isDraftPreviewed, setIsDraftPreviewed] = useState(false);
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({ maxSteps: 10 });

  const {
    invoiceId,
    transcript,
    setTranscript,
    setInvoiceId,
    fetchDraft,
    fetchAllDrafts,
  } = useInvoiceDraftStore();

  const bottomRef = useRef<HTMLDivElement | null>(null);

  const hasFetchedDraft = useRef(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });

    if (hasFetchedDraft.current) return; // prevent repeated calls

    for (const message of messages) {
      for (const part of message.parts) {
        if (part.type === "tool-invocation") {
          const toolInvocation = part.toolInvocation as any;

          if (
            toolInvocation.result?.isDraftComplete &&
            toolInvocation.result?.invoiceId
          ) {
            const newInvoiceId = toolInvocation.result.invoiceId;
            setInvoiceId(newInvoiceId);
            setDraftLastUpdated(toolInvocation.result?.lastUpdated);
            return;
          }
        }
      }
    }
  }, [messages, setInvoiceId, setDraftLastUpdated]);

  useEffect(() => {
    if (transcript.trim()) {
      // Manually update input state
      const fakeEvent = {
        target: { value: transcript },
      } as unknown as React.ChangeEvent<HTMLInputElement>;

      handleInputChange(fakeEvent);

      // Wait a moment to ensure input state is updated
      setTimeout(() => {
        handleSubmit(new Event("submit"));
        setTranscript(""); // Clear after submit to avoid resubmission
      }, 100); // 100ms delay to ensure state updates before submit
    }
  }, [transcript, handleSubmit]);

  useEffect(() => {
    fetchAllDrafts();
    if (invoiceId) {
      fetchDraft();
    }
  }, [draftLastUpdated, invoiceId, fetchDraft, fetchAllDrafts]);

  return (
    <div className="relative">
      {isOpen ? (
        <div className="fixed bottom-0 right-0 z-50 flex h-[97vh] max-h-screen w-screen flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-700 dark:bg-zinc-900 md:bottom-4 md:right-4 md:h-[550px] md:w-[350px]">
          {/* Header */}
          <div className="relative flex items-center justify-between border-b p-4 dark:border-zinc-800">
            <div>
              <h2 className="text-lg font-semibold">AI Assistant</h2>
              <span className="text-xs">
                {`👋 Hi, I'm your AI assistant. You can ask me to create a new
                invoice, update, or manage an existing one.`}
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-1 top-1 rounded-full p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-3 overflow-y-auto px-3 py-2">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex",
                  message.role === "user" ? "justify-end" : "justify-start",
                )}
              >
                <div
                  className={cn(
                    "max-w-[75%] rounded-2xl px-4 py-2 text-sm shadow",
                    message.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100",
                  )}
                >
                  {message.parts.map((part, i) => {
                    switch (part.type) {
                      case "text":
                        return (
                          <div key={`${message.id}-${i}`}>
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm]}
                              rehypePlugins={[rehypeRaw, rehypeHighlight]}
                              components={{
                                a: ({ node, ...props }) => (
                                  <a
                                    {...props}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 underline hover:text-blue-800"
                                  />
                                ),
                              }}
                            >
                              {part.text}
                            </ReactMarkdown>
                          </div>
                        );
                      // case "tool-invocation":
                      //   return (
                      //     <pre key={`${message.id}-${i}`} className="text-xs">
                      //       {JSON.stringify(part.toolInvocation, null, 2)}
                      //     </pre>
                      //   );
                      default:
                        return null;
                    }
                  })}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="border-t bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="flex items-center space-x-2">
              <input
                value={input}
                onChange={handleInputChange}
                placeholder="Type a message..."
                className="flex-1 rounded-md border border-zinc-300 px-3 py-2 text-sm focus:outline-none dark:border-zinc-700 dark:bg-zinc-800"
              />
              <VoiceRecorder />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="rounded-md bg-blue-600 px-2 py-2 text-sm text-white transition hover:bg-blue-700"
              >
                <Send className="size-5" />
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="fixed bottom-4 right-4 z-50">
          <span
            className="absolute -top-5 right-0 w-[200px] text-xs"
            onClick={() => setIsOpen(true)}
          >
            {`👋 Hi, I'm your AI assistant.`}
          </span>
          <button
            onClick={() => setIsOpen(true)}
            className="rounded-full bg-blue-600 p-3 text-white shadow-lg transition hover:bg-blue-700"
            aria-label="Open Chat"
          >
            <MessageCircle className="size-5" />
          </button>
        </div>
      )}
    </div>
  );
}
