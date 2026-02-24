import React from "react";
import { Outlet, redirect } from "react-router";
import Navbar from "~/components/navbar/navbar";
import Sidebar from "~/components/navbar/sidebar";
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
    <div className="flex h-screen bg-[#0c0c0e] overflow-hidden font-['DM_Sans',sans-serif]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="flex-1 flex min-h-0 overflow-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
