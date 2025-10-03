"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAssistantStore } from "@/stores/assistantStore";
import { useChat } from "@ai-sdk/react";
import clsx from "clsx";
import { nanoid } from "nanoid";

import { useUser } from "@/hooks/use-user";

import ChatUI from "./chat-ui";
import InvoicePreview from "./invoice-preview";

const AIAssistant = () => {
  const [mobileTab, setMobileTab] = useState<"chat" | "preview">("chat");
  const { user } = useUser();
  const router = useRouter();
  const { usageLimit } = useUser();
  const [isSavingGuestInvoice, setIsSavingGuestInvoice] = useState(false);

  const isTokenLimitReached = useAssistantStore((s) =>
    s.isTokenLimitReached(usageLimit),
  );

  const {
    messages: storedMessages,
    currentInvoice,
    conversationId,
    setCurrentInvoice,
    mergeInvoice,
    setIsGenerating,
    addTokens,
    incrementInvoicesCreated,
    appendMessage,
  } = useAssistantStore();

  const params = useParams();
  const invoiceId = params?.invoiceId as string | undefined;

  console.log("conversationId", conversationId);

  const fetchInvoice = async (invoiceId: string) => {
    try {
      const response = await fetch(`/api/private/invoice/${invoiceId}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();

      console.log("invoice", data);
      if (data?.id) {
        setIsGenerating(true);
        setCurrentInvoice(data);
        const timeout = setTimeout(() => {
          // incrementInvoicesCreated(result.invoice.number);
          setIsGenerating(false);
        }, 2000);

        return () => clearTimeout(timeout);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const saveGuestInvoice = async () => {
    setIsSavingGuestInvoice(true);
    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        body: JSON.stringify({ draft: currentInvoice }),
      });
      if (res.ok) {
        const data = await res.json();
        console.log("saved data:", data);
        setCurrentInvoice(data);
        if (data.id) {
          //Redirect to invoice page
          router.push(`/ai-assistant/${data.id}`);
        }
      } else {
        console.log("Unable to save invoice:", res.status);
      }
    } catch (error) {
      console.log("unable to save invoice...", error);
    }
    setIsSavingGuestInvoice(false);
  };

  useEffect(() => {
    if (invoiceId) {
      fetchInvoice(invoiceId);
    }
  }, [invoiceId]);

  // Save invoice to database after guest is signed in
  useEffect(() => {
    if (
      user?.id &&
      currentInvoice &&
      !currentInvoice.id &&
      !invoiceId &&
      !isSavingGuestInvoice
    ) {
      saveGuestInvoice();
    }
  }, [user, currentInvoice, invoiceId, isSavingGuestInvoice]);

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
    body: { draft: currentInvoice },
    onFinish: (message, options) => {
      console.log("message", message);
      console.log("options", options);
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
              if (user?.id && result.invoice?.id) {
                //Redirect to invoice page
                router.push(`/ai-assistant/${result.invoice?.id}`);
              } else {
                setIsGenerating(true);
                const timeout = setTimeout(() => {
                  setCurrentInvoice(result.invoice);
                  // addInvoice(result.invoice);
                  // setInvoiceDraft(null);
                  incrementInvoicesCreated(result.invoice.number);
                  setIsGenerating(false);
                }, 2000);

                return () => clearTimeout(timeout);
              }
            } else if (result.draft) {
              if (user?.id && currentInvoice?.status == "COMPLETE") {
                setIsGenerating(true);
                const timeout = setTimeout(() => {
                  mergeInvoice(result.draft);
                  setIsGenerating(false);
                }, 2000);

                return () => clearTimeout(timeout);
              } else {
                mergeInvoice(result.draft);
              }
            }
          }
        }
      }
    },
  });

  // Custom handleSubmit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isTokenLimitReached) return;
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
    if (isTokenLimitReached) return;
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

  const chatMessages = messages;

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
            isAuthenticated={user?.id ? true : false}
            userName={user?.name || ""}
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
            <InvoicePreview />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
