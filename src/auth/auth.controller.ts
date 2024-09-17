import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupCredentialsDto } from './dto/signup-credentials.dto';
import { AuthResponseInterface } from './dto/auth-response.interface';
import { LoginCredentialsDto } from './dto/login-credentials.dto';
import { EmailDto } from './dto/email.dto';
import { SignupResponseDto } from './dto/signup-response.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async signUp(
    @Body() authCredentialsDto: SignupCredentialsDto,
  ): Promise<SignupResponseDto> {
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

  @Post('/send-email')
  async sendEmail(@Body() dto: EmailDto): Promise<any> {
    console.log('Controller - DTO:', dto);
    return this.authService.sendEmail(dto);
  }

  @Post('/verify-otp')
  async verifyOtp(@Body() dto: VerifyOtpDto): Promise<{ accessToken: string }> {
    return this.authService.verifyOtp(dto);
  }
}
