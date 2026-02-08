import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyResetTokenDto {
  @IsNotEmpty()
  @IsString()
  token: string;
}
