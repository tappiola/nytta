"use client";
import Link from "next/link";
import React from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import Image from "next/image";
import jigglypuff from "@/public/images/jigglypuff.png";

export default function Home() {
  const { user } = useUser();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {!user && <Link href="/api/auth/login">Login</Link>}
      {user && <Image src={jigglypuff} alt={"jigglypuff"} />}
    </main>
  );
}
