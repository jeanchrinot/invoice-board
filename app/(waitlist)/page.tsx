import { constructMetadata } from "@/lib/utils";

import CTASection from "./cta-section";
import FeatureHighlights from "./feature-highlights";
import HeroLanding from "./hero";

export const metadata = constructMetadata({
  title:
    "Free AI Invoice Assistant For Freelancers and Small Businesses | InvoiceBoard",
  description: "Free AI Invoice Assistant For Freelancers and Small Businesses",
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
