import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsNotEmpty({ message: 'Current password is required' })
  @IsString({ message: 'Current password must be a string' })
  @MinLength(6, { message: 'Old password must be at least 6 characters long' })
  currentPassword: string;

  @IsNotEmpty({ message: 'New password is required' })
  @IsString({ message: 'New password must be a string' })
  @MinLength(6, { message: 'New password must be at least 6 characters long' })
  newPassword: string;
}
