import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  route("auth", "routes/auth-layout.tsx", [
    route("login", "routes/auth/login.tsx"),
    route("register", "routes/auth/createAccount.tsx"),
    route("forgot-password", "routes/auth/forgotPassword.tsx"),
    route("reset-password", "routes/auth/resetPassword.tsx"),
  ]),

  route("", "routes/app-layout.tsx", [route("home", "routes/home.tsx")]),
] satisfies RouteConfig;
