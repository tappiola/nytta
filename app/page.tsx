"use client";
import Link from "next/link";
import React from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import Header from "@/app/ui/Header";
import { Button } from "primereact/button";
import { Card } from "primereact/card";

export default function Home() {
  const { user } = useUser();

  return (
    <main className="flex min-h-screen flex-col items-center">
      <Header>
        <div className="grow" />
        {!user && (
          <Link href="/api/auth/login" className="ms-auto me-0">
            <Button label="Login" />
          </Link>
        )}
      </Header>
      <section className="flex gap-6 mt-12 justify-content-center">
        <Link
          href="/insights/overview"
          className="no-underline w-400px basis-4/12"
        >
          <Card>
            <p>
              Want to open a new business, but not sure about location? Willing
              to open a restaurant, but don&#39;t know what type of cuisine to
              pick?
            </p>
            <p>
              Welcome to Nýtta Business Insights - market analysis data combined
              with feedback from real users
            </p>
            <Button>View Business Insights</Button>
          </Card>
        </Link>
        <Link href="/amenities" className="no-underline w-400px basis-4/12">
          <Card>
            <p>
              Dream of fresh hot croissants you can buy daily just round the
              corner? Or wish you didn&#39;t need to travel to city center every
              you need a barbershop?
            </p>
            <p>
              Let businesses know what amenities you are missing in your local
              area!
            </p>
            <Button>Select Amenities</Button>
          </Card>
        </Link>
      </section>
    </main>
  );
}
