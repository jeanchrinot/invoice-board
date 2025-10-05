import { MonthlyUsage } from "@prisma/client";
import { nanoid } from "nanoid";
import { create } from "zustand";
import { persist } from "zustand/middleware";

import { Invoice } from "@/types/invoice";
import { UsageLimit } from "@/hooks/use-user";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system" | "data";
  content: string;
}

interface Usage {
  tokens: number;
  invoices: number;
}

interface AssistantStore {
  // UI state
  mobileTab: "chat" | "preview";
  setMobileTab: (tab: "chat" | "preview") => void;

  // Invoice generation state
  invoices: Partial<Invoice>[] | Invoice[];
  currentInvoice: Partial<Invoice> | Invoice | null;
  setCurrentInvoice: (invoice: Partial<Invoice> | Invoice | null) => void;
  addInvoice: (invoice: Partial<Invoice> | Invoice) => void;

  // invoiceDraft: Partial<Invoice> | null;
  // setInvoiceDraft: (draft: Partial<Invoice> | null) => void;
  mergeInvoice: (partial: Partial<Invoice> | Invoice) => void;

  isGenerating: boolean;
  setIsGenerating: (val: boolean) => void;

  // Usage tracking
  usage: Usage;
  setUsage: (usage: Usage) => void;
  addTokens: (count: number) => void;
  incrementInvoicesCreated: (invoice: Invoice) => void;

  // Chat message state
  messages: ChatMessage[];
  setMessages: (msgs: ChatMessage[]) => void;
  appendMessage: (msg: ChatMessage) => void;
  clearMessages: () => void;

  // Conversation ID
  conversationId: string;
  setConversationId: (id: string) => void;
  newConversation: () => void;
  //Limit
  isInvoiceLimitReached: (usageLimit: UsageLimit) => boolean;
  isTokenLimitReached: (usageLimit: UsageLimit) => boolean;
  // Reset everything
  // resetIfExpired: () => void;
}

const ONE_DAY_MS = 24 * 60 * 60 * 1000;
// const ONE_DAY_MS = 10 * 60 * 1000;

export const useAssistantStore = create<AssistantStore>()(
  persist(
    (set, get) => ({
      mobileTab: "chat",
      setMobileTab: (tab) => set({ mobileTab: tab }),
      invoices: [],
      currentInvoice: null,
      setCurrentInvoice: (invoice) => set({ currentInvoice: invoice }),
      addInvoice: (invoice) =>
        set((state) => ({
          invoices: [...state.invoices, invoice],
        })),
      setUsage: (usage) => set({ usage: usage }),
      mergeInvoice: (partial) =>
        set((state) => {
          const prevInvoice = state.currentInvoice || {};

          return {
            currentInvoice: {
              ...prevInvoice,
              ...partial,

              billTo: {
                ...(prevInvoice.billTo || {}),
                ...(partial.billTo || {}),
              },

              from: {
                ...(prevInvoice.from || {}),
                ...(partial.from || {}),
              },

              items: partial.items ?? prevInvoice.items ?? [],
            },
          };
        }),

      isGenerating: false,
      setIsGenerating: (val) => set({ isGenerating: val }),

      usage: {
        tokens: 0,
        invoices: 0,
      },
      addTokens: (count) =>
        set((state) => ({
          usage: {
            ...state.usage,
            tokens: state.usage.tokens + count,
          },
        })),
      incrementInvoicesCreated: (invoice: Invoice) => {
        set((state) => {
          const invoiceAlreadyExists = state.invoices.some(
            (inv) => inv.number === invoice.number,
          );

          // If invoice with this number is already in state, do not increment usage
          if (invoiceAlreadyExists) {
            return state;
          }

          return {
            invoices: [...state.invoices, invoice],
            usage: {
              ...state.usage,
              invoices: state.usage.invoices + 1,
            },
          };
        });
      },

      messages: [],
      setMessages: (msgs) => set({ messages: msgs }),
      appendMessage: (msg) =>
        set((state) => ({
          messages: [...state.messages, msg],
        })),
      clearMessages: () => set({ messages: [] }),

      conversationId: nanoid(),
      setConversationId: (id) => set({ conversationId: id }),

      newConversation: () => {
        set({
          conversationId: nanoid(),
          messages: [],
          currentInvoice: null,
          // invoiceDraft: null,
          isGenerating: false,
        });
      },

      // resetIfExpired: () => {
      //   const now = Date.now();
      //   const { usage } = get();
      //   if (!usage.lastReset) {
      //     const { invoices, tokens } = get().usage;
      //     set({
      //       usage: {
      //         invoices: invoices,
      //         tokens: tokens,
      //         lastReset: now,
      //       },
      //     });
      //   }
      //   if (now - usage.lastReset > ONE_DAY_MS) {
      //     set({
      //       currentInvoice: null,
      //       // invoiceDraft: null,
      //       isGenerating: false,
      //       messages: [],
      //       invoices: [],
      //       conversationId: nanoid(),
      //       usage: {
      //         invoices: 0,
      //         tokens: 0,
      //         lastReset: now,
      //       },
      //     });
      //   }
      // },

      isInvoiceLimitReached: (usageLimit: UsageLimit) => {
        // get().resetIfExpired();
        const { invoices } = get().usage;
        return invoices >= usageLimit.invoices;
      },

      isTokenLimitReached: (usageLimit: UsageLimit) => {
        // get().resetIfExpired();
        const { tokens } = get().usage;
        return tokens >= usageLimit.tokens;
      },
    }),
    {
      name: "assistant-store", // localStorage key
    },
  ),
);
