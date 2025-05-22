import { Suspense } from "react";
import Link from "next/link";

import { getCurrentUser } from "@/lib/session";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import ChatWidget from "@/components/chat/chat-widget";
import InvoiceTable from "@/components/invoice/invoice-list";
import AuthPageContent from "@/components/playground/auth-page-content";
import HomeHero from "@/components/sections/home-hero";

export const metadata = {
  title: "Free AI Invoice Generator For Freelancers | Freelancer AI Assistant",
  description: "Free AI Invoice Generator For Freelancers.",
};

export default async function HomePage() {
  const user = await getCurrentUser();

  return (
    <>
      <div className="container w-screen flex-col items-center justify-center bg-muted lg:grid lg:h-screen lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="lg:p-8">
          <HomeHero />
        </div>
        <div className="bg-white lg:block lg:h-full lg:px-4">
          {user?.id ? (
            <InvoiceTable></InvoiceTable>
          ) : (
            <AuthPageContent></AuthPageContent>
          )}
        </div>
        <div className="py-4 text-center lg:hidden">
          Created by{" "}
          <Link
            href="https://www.velombe.com"
            className={
              "text-gradient_indigo-purple inline-flex hover:underline"
            }
            target={"_blank"}
          >
            Velombe.
          </Link>
        </div>
      </div>
      {user?.id && <ChatWidget></ChatWidget>}
    </>
  );
}
