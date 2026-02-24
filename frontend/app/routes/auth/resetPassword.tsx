import { useActionData, useLoaderData, Form, redirect } from "react-router";
import type { Route } from "./+types/resetPassword";
import ResetPasswordComponent from "~/components/auth/resetPassword";
import { exchangeResetCode, resetPassword } from "~/api/auth.api";

export function shouldRevalidate() {
  return false;
}

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return { resetToken: null, error: "Invalid reset link" };
  }

  try {
    const data = await exchangeResetCode(code);
    console.log(data);
    return { resetToken: data.resetToken, error: null };
  } catch {
    return { resetToken: null, error: "This link has expired or is invalid" };
  }
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();
  const newPassword = formData.get("newPassword") as string;
  const resetToken = formData.get("resetToken") as string;

  if (!newPassword || newPassword.length < 6) {
    return { error: "Password must be at least 6 characters" };
  }

  try {
    await resetPassword(resetToken, newPassword);
    return { success: true };
  } catch (err: any) {
    return { error: err?.data?.message || "Failed to reset password" };
  }
}

export default function ResetPassword() {
  const loaderData = useLoaderData<typeof clientLoader>();
  const actionData = useActionData<typeof clientAction>();

  return (
    <ResetPasswordComponent
      resetToken={loaderData.resetToken}
      loaderError={loaderData.error}
      actionError={actionData?.error}
      isSuccess={actionData?.success}
    />
  );
}
