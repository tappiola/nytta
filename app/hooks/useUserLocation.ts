import { useEffect, useState } from "react";
import { getUserAmenities } from "@/app/lib/actions";
import { getCategoriesNames, removeNullUndefined } from "@/app/lib/util";
import { Categories, UserLocation } from "@/app/ui/types";
import { TreeCheckboxSelectionKeys } from "primereact/tree";
import { isEqual } from "lodash";
import { MAX_AMENITIES } from "@/app/ui/amenities/AmenitiesPicker";

export const useUserLocation = (categories: Categories, userId: string) => {
  const [selectedCategories, setSelectedCategories] =
    useState<TreeCheckboxSelectionKeys>({});
  const [prevCategories, setPrevCategories] =
    useState<TreeCheckboxSelectionKeys>({});
  const [userLocation, setUserLocation] = useState<UserLocation>({});
  const [prevLocation, setPrevLocation] = useState<UserLocation>({});

  useEffect(() => {
    const loadAmenities = async () => {
      const userAmenities = await getUserAmenities(userId!);

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
      setPrevCategories(prevAmenities);

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

    if (userId) {
      loadAmenities();
    }
  }, [userId]);

  const isSaveDisabled =
    !Object.keys(selectedCategories).length ||
    getCategoriesNames(categories, selectedCategories).length > MAX_AMENITIES ||
    !userLocation.latitude ||
    !userLocation.longitude ||
    (isEqual(prevCategories, selectedCategories) &&
      isEqual(
        [prevLocation.latitude, prevLocation.longitude],
        [userLocation.latitude, userLocation.longitude],
      ));

  return {
    selectedCategories,
    prevCategories,
    userLocation,
    prevLocation,
    setUserLocation,
    setSelectedCategories,
    isSaveDisabled,
  };
};
