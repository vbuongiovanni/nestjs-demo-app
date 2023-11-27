import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLogoutRequestDTO, AuthRequestDTO, AuthResponseDTO } from './auth.dto';
import { plainToInstance } from 'class-transformer';
import { Public } from '../../common/decorators';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body() body: AuthRequestDTO): Promise<AuthResponseDTO> {
    const authResponse = await this.authService.login(body);
    return plainToInstance(AuthResponseDTO, authResponse, { excludeExtraneousValues: true });
  }

  @Post('logout')
  async logout(@Body() body: AuthLogoutRequestDTO): Promise<Record<string, never>> {
    const logoutResponse = await this.authService.logout(body);
    return logoutResponse;
  }
}
