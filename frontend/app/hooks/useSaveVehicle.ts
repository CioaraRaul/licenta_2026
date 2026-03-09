import { useState, useCallback } from "react";
import { useNavigate } from "react-router";
import { saveVehicle, unsaveVehicle } from "~/api/saved-vehicles.api";
import { useAuthStore } from "~/store/auth.store";
import { HttpError } from "~/api/http.api";

/**
 * Hook managing save / unsave toggle for a single vehicle.
 * Performs optimistic UI updates and silently handles 409/404 race-conditions.
 */
export function useSaveVehicle(
  vehicleId: number | undefined,
  initialIsSaved: boolean,
) {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [isSaved, setIsSaved] = useState(initialIsSaved);

  const toggleSave = useCallback(async () => {
    if (!vehicleId) return;
    if (!isAuthenticated) {
      navigate("/auth/login");
      return;
    }
    const wasSaved = isSaved;
    setIsSaved(!wasSaved);
    try {
      if (wasSaved) await unsaveVehicle(vehicleId);
      else await saveVehicle(vehicleId);
    } catch (err) {
      // 409 = already saved, 404 = already unsaved — keep the optimistic state
      if (
        err instanceof HttpError &&
        (err.status === 409 || err.status === 404)
      )
        return;
      setIsSaved(wasSaved);
    }
  }, [vehicleId, isSaved, isAuthenticated, navigate]);

  return { isSaved, toggleSave };
}
