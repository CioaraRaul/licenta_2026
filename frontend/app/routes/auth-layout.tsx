import { Outlet, redirect } from "react-router";
import type { Route } from "./+types/auth-layout";
import { waitForAuthRehydration } from "~/utils/auth.guard";
import { useAuthStore } from "~/store/auth.store";

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  await waitForAuthRehydration();

  const { isTokenValid } = useAuthStore.getState();

  const url = new URL(request.url);
  const publicPaths = [
    "/auth/verify-email",
    "/auth/reset-password",
    "/auth/callback",
  ];
  const isPublicPath = publicPaths.some((p) => url.pathname.startsWith(p));

  if (isTokenValid() && !isPublicPath) {
    throw redirect("/home");
  }

  return null;
}

function AuthLayout() {
  return (
    <div>
      <Outlet />
    </div>
  );
}

export default AuthLayout;
