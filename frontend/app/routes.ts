import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  route("auth", "routes/auth-layout.tsx", [
    route("login", "routes/auth/login.tsx"),
    route("register", "routes/auth/createAccount.tsx"),
    route("forgot-password", "routes/auth/forgotPassword.tsx"),
    route("reset-password", "routes/auth/resetPassword.tsx"),
    route("callback", "routes/auth/callback.tsx"),
    route("privacy-policy", "routes/auth/privacyPolicy.tsx"),
    route("terms", "routes/auth/terms.tsx"),
    route("auth/verify-email", "routes/auth/verifyEmail.tsx"),
  ]),

  route("", "routes/app-layout.tsx", [
    route("", "routes/homepage/index.tsx"),
    route("dashboard", "routes/homepage/main/dashboard.tsx", []),
    route("dashboard/messages", "routes/homepage/main/messages.tsx"),
    route("dashboard/my-listings", "routes/homepage/main/myListinings.tsx"),
    route("dashboard/wallet", "routes/homepage/main/wallet.tsx"),
    route("dashboard/find-vehicle", "routes/homepage/vehicles/findVehicle.tsx"),
    route("dashboard/saved", "routes/homepage/vehicles/saved.tsx"),
    route("dashboard/compare", "routes/homepage/vehicles/compare.tsx"),
    route("dashboard/bids", "routes/homepage/vehicles/myBids.tsx"),
  ]),
] satisfies RouteConfig;
