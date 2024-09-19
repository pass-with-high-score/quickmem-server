import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupCredentialsDto } from './dto/signup-credentials.dto';
import { AuthResponseInterface } from './dto/auth-response.interface';
import { LoginCredentialsDto } from './dto/login-credentials.dto';
import { SignupResponseDto } from './dto/signup-response.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { SendResetPasswordDto } from './dto/send-reset-password.dto';
import { SendResetPasswordResponseDto } from './dto/send-reset-password-response.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ResetPasswordResponseDto } from './dto/reset-password-response.dto';

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

  @Post('/verify-otp')
  async verifyOtp(@Body() dto: VerifyOtpDto): Promise<AuthResponseInterface> {
    return this.authService.verifyOtp(dto);
  }

  @Post('/send-reset-password')
  async sendResetPassword(
    @Body() sendResetPasswordDto: SendResetPasswordDto,
  ): Promise<SendResetPasswordResponseDto> {
    return this.authService.sendResetPassword(sendResetPasswordDto);
  }

  @Post('/reset-password')
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<ResetPasswordResponseDto> {
    return this.authService.resetPassword(resetPasswordDto);
  }
}
