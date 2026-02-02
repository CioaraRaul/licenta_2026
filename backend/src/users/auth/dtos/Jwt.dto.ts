import { IsNumber, IsString } from 'class-validator';

export class JwtPayload {
  @IsNumber()
  sub: number;

  @IsString()
  username: string;
}
