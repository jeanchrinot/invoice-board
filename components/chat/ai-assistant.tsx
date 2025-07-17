"use client";

import React, { useEffect, useState } from "react";
import { useChat } from "@ai-sdk/react";
import clsx from "clsx";
import { Eye } from "lucide-react";

import { Invoice } from "@/lib/llm/invoice-schema";

import ChatUI from "./chat-ui";
import InvoicePreview from "./invoice-preview";

const AIAssistant = () => {
  const [mobileTab, setMobileTab] = useState<"chat" | "preview">("chat");
  const [currentInvoice, setCurrentInvoice] = useState(null);
  const [invoiceDraft, setInvoiceDraft] = useState<Partial<Invoice> | null>(
    null,
  );
  const [isGenerating, setIsGenerating] = useState(false);

  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: "/api/assistant",
      maxSteps: 10,
      // initialMessages: [
      //   {
      //     id: "initial-message",
      //     role: "assistant",
      //     content:
      //       "Hello! I'm your magical Invoice AI Assistant! ✨ I can create stunning invoices in seconds. Just tell me what you need!",
      //   },
      // ],
      // Pass invoiceDraft as part of the API request
      body: {
        draft: invoiceDraft,
      },
      //   // Handle tool calls and text responses
      //   onResponse: async (response) => {
      //     const data = await response.json();
      //     console.log("data", data);
      //     const { toolResults, text } = data;

      //     if (toolResults) {
      //       for (const toolResult of toolResults) {
      //         if (toolResult.result.invoice) {
      //           // Complete invoice
      //           setCurrentInvoice(toolResult.result.invoice);
      //           setInvoiceDraft(null);
      //           setIsGenerating(false);
      //         } else if (toolResult.result.draft) {
      //           // Partial draft
      //           setInvoiceDraft((prev) => ({
      //             ...prev,
      //             ...toolResult.result.draft,
      //           }));
      //           setIsGenerating(false);
      //         }
      //       }
      //     }
      //   },
      //   onError: (error) => {
      //     console.error("Error processing message:", error);
      //     // Note: useChat automatically appends error messages to the messages array
      //   },
    });

  //   const { messages, input, handleInputChange, handleSubmit, isLoading } =
  //     useChat({ maxSteps: 10 });

  const handleVoiceRecord = (isRecording: boolean) => {
    console.log("Voice recording:", isRecording);
  };

  useEffect(() => {
    // Process the latest message for tool invocation results in parts
    const latestMessage = messages[messages.length - 1];
    if (latestMessage?.role === "assistant" && latestMessage.parts) {
      setIsGenerating(false);
      for (const part of latestMessage.parts) {
        if (
          part.type === "tool-invocation" &&
          part.toolInvocation.state === "result" &&
          part.toolInvocation.result
        ) {
          if (part.toolInvocation.result.invoice) {
            // Complete invoice
            setCurrentInvoice(part.toolInvocation.result.invoice);
            setInvoiceDraft(null);
          } else if (part.toolInvocation.result.draft) {
            // Partial draft
            setInvoiceDraft((prev) => ({
              ...prev,
              ...part.toolInvocation.result.draft,
              // Merge items array correctly
              items: part.toolInvocation.result.draft.items
                ? [
                    ...(prev?.items || []),
                    ...part.toolInvocation.result.draft.items,
                  ]
                : prev?.items,
            }));
          }
        }
      }
    }

    // Error handling: Check for error-like content in the latest message
    //   if (latestMessage?.role === "assistant" && latestMessage.content.toLowerCase().includes("error")) {
    //     setError("Oops, something went wrong! Please try again or provide more details.");
    //   }
  }, [messages]);

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
            isAuthenticated={true}
            userName="Sarah"
            onSendMessage={handleSubmit}
            onVoiceRecord={handleVoiceRecord}
            messages={messages}
            input={input}
            handleInputChange={handleInputChange}
            isLoading={isLoading}
          />
        </div>

        <div
          className={clsx(
            "h-full w-full p-6 md:w-1/2",
            mobileTab !== "preview" && "hidden md:block",
          )}
        >
          <div className="h-full">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-xl font-semibold text-transparent">
                Invoice Preview
              </h2>
              {currentInvoice && (
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <Eye className="h-4 w-4" />
                  <span>Live Preview</span>
                </div>
              )}
            </div>
            <InvoicePreview
              invoice={currentInvoice}
              isGenerating={isGenerating}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
