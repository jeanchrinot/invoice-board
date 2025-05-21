"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useInvoiceDraftStore } from "@/stores/invoiceStore";
import { useChat } from "@ai-sdk/react";
import { MessageCircle, X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

import { cn } from "@/lib/utils";

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

  const { invoiceId, setInvoiceId, fetchDraft } = useInvoiceDraftStore();

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
  }, [messages]);

  // useEffect(() => {
  //   if (isDraftComplete && !isDraftPreviewed && invoiceId) {
  //     router.push(`/dashboard/invoice/${invoiceId}`);
  //     setIsDraftPreviewed(true);
  //   }
  // }, [isDraftComplete, isDraftPreviewed, invoiceId]);

  useEffect(() => {
    if (invoiceId) {
      fetchDraft();
      const invoicePreviewUrl = `/dashboard/invoice/${invoiceId}`;
      if (pathname !== invoicePreviewUrl) {
        router.push(invoicePreviewUrl);
      }
    }
  }, [draftLastUpdated, invoiceId]);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="flex h-[500px] w-[350px] flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-700 dark:bg-zinc-900">
          {/* Header */}
          <div className="flex items-center justify-between border-b p-4 dark:border-zinc-800">
            <h2 className="text-lg font-semibold">AI Assistant</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              <X className="h-5 w-5" />
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
                              children={part.text}
                              remarkPlugins={[remarkGfm]}
                              rehypePlugins={[rehypeRaw, rehypeHighlight]}
                            />
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
                className="flex-1 rounded-full border border-zinc-300 px-3 py-2 text-sm focus:outline-none dark:border-zinc-700 dark:bg-zinc-800"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="rounded-full bg-blue-600 px-3 py-2 text-sm text-white transition hover:bg-blue-700"
              >
                {isLoading ? "..." : "Send"}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="rounded-full bg-blue-600 p-3 text-white shadow-lg transition hover:bg-blue-700"
          aria-label="Open Chat"
        >
          <MessageCircle className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
