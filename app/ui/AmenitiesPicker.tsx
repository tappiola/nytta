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
    <div className="h-screen flex-col">
      <header
        className="h-16 w-screen p-2 flex"
        style={{
          backgroundColor: "#111827",
          borderBottom: "1px solid #424b57",
        }}
      >
        <Logo />
      </header>
      <main className="flex">
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
        style={{ bottom: "16px", right: "16px" }}
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
