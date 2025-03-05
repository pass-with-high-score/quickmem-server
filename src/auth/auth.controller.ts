import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
  Request as ReqUser,
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
import { Request, Response } from 'express';
import { FacebookAuthGuard } from './guard/facebook-auth.guard';
import { AuthProviderEnum } from './enums/auth-provider.enum';
import { UpdateCoinDto } from './dto/bodies/update-coin.dto';
import { UpdateCoinResponseInterface } from './interfaces/update-coin-response.interface';
import { UpdateAvatarDto } from './dto/bodies/update-avatar.dto';
import { UpdateAvatarInterface } from './interfaces/update-avatar.interface';
import { AuthGuard } from '@nestjs/passport';
import { GetUserDetailQueryDto } from './dto/queries/get-user-detail-query.dto';
import { GetUserDetailParamDto } from './dto/params/get-user-detail-param.dto';
import { UserDetailResponseInterface } from './interfaces/user-detail-response.interface';
import { VerifyPasswordBodyDto } from './dto/bodies/verify-password-body.dto';
import { VerifyPasswordResponseInterface } from './interfaces/verify-password-response.interface';
import { UpdateEmailDto } from './dto/bodies/update-email.dto';
import { UpdateEmailResponseInterfaceDto } from './interfaces/update-email-response.interface.dto';
import { VerifyEmailQueryDto } from './dto/queries/verify-email-query.dto';
import { ChangeUsernameBodyDto } from './dto/bodies/change-username-body.dto';
import { ChangePasswordResponseInterface } from './interfaces/change-password-response.interface';
import { SearchUserByUsernameQueryDto } from './dto/queries/search-user-by-username-query.dto';
import { UserResponseInterface } from './interfaces/user-response.interface';
import { GetUserProfileResponseInterface } from './interfaces/get-user-profile-response.interface';
import { logger } from '../winston-logger.service';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { GetAvatarsResponseInterface } from './interfaces/get-avatars-response.interface';
import { SocialSignupCredentialBodyDto } from './dto/bodies/social-signup-credential-body.dto';
import { SocialLoginCredentialBodyDto } from './dto/bodies/social-login-credential-body.dto';
import { CheckEmailQueryDto } from './dto/queries/check-email.query.dto';
import { CheckEmailResponseInterface } from './interfaces/check-email.response.interface';
import { GetNewTokenResponseInterface } from './interfaces/get-new-token.response.interface';

@Controller('auth')
@UseInterceptors(CacheInterceptor)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('facebook')
  @UseGuards(FacebookAuthGuard)
  @HttpCode(HttpStatus.OK)
  async facebookAuth(@Req() request: Request) {
    // Guard sẽ xử lý yêu cầu đến Facebook OAuth
    console.log('User information from Facebook', request.user);
  }

  @Get('facebook/callback')
  @UseGuards(FacebookAuthGuard)
  @HttpCode(HttpStatus.OK)
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
      isSignUp: user.isSignUp,
    });
    const deepLinkUrl = `quickmem://oauth/facebook/callback?${params.toString()}`;
    return response.redirect(deepLinkUrl);
  }

  @Get('/user/search')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  async searchUserByUsername(
    @Query() searchUserByUsernameQueryDto: SearchUserByUsernameQueryDto,
  ): Promise<UserResponseInterface[]> {
    return this.authService.searchUserByUsername(searchUserByUsernameQueryDto);
  }

  @Get('/avatars')
  @HttpCode(HttpStatus.OK)
  async getAvatars(): Promise<GetAvatarsResponseInterface[]> {
    return this.authService.getAvatars();
  }

  @Get('/me/:id')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  async getUserProfileDetail(
    @ReqUser() req,
    @Param() getUserDetailParamDto: GetUserDetailParamDto,
  ): Promise<UserDetailResponseInterface> {
    const getUserDetailQueryDto = new GetUserDetailQueryDto();
    getUserDetailQueryDto.isOwner = req.user.id === getUserDetailParamDto.id;
    return this.authService.getUserProfileDetail(
      getUserDetailQueryDto,
      getUserDetailParamDto,
    );
  }

  @Get('/profile')
  async getUserProfileById(
    @ReqUser() req,
  ): Promise<GetUserProfileResponseInterface> {
    const userId = req.user.id;
    return this.authService.getUserProfileById(userId);
  }

  @Get('/verify-email')
  @HttpCode(HttpStatus.OK)
  async verifyEmail(
    @Query() verifyEmailDto: VerifyEmailQueryDto,
    @Res() response: Response,
  ): Promise<void> {
    try {
      const result = await this.authService.verifyEmail(verifyEmailDto);
      const successHtml = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        margin: 0;
      }
      .container {
        background-color: #fff;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        max-width: 400px;
        text-align: center;
      }
      h1 {
        font-size: 24px;
        color: #333;
      }
      p {
        font-size: 16px;
        color: #555;
        margin-bottom: 20px;
      }
      .footer {
        margin-top: 30px;
        font-size: 12px;
        color: #888;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Email Verified!</h1>
      <p>Your email has been successfully verified and updated to:</p>
      <p><strong>${result.email}</strong></p>
      <div class="footer">
        <p>Thank you for verifying your email!</p>
      </div>
    </div>
  </body>
  </html>
  `;
      if (result.success) {
        response.status(HttpStatus.OK).send(successHtml);
      }
    } catch (e) {
      logger.error('Error verifying email', e);
      const errorHtml = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification Failed</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        margin: 0;
      }
      .container {
        background-color: #fff;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        max-width: 400px;
        text-align: center;
      }
      h1 {
        font-size: 24px;
        color: #d9534f;
      }
      p {
        font-size: 16px;
        color: #555;
        margin-bottom: 20px;
      }
      .retry-btn {
        display: inline-block;
        padding: 10px 20px;
        background-color: #007bff;
        color: #fff;
        text-decoration: none;
        border-radius: 5px;
        margin-top: 20px;
      }
      .footer {
        margin-top: 30px;
        font-size: 12px;
        color: #888;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Email Verification Failed</h1>
      <p>Your email verification failed. The token might have expired or is invalid.</p>
      <p>Please open the <strong>QuickMem</strong> app to resend the verification email.</p>
      <div class="footer">
        <p>If the issue persists, contact support for further assistance.</p>
      </div>
    </div>
  </body>
  </html>
  `;
      response.status(HttpStatus.BAD_REQUEST).send(errorHtml);
    }
  }

  @SkipThrottle()
  @HttpCode(HttpStatus.CREATED)
  @Post('/signup')
  async signUp(
    @Body() authCredentialsDto: SignupCredentialsDto,
  ): Promise<SignupResponseInterface> {
    return this.authService.signUp(authCredentialsDto);
  }

  @SkipThrottle()
  @HttpCode(HttpStatus.CREATED)
  @Post('/signup/google')
  async createUserWithGoogle(
    @Body() socialSignupCredentialBodyDto: SocialSignupCredentialBodyDto,
  ): Promise<AuthResponseInterface> {
    return this.authService.createUserWithGoogle(socialSignupCredentialBodyDto);
  }

  @UseGuards(OwnershipGuard)
  @HttpCode(HttpStatus.OK)
  @Patch('/user/fullname')
  async updateFullname(
    @ReqUser() req,
    @Body() updateFullnameDto: UpdateFullnameDto,
  ): Promise<UpdateFullnameResponseInterfaceDto> {
    const userId = req.user.id;
    return await this.authService.updateFullname(updateFullnameDto, userId);
  }

  @UseGuards(OwnershipGuard)
  @HttpCode(HttpStatus.OK)
  @Patch('/user/email')
  async updateEmail(
    @ReqUser() req,
    @Body() updateEmailDto: UpdateEmailDto,
  ): Promise<UpdateEmailResponseInterfaceDto> {
    const userId = req.user.id;
    return await this.authService.updateEmail(updateEmailDto, userId);
  }

  @UseGuards(OwnershipGuard)
  @HttpCode(HttpStatus.OK)
  @Patch('/user/username')
  async changeUsername(
    @ReqUser() req,
    @Body() changeUsernameBodyDto: ChangeUsernameBodyDto,
  ): Promise<ChangePasswordResponseInterface> {
    const userId = req.user.id;
    return this.authService.changeUsername(changeUsernameBodyDto, userId);
  }

  @UseGuards(OwnershipGuard)
  @SkipThrottle()
  @HttpCode(HttpStatus.OK)
  @Patch('/user/password')
  async setNewPassword(
    @ReqUser() req,
    @Body() setNewPasswordDto: SetNewPasswordDto,
  ): Promise<SetNewPasswordResponseInterface> {
    const email = req.user.email;
    return this.authService.setNewPassword(setNewPasswordDto, email);
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
  @Post('/login/google')
  async loginGoogle(
    @Body() socialLoginCredentialBodyDto: SocialLoginCredentialBodyDto,
  ): Promise<AuthResponseInterface> {
    return this.authService.loginGoogle(socialLoginCredentialBodyDto);
  }

  @SkipThrottle()
  @HttpCode(HttpStatus.OK)
  @Post('/refresh-token')
  async refreshToken(
    @Body('refreshToken') refreshToken: string,
  ): Promise<GetNewTokenResponseInterface> {
    return this.authService.refreshToken(refreshToken);
  }

  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Post('/verify-otp')
  async verifyOtp(@Body() dto: VerifyOtpDto): Promise<AuthResponseInterface> {
    return this.authService.verifyOtp(dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/verify-password')
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  async verifyPassword(
    @ReqUser() req,
    @Body() verifyPasswordDto: VerifyPasswordBodyDto,
  ): Promise<VerifyPasswordResponseInterface> {
    const userId = req.user.id;
    return this.authService.verifyPassword(verifyPasswordDto, userId);
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

  @SkipThrottle()
  @HttpCode(HttpStatus.OK)
  @Post('/check-email')
  async checkEmail(
    @Query() checkEmailQueryDto: CheckEmailQueryDto,
  ): Promise<CheckEmailResponseInterface> {
    return this.authService.checkEmail(checkEmailQueryDto);
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
    @ReqUser() req,
    @Body() updateCoinDto: UpdateCoinDto,
  ): Promise<UpdateCoinResponseInterface> {
    const userId = req.user.id;
    return this.authService.updateCoin(updateCoinDto, userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @Patch('/user/avatar')
  async updateAvatar(
    @ReqUser() req,
    @Body() updateAvatarDto: UpdateAvatarDto,
  ): Promise<UpdateAvatarInterface> {
    const userId = req.user.id;
    return this.authService.updateAvatar(userId, updateAvatarDto);
  }
}
