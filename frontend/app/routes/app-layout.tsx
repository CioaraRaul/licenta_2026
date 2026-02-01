import React from "react";
import { Outlet } from "react-router";

function AppLayout() {
  return (
    <div>
      <h1>App Layout</h1>
      <Outlet />
    </div>
  );
}

export default AppLayout;
