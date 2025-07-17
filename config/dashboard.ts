import { UserRole } from "@prisma/client";

import { SidebarNavItem } from "types";

export const sidebarLinks: SidebarNavItem[] = [
  {
    title: "MENU",
    items: [
      // {
      //   href: "/admin",
      //   icon: "laptop",
      //   title: "Admin Panel",
      //   authorizeOnly: UserRole.ADMIN,
      // },
      { href: "/ai-assistant", icon: "bot", title: "AI Assistant" },
      {
        href: "/dashboard",
        icon: "dashboard",
        title: "Dashboard",
        authorizeOnly: UserRole.USER,
      },
      {
        href: "/dashboard/invoices",
        icon: "receipt",
        title: "Invoices",
        authorizeOnly: UserRole.USER,
      },
      {
        href: "/dashboard/quotes",
        icon: "receiptEuro",
        title: "Quotes",
        authorizeOnly: UserRole.USER,
      },
      {
        href: "/dashboard/proposals",
        icon: "receiptText",
        title: "Proposals",
        authorizeOnly: UserRole.USER,
      },
      {
        href: "/dashboard/clients",
        icon: "bookUser",
        title: "Clients",
        authorizeOnly: UserRole.USER,
      },
      {
        href: "/dashboard/analytics",
        icon: "lineChart",
        title: "Analytics",
        authorizeOnly: UserRole.USER,
      },
    ],
  },
  {
    title: "SETTINGS",
    items: [
      {
        href: "/dashboard/settings",
        icon: "settings",
        title: "Settings",
        authorizeOnly: UserRole.USER,
      },
      {
        href: "/dashboard/billing",
        icon: "billing",
        title: "Billing",
        authorizeOnly: UserRole.USER,
      },
      // { href: "/", icon: "home", title: "Homepage" },
      // { href: "/docs", icon: "bookOpen", title: "Documentation" },
      // {
      //   href: "#",
      //   icon: "messages",
      //   title: "Support",
      //   authorizeOnly: UserRole.USER,
      //   disabled: true,
      // },
    ],
  },
];
