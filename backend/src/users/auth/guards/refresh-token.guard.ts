import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class RefreshJWTAuthGuards extends AuthGuard('jwt-refresh') {}
