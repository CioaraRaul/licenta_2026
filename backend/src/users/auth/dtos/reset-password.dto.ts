import { IsNotEmpty, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsNotEmpty({ message: 'Reset token should not be empty' })
  resetToken: string;

  @IsNotEmpty({ message: 'New password should not be empty' })
  @MinLength(6)
  newPassword: string;
}
