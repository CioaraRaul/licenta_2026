import React from "react";
import { Outlet } from "react-router";

function AuthLayout() {
  return (
    <div>
      <h1>Auth Layout</h1>
      <Outlet />
    </div>
  );
}

export default AuthLayout;
