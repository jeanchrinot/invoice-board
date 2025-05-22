import { Suspense } from "react";
import Link from "next/link";

import { cn, constructMetadata } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import InvoicePreview from "@/components/invoice/invoice-preview-public";
import HomeHero from "@/components/sections/home-hero";

export const metadata = constructMetadata({
  title: "Invoice Preview | Freelancer AI Assistant",
  description: "Preview your invoice.",
});

export default function InvoicePreviewPage() {
  return (
    <div className="container flex grid w-screen items-center justify-center pb-16 pt-16">
      {/* <div className="hidden lg:block lg:p-8">
        <HomeHero />
      </div> */}
      <InvoicePreview />
    </div>
  );
}
