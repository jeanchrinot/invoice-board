import { PlansRow, SubscriptionPlan } from "types";
import { env } from "@/env.mjs";

export const pricingData: SubscriptionPlan[] = [
  {
    title: "Free",
    description: "For freelancers just getting started",
    benefits: [
      "Up to 50 manual invoices per month",
      "1 AI-generated invoice per month (20K tokens)",
      "Save & download invoices (with watermark)",
      "Basic client management (store client info)",
      "Standard invoice templates",
    ],
    limitations: [
      "Watermark on invoices",
      "Limited AI usage (1 invoice)",
      "Email support only",
      "No custom branding",
      "No team features",
    ],
    prices: {
      monthly: 0,
      yearly: 0,
    },
    stripeIds: {
      monthly: null,
      yearly: null,
    },
  },
  {
    title: "Pro",
    description: "For professionals automating their workflow",
    benefits: [
      "Up to 50 AI-generated invoices per month (1M tokens)",
      "Unlimited manual invoices",
      "Save, download & share invoices (no watermark)",
      "Advanced client management (notes, history)",
      "Custom invoice templates",
      "Priority email support",
      // "Export to PDF & share via link",
      // "Basic roles & permissions (single team)",
      "Early access to new features",
    ],
    limitations: ["No custom branding", "Limited team management"],
    prices: {
      monthly: 19,
      yearly: 180,
    },
    stripeIds: {
      monthly: env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PLAN_ID,
      yearly: env.NEXT_PUBLIC_STRIPE_PRO_YEARLY_PLAN_ID,
    },
  },
  {
    title: "Business",
    description: "For teams and growing agencies",
    benefits: [
      "Up to 200 AI-generated invoices per month (4M tokens)",
      "Unlimited manual invoices",
      "Save, download & share invoices (no watermark)",
      "Advanced client management (tags, search, history)",
      "Customizable invoice templates",
      "24/7 priority support",
      // "Advanced Roles & permissions ",
      "Custom branding & logos",
      "Integration support (accounting tools, CRMs)",
      // "Onboarding assistance",
    ],
    limitations: [],
    prices: {
      monthly: 49,
      yearly: 480,
    },
    stripeIds: {
      monthly: env.NEXT_PUBLIC_STRIPE_BUSINESS_MONTHLY_PLAN_ID,
      yearly: env.NEXT_PUBLIC_STRIPE_BUSINESS_YEARLY_PLAN_ID,
    },
  },
];

export const plansColumns = ["free", "pro", "business"] as const;

export const comparePlans: PlansRow[] = [
  {
    feature: "AI-generated invoices",
    free: "1 / mo",
    pro: "50 / mo",
    business: "200 / mo",
    tooltip: "AI-powered invoice assistant with OpenAI token usage limits.",
  },
  {
    feature: "Manual invoices",
    free: "50 / mo",
    pro: "Unlimited",
    business: "Unlimited",
  },
  {
    feature: "Client management",
    free: "Basic",
    pro: "Advanced",
    business: "Advanced + tags",
    tooltip: "Store client details, notes, and invoice history.",
  },
  {
    feature: "Custom branding",
    free: null,
    pro: null,
    business: true,
    tooltip: "Upload your own logo and remove InvoiceBoard branding.",
  },
  {
    feature: "Invoice templates",
    free: "Standard",
    pro: "Custom",
    business: "Custom + Branding",
  },
  {
    feature: "Export & sharing",
    free: "PDF (with watermark)",
    pro: "PDF + Share link",
    business: "PDF + Share link",
  },
  {
    feature: "Roles & permissions",
    free: "Single User",
    pro: "Basic Team",
    business: "Advanced Team",
  },
  {
    feature: "Support",
    free: "Email only",
    pro: "Priority email",
    business: "24/7 priority",
  },
  // {
  //   feature: "Onboarding assistance",
  //   free: false,
  //   pro: "Self-service",
  //   business: "Personalized onboarding",
  // },
  {
    feature: "Integrations",
    free: false,
    pro: false,
    business: "Available",
    tooltip:
      "Business plan includes integrations with CRMs and accounting tools.",
  },
];
