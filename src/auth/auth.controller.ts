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
import { GetUserProfileParamDto } from './dto/params/get-user-profile.param.dto';
import { GetUserProfileResponseInterface } from './interfaces/get-user-profile-response.interface';
import { UpdateRoleDto } from './dto/bodies/update-role.dto';
import { UpdateRoleResponseInterfaceDto } from './interfaces/update-role-response.interface.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  @HttpCode(HttpStatus.OK)
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

  @Get('/me/:id')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  async getUserProfileDetail(
    @Query() getUserDetailQueryDto: GetUserDetailQueryDto,
    @Param() getUserDetailParamDto: GetUserDetailParamDto,
  ): Promise<UserDetailResponseInterface> {
    return this.authService.getUserProfileDetail(
      getUserDetailQueryDto,
      getUserDetailParamDto,
    );
  }

  @Get('/profile/:id')
  @UseGuards(OwnershipGuard)
  @HttpCode(HttpStatus.OK)
  async getUserProfileById(
    @Param() getUserProfileParamDto: GetUserProfileParamDto,
  ): Promise<GetUserProfileResponseInterface> {
    return this.authService.getUserProfileById(getUserProfileParamDto);
  }

  @Get('/verify-email')
  async verifyEmail(
    @Query() verifyEmailDto: VerifyEmailQueryDto,
    @Res() response: Response,
  ): Promise<void> {
    const result = await this.authService.verifyEmail(verifyEmailDto);

    const htmlContent = `
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
          margin: 0;
          padding: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
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

    response
      .status(result.success ? HttpStatus.OK : HttpStatus.BAD_REQUEST)
      .send(htmlContent);
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

  @UseGuards(OwnershipGuard)
  @HttpCode(HttpStatus.OK)
  @Patch('/user/email')
  async updateEmail(
    @Body() updateEmailDto: UpdateEmailDto,
  ): Promise<UpdateEmailResponseInterfaceDto> {
    return await this.authService.updateEmail(updateEmailDto);
  }

  @UseGuards(OwnershipGuard)
  @HttpCode(HttpStatus.OK)
  @Patch('/user/username')
  async changeUsername(
    @Body() changeUsernameBodyDto: ChangeUsernameBodyDto,
  ): Promise<ChangePasswordResponseInterface> {
    return this.authService.changeUsername(changeUsernameBodyDto);
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

  @UseGuards(OwnershipGuard)
  @SkipThrottle()
  @HttpCode(HttpStatus.OK)
  @Patch('/user/role')
  async updateRole(
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<UpdateRoleResponseInterfaceDto> {
    return this.authService.updateRole(updateRoleDto);
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

  @UseGuards(AuthGuard('jwt'))
  @Post('/verify-password')
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  async verifyPassword(
    @Body() verifyPasswordDto: VerifyPasswordBodyDto,
  ): Promise<VerifyPasswordResponseInterface> {
    return this.authService.verifyPassword(verifyPasswordDto);
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
