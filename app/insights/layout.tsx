import { ReactNode } from "react";
import ActiveLink from "@/app/ui/ActiveLink";

const MENU_CONFIG = [
  {
    href: "/insights/overview",
    label: "Overview",
  },
  { href: "/insights/amenities", label: "Amenities" },
  { href: "/insights/geo", label: "Geo" },
];
export default function TabsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <ul className="nav flex">
        {MENU_CONFIG.map(({ href, label }, i) => (
          <li key={i} className="list-none ">
            <ActiveLink href={href}>{label}</ActiveLink>
          </li>
        ))}
      </ul>
      {children}
    </>
  );
}
