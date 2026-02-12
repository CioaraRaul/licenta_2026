import {
  type OAuthExchangeResponse,
  type AuthResponse,
  type LoginPayload,
  type RegisterAccountPayload,
} from "~/interface/auth.interface";
import { httpClient } from "./http.api";

export async function login(loginPayload: LoginPayload) {
  return await httpClient.post<AuthResponse>("/auth/signin", loginPayload);
}

export async function oauthExchange(code: string) {
  return await httpClient.get<OAuthExchangeResponse>(
    "/auth/oauth/exchange?code=" + code,
  );
}

export async function forgotPassword(email: string) {
  return await httpClient.post("/auth/forgot-password", { email });
}

export async function registerAccount(
  registerAccountPayload: RegisterAccountPayload,
) {
  return await httpClient.post<AuthResponse>(
    "/auth/signup",
    registerAccountPayload,
  );
}

export async function resetPassword(resetToken: string, newPassword: string) {
  return await httpClient.post("/auth/reset-password", {
    resetToken,
    newPassword,
  });
}

export async function exchangeResetCode(code: string) {
  return await httpClient.get<{ resetToken: string }>(
    "/auth/reset/exchange?code=" + code,
  );
}

export async function resendVerificationEmail(email: string) {
  return await httpClient.post("/auth/resend-verification", { email });
}

export async function verifyEmail(token: string) {
  return await httpClient.post("/auth/verify-email", { token });
}

export async function exchangeVerificationCode(code: string) {
  return await httpClient.get<{ verificationToken: string }>(
    "/auth/verify/exchange?code=" + code,
  );
}
