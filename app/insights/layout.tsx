import React, { ReactNode } from "react";
import ActiveLink from "@/app/ui/ActiveLink";
import Header from "@/app/ui/Header";

const MENU_CONFIG = [
  {
    href: "/insights/overview",
    label: "Overview",
  },
  { href: "/insights/spheres", label: "Spheres" },
  { href: "/insights/geo", label: "Geo" },
];
export default function TabsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header>
        <ul className="flex grow m-0 h-full">
          {MENU_CONFIG.map(({ href, label }, i) => (
            <li key={i} className="list-none px-1 h-full">
              <ActiveLink href={href}>{label}</ActiveLink>
            </li>
          ))}
        </ul>
      </Header>
      {children}
    </>
  );
}
