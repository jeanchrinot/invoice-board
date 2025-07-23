import { nanoid } from "nanoid";
import { create } from "zustand";
import { persist } from "zustand/middleware";

import { Invoice } from "@/types/invoice";
import { guestUserLimit } from "@/config/user";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system" | "data";
  content: string;
}

interface Usage {
  tokensUsed: number;
  invoicesCreated: number;
  lastReset: number;
}

interface AssistantStore {
  // UI state
  mobileTab: "chat" | "preview";
  setMobileTab: (tab: "chat" | "preview") => void;

  // Invoice generation state
  invoices: Invoice[];
  currentInvoice: Invoice | null;
  setCurrentInvoice: (invoice: Invoice | null) => void;
  addInvoice: (invoice: Invoice) => void;

  invoiceDraft: Partial<Invoice> | null;
  setInvoiceDraft: (draft: Partial<Invoice> | null) => void;
  mergeInvoiceDraft: (partial: Partial<Invoice>) => void;

  isGenerating: boolean;
  setIsGenerating: (val: boolean) => void;

  // Usage tracking
  usage: Usage;
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
  isInvoiceLimitReached: () => boolean;
  isTokenLimitReached: () => boolean;
  // Reset everything
  resetIfExpired: () => void;
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
      invoiceDraft: null,
      setInvoiceDraft: (draft) => set({ invoiceDraft: draft }),

      mergeInvoiceDraft: (partial) =>
        set((state) => {
          const prevDraft = state.invoiceDraft || {};

          return {
            invoiceDraft: {
              ...prevDraft,
              ...partial,

              billTo: {
                ...(prevDraft.billTo || {}),
                ...(partial.billTo || {}),
              },

              from: {
                ...(prevDraft.from || {}),
                ...(partial.from || {}),
              },

              items: partial.items
                ? [...(prevDraft.items || []), ...partial.items]
                : (prevDraft.items ?? []),
            },
          };
        }),

      //   mergeInvoiceDraft: (partial) =>
      //     set((state) => ({
      //       invoiceDraft: {
      //         ...state.invoiceDraft,
      //         ...partial,
      //         items: partial.items
      //           ? [...(state.invoiceDraft?.items || []), ...partial.items]
      //           : state.invoiceDraft?.items,
      //       },
      //     })),

      isGenerating: false,
      setIsGenerating: (val) => set({ isGenerating: val }),

      usage: {
        tokensUsed: 0,
        invoicesCreated: 0,
        lastReset: Date.now(),
      },
      addTokens: (count) =>
        set((state) => ({
          usage: {
            ...state.usage,
            tokensUsed: state.usage.tokensUsed + count,
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
              invoicesCreated: state.usage.invoicesCreated + 1,
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
          invoiceDraft: null,
          isGenerating: false,
        });
      },

      resetIfExpired: () => {
        const now = Date.now();
        const { usage } = get();
        if (!usage.lastReset) {
          const { invoicesCreated, tokensUsed } = get().usage;
          set({
            usage: {
              invoicesCreated: invoicesCreated,
              tokensUsed: tokensUsed,
              lastReset: now,
            },
          });
        }
        if (now - usage.lastReset > ONE_DAY_MS) {
          set({
            currentInvoice: null,
            invoiceDraft: null,
            isGenerating: false,
            messages: [],
            invoices: [],
            conversationId: nanoid(),
            usage: {
              invoicesCreated: 0,
              //   tokensUsed: usage.tokensUsed,
              tokensUsed: 0,
              lastReset: now,
            },
          });
        }
      },

      isInvoiceLimitReached: () => {
        get().resetIfExpired();
        const { invoicesCreated } = get().usage;
        return invoicesCreated >= guestUserLimit.invoices;
      },

      isTokenLimitReached: () => {
        get().resetIfExpired();
        const { tokensUsed } = get().usage;
        return tokensUsed >= guestUserLimit.tokens;
      },

      //   reset: () =>
      //     set({
      //       currentInvoice: null,
      //       invoiceDraft: null,
      //       isGenerating: false,
      //       usage: { tokensUsed: 0, invoicesCreated: 0, lastReset:Date.now() },
      //       messages: [],
      //       conversationId: nanoid(),
      //     }),
    }),
    {
      name: "assistant-store", // localStorage key
    },
  ),
);
