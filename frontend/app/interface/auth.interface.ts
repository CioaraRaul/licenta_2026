import type { User } from "./user.interface";

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;

  setTokens: (accessToken: string, refreshToken: string) => void;
  setUsers: (user: User) => void;
  logout: () => void;
  isTokenValid: () => boolean;
}

export interface LoginPayload {
  email?: string;
  username?: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface AccountDeactivatedResponse {
  accountDeactivated: boolean;
  message: string;
  email: string;
}

export interface EmailNotVerifiedResponse {
  emailNotVerified: boolean;
  message: string;
  email: string;
}

export type LoginResponse =
  | AuthResponse
  | AccountDeactivatedResponse
  | EmailNotVerifiedResponse;

export interface SignupPayload {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "buyer" | "seller" | "admin" | "guest";
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  resetToken: string;
  newPassword: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface VerifyEmailPayload {
  token: string;
}

export interface OAuthExchangeResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface RegisterAccountPayload {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "buyer" | "seller" | "admin" | "guest";
}

export type ResetPasswordProps = {
  resetToken: string | null;
  loaderError: string | null;
  actionError?: string;
  isSuccess?: boolean;
};
