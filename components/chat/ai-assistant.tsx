"use client";

import React, { useEffect, useState } from "react";
import { useAssistantStore } from "@/stores/assistantStore";
import { useChat } from "@ai-sdk/react";
import clsx from "clsx";
import { Eye } from "lucide-react";
import { nanoid } from "nanoid";

// import { Invoice } from "@/lib/llm/invoice-schema";

import ChatUI from "./chat-ui";
import InvoicePreview from "./invoice-preview";

const AIAssistant = () => {
  const [mobileTab, setMobileTab] = useState<"chat" | "preview">("chat");
  // const [currentInvoice, setCurrentInvoice] = useState(null);
  // const [invoiceDraft, setInvoiceDraft] = useState<Partial<Invoice> | null>(
  //   null,
  // );
  // const [isGenerating, setIsGenerating] = useState(false);

  const {
    messages: storedMessages,
    setMessages,
    invoiceDraft,
    conversationId,
    setInvoiceDraft,
    mergeInvoiceDraft,
    setCurrentInvoice,
    setIsGenerating,
    addTokens,
    incrementInvoicesCreated,
    appendMessage,
    currentInvoice,
    isInvoiceLimitReached,
    isTokenLimitReached,
    usage,
  } = useAssistantStore();

  // const {
  //   messages,
  //   input,
  //   handleInputChange,
  //   handleSubmit,
  //   isLoading,
  //   status,
  // } = useChat({
  //   api: "/api/assistant",
  //   maxSteps: 10,
  //   // initialMessages: [
  //   //   {
  //   //     id: "initial-message",
  //   //     role: "assistant",
  //   //     content:
  //   //       "Hello! I'm your magical Invoice AI Assistant! ✨ I can create stunning invoices in seconds. Just tell me what you need!",
  //   //   },
  //   // ],
  //   // Pass invoiceDraft as part of the API request
  //   body: {
  //     draft: invoiceDraft,
  //   },
  //   onFinish: (message,options) => {
  //     console.log("message", message);
  //     console.log("options",options); // I need to store and track options.usage.totalTokens
  //     if (message?.role === "assistant" && message.parts) {
  //       setIsGenerating(false);
  //       for (const part of message.parts) {
  //         if (
  //           part.type === "tool-invocation" &&
  //           part.toolInvocation.state === "result" &&
  //           part.toolInvocation.result
  //         ) {
  //           if (part.toolInvocation.result.invoice) {
  //             setIsGenerating(true);

  //             const timeout = setTimeout(() => {
  //               // Complete invoice
  //               setCurrentInvoice(part.toolInvocation.result.invoice);
  //               setInvoiceDraft(null);
  //               setIsGenerating(false);
  //             }, 3000); // 3 seconds

  //             // Cleanup function to clear timeout if component unmounts or currentInvoice changes
  //             return () => clearTimeout(timeout);
  //           } else if (part.toolInvocation.result.draft) {
  //             // Partial draft
  //             setInvoiceDraft((prev) => ({
  //               ...prev,
  //               ...part.toolInvocation.result.draft,
  //               // Merge items array correctly
  //               items: part.toolInvocation.result.draft.items
  //                 ? [
  //                     ...(prev?.items || []),
  //                     ...part.toolInvocation.result.draft.items,
  //                   ]
  //                 : prev?.items,
  //             }));
  //             // setIsGenerating(true);
  //           }
  //         }
  //       }
  //     }
  //   },
  // });

  console.log("conversationId", conversationId);

  const {
    messages,
    input,
    setInput,
    append,
    handleInputChange,
    handleSubmit: originalHandleSubmit,
    isLoading,
    status,
  } = useChat({
    id: conversationId, // 👈 important for persistence
    initialMessages: storedMessages,
    api: "/api/assistant",
    maxSteps: 10,
    body: { draft: invoiceDraft },
    onFinish: (message, options) => {
      if (message?.id && message?.role && message?.content) {
        appendMessage({
          id: message.id,
          role: message.role,
          content: message.content,
        });
      }

      if (options?.usage?.totalTokens) {
        addTokens(options.usage.totalTokens);
      }

      if (options?.finishReason) {
        console.log("options?.finishReason", options?.finishReason);
      }

      if (message?.role === "assistant" && message.parts) {
        setIsGenerating(false);

        for (const part of message.parts) {
          if (
            part.type === "tool-invocation" &&
            part.toolInvocation.state === "result" &&
            part.toolInvocation.result
          ) {
            const result = part.toolInvocation.result;

            if (result.invoice) {
              setIsGenerating(true);
              const timeout = setTimeout(() => {
                setCurrentInvoice(result.invoice);
                // addInvoice(result.invoice);
                setInvoiceDraft(null);
                incrementInvoicesCreated(result.invoice.number);
                setIsGenerating(false);
              }, 3000);

              return () => clearTimeout(timeout);
            } else if (result.draft) {
              mergeInvoiceDraft(result.draft);
            }
          }
        }
      }
    },
  });

  // Custom handleSubmit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isTokenLimitReached()) return;
    if (!input.trim()) return;

    // Append user message to Zustand store before sending
    appendMessage({
      id: nanoid(),
      role: "user",
      content: input,
    });

    // Call the original useChat handleSubmit to actually send the message
    await originalHandleSubmit(e);
  };

  //   const { messages, input, handleInputChange, handleSubmit, isLoading } =
  //     useChat({ maxSteps: 10 });

  const handleVoiceRecord = (transcript: string) => {
    console.log("Voice recording:", transcript);
    setInput(transcript);
  };

  const handleQuickReply = (reply: string) => {
    if (isTokenLimitReached()) return;
    if (!reply.trim()) return;

    // Append user message to Zustand store before sending
    appendMessage({
      id: nanoid(),
      role: "user",
      content: reply,
    });

    append({
      role: "user",
      content: reply,
    });
  };

  useEffect(() => {
    console.log("messages", messages);
    // setMessages(messages); // Sync with your custom state
  }, [messages]);

  // useEffect(() => {
  //   // Process the latest message for tool invocation results in parts
  //   const latestMessage = messages[messages.length - 1];
  //   if (latestMessage?.role === "assistant" && latestMessage.parts) {
  //     setIsGenerating(false);
  //     for (const part of latestMessage.parts) {
  //       if (
  //         part.type === "tool-invocation" &&
  //         part.toolInvocation.state === "result" &&
  //         part.toolInvocation.result
  //       ) {
  //         if (part.toolInvocation.result.invoice) {
  //           // Complete invoice
  //           setCurrentInvoice(part.toolInvocation.result.invoice);
  //           setInvoiceDraft(null);
  //           // setIsGenerating(false);
  //         } else if (part.toolInvocation.result.draft) {
  //           // Partial draft
  //           setInvoiceDraft((prev) => ({
  //             ...prev,
  //             ...part.toolInvocation.result.draft,
  //             // Merge items array correctly
  //             items: part.toolInvocation.result.draft.items
  //               ? [
  //                   ...(prev?.items || []),
  //                   ...part.toolInvocation.result.draft.items,
  //                 ]
  //               : prev?.items,
  //           }));
  //           // setIsGenerating(true);
  //         }
  //       }
  //     }
  //   }

  //   // Error handling: Check for error-like content in the latest message
  //   //   if (latestMessage?.role === "assistant" && latestMessage.content.toLowerCase().includes("error")) {
  //   //     setError("Oops, something went wrong! Please try again or provide more details.");
  //   //   }
  // }, [messages]);

  // useEffect(() => {
  //   if (!currentInvoice) return;

  //   setIsGenerating(true);

  //   const timeout = setTimeout(() => {
  //     setIsGenerating(false);
  //   }, 3000); // 3 seconds

  //   // Cleanup function to clear timeout if component unmounts or currentInvoice changes
  //   return () => clearTimeout(timeout);
  // }, [currentInvoice]);

  const chatMessages = messages.length > 0 ? messages : storedMessages;

  return (
    <div className="h-screen overflow-hidden bg-background dark:bg-gradient-to-br dark:from-slate-900 dark:via-gray-900 dark:to-black dark:text-white">
      <div className="flex h-full flex-col md:flex-row">
        <div
          className={clsx(
            "h-full w-full border-r border-gray-300 dark:border-gray-700/50 md:w-1/2",
            mobileTab !== "chat" && "hidden md:block",
          )}
        >
          <ChatUI
            isAuthenticated={false}
            userName="Sarah"
            onSendMessage={handleSubmit}
            onVoiceRecord={handleVoiceRecord}
            onQuickReply={handleQuickReply}
            messages={chatMessages}
            input={input}
            handleInputChange={handleInputChange}
            isLoading={isLoading}
            status={status}
          />
        </div>

        <div
          className={clsx(
            "h-full w-full md:w-1/2",
            mobileTab !== "preview" && "hidden md:block",
          )}
        >
          <div className="h-full">
            {/* <div className="flex items-center justify-between px-6 py-3">
              <h2 className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-xl font-semibold text-transparent">
                Invoice Preview
              </h2>
              {currentInvoice && (
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <Eye className="h-4 w-4" />
                  <span>Live Preview</span>
                </div>
              )}
            </div> */}
            <InvoicePreview
            // invoice={currentInvoice}
            // isGenerating={isGenerating}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
