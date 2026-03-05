import { useLoaderData } from "react-router";
import { getSavedVehicles } from "~/api/saved-vehicles.api";
import SavedComponent from "~/components/homepage/vehiclesSectionComponent/saved";
import type { SavedVehiclesPageData } from "~/interface/saved-vehicle.interface";

const LIMIT = 12;

export async function clientLoader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get("page")) || 1;

  try {
    const result = await getSavedVehicles(page, LIMIT);
    return {
      vehicles: result.data.map((sv) => sv.vehicle),
      total: result.total,
      page: result.page,
      error: false,
    } satisfies SavedVehiclesPageData;
  } catch {
    return {
      vehicles: [],
      total: 0,
      page: 1,
      error: true,
    } satisfies SavedVehiclesPageData;
  }
}

export default function Saved() {
  const data = useLoaderData<SavedVehiclesPageData>();
  return (
    <div className="flex-1 flex flex-col h-full w-full">
      <SavedComponent
        vehicles={data.vehicles}
        total={data.total}
        page={data.page}
        error={data.error}
      />
    </div>
  );
}
