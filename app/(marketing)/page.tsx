import { infos } from "@/config/landing";
import { constructMetadata } from "@/lib/utils";
import BentoGrid from "@/components/sections/bentogrid";
import Features from "@/components/sections/features";
import HeroLanding from "@/components/sections/hero-landing";
import InfoLanding from "@/components/sections/info-landing";
import Powered from "@/components/sections/powered";
import PreviewLanding from "@/components/sections/preview-landing";
import Testimonials from "@/components/sections/testimonials";

export const metadata = constructMetadata({
  title:
    "Free AI Invoice Assistant For Freelancers and Small Businesses | InvoiceBoard",
  description: "Free AI Invoice Assistant For Freelancers and Small Businesses",
});

export default function IndexPage() {
  return (
    <>
      <HeroLanding />
      <PreviewLanding />
      <Powered />
      <BentoGrid />
      <InfoLanding data={infos[0]} reverse={true} />
      {/* <InfoLanding data={infos[1]} /> */}
      <Features />
      <Testimonials />
    </>
  );
}
