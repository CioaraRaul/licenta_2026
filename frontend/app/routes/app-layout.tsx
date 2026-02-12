import React from "react";
import { Outlet, redirect } from "react-router";
import { useAuthStore } from "~/store/auth.store";
import { waitForAuthRehydration } from "~/utils/auth.guard";

export async function clientLoader() {
  await waitForAuthRehydration();
  const { isTokenValid, logout } = useAuthStore.getState();

  if (!isTokenValid()) {
    logout();
    throw redirect("/auth/login");
  }
  return null;
}

function AppLayout() {
  return (
    <div>
      <h1>App Layout</h1>
      <Outlet />
    </div>
  );
}

export default AppLayout;
