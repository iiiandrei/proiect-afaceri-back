import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpStatus,
  UnauthorizedException,
  Inject,
  HttpException,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '../modules/auth/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  @Inject(AuthService)
  public readonly service: AuthService;

  public async canActivate(ctx: ExecutionContext): Promise<boolean> | never {
    const req: Request = ctx.switchToHttp().getRequest();
    const authorization: string = req.headers['authorization'];
    if (!authorization) {
      throw new UnauthorizedException();
    }

    const bearer: string[] = authorization.split(' ');

    if (!bearer || bearer.length < 2) {
      throw new UnauthorizedException();
    }

    const token: string = bearer[1];

    const response = await this.service.validateToken({token});
    req['user'] = response.data;
    if (response.status === HttpStatus.BAD_REQUEST) {
      throw new HttpException (
        {
          statusCode: HttpStatus.FORBIDDEN,
          message: ['Token expired'],
        },
        HttpStatus.FORBIDDEN,
      );
    }
    if (response.status !== HttpStatus.OK) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
