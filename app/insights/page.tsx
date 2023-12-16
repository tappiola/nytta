import AmenitiesDataTable from "@/app/ui/AmenitiesDataTable";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";

const Insights = async () => {
  return <AmenitiesDataTable />;
};

export default withPageAuthRequired(Insights, { returnTo: "/insights" });
