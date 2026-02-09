import LoginComponent from "~/components/auth/login";
import type { Route } from "./+types/login";
import { login } from "~/api/auth.api";
import { useAuthStore } from "~/store/auth.store";
import { redirect } from "react-router";

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formdata = await request.formData();

  const emailOrUsername = formdata.get("emailOrUsername") as string;
  const password = formdata.get("password") as string;

  const isEmail = emailOrUsername.includes("@");

  const payload = isEmail
    ? { email: emailOrUsername, password }
    : { username: emailOrUsername, password };

  try {
    const data = await login(payload);

    if ("accountDeactivated" in data) {
      return {
        accountDeactivated: true,
        message: (data as any).message,
        email: (data as any).email,
      };
    }

    const { setTokens, setUsers } = useAuthStore.getState();
    setTokens(data.accessToken, data.refreshToken);
    setUsers(data.user);

    return redirect("/dashboard");
  } catch (error: any) {
    return {
      error: error.data?.message || "Login failed. Please try again.",
      status: error.status || 500,
    };
  }
}

function Login() {
  return <LoginComponent />;
}

export default Login;
