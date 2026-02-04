import { IsBoolean, IsOptional } from 'class-validator';

export class REvokeSessionsDto {
  @IsOptional()
  @IsBoolean()
  revokeAll?: boolean;
}
