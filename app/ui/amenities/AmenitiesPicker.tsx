"use client";
import CategorySelect from "@/app/ui/analytics/CategorySelect";
import Map from "@/app/ui/map/Map";
import { Button } from "primereact/button";
import { create } from "@/app/lib/actions";
import { useRef } from "react";
import { Categories, UserLocationSaved } from "@/app/ui/types";
import Header from "@/app/ui/header/Header";
import { useUser } from "@auth0/nextjs-auth0/client";
import { Toast } from "primereact/toast";
import { Message } from "primereact/message";
import "./Amenities.styles.css";
import { useUserLocation } from "@/app/hooks/useUserLocation";
import { getCategoriesNames } from "@/app/lib/util";

export const MAX_AMENITIES = 7;

const AmenitiesPicker = ({ categories }: { categories: Categories }) => {
  const { user: { sub } = {} } = useUser();
  const toastRef = useRef<Toast>(null);

  const {
    selectedCategories,
    userLocation,
    setUserLocation,
    setSelectedCategories,
    isSaveDisabled,
  } = useUserLocation(categories, sub!);

  const categoriesNames = getCategoriesNames(categories, selectedCategories);

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
          {categoriesNames.length ? (
            <p className="two-lines text-gray-200">
              <strong>{categoriesNames.length} amenities selected:</strong>{" "}
              {categoriesNames.join(", ")}.
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
                area! You can select up to {MAX_AMENITIES}, pick the most
                desired ones.
              </p>
            </>
          )}
        </div>
        <Button
          type="button"
          className="shrink-0"
          disabled={isSaveDisabled}
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
        {Object.keys(categoriesNames).length > MAX_AMENITIES && (
          <Message
            severity="warn"
            text={`Please, select no more than ${MAX_AMENITIES} amenities`}
            className="fixed bottom-6 left-1/2 transform -translate-x-1/2"
          />
        )}
      </main>
    </div>
  );
};

export default AmenitiesPicker;
