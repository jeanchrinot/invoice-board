import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { HeaderSection } from "../shared/header-section";

const pricingFaqData = [
  {
    id: "item-1",
    question: "Can I use the app for free?",
    answer:
      "Yes! The Free plan gives you up to 50 invoices including 1 AI-generated invoice per month (20K tokens). You can create, save, and download invoices with a watermark — perfect for freelancers just starting out.",
  },
  {
    id: "item-2",
    question: "What’s included in the Pro plan?",
    answer:
      "The Pro plan is designed for professionals automating their workflow. You get up to 50 AI-generated invoices per month (1M tokens), unlimited manual invoices, custom templates, priority email support, and early access to new features — all without watermarks.",
  },
  {
    id: "item-3",
    question: "What’s the difference between Pro and Business plans?",
    answer:
      "The Business plan is for teams and agencies. It includes 200 AI-generated invoices (4M tokens), advanced client management with tags and search, custom branding and logos, 24/7 priority support, and integrations with accounting tools or CRMs.",
  },
  {
    id: "item-4",
    question: "How are AI invoice limits calculated?",
    answer:
      "AI usage is counted per used tokens. Each AI-assisted invoice consumes tokens (based on your description length and assistant output). Once your monthly token or invoice limit is reached, you can still create manual invoices or upgrade your plan.",
  },
  {
    id: "item-5",
    question: "Can I still create invoices manually without using AI?",
    answer:
      "Absolutely. Manual invoice creation is available in all plans, including Free. Pro and Business users get unlimited manual invoices each month.",
  },
  {
    id: "item-6",
    question: "Do my unused AI invoice credits roll over to the next month?",
    answer:
      "No, AI invoice credits and token limits reset at the start of each billing month. You’ll always get fresh credits according to your plan.",
  },
  {
    id: "item-7",
    question: "Can I upload my own logo or use my own branding?",
    answer:
      "Custom branding is available only in the Business plan. It allows you to upload your logo, customize invoice colors, and remove all InvoiceBoard branding from PDFs and share links.",
  },
  // {
  //   id: "item-8",
  //   question: "Do you offer team access or roles?",
  //   answer:
  //     "Yes. The Pro plan supports a single basic team, while the Business plan includes advanced roles and permissions for multiple users or departments.",
  // },
  // {
  //   id: "item-9",
  //   question: "Are integrations available for external tools?",
  //   answer:
  //     "Integrations with accounting software and CRMs are available for Business users. You can connect your workflow to streamline bookkeeping and client management.",
  // },
  {
    id: "item-10",
    question: "Can I switch plans or cancel anytime?",
    answer:
      "Yes, you can upgrade, downgrade, or cancel your subscription anytime from your account settings. Plan changes take effect immediately, with prorated billing adjustments where applicable.",
  },
];

export function PricingFaq() {
  return (
    <section className="container max-w-4xl py-2">
      <HeaderSection
        label="FAQ"
        title="Frequently Asked Questions"
        subtitle="Everything you need to know about our pricing, AI invoice limits, and plan features."
      />

      <Accordion type="single" collapsible className="my-12 w-full">
        {pricingFaqData.map((faqItem) => (
          <AccordionItem key={faqItem.id} value={faqItem.id}>
            <AccordionTrigger>{faqItem.question}</AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground sm:text-[15px]">
              {faqItem.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
