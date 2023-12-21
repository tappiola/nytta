"use client";
import Link from "next/link";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";
const ActiveLink = ({
  children,
  href,
}: {
  href: string;
  children: ReactNode;
}) => {
  const pathname = usePathname();

  const isActiveLink = pathname === href;

  return (
    <Link
      href={href}
      style={isActiveLink ? { borderBottomStyle: "solid" } : {}}
      className={`no-underline p-2 flex items-center px-3 h-full ${
        isActiveLink
          ? `text-gray-100 font-semibold border-b-2 border-teal-500`
          : "text-gray-300"
      }`}
    >
      {children}
    </Link>
  );
};

export default ActiveLink;
