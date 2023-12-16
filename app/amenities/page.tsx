import { getCategories } from "@/app/lib/actions";
import AmenitiesPicker from "@/app/ui/AmenitiesPicker";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";

const Amenities = async () => {
  const categories = await getCategories();

  return <AmenitiesPicker categories={categories} />;
};

export default withPageAuthRequired(Amenities, { returnTo: "/amenities" });
