import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  Res,
  Session,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupCredentialsDto } from './dto/bodies/signup-credentials.dto';
import { AuthResponseInterface } from './interfaces/auth-response.interface';
import { LoginCredentialsDto } from './dto/bodies/login-credentials.dto';
import { SignupResponseInterface } from './interfaces/signup-response.interface';
import { VerifyOtpDto } from './dto/bodies/verify-otp.dto';
import { SendEmailDto } from './dto/bodies/send-email.dto';
import { SendResetPasswordResponseInterface } from './interfaces/send-reset-password-response.interface';
import { ResetPasswordDto } from './dto/bodies/reset-password.dto';
import { ResetPasswordResponseInterface } from './interfaces/reset-password-response.interface';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import { SetNewPasswordResponseInterface } from './interfaces/set-new-password-response.interface';
import { SetNewPasswordDto } from './dto/bodies/set-new-password.dto';
import { ResendVerificationEmailResponseInterface } from './interfaces/resend-verification-email-response.interface';
import { UpdateFullnameDto } from './dto/bodies/update-fullname.dto';
import { UpdateFullnameResponseInterfaceDto } from './interfaces/update-fullname-response.interface.dto';
import { OwnershipGuard } from './guard/ownership.guard';
import { GoogleAuthGuard } from './guard/google-auth.guard';
import { Request, Response } from 'express';
import { FacebookAuthGuard } from './guard/facebook-auth.guard';
import { AuthProviderEnum } from './enums/auth-provider.enum';
import { UpdateCoinDto } from './dto/bodies/update-coin.dto';
import { UpdateCoinResponseInterface } from './interfaces/update-coin-response.interface';
import { UpdateAvatarParamDto } from './dto/params/update-avatar-param.dto';
import { UpdateAvatarDto } from './dto/bodies/update-avatar.dto';
import { UpdateAvatarInterface } from './interfaces/update-avatar.interface';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  googleAuthRedirect(@Req() request: Request, @Res() response: Response) {
    console.log('User information from Google', request.user);
    const user = request.user as any;

    // Serialize user information into query string
    const params = new URLSearchParams({
      token: user.accessToken,
      email: user.email,
      fullName: user.fullName,
      provider: AuthProviderEnum.GOOGLE,
      picture: user.picture,
    });
    const deepLinkUrl = `quickmem://oauth/google/callback?${params.toString()}`;
    return response.redirect(deepLinkUrl);
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
  facebookAuthRedirect(@Req() request: Request, @Res() response: Response) {
    console.log('User information from Facebook', request.user);
    const user = request.user as any;

    // Serialize user information into query string
    const params = new URLSearchParams({
      token: user.accessToken,
      email: user.email,
      fullName: user.fullName,
      provider: AuthProviderEnum.FACEBOOK,
      picture: user.picture,
    });
    const deepLinkUrl = `quickmem://oauth/facebook/callback?${params.toString()}`;
    return response.redirect(deepLinkUrl);
  }

  @SkipThrottle()
  @HttpCode(HttpStatus.CREATED)
  @Post('/signup')
  async signUp(
    @Body() authCredentialsDto: SignupCredentialsDto,
  ): Promise<SignupResponseInterface> {
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
    return this.authService.login(authCredentialsDto);
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
  @HttpCode(HttpStatus.OK)
  @Post('/send-reset-password')
  async sendResetPassword(
    @Body() sendEmailDto: SendEmailDto,
  ): Promise<SendResetPasswordResponseInterface> {
    return this.authService.sendResetPassword(sendEmailDto);
  }

  @SkipThrottle()
  @HttpCode(HttpStatus.OK)
  @Post('/reset-password')
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<ResetPasswordResponseInterface> {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @UseGuards(OwnershipGuard)
  @SkipThrottle()
  @HttpCode(HttpStatus.OK)
  @Patch('/user/password')
  async setNewPassword(
    @Body() setNewPasswordDto: SetNewPasswordDto,
  ): Promise<SetNewPasswordResponseInterface> {
    return this.authService.setNewPassword(setNewPasswordDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @Patch('/user/avatar/:id')
  async updateAvatar(
    @Param() updateAvatarParamDto: UpdateAvatarParamDto,
    @Body() updateAvatarDto: UpdateAvatarDto,
  ): Promise<UpdateAvatarInterface> {
    return this.authService.updateAvatar(updateAvatarParamDto, updateAvatarDto);
  }

  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @HttpCode(HttpStatus.OK)
  @Post('/resend-verification-email')
  async resendVerificationEmail(
    @Body() sendEmailDto: SendEmailDto,
  ): Promise<ResendVerificationEmailResponseInterface> {
    return this.authService.resendVerificationEmail(sendEmailDto);
  }

  @UseGuards(OwnershipGuard)
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Post('/coin')
  @HttpCode(HttpStatus.OK)
  async updateCoin(
    @Body() updateCoinDto: UpdateCoinDto,
  ): Promise<UpdateCoinResponseInterface> {
    return this.authService.updateCoin(updateCoinDto);
  }
}
