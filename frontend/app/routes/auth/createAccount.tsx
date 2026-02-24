import SignUpComponent from "~/components/auth/signup";
import type { Route } from "./+types/login";
import { registerAccount } from "~/api/auth.api";

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const email = formData.get("email") as string;
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as string;

  const isEmail = email.includes("@");

  if (!isEmail) {
    return {
      error: "Please enter a valid email address.",
      status: 400,
    };
  }

  try {
    const data = await registerAccount({
      firstName,
      lastName,
      email,
      username,
      password,
      role: role as "buyer" | "seller" | "admin" | "guest",
    });
    return data;
  } catch (error) {
    return {
      error: "Failed to register account.",
      status: 500,
    };
  }
}

function CreateAccount() {
  return <SignUpComponent />;
}

export default CreateAccount;
