import { useLoaderData } from "react-router";
import { useAuthStore } from "~/store/auth.store";
import { getSellerStats, getBuyerStats } from "~/api/dashboard.api";
import { getMyListings } from "~/api/vehicles.api";
import { getSavedVehicles } from "~/api/saved-vehicles.api";
import DashboardMainComponent from "~/components/homepage/mainSectionComponent/dashboardMain";

export async function clientLoader() {
  const user = useAuthStore.getState().user;
  const isSeller = user?.role === "seller" || user?.role === "admin";

  try {
    if (isSeller) {
      const [stats, listingsResult] = await Promise.all([
        getSellerStats(),
        getMyListings(1, 5),
      ]);
      return { stats, isSeller, user, listings: listingsResult.vehicles ?? [], savedVehicles: [], error: false };
    } else {
      const [stats, savedResult] = await Promise.all([
        getBuyerStats(),
        getSavedVehicles(1, 4),
      ]);
      return { stats, isSeller, user, listings: [], savedVehicles: savedResult.data ?? [], error: false };
    }
  } catch {
    return { stats: null, isSeller, user, listings: [], savedVehicles: [], error: true };
  }
}

function Dashboard() {
  const data = useLoaderData<typeof clientLoader>();
  return <DashboardMainComponent {...data} />;
}

export default Dashboard;
