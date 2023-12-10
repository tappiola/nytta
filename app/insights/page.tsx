import AmenitiesDataTable from "@/app/ui/AmenitiesDataTable";
import { getCategories } from "@/app/lib/actions";

const Insights = async () => {
  const categories = await getCategories();

  return <AmenitiesDataTable categories={categories} />;
};

export default Insights;
