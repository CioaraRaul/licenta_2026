import { useLoaderData } from "react-router";
import { getMyBids, getReceivedBids } from "~/api/bids.api";
import MyBidsComponent from "~/components/homepage/vehiclesSectionComponent/myBids";
import type { MyBidsPageData } from "~/interface/bid.interface";
import { useAuthStore } from "~/store/auth.store";

/**
 * clientLoader — runs on the client before the component renders.
 *
 * Fetches placed bids for every user and, if the user is a seller/admin,
 * also fetches received bids. Returns both arrays so the component can
 * render them in a tabbed layout.
 */
export async function clientLoader(): Promise<MyBidsPageData> {
  const user = useAuthStore.getState().user;
  const isSeller = user?.role === "seller" || user?.role === "admin";

  try {
    const [placedResult, receivedResult] = await Promise.all([
      getMyBids(1, 100),
      isSeller
        ? getReceivedBids(1, 100)
        : Promise.resolve({ data: [], total: 0, page: 1, limit: 100 }),
    ]);

    return {
      placedBids: placedResult.data ?? [],
      receivedBids: receivedResult.data ?? [],
      isSeller,
      error: false,
    };
  } catch {
    return { placedBids: [], receivedBids: [], isSeller, error: true };
  }
}

export default function MyBids() {
  const data = useLoaderData<typeof clientLoader>();
  return <MyBidsComponent {...data} />;
}
