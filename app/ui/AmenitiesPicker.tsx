"use client";
import CategorySelect from "@/app/ui/CategorySelect";
import Map from "@/app/ui/Map";
import { Button } from "primereact/button";
import { Prisma } from "@prisma/client";
import { create, getCategories } from "@/app/lib/actions";
import { useState } from "react";
import { TreeCheckboxSelectionKeys } from "primereact/tree";
import { UserLocation, UserLocationSaved } from "@/app/ui/types";
import Logo from "@/app/ui/Logo";

type Categories = Prisma.PromiseReturnType<typeof getCategories>;
const AmenitiesPicker = ({ categories }: { categories: Categories }) => {
  const [selectedCategories, setSelectedCategories] =
    useState<TreeCheckboxSelectionKeys>({});
  const [userLocation, setUserLocation] = useState<UserLocation>({});

  const categoriesKeys = Object.keys(selectedCategories)
    .filter((key) => selectedCategories[key].checked)
    .map((key) => key);

  return (
    <div className="h-screen flex flex-col">
      <header
        className="h-16 w-screen p-2 flex"
        style={{
          backgroundColor: "#111827",
          borderBottom: "1px solid #424b57",
        }}
      >
        <Logo />
        <div className="text-gray-400 text-sm text-center flex flex-col grow justify-center">
          <p className="m-0">
            Dream of fresh hot croissants you can buy daily just round the
            corner? Or wish you didn&#39;t need to travel to city center every
            you need a barbershop?
          </p>
          <p className="m-0">
            Let businesses know what amenities you are missing in your local
            area! You can select up to 7, pick the most desired ones.
          </p>
        </div>
      </header>
      <main className="flex grow overflow-y-auto">
        <CategorySelect
          categories={categories}
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
        />
        <Map userLocation={userLocation} setUserLocation={setUserLocation} />
      </main>

      <Button
        type={"button"}
        className="fixed"
        style={{ top: "9px", right: "16px" }}
        onClick={async () =>
          await create(categoriesKeys, userLocation as UserLocationSaved)
        }
      >
        Save
      </Button>
    </div>
  );
};

export default AmenitiesPicker;
