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

  return (
    <Link
      href={href}
      style={{ color: pathname === href ? "pink" : "white" }}
      className="no-underline p-2"
    >
      {children}
    </Link>
  );
};

export default ActiveLink;
