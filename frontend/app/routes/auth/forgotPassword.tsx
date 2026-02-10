import ForgotPasswordComponent from "~/components/auth/forgotPassword";
import type { Route } from "./+types/terms";
import { forgotPassword } from "~/api/auth.api";

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formdata = await request.formData();

  const email = formdata.get("email") as string;

  try {
    await forgotPassword(email);
    return {
      success: true,
      message:
        "If an account with that email exists, a password reset link has been sent.",
    };
  } catch (error: any) {
    return {
      error:
        error.data?.message ||
        "Failed to send password reset email. Please try again.",
      status: error.status || 500,
    };
  }
}

function ForgotPassword() {
  return <ForgotPasswordComponent />;
}

export default ForgotPassword;
