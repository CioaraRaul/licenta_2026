import {
  type AuthResponse,
  type LoginPayload,
} from "~/interface/auth.interface";
import { httpClient } from "./http.api";

export async function login(loginPayload: LoginPayload) {
  return await httpClient.post<AuthResponse>("/auth/signin", loginPayload);
}
