import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './services/authentication.service';
import { AuthRequestDTO, AuthResponseDTO, RefreshTokenRequestDto, RegisterRequestDTO, RegisterResponseDTO } from './authentication.dto';
import { plainToInstance } from 'class-transformer';
import { AuthType } from '../../../common/types/authType';
import { ReqAuthType } from 'src/common/decorators/reqAuthType.decorator';

@Controller('authentication')
@ReqAuthType(AuthType.Public)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginBody: AuthRequestDTO): Promise<AuthResponseDTO> {
    const loginData = await this.authService.login(loginBody);
    return plainToInstance(AuthResponseDTO, loginData, { excludeExtraneousValues: true });
  }

  @Post('register')
  async register(@Body() registerBody: RegisterRequestDTO): Promise<RegisterResponseDTO> {
    const registerData = await this.authService.register(registerBody);
    return plainToInstance(RegisterResponseDTO, registerData, { excludeExtraneousValues: true });
  }

  @Post('refresh-token')
  async refreshTokens(@Body() refreshTokenDto: RefreshTokenRequestDto): Promise<AuthResponseDTO> {
    const refreshTokenData = await this.authService.refreshToken(refreshTokenDto);
    return plainToInstance(AuthResponseDTO, refreshTokenData, { excludeExtraneousValues: true });
  }
}
