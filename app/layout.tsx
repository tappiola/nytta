import type { Metadata } from "next";
import { Inter } from "next/font/google";
// import "./globals.css";
import "primereact/resources/themes/lara-dark-teal/theme.css";
import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Nýtta | Local Amenities",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
