import { useAuthStore } from "~/store/auth.store";

export function waitForAuthRehydration(): Promise<void> {
  return new Promise((resolve) => {
    const unsub = useAuthStore.persist.onFinishHydration(() => {
      unsub();
      resolve();
    });

    if (useAuthStore.persist.hasHydrated()) {
      unsub();
      resolve();
    }
  });
}
