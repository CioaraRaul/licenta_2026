import { IsOptional, IsString, ValidateIf } from 'class-validator';

export class LoginDTO {
  @IsOptional()
  @IsString()
  @ValidateIf((obj: LoginDTO) => !obj.email)
  username?: string;

  @IsOptional()
  @IsString()
  @ValidateIf((obj: LoginDTO) => !obj.username)
  email?: string;

  @IsString()
  password: string;
}
