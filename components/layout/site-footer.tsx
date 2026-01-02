import * as React from "react";
import Link from "next/link";

import { footerLinks, siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/layout/mode-toggle";

import { NewsletterForm } from "../forms/newsletter-form";
import { Icons } from "../shared/icons";

export function SiteFooter({ className }: React.HTMLAttributes<HTMLElement>) {
  return (
    <footer className={cn("border-t", className)}>
      {/* <div className="container grid max-w-6xl grid-cols-2 gap-6 py-14 md:grid-cols-5">
        {footerLinks.map((section) => (
          <div key={section.title}>
            <span className="text-sm font-medium text-foreground">
              {section.title}
            </span>
            <ul className="mt-4 list-inside space-y-3">
              {section.items?.map((link) => (
                <li key={link.title}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div className="col-span-full flex flex-col items-end sm:col-span-1 md:col-span-2">
          <NewsletterForm />
        </div>
      </div> */}

      <div className="border-t py-4">
        <div className="container flex max-w-6xl flex-col items-center justify-between gap-2 text-center sm:flex-row sm:gap-0 sm:text-left">
          <span className="text-sm text-muted-foreground">
            Copyright &copy; {new Date().getFullYear()} . All rights reserved.
          </span>

          <p className="text-sm text-muted-foreground">
            Watch me build on{" "}
            <Link
              href={"https://www.x.com/jeanchrinot"}
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              X
            </Link>
          </p>

          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Link
              href="/terms"
              className="font-medium underline underline-offset-4"
            >
              Terms
            </Link>
            <Link
              href="/privacy"
              className="font-medium underline underline-offset-4"
            >
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
