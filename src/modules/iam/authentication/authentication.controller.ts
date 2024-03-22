import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './services/authentication.service';
import {
  AuthCompanySelectionResponseDTO,
  AuthRequestDTO,
  AuthResponseDTO,
  RefreshTokenRequestDto,
  RegisterRequestDTO,
  RegisterResponseDTO,
} from './authentication.dto';
import { plainToInstance } from 'class-transformer';
import { AuthType } from '../../../common/types/authType';
import { IUser } from 'src/common/types';
import { ReqAuthType, ActiveUser } from 'src/common/decorators';

@Controller('authentication')
@ReqAuthType(AuthType.Public)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginBody: AuthRequestDTO): Promise<AuthResponseDTO | AuthCompanySelectionResponseDTO> {
    const preLoginValue = await this.authService.preLogin(loginBody);
    const resKeys = Object.keys(preLoginValue);
    if (resKeys.includes('accessToken') && resKeys.includes('refreshToken')) {
      return plainToInstance(AuthResponseDTO, { ...preLoginValue, responseType: 'tokens' }, { excludeExtraneousValues: true });
    } else {
      return plainToInstance(AuthCompanySelectionResponseDTO, { companies: preLoginValue }, { excludeExtraneousValues: true });
    }
  }

  @Post('refresh-token')
  async refreshTokens(@Body() refreshTokenDto: RefreshTokenRequestDto): Promise<AuthResponseDTO> {
    const refreshTokenData = await this.authService.refreshToken(refreshTokenDto);
    return plainToInstance(AuthResponseDTO, refreshTokenData, { excludeExtraneousValues: true });
  }

  @ReqAuthType(AuthType.Bearer)
  @Post('register')
  async register(@ActiveUser() user: IUser, @Body() registerBody: RegisterRequestDTO): Promise<RegisterResponseDTO> {
    const registerData = await this.authService.register(registerBody);
    return plainToInstance(RegisterResponseDTO, registerData, { excludeExtraneousValues: true });
  }
}
