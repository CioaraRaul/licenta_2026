import { MinLength } from 'class-validator';

export class ChangePasswordDto {
  @MinLength(6, { message: 'Old password must be at least 6 characters long' })
  currentPassword: string;

  @MinLength(6, { message: 'New password must be at least 6 characters long' })
  newPassword: string;
}
