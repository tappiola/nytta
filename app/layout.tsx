import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "primereact/resources/themes/lara-dark-teal/theme.css";
import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.css";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import { ReactNode } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Nýtta | Local Amenities",
  description:
    "App helping businesses know what amenities you miss in the local area",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  );
}
