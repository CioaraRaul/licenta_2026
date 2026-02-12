import { UserRole } from 'src/users/enum/user-role.enum';

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
  };
  accessToken: string;
  refreshToken: string;
}
