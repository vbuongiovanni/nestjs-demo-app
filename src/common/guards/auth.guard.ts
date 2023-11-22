import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Auth, AuthDocument } from '../../mongodb';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    private readonly reflector: Reflector,
    @InjectModel(Auth.name) private readonly authModel: Model<AuthDocument>,
  ) {}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.header('Authorization');
    const authKey = this.configService.get<string>('authKey');
    const isPublic = this.reflector.get<boolean>('isPublic', context.getHandler());
    if (isPublic) return true;

    if (authHeader.includes('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const { userId } = request.body;
      return this.validateToken(userId, token);
    } else {
      const isAuthorized = authHeader === authKey;
      if (!isAuthorized) {
        throw new UnauthorizedException('Invalid authorization key');
      }
      return isAuthorized;
    }
  }

  async validateToken(userId: string, token: string): Promise<boolean> {
    const authDocument = await this.authModel.findOne({ userId, token });
    if (!authDocument) {
      throw new UnauthorizedException('Invalid bearer token');
    }
    const currentDate = new Date();
    const expirationDate = new Date(authDocument.expiration);
    const isExpired = currentDate.getTime() > expirationDate.getTime();

    if (isExpired) {
      throw new UnauthorizedException('Token has expired');
    } else {
      return true;
    }
  }
}
