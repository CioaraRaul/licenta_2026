export interface User {
  userId: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'buyer' | 'seller' | 'admin' | 'guest';
  bio?: string;
  isEmailVerified: boolean;
  isActive: boolean;
  createdAt: string;
}
