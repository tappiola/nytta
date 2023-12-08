import { getCategories } from "@/app/lib/actions";
import AmenitiesPicker from "@/app/ui/AmenitiesPicker";

const Amenities = async () => {
  const categories = await getCategories();

  return <AmenitiesPicker categories={categories} />;
};

export default Amenities;
