import { useLoaderData } from "react-router";
import { getVehicleById, getSimilarVehicles } from "~/api/vehicles.api";
import { checkIsSaved } from "~/api/saved-vehicles.api";
import VehicleDetailComponent from "~/components/homepage/vehiclesSectionComponent/vehicleDetail";
import type { Vehicle, VehicleDetailPageData } from "~/interface/vehicle.interface";

export async function clientLoader({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);
  if (isNaN(id)) {
    return {
      vehicle: null,
      similarVehicles: [],
      isSaved: false,
      error: true,
    } satisfies VehicleDetailPageData;
  }

  try {
    const vehicle = await getVehicleById(id);

    // Fetch saved status & similar vehicles in parallel (fail-safe)
    let isSaved = false;
    let similarVehicles: Vehicle[] = [];

    const [savedResult, similarResult] = await Promise.allSettled([
      checkIsSaved(id),
      getSimilarVehicles(id, 4),
    ]);

    if (savedResult.status === "fulfilled" && savedResult.value.isSaved) {
      isSaved = true;
    }
    if (similarResult.status === "fulfilled") {
      similarVehicles = similarResult.value;
    }

    return {
      vehicle,
      similarVehicles,
      isSaved,
      error: false,
    } satisfies VehicleDetailPageData;
  } catch {
    return {
      vehicle: null,
      similarVehicles: [],
      isSaved: false,
      error: true,
    } satisfies VehicleDetailPageData;
  }
}

export default function VehicleDetail() {
  const data = useLoaderData<VehicleDetailPageData>();
  return <VehicleDetailComponent {...data} />;
}
