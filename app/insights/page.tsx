import AmenitiesDataTable from "@/app/ui/AmenitiesDataTable";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { getAmenitiesData, getCategories } from "@/app/lib/actions";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Business Insights | Nýtta",
};

const Insights = async () => {
  const amenities = await getAmenitiesData();

  return <AmenitiesDataTable savedAmenities={amenities} />;
};

export default withPageAuthRequired(Insights, { returnTo: "/insights" });
