import { getCategories } from "@/app/lib/actions";
import AmenitiesPicker from "@/app/ui/AmenitiesPicker";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Local Amenities | Nýtta",
};

const Amenities = async () => {
  const categories = await getCategories();

  return <AmenitiesPicker categories={categories} />;
};

export default withPageAuthRequired(Amenities, { returnTo: "/amenities" });
