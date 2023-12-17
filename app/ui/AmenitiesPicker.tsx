"use client";
import CategorySelect from "@/app/ui/CategorySelect";
import Map from "@/app/ui/Map/Map";
import { Button } from "primereact/button";
import { Prisma } from "@prisma/client";
import { create, getCategories, getUserAmenities } from "@/app/lib/actions";
import { useEffect, useState } from "react";
import { TreeCheckboxSelectionKeys } from "primereact/tree";
import { UserLocation, UserLocationSaved } from "@/app/ui/types";
import Header from "@/app/ui/Header";
import { useUser } from "@auth0/nextjs-auth0/client";

type Categories = Prisma.PromiseReturnType<typeof getCategories>;
const AmenitiesPicker = ({ categories }: { categories: Categories }) => {
  const [selectedCategories, setSelectedCategories] =
    useState<TreeCheckboxSelectionKeys>({});
  const [userLocation, setUserLocation] = useState<UserLocation>({});
  const { user: { sub } = {} } = useUser();

  useEffect(() => {
    const loadAmenities = async () => {
      const t = await getUserAmenities(sub!);
      console.log(t);
      setSelectedCategories(
        t.reduce(
          (prev, next) => ({ ...prev, [next.amenity]: { checked: true } }),
          {},
        ),
      );
    };

    if (sub) {
      loadAmenities();
    }
  }, [sub]);

  console.log(selectedCategories);

  const categoriesKeys = Object.keys(selectedCategories)
    .filter((key) => selectedCategories[key].checked)
    .map((key) => key);

  // TODO refactor
  const d3 = categories.reduce(
    (prev, c) => ({
      ...prev,
      [c.id]: c.name,
      ...c.categories.reduce(
        (prev, item) => ({
          ...prev,
          [`${c.id}-${item.id}`]: item.name,
          ...item.SubCategory.reduce(
            (prev, sub) => ({
              ...prev,
              [`${c.id}-${item.id}-${sub.id}`]: sub.name,
            }),
            {},
          ),
        }),
        {},
      ),
    }),
    {},
  );

  const names = categoriesKeys.map((key) => d3[key as keyof typeof d3]);

  return (
    <div className="h-screen flex flex-col">
      <Header>
        <div className="text-gray-400 text-sm text-center flex flex-col grow justify-center">
          {names.length ? (
            `${names.length} amenities selected: ${names.join(", ")}.`
          ) : (
            <>
              <p className="m-0">
                Dream of fresh hot croissants you can buy daily just round the
                corner? Or wish you didn&#39;t need to travel to city center
                every you need a barbershop?
              </p>
              <p className="m-0">
                Let businesses know what amenities you are missing in your local
                area! You can select up to 7, pick the most desired ones.
              </p>
            </>
          )}
        </div>
        <Button
          type="button"
          onClick={async () =>
            await create(
              categoriesKeys,
              userLocation as UserLocationSaved,
              sub!,
            )
          }
        >
          Save
        </Button>
      </Header>
      <main className="flex grow overflow-y-auto">
        <CategorySelect
          categories={categories}
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
        />
        <Map userLocation={userLocation} setUserLocation={setUserLocation} />
      </main>
    </div>
  );
};

export default AmenitiesPicker;
