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
import { UserCompanies } from 'src/mongodb/schemas/user-companies';
import { TCompany, TUserCompany } from 'src/common/types';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(UserCompanies.name) private readonly userCompaniesModel: Model<UserCompanies>,
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

  private async generateTokens(user: IUser, companyId: Types.ObjectId) {
    const refreshTokenId = randomUUID();
    const { email, _id } = user;
    const pipeline = [{ $match: { userId: user._id, companyId } }, { $limit: 1 }];
    try {
      const [userCompany]: TUserCompany[] = await this.userCompaniesModel.aggregate(pipeline);
      if (!userCompany) throw new BadRequestException('Invalid company or user');
      const roleId = userCompany.roleId;
      const userId = _id.toString();
      const [accessToken, refreshToken] = await Promise.all([
        this.signToken(userId, this.jwtConfiguration.accessTokenTtl, { email, companyId, roleId }),
        this.signToken(refreshTokenId, this.jwtConfiguration.refreshTokenTtl, { userId, refreshTokenId, companyId }),
      ]);
      await this.refreshTokenService.insert(userId, refreshTokenId);
      return { accessToken, refreshToken };
    } catch (ex) {
      this.customLogger.logger(`Error in auth.service generateTokens: ${ex.message}`, ex);
    }
  }

  async preLogin(loginBody: AuthRequestDTO) {
    const { email, password, activeCompanyId } = loginBody;
    try {
      const [user]: IUser[] = await this.userModel.aggregate([
        { $match: { email } },
        { $limit: 1 },
        { $lookup: { from: 'companies', localField: 'companies', foreignField: '_id', as: 'companies' } },
      ]);
      const isMatch = await this.hashingService.compare(password, user?.password || '');
      if (!user || !isMatch) {
        throw new UnauthorizedException('Invalid user or incorrect credentials.');
      } else {
        try {
          const populatedCompanies = user?.companies || [];
          const companies = populatedCompanies as unknown as TCompany[];
          if (companies.length === 1) {
            const [activeCompany] = companies;
            return await this.generateTokens(user, activeCompany._id);
          } else if (activeCompanyId) {
            const company = companies.find((c) => c._id.toString() === activeCompanyId.toString());
            if (company) {
              return await this.generateTokens(user, company._id);
            } else {
              throw new BadRequestException('Invalid company.');
            }
          } else {
            return companies;
          }
        } catch (ex) {
          this.customLogger.logger(`Error in auth.service userCompaniesModel.find(${email}): ${ex.message}`, ex);
          return null;
        }
      }
    } catch (ex) {
      this.customLogger.logger(`Error in auth.service userModel.findOne(${email}): ${ex.message}`, ex);
      return null;
    }
  }

  async login(loginBody: AuthRequestDTO) {
    const { email, password } = loginBody;
    try {
      const [user]: IUser[] = await this.userModel.aggregate([{ $match: { email } }, { $limit: 1 }]);
      const isMatch = await this.hashingService.compare(password, user?.password || '');
      if (!user || !isMatch) {
        throw new UnauthorizedException('Invalid user or incorrect credentials.');
      } else {
        try {
          const userCompanies: TUserCompany[] = await this.userCompaniesModel.aggregate([{ $match: { userId: user._id } }]);
          let companyId: undefined | Types.ObjectId = undefined;
          let roleId: undefined | Types.ObjectId = undefined;
          if (userCompanies.length === 1) {
            const [userCompany] = userCompanies;
            companyId = userCompany.companyId;
            roleId = userCompany.roleId;
          }
          return await this.generateTokens(user, companyId);
        } catch (ex) {
          this.customLogger.logger(`Error in auth.service userCompaniesModel.find(${email}): ${ex.message}`, ex);
          return null;
        }
      }
    } catch (ex) {
      this.customLogger.logger(`Error in auth.service userModel.findOne(${email}): ${ex.message}`, ex);
      return null;
    }
  }

  async register(registerBody: RegisterRequestDTO) {
    const hashedPassword = await this.hashingService.hash(registerBody.password);
    const newUserObject = { ...registerBody, password: hashedPassword, companies: [] };
    try {
      const newUser = new this.userModel(newUserObject);
      return newUser.save().then((user) => {
        return user.toObject();
      });
    } catch (ex) {
      this.customLogger.logger(`Error in auth.service userModel.save(${newUserObject}): ${ex.message}`, ex);
      if (ex.code === 11000) {
        throw new DuplicateRecordException();
      }
      return null;
    }
  }

  async refreshToken(refreshBody: RefreshTokenRequestDto) {
    try {
      const { refreshToken } = refreshBody;
      const { userId, refreshTokenId, companyId } = await this.jwtService.verifyAsync<{
        userId: string;
        refreshTokenId: string;
        companyId: string;
      }>(refreshToken, {
        secret: this.jwtConfiguration.secret,
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
      });
      const mongoUserId = new Types.ObjectId(userId);
      const mongoCompanyId = new Types.ObjectId(companyId);
      const [user]: IUser[] = await this.userModel.aggregate([{ $match: { _id: mongoUserId } }]);

      if (!user) throw new UnauthorizedException('Invalid user.');

      await this.refreshTokenService.validate(userId, refreshTokenId).then(async (res) => {
        await this.refreshTokenService.invalidate(userId);
        return res;
      });

      return await this.generateTokens(user, mongoCompanyId);
    } catch (ex) {
      if (ex instanceof InvalidatedRefreshTokenException) {
        // this is where we can either notify the user that they have been compromised or
        // just log the instance in a db.
      }
      throw ex;
    }
  }
}
