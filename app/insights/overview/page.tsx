import AmenitiesDataTable from "@/app/ui/analytics/AmenitiesDataTable";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { getAmenitiesData } from "@/app/lib/actions";
import type { Metadata } from "next";
import { Amenity } from "@/app/ui/types";

export const metadata: Metadata = {
  title: "Business Insights | Nýtta",
};

const Insights = async () => {
  const amenities = (await getAmenitiesData()) as Amenity[];

  return <AmenitiesDataTable savedAmenities={amenities} />;
};

export default withPageAuthRequired(Insights, {
  returnTo: "/insights/overview",
});
