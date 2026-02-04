import { IsString } from 'class-validator';

export class ResendVerificationEmailDto {
  @IsString()
  email: string;
}
