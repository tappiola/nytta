import { getCategories } from "@/app/lib/actions";
import CategorySelect2 from "@/app/ui/CategorySelect2";
import Map from "@/app/ui/Map";

const Amenities = async () => {
  const categories = await getCategories();

  return (
    <div className="flex h-screen">
      <CategorySelect2 categories={categories} />
      <Map />
    </div>
  );
};

export default Amenities;
