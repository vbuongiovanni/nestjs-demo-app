import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from 'src/common/config/jwt.config';
import { Request } from 'express';

@Injectable()
export class BearerGuard implements CanActivate {
  constructor(
    @Inject(JwtService) private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const res = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(res);
    if (!token) {
      throw new UnauthorizedException();
    } else {
      try {
        const payload = await this.jwtService.verifyAsync(token, this.jwtConfiguration);
        res['user'] = payload;
      } catch (ex) {
        console.error(ex);
        throw new UnauthorizedException();
      }
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') || [];
    return type === 'Bearer' ? token : null;
  }
}
