import { IsString } from 'class-validator';

export class VerifyResetTokenDto {
  @IsString()
  token: string;
}
