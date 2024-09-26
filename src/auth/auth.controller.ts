import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Req,
  Session,
  UseGuards,
} from '@nestjs/common';
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
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import { SetNewPasswordResponseDto } from './dto/set-new-password-response.dto';
import { SetNewPasswordDto } from './dto/set-new-password.dto';
import { ResendVerificationEmailDto } from './dto/resend-verification-email.dto';
import { ResendVerificationEmailResponseDto } from './dto/resend-verification-email-response.dto';
import { UpdateFullnameDto } from './dto/update-fullname.dto';
import { UpdateFullnameResponseInterfaceDto } from './dto/update-fullname-response.interface.dto';
import { OwnershipGuard } from './guard/ownership.guard';
import { GoogleAuthGuard } from './guard/google-auth.guard';
import { Request } from 'express';
import { FacebookAuthGuard } from './guard/facebook-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  googleAuthRedirect(@Req() request: Request) {
    console.log('User information from Google', request.user);
    return {
      message: 'User information from Google',
      user: request.user,
    };
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth(
    @Session() session: Record<string, any>,
    @Req() request: Request,
  ) {
    // Guard sẽ xử lý yêu cầu đến Google OAuth
    console.log('User information from Google', request.user);
    console.log('Session', session);
  }

  @Get('facebook')
  @UseGuards(FacebookAuthGuard)
  async facebookAuth(@Req() request: Request) {
    // Guard sẽ xử lý yêu cầu đến Facebook OAuth
    console.log('User information from Facebook', request.user);
  }

  @Get('facebook/callback')
  @UseGuards(FacebookAuthGuard)
  facebookAuthRedirect(@Req() request: Request) {
    return {
      message: 'User information from Facebook',
      user: request.user,
    };
  }

  @SkipThrottle()
  @HttpCode(HttpStatus.CREATED)
  @Post('/signup')
  async signUp(
    @Body() authCredentialsDto: SignupCredentialsDto,
  ): Promise<SignupResponseDto> {
    return this.authService.signUp(authCredentialsDto);
  }

  @UseGuards(OwnershipGuard)
  @HttpCode(HttpStatus.OK)
  @Patch('/user/fullname')
  async updateFullname(
    @Body() updateFullnameDto: UpdateFullnameDto,
  ): Promise<UpdateFullnameResponseInterfaceDto> {
    return await this.authService.updateFullname(updateFullnameDto);
  }

  @SkipThrottle()
  @HttpCode(HttpStatus.OK)
  @Post('/login')
  async logIn(
    @Body() authCredentialsDto: LoginCredentialsDto,
  ): Promise<AuthResponseInterface> {
    return this.authService.logInWithEmail(authCredentialsDto);
  }

  @SkipThrottle()
  @HttpCode(HttpStatus.OK)
  @Post('/refresh-token')
  async refreshToken(
    @Body('refreshToken') refreshToken: string,
  ): Promise<{ accessToken: string }> {
    return this.authService.refreshToken(refreshToken);
  }

  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Post('/verify-otp')
  async verifyOtp(@Body() dto: VerifyOtpDto): Promise<AuthResponseInterface> {
    return this.authService.verifyOtp(dto);
  }

  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('/send-reset-password')
  async sendResetPassword(
    @Body() sendResetPasswordDto: SendResetPasswordDto,
  ): Promise<SendResetPasswordResponseDto> {
    return this.authService.sendResetPassword(sendResetPasswordDto);
  }

  @SkipThrottle()
  @HttpCode(HttpStatus.OK)
  @Post('/reset-password')
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<ResetPasswordResponseDto> {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @UseGuards(OwnershipGuard)
  @SkipThrottle()
  @HttpCode(HttpStatus.OK)
  @Patch('/user/password')
  async setNewPassword(
    @Body() setNewPasswordDto: SetNewPasswordDto,
  ): Promise<SetNewPasswordResponseDto> {
    return this.authService.setNewPassword(setNewPasswordDto);
  }

  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @HttpCode(HttpStatus.OK)
  @Post('/resend-verification-email')
  async resendVerificationEmail(
    @Body() resendVerificationEmailDto: ResendVerificationEmailDto,
  ): Promise<ResendVerificationEmailResponseDto> {
    return this.authService.resendVerificationEmail(resendVerificationEmailDto);
  }
}
