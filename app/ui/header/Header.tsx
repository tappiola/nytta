import Logo from "@/app/ui/header/Logo";
import React, { ReactNode } from "react";
import styles from "./Header.module.css";
import UserActions from "@/app/ui/header/UserActions";
const Header = ({ children }: { children?: ReactNode }) => {
  return (
    <header
      className={`h-16 w-screen px-2 flex gap-3 items-center justify-between ${styles.header}`}
    >
      <Logo />
      {children}
      <UserActions />
    </header>
  );
};

export default Header;
