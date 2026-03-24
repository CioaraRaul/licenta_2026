import { useLoaderData } from "react-router";
import { getMyListings } from "~/api/vehicles.api";
import MyListingsComponent from "~/components/homepage/mainSectionComponent/myListinings";
import type { MyListingsPageData } from "~/interface/vehicle.interface";

/**
 * clientLoader — runs on the client before the component renders.
 *
 * Fetches the seller's listings with a large page size so we can do
 * client-side filtering / sorting for instant UX. The pagination state
 * is still returned for potential server-side paging in the future.
 */
export async function clientLoader(): Promise<MyListingsPageData> {
  try {
    const result = await getMyListings(1, 100);
    return {
      vehicles: result.vehicles ?? [],
      pagination: result.pagination ?? {
        total: 0,
        page: 1,
        limit: 0,
        totalPages: 1,
      },
      error: false,
    };
  } catch {
    return {
      vehicles: [],
      pagination: { total: 0, page: 1, limit: 0, totalPages: 1 },
      error: true,
    };
  }
}

export default function MyListings() {
  const data = useLoaderData<typeof clientLoader>();
  return <MyListingsComponent {...data} />;
}
