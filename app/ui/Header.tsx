import Logo from "@/app/ui/Logo";
import React, { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0/client";
import styles from "./Header.module.css";
const Header = ({ children }: { children?: ReactNode }) => {
  const { user } = useUser();

  return (
    <header
      className={`h-16 w-screen p-2 flex gap-3 items-center ${styles.header}`}
    >
      <Logo />
      {children}
      {user && (
        <>
          <span className="user-info">
            <Image
              src={user.picture!}
              alt="Profile"
              className="rounded-full"
              width="45"
              height="45"
            />
          </span>
          <Link href="/api/auth/logout" className="text-white">
            <span className="pi pi-sign-out"></span>
          </Link>
        </>
      )}
    </header>
  );
};

export default Header;
