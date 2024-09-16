import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupCredentialsDto } from './dto/signup-credentials.dto';
import { AuthResponseInterface } from './dto/auth-response.interface';
import { LoginCredentialsDto } from './dto/login-credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async signUp(
    @Body() authCredentialsDto: SignupCredentialsDto,
  ): Promise<AuthResponseInterface> {
    return this.authService.signUp(authCredentialsDto);
  }

  @Post('/login')
  async logIn(
    @Body() authCredentialsDto: LoginCredentialsDto,
  ): Promise<AuthResponseInterface> {
    const { email } = authCredentialsDto;
    if (email) {
      console.log('email');
      return this.authService.logInWithEmail(authCredentialsDto);
    } else {
      console.log('username');
      return this.authService.logInWithUsername(authCredentialsDto);
    }
  }

  @Post('/refresh-token')
  async refreshToken(
    @Body('refreshToken') refreshToken: string,
  ): Promise<{ accessToken: string }> {
    return this.authService.refreshToken(refreshToken);
  }
}
