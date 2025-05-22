import Link from "next/link";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export default async function HomeHero() {
  return (
    <section className="space-y-6 py-12 sm:py-20 lg:py-20">
      <div className="container flex max-w-5xl flex-col items-center gap-5 px-4 text-center">
        <Link
          href="#"
          className={cn(
            buttonVariants({ variant: "outline", size: "sm", rounded: "full" }),
            "px-4",
          )}
        >
          <span className="mr-2">🚀 Beta </span>

          <span className="hidden md:flex">- Live For Testing&nbsp;</span>
        </Link>

        <h1 className="text-balance font-urban text-2xl font-extrabold tracking-tight sm:text-2xl md:text-3xl">
          Free{" "}
          <span className="text-gradient_indigo-purple font-extrabold">
            AI Invoice Generator
          </span>{" "}
          For Freelancers
        </h1>

        <p
          className="max-w-2xl text-balance leading-normal text-muted-foreground sm:text-xl sm:leading-8"
          style={{ animationDelay: "0.35s", animationFillMode: "forwards" }}
        >
          Create professional invoices in minutes with the help of AI. Our tool
          is designed for freelancers and creatives to:
        </p>
        <ul className="list-inside list-disc space-y-1 text-left">
          <li>Generate customized invoices based on your inputs</li>
          <li>Save time with auto-filled client and project details</li>
          <li>Export invoices as PDF or share online</li>
        </ul>

        {/* <div
          className="flex justify-center space-x-2 md:space-x-4"
          style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}
        >
          <Link
            href="/pricing"
            prefetch={true}
            className={cn(
              buttonVariants({ size: "lg", rounded: "full" }),
              "gap-2",
            )}
          >
            <span>Go Pricing</span>
            <Icons.arrowRight className="size-4" />
          </Link>
        </div> */}
        <div className="absolute bottom-10 hidden lg:block">
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
    </section>
  );
}
