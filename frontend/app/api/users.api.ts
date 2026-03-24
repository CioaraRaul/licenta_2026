import { httpClient } from "./http.api";
import type { User } from "~/interface/user.interface";
import type {
  ProfileFormState,
  PasswordFormState,
} from "~/interface/settings.interface";

// ─── Users API ────────────────────────────────────────────────────────────────

/** GET /auth/me — returns the authenticated user's public profile */
export async function getMyProfile(): Promise<User> {
  return httpClient.get<User>("/auth/me");
}

/** PATCH /user/profile — update mutable profile fields */
export async function updateProfile(
  payload: Partial<ProfileFormState>,
): Promise<User> {
  return httpClient.patch<User>("/user/profile", payload);
}

/** POST /auth/change-password — verify current password and set new one */
export async function changePassword(form: PasswordFormState): Promise<void> {
  return httpClient.post<void>("/auth/change-password", {
    currentPassword: form.current,
    newPassword: form.next,
  });
}

/** DELETE /auth/account/delete — permanently delete the account (requires password) */
export async function deleteMyAccount(password: string): Promise<void> {
  return httpClient.delete<void>("/auth/account/delete", {
    data: { password },
  });
}
