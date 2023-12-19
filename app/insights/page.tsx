import AmenitiesDataTable from "@/app/ui/AmenitiesDataTable";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { getAmenitiesData, getCategories } from "@/app/lib/actions";
import type { Metadata } from "next";
import { Amenity } from "@/app/ui/types";

export const metadata: Metadata = {
  title: "Business Insights | Nýtta",
};

const Insights = async () => {
  const amenities = (await getAmenitiesData()) as Amenity[];
  const categories = await getCategories();

  return (
    <AmenitiesDataTable savedAmenities={amenities} categories={categories} />
  );
};

export default withPageAuthRequired(Insights, { returnTo: "/insights" });
