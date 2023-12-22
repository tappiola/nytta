import Link from "next/link";
import React from "react";
import Header from "@/app/ui/header/Header";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import Image from "next/image";
import bakery from "@/public/images/bakery.png";
import chart from "@/public/images/pie-chart.png";

const Home = () => {
  return (
    <>
      <Header>
        <div className="grow" />
      </Header>
      <main className="flex flex-column gap-6 my-12 justify-content-center mx-8">
        <Link href="/amenities" className="no-underline w-400px basis-4/12">
          <Card className="py-0">
            <div className="flex flex-row-reverse items-center gap-10 px-6">
              <Image src={bakery} alt="" height={400} width={400} />
              <div>
                <h1 className="mb-4 text-4xl">Nýtta Amenities</h1>
                <p className="text-lg">
                  Dream of fresh hot croissants you can buy daily just round the
                  corner? Or wish you didn&#39;t need to travel to city center
                  every you need a barbershop?
                </p>
                <p className="text-lg">
                  Let businesses know what amenities you are missing in your
                  local area!
                </p>
                <Button
                  className="mt-4"
                  label="Select Amenities"
                  icon="pi pi-arrow-right"
                  iconPos="right"
                />
              </div>
            </div>
          </Card>
        </Link>
        <Link
          href="/insights/overview"
          className="no-underline w-400px basis-4/12"
        >
          <Card>
            <div className="flex items-center gap-10 px-6">
              <Image src={chart} alt="" width={400} />
              <div>
                <h1 className="mb-4 text-4xl">Nýtta Business Insights</h1>
                <p className="text-lg">
                  Want to open a new business, but not sure about location?
                  Willing to open a restaurant, but don&#39;t know what type of
                  cuisine to pick?
                </p>
                <p className="text-lg">
                  Welcome to Nýtta Business Insights - service providing market
                  analysis data combined with feedback from real users
                </p>
                <Button
                  className="mt-4"
                  label="Explore Business Insights"
                  icon="pi pi-arrow-right"
                  iconPos="right"
                />
              </div>
            </div>
          </Card>
        </Link>
      </main>
    </>
  );
};

export default Home;
