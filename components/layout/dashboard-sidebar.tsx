"use client";

import { Fragment, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavItem, SidebarNavItem } from "@/types";
import { Menu, PanelLeftClose, PanelRightClose } from "lucide-react";
import { useTheme } from "next-themes";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useUser } from "@/hooks/use-user";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ProjectSwitcher from "@/components/dashboard/project-switcher";
import { UpgradeCard } from "@/components/dashboard/upgrade-card";
import { ModeToggle } from "@/components/layout/mode-toggle";
import { UserAccountNav } from "@/components/layout/user-account-nav";
import { Icons } from "@/components/shared/icons";

import { SignUpCard } from "../dashboard/signup-card";

interface DashboardSidebarProps {
  links: SidebarNavItem[];
}

export function DashboardSidebar({ links }: DashboardSidebarProps) {
  const path = usePathname();
  const { user } = useUser();

  const { isTablet } = useMediaQuery();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(!isTablet);

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  useEffect(() => {
    setIsSidebarExpanded(!isTablet);
  }, [isTablet]);

  const Logo = () => {
    return (
      <Link href="/" className="flex items-center space-x-1.5">
        <Image
          src="/InvoiceBoard-Logo.png"
          className="hidden w-[170px] dark:block"
          width={500}
          height={94}
          alt="InvoiceBoard Dark"
        />
        <Image
          src="/InvoiceBoard-Logo-Light.png"
          className="w-[170px] dark:hidden"
          width={500}
          height={94}
          alt="InvoiceBoard Light"
        />
      </Link>
    );
  };

  const Icon = () => {
    return (
      <Link href="/" className="flex items-center space-x-1.5">
        <Image
          src="/InvoiceBoard-Icon.png"
          className="w-[160px]"
          width={500}
          height={500}
          alt="InvoiceBoard Icon"
        />
      </Link>
    );
  };

  return (
    <TooltipProvider delayDuration={0}>
      <div className="sticky top-0 z-50 h-full bg-background dark:bg-black/20">
        <ScrollArea className="h-full overflow-y-auto border-r">
          <aside
            className={cn(
              isSidebarExpanded ? "w-[220px] xl:w-[260px]" : "w-[68px]",
              "relative hidden h-screen pb-10 md:block",
            )}
          >
            <div className="flex flex-1 flex-col gap-2 pb-16">
              <span
                className={`relative z-50 flex cursor-pointer items-center rounded-br-md rounded-tr-md px-2 py-1 ${isSidebarExpanded ? "justify-end" : "justify-center"}`}
                onClick={toggleSidebar}
              >
                {isSidebarExpanded ? (
                  <PanelLeftClose
                    size={18}
                    className="stroke-muted-foreground"
                  />
                ) : (
                  <PanelRightClose
                    size={18}
                    className="stroke-muted-foreground"
                  />
                )}
                <span className="sr-only">Toggle Sidebar</span>
              </span>
              <div className="relative flex h-14 items-center p-4 lg:h-[60px]">
                {isSidebarExpanded ? <Logo /> : <Icon />}
              </div>

              <nav className="flex flex-1 flex-col gap-8 px-4 pt-4">
                {links.map((section) => {
                  if (section.items?.length == 0) return;
                  return (
                    <section
                      key={section.title}
                      className="flex flex-col gap-0.5"
                    >
                      {isSidebarExpanded ? (
                        <p className="text-xs text-muted-foreground">
                          {section.title}
                        </p>
                      ) : (
                        <div className="h-4" />
                      )}
                      {section.items.map((item) => {
                        const Icon = Icons[item.icon || "arrowRight"];
                        return (
                          item.href && (
                            <Fragment key={`link-fragment-${item.title}`}>
                              {isSidebarExpanded ? (
                                <Link
                                  key={`link-${item.title}`}
                                  href={item.disabled ? "#" : item.href}
                                  className={cn(
                                    "flex items-center gap-3 rounded-md p-2 text-sm font-medium hover:bg-primary hover:text-white",
                                    path === item.href
                                      ? "bg-primary text-white"
                                      : "text-muted-foreground hover:text-white",
                                    item.disabled &&
                                      "cursor-not-allowed opacity-80 hover:bg-transparent hover:text-muted-foreground",
                                  )}
                                >
                                  <Icon className="size-5" />
                                  {item.title}
                                  {item.badge && (
                                    <Badge className="ml-auto flex size-5 shrink-0 items-center justify-center rounded-full">
                                      {item.badge}
                                    </Badge>
                                  )}
                                </Link>
                              ) : (
                                <Tooltip key={`tooltip-${item.title}`}>
                                  <TooltipTrigger asChild>
                                    <Link
                                      key={`link-tooltip-${item.title}`}
                                      href={item.disabled ? "#" : item.href}
                                      className={cn(
                                        "group flex items-center gap-3 rounded-md py-2 text-sm font-medium hover:bg-primary",
                                        path === item.href
                                          ? "bg-primary"
                                          : "text-muted-foreground hover:text-accent-foreground",
                                        item.disabled &&
                                          "cursor-not-allowed opacity-80 hover:bg-transparent hover:text-muted-foreground",
                                      )}
                                    >
                                      <span
                                        className={`flex size-full items-center justify-center group-hover:text-white ${path === item.href ? "text-white" : "text-muted-foreground"}`}
                                      >
                                        <Icon className="size-5" />
                                      </span>
                                    </Link>
                                  </TooltipTrigger>
                                  <TooltipContent
                                    side="right"
                                    className="bg-gradient text-white dark:text-white"
                                  >
                                    {item.title}
                                  </TooltipContent>
                                </Tooltip>
                              )}
                            </Fragment>
                          )
                        );
                      })}
                    </section>
                  );
                })}
                <ModeToggle />
              </nav>

              <div className="mt-auto xl:p-4">
                {isSidebarExpanded && user ? <UpgradeCard /> : null}
                {isSidebarExpanded && !user ? <SignUpCard /> : null}
              </div>
              {/* This section is fixed and it covers the bottom part of the sidebar. So I need to add some padding or margin bottom to some of the above elements to make the sidebar scroll further */}
              <section
                className={`fixed bottom-0 flex ${user?.id ? "h-16" : ""} flex-col items-center justify-center gap-0.5 px-4 py-2 ${isSidebarExpanded ? "w-[220px] bg-primary xl:w-[260px]" : "w-[68px]"}`}
              >
                <UserAccountNav isSidebarExpanded={isSidebarExpanded} />
              </section>
            </div>
          </aside>
        </ScrollArea>
      </div>
    </TooltipProvider>
  );
}

export function MobileSheetSidebar({ links }: DashboardSidebarProps) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const { isSm, isMobile } = useMediaQuery();

  if (isSm || isMobile) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="size-9 shrink-0 md:hidden"
          >
            <Menu className="size-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col p-0">
          <ScrollArea className="h-full overflow-y-auto">
            <div className="flex h-screen flex-col">
              <nav className="flex flex-1 flex-col gap-y-8 p-6 text-lg font-medium">
                <Link
                  href="#"
                  className="flex items-center gap-2 text-lg font-semibold"
                >
                  <Icons.logo className="size-6" />
                  <span className="font-urban text-xl font-bold">
                    {siteConfig.name}
                  </span>
                </Link>

                <ProjectSwitcher large />

                {links.map((section) => (
                  <section
                    key={section.title}
                    className="flex flex-col gap-0.5"
                  >
                    <p className="text-xs text-muted-foreground">
                      {section.title}
                    </p>

                    {section.items.map((item) => {
                      const Icon = Icons[item.icon || "arrowRight"];
                      return (
                        item.href && (
                          <Fragment key={`link-fragment-${item.title}`}>
                            <Link
                              key={`link-${item.title}`}
                              onClick={() => {
                                if (!item.disabled) setOpen(false);
                              }}
                              href={item.disabled ? "#" : item.href}
                              className={cn(
                                "flex items-center gap-3 rounded-md p-2 text-sm font-medium hover:bg-muted",
                                path === item.href
                                  ? "bg-muted"
                                  : "text-muted-foreground hover:text-accent-foreground",
                                item.disabled &&
                                  "cursor-not-allowed opacity-80 hover:bg-transparent hover:text-muted-foreground",
                              )}
                            >
                              <Icon className="size-5" />
                              {item.title}
                              {item.badge && (
                                <Badge className="ml-auto flex size-5 shrink-0 items-center justify-center rounded-full">
                                  {item.badge}
                                </Badge>
                              )}
                            </Link>
                          </Fragment>
                        )
                      );
                    })}
                  </section>
                ))}

                <div className="mt-auto">
                  <UpgradeCard />
                </div>
              </nav>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div className="flex size-9 animate-pulse rounded-lg bg-muted md:hidden" />
  );
}
