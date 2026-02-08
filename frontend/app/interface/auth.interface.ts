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
