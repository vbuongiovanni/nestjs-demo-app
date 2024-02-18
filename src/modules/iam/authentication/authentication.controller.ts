import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './services/authentication.service';
import { AuthRequestDTO, AuthResponseDTO, RefreshTokenRequestDto, RegisterRequestDTO, RegisterResponseDTO } from './authentication.dto';
import { plainToInstance } from 'class-transformer';
import { AuthType } from '../../../common/types/authType';
import { IUser } from 'src/common/types';
import { ReqAuthType, ActiveUser } from 'src/common/decorators';
import { Types } from 'mongoose';

@Controller('authentication')
@ReqAuthType(AuthType.Public)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginBody: AuthRequestDTO): Promise<AuthResponseDTO> {
    const loginData = await this.authService.login(loginBody);
    return plainToInstance(AuthResponseDTO, loginData, { excludeExtraneousValues: true });
  }

  @Post('refresh-token')
  async refreshTokens(@Body() refreshTokenDto: RefreshTokenRequestDto): Promise<AuthResponseDTO> {
    const refreshTokenData = await this.authService.refreshToken(refreshTokenDto);
    return plainToInstance(AuthResponseDTO, refreshTokenData, { excludeExtraneousValues: true });
  }

  @ReqAuthType(AuthType.Bearer)
  @Post('register')
  async register(@ActiveUser() user: IUser, @Body() registerBody: RegisterRequestDTO): Promise<RegisterResponseDTO> {
    // const companyId = new Types.ObjectId(user.companyId);
    const companyId = new Types.ObjectId('65d16af4244f46376139edbd');
    const registerData = await this.authService.register(companyId, registerBody);
    return plainToInstance(RegisterResponseDTO, registerData, { excludeExtraneousValues: true });
  }
}
