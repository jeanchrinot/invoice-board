"use client";

import { useContext } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";

import { docsConfig } from "@/config/docs";
import { marketingConfig } from "@/config/marketing";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { useScroll } from "@/hooks/use-scroll";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DocsSearch } from "@/components/docs/search";
import { ModeToggle } from "@/components/layout/mode-toggle";
import { ModalContext } from "@/components/modals/providers";
import { Icons } from "@/components/shared/icons";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";

interface NavBarProps {
  scroll?: boolean;
  large?: boolean;
}

export function NavBar({ scroll = false }: NavBarProps) {
  const { theme } = useTheme();
  const scrolled = useScroll(50);
  const { data: session, status } = useSession();
  const { setShowSignInModal } = useContext(ModalContext);

  const selectedLayout = useSelectedLayoutSegment();
  const documentation = selectedLayout === "docs";

  const configMap = {
    docs: docsConfig.mainNav,
  };

  const links =
    (selectedLayout && configMap[selectedLayout]) || marketingConfig.mainNav;

  console.log("theme", theme);

  return (
    <header
      className={`sticky top-0 z-40 flex w-full justify-center bg-background/60 backdrop-blur-xl transition-all ${
        scroll ? (scrolled ? "border-b" : "bg-transparent") : "border-b"
      }`}
    >
      <MaxWidthWrapper
        className="flex h-16 items-center justify-between py-4"
        large={documentation}
      >
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-1.5">
            <Image
              src="/InvoiceBoard-Logo.png"
              className="hidden w-[150px] dark:block md:w-[200px]"
              width={604}
              height={219}
              alt="InvoiceBoard Dark"
            />
            <Image
              src="/InvoiceBoard-Logo-Light.png"
              className="w-[150px] dark:hidden md:w-[200px]"
              width={604}
              height={219}
              alt="InvoiceBoard Light"
            />
          </Link>

          {/* {links && links.length > 0 ? (
            <nav className="hidden gap-6 md:flex">
              {links.map((item, index) => (
                <Link
                  key={index}
                  href={item.disabled ? "#" : item.href}
                  prefetch={true}
                  className={cn(
                    "flex items-center text-lg font-medium transition-colors hover:text-foreground/80 sm:text-sm",
                    item.href.startsWith(`/${selectedLayout}`)
                      ? "text-foreground"
                      : "text-foreground/60",
                    item.disabled && "cursor-not-allowed opacity-80",
                  )}
                >
                  {item.title}
                </Link>
              ))}
            </nav>
          ) : null} */}
        </div>

        <div className="flex items-center space-x-3">
          {/* <div className="hidden flex-1 items-center space-x-4 sm:justify-end lg:flex">
            <div className="flex space-x-4">

            </div>
          </div> */}

          {/* {session ? (
            <Link
              href={session.user.role === "ADMIN" ? "/admin" : "/dashboard"}
              className="hidden md:block"
            >
              <Button
                className="gap-2 px-5"
                variant="default"
                size="sm"
                rounded="full"
              >
                <span>Dashboard</span>
              </Button>
            </Link>
          ) : status === "unauthenticated" ? (
            <Link href={"/login"}>
              <Button
                className="hidden gap-2 px-5 md:flex"
                variant="default"
                size="sm"
                rounded="full"
              >
                <span>Sign In</span>
                <Icons.arrowRight className="size-4" />
              </Button>
            </Link>
          ) : (
            <Skeleton className="hidden h-9 w-28 rounded-full lg:flex" />
          )} */}

          <Link href={"#waitlist"}>
            <Button
              className="hidden gap-2 px-5 md:flex"
              variant="default"
              size="sm"
              rounded="full"
            >
              <span>Join Waitlist</span>
              <Icons.arrowRight className="size-4" />
            </Button>
          </Link>
          <span className="mr-4"></span>
          <Link
            href={siteConfig.links.twitter}
            target="_blank"
            rel="noreferrer"
            className="hidden md:flex"
          >
            <Icons.twitter className="size-5" />
            <span className="sr-only">X</span>
          </Link>

          <div className="hidden md:block">
            <ModeToggle />
          </div>
        </div>
      </MaxWidthWrapper>
    </header>
  );
}
