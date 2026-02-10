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
