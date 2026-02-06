import { IsNotEmpty, IsString } from 'class-validator';

export class ResendVerificationEmailDto {
  @IsNotEmpty()
  @IsString()
  email: string;
}
