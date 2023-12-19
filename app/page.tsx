"use client";
import Link from "next/link";
import React from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import Image from "next/image";
import jigglypuff from "@/public/images/jigglypuff.png";
import Header from "@/app/ui/Header";
import { Button } from "primereact/button";

export default function Home() {
  const { user } = useUser();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <Header>
        {!user && (
          <Link href="/api/auth/login" className="ms-auto me-0">
            <Button label="Login" />
          </Link>
        )}
      </Header>
      <Link href="/insights">Insights</Link>
      <Link href="/amenities">Amenities</Link>
    </main>
  );
}
