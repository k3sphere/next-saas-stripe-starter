import { UserRole } from "@prisma/client";

import { SidebarNavItem } from "types";

export const sidebarLinks: SidebarNavItem[] = [
  {
    title: "MENU",
    items: [
      {
        href: "/admin",
        icon: "laptop",
        title: "Admin Panel",
        authorizeOnly: UserRole.ADMIN,
      },
      { href: "/dashboard", icon: "dashboard", title: "Dashboard" },
      { href: "/dashboard/nodes", icon: "dashboard", title: "Nodes" },
      { href: "/dashboard/members", icon: "lineChart", title: "Members" },
      { href: "/dashboard/joining", icon: "lineChart", title: "Joining Keys" },
      { href: "/dashboard/services", icon: "lineChart", title: "Services" },
      { href: "/dashboard/routes", icon: "lineChart", title: "Routing table" },
      { href: "/dashboard/firewall", icon: "lineChart", title: "Firewall" },
    ],
  },
  {
    title: "OPTIONS",
    items: [
      {
        href: "/dashboard/billing",
        icon: "billing",
        title: "Billing",
        authorizeOnly: UserRole.USER,
      },
      { href: "/dashboard/settings", icon: "settings", title: "Settings" },
      { href: "/", icon: "home", title: "Homepage" },
      { href: "/docs", icon: "bookOpen", title: "Documentation" },
      {
        href: "#",
        icon: "messages",
        title: "Support",
        authorizeOnly: UserRole.USER,
        disabled: true,
      },
    ],
  },
];
