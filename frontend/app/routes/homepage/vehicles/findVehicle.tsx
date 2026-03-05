import { useLoaderData } from "react-router";
import { getVehicles } from "~/api/vehicles.api";
import { checkIsSaved } from "~/api/saved-vehicles.api";
import { paramsToFilters } from "~/utils/findVehicle.utils";
import FindVehiclesComponent from "~/components/homepage/vehiclesSectionComponent/findVehicles";
import type { FindVehiclePageData } from "~/interface/vehicle.interface";

export async function clientLoader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const params = paramsToFilters(url.searchParams);

  try {
    const result = await getVehicles(params);

    // Check saved status for each vehicle (parallel, fail-safe)
    const savedIds = new Set<number>();
    try {
      const checks = await Promise.allSettled(
        result.data.map((v) => checkIsSaved(v.id)),
      );
      checks.forEach((c, i) => {
        if (c.status === "fulfilled" && c.value.isSaved) {
          savedIds.add(result.data[i].id);
        }
      });
    } catch {
      /* saved status is nice-to-have */
    }

    return {
      vehicles: result.data,
      total: result.total,
      page: result.page,
      savedIds,
      error: false,
    } satisfies FindVehiclePageData;
  } catch {
    return {
      vehicles: [],
      total: 0,
      page: 1,
      savedIds: new Set<number>(),
      error: true,
    } satisfies FindVehiclePageData;
  }
}

export default function FindVehicle() {
  const data = useLoaderData<FindVehiclePageData>();
  return (
    <div className="flex flex-col h-full">
      <FindVehiclesComponent
        vehicles={data.vehicles}
        total={data.total}
        page={data.page}
        savedIds={
          data.savedIds instanceof Set ? data.savedIds : new Set(data.savedIds)
        }
        error={data.error}
      />
    </div>
  );
}
