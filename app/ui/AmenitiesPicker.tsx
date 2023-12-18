"use client";
import CategorySelect from "@/app/ui/CategorySelect";
import Map from "@/app/ui/Map/Map";
import { Button } from "primereact/button";
import { create, getUserAmenities } from "@/app/lib/actions";
import { useEffect, useRef, useState } from "react";
import { TreeCheckboxSelectionKeys } from "primereact/tree";
import { Categories, UserLocation, UserLocationSaved } from "@/app/ui/types";
import Header from "@/app/ui/Header";
import { useUser } from "@auth0/nextjs-auth0/client";
import { isEqual } from "lodash";
import { removeNullUndefined } from "@/app/lib/util";
import { Toast } from "primereact/toast";

const AmenitiesPicker = ({ categories }: { categories: Categories }) => {
  const [selectedCategories, setSelectedCategories] =
    useState<TreeCheckboxSelectionKeys>({});
  const [savedCategories, setSavedCategories] =
    useState<TreeCheckboxSelectionKeys>({});
  const [userLocation, setUserLocation] = useState<UserLocation>({});
  const [prevLocation, setPrevLocation] = useState<UserLocation>({});
  const { user: { sub } = {} } = useUser();
  const toastRef = useRef<Toast>(null);

  useEffect(() => {
    const loadAmenities = async () => {
      const userAmenities = await getUserAmenities(sub!);

      if (!userAmenities.length) {
        return;
      }

      const prevAmenities = userAmenities.reduce(
        (prev, { amenityId, partiallySelected }) => ({
          ...prev,
          [amenityId]: {
            checked: !partiallySelected,
            partialChecked: partiallySelected,
          },
        }),
        {},
      );
      setSelectedCategories(prevAmenities);
      setSavedCategories(prevAmenities);

      const {
        shortName,
        region,
        postcode,
        place,
        neighborhood,
        longitude,
        longName,
        locality,
        latitude,
        district,
        country,
      } = removeNullUndefined(userAmenities[0]);

      const location = {
        shortName,
        region,
        postcode,
        place,
        neighborhood,
        longitude,
        longName,
        locality,
        latitude,
        district,
        country,
      } as UserLocation;

      setUserLocation(location);
      setPrevLocation(location);
    };

    if (sub) {
      loadAmenities();
    }
  }, [sub]);

  const categoriesKeys = Object.keys(selectedCategories)
    .filter(
      (key) =>
        selectedCategories[key].checked &&
        categories.find(({ id }) => id === +key)?.childrenCount === 0,
    )
    .map((key) => key);

  const names = categories
    .filter(({ id }) => categoriesKeys.includes(id.toString()))
    .map(({ name }) => name);

  const showMessage = (severity: "success" | "error") => {
    const labels = {
      success: "Amenities saved successfully",
      error: "Failed to save amenities",
    };

    toastRef.current!.show({
      severity,
      summary: labels[severity],
      life: 2000,
    });
  };

  return (
    <div className="h-screen flex flex-col">
      <Toast ref={toastRef} position="bottom-right" />
      <Header>
        <div className="text-gray-400 text-sm text-center flex flex-col grow justify-center">
          {names.length ? (
            <p className="two-lines text-gray-200">
              <strong>{names.length} amenities selected:</strong>{" "}
              {names.join(", ")}.
            </p>
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
          disabled={
            !Object.keys(selectedCategories).length ||
            !userLocation.latitude ||
            !userLocation.longitude ||
            (isEqual(savedCategories, selectedCategories) &&
              isEqual(
                [prevLocation.latitude, prevLocation.longitude],
                [userLocation.latitude, userLocation.longitude],
              ))
          }
          onClick={async () => {
            const { status } = await create(
              selectedCategories,
              userLocation as UserLocationSaved,
              sub!,
            );
            showMessage(status);
          }}
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
        {/*<Message*/}
        {/*  severity="warn"*/}
        {/*  text="Please, select no more than 7 amenities"*/}
        {/*  className="fixed bottom-4 end-4"*/}
        {/*/>*/}
      </main>
    </div>
  );
};

export default AmenitiesPicker;
