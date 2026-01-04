import { constructMetadata } from "@/lib/utils";

import CTASection from "./cta-section";
import FeatureHighlights from "./feature-highlights";
import HeroLanding from "./hero";

export const metadata = constructMetadata({
  title: "Create Invoices at the Speed of Thought | InvoiceBoard",
  description:
    "Stop manually filling out rows and columns. Simply type a request, and InvoiceBoard's AI generates professional, tax-ready invoices, tracks payments, and chases clients for you.",
});

export default function IndexPage() {
  return (
    <>
      <HeroLanding />
      <FeatureHighlights />
      <CTASection />
    </>
  );
}
