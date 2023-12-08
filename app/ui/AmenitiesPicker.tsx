"use client";
import CategorySelect from "@/app/ui/CategorySelect";
import Map from "@/app/ui/Map";
import { Button } from "primereact/button";
import { Prisma } from "@prisma/client";
import { create, getCategories } from "@/app/lib/actions";
import { useState } from "react";
import { TreeCheckboxSelectionKeys } from "primereact/tree";
import { UserLocation } from "@/app/ui/types";

type Categories = Prisma.PromiseReturnType<typeof getCategories>;
const AmenitiesPicker = ({ categories }: { categories: Categories }) => {
  const [selectedCategories, setSelectedCategories] =
    useState<TreeCheckboxSelectionKeys>({});
  const [userLocation, setUserLocation] = useState<UserLocation>({});

  console.log(selectedCategories, userLocation);

  const categoriesKeys = Object.keys(selectedCategories)
    .filter((key) => selectedCategories[key].checked)
    .map((key) => key);

  const createWithData = create.bind(null, categoriesKeys, userLocation);

  return (
    <>
      <form action={createWithData}>
        <div className="flex h-screen">
          <CategorySelect
            categories={categories}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
          />
          <Map userLocation={userLocation} setUserLocation={setUserLocation} />
        </div>

        <Button
          type="submit"
          className="fixed"
          style={{ bottom: "16px", right: "16px" }}
        >
          Save
        </Button>
      </form>
    </>
  );
};

export default AmenitiesPicker;
