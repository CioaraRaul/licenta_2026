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
    route("verify-email", "routes/auth/verifyEmail.tsx"),
  ]),

  route("", "routes/app-layout.tsx", [
    index("routes/home.tsx"),
    route("", "routes/homepage/index.tsx"),
    route("dashboard", "routes/homepage/main/dashboard.tsx", []),
    route("messages", "routes/homepage/main/messages.tsx"),
    route("my-listings", "routes/homepage/main/myListinings.tsx"),
    route("my-listings/new", "routes/homepage/main/newListing.tsx"),
    route("wallet", "routes/homepage/main/wallet.tsx"),
    route("find-vehicle", "routes/homepage/vehicles/findVehicle.tsx"),
    route("find-vehicle/:id", "routes/homepage/vehicles/vehicleDetail.tsx"),
    route("saved", "routes/homepage/vehicles/saved.tsx"),
    route("compare", "routes/homepage/vehicles/compare.tsx"),
    route("bids", "routes/homepage/vehicles/myBids.tsx"),
    route("help-support", "routes/homepage/main/helpSupport.tsx"),
    route("settings", "routes/homepage/main/settings.tsx"),
  ]),
] satisfies RouteConfig;
