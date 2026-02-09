export interface User {
  userId: number;
  username: string;
  email: string;
  password: string;
  isEmailVerified: boolean;
  role: string;
  isActive: boolean;
}
