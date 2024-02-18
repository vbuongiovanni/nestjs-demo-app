import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../../../mongodb';
import { AuthRequestDTO, RefreshTokenRequestDto, RegisterRequestDTO } from '../authentication.dto';
import { HashingService } from '../hashing';
import jwtConfig from '../../../../common/config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { CustomLogger } from '../../../../logger/custom-logger.service';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/common/types/user';
import { randomUUID } from 'crypto';
import { DuplicateRecordException, InvalidatedRefreshTokenException } from 'src/common/exceptions';
import { RefreshTokenService } from './refresh-token.service';
import { Types } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @Inject(JwtService) private readonly jwtService: JwtService,
    @Inject(HashingService) private readonly hashingService: HashingService,
    @Inject(jwtConfig.KEY) private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    @Inject(RefreshTokenService) private readonly refreshTokenService: RefreshTokenService,
    private readonly customLogger: CustomLogger,
  ) {
    this.customLogger.setContext('AuthService');
  }

  private async signToken<T>(userId: string, expiresIn: number, payload: T) {
    const userData = {
      sub: userId,
      ...payload,
    };
    return await this.jwtService.signAsync(userData, {
      audience: this.jwtConfiguration.audience,
      issuer: this.jwtConfiguration.issuer,
      secret: this.jwtConfiguration.secret,
      expiresIn,
    });
  }

  private async generateTokens(user: IUser) {
    const refreshTokenId = randomUUID();
    const { email, _id, permissions } = user;
    const userId = _id.toString();
    console.log('userId', userId);
    const [accessToken, refreshToken] = await Promise.all([
      this.signToken(userId, this.jwtConfiguration.accessTokenTtl, { email, permissions }),
      this.signToken(refreshTokenId, this.jwtConfiguration.refreshTokenTtl, { userId, refreshTokenId }),
    ]);
    await this.refreshTokenService.insert(userId, refreshTokenId);
    // await this.refreshTokenIdsStoragee.insert(userId, refreshTokenId);
    return { accessToken, refreshToken };
  }

  async login(loginBody: AuthRequestDTO) {
    const { email, password } = loginBody;
    const user = await this.userModel.findOne({ email }).catch((ex) => {
      this.customLogger.logger(`Error in auth.service userModel.findOne(${email}): ${ex.message}`, ex);
      return null;
    });

    const isMatch = await this.hashingService.compare(password, user?.password || '');

    if (!user || !isMatch) {
      throw new UnauthorizedException('Invalid user or incorrect credentials.');
    } else {
      return await this.generateTokens(user);
    }
  }

  async register(companyId: Types.ObjectId, registerBody: RegisterRequestDTO) {
    const hashedPassword = await this.hashingService.hash(registerBody.password);
    const newUser = new this.userModel({ ...registerBody, password: hashedPassword, companyId });
    return newUser
      .save()
      .then((user) => {
        return user.toObject();
      })
      .catch((ex) => {
        this.customLogger.logger(`Error in auth.service userModel.save(${newUser}): ${ex.message}`, ex);
        if (ex.code === 11000) {
          throw new DuplicateRecordException();
        }
        console.log(ex);
        return null;
      });
  }

  async refreshToken(refreshBody: RefreshTokenRequestDto) {
    try {
      const { refreshToken } = refreshBody;
      const { userId, refreshTokenId } = await this.jwtService.verifyAsync<{ userId: string; refreshTokenId: string }>(refreshToken, {
        secret: this.jwtConfiguration.secret,
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
      });

      const user = await this.userModel.findOne({ _id: userId }).catch((ex) => {
        this.customLogger.logger(`Error in auth.service userModel.findById(${userId}): ${ex.message}`, ex);
        return null;
      });
      if (!user) throw new UnauthorizedException('Invalid user.');

      console.log('userId', userId);
      // await this.refreshTokenIdsStoragee.validate(userId, refreshTokenId);

      const isValid = await this.refreshTokenService
        .validate(userId, refreshTokenId)
        .then(async (res) => {
          await this.refreshTokenService.invalidate(userId);
          return res;
        })
        .catch((ex) => {
          if (ex instanceof InvalidatedRefreshTokenException) {
            // this is where we can either notify the user that they have been compromised or
            // just log the instance in a db.
            throw new InvalidatedRefreshTokenException();
          }
        });
      return await this.generateTokens(user);
    } catch (ex) {
      throw new UnauthorizedException();
    }
  }
}
