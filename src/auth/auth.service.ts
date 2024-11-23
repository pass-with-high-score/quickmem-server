import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { SignupCredentialsDto } from './dto/bodies/signup-credentials.dto';
import { AuthResponseInterface } from './interfaces/auth-response.interface';
import { LoginCredentialsDto } from './dto/bodies/login-credentials.dto';
import { SignupResponseInterface } from './interfaces/signup-response.interface';
import { VerifyOtpDto } from './dto/bodies/verify-otp.dto';
import { SendEmailDto } from './dto/bodies/send-email.dto';
import { SendResetPasswordResponseInterface } from './interfaces/send-reset-password-response.interface';
import { ResetPasswordDto } from './dto/bodies/reset-password.dto';
import { ResetPasswordResponseInterface } from './interfaces/reset-password-response.interface';
import { SetNewPasswordResponseInterface } from './interfaces/set-new-password-response.interface';
import { SetNewPasswordDto } from './dto/bodies/set-new-password.dto';
import { ResendVerificationEmailResponseInterface } from './interfaces/resend-verification-email-response.interface';
import { UpdateFullnameDto } from './dto/bodies/update-fullname.dto';
import { UpdateFullnameResponseInterfaceDto } from './interfaces/update-fullname-response.interface.dto';
import axios from 'axios';
import { OAuth2Client } from 'google-auth-library';
import { logger } from '../winston-logger.service';
import { UpdateCoinDto } from './dto/bodies/update-coin.dto';
import { UpdateCoinResponseInterface } from './interfaces/update-coin-response.interface';
import { UpdateAvatarParamDto } from './dto/params/update-avatar-param.dto';
import { UpdateAvatarDto } from './dto/bodies/update-avatar.dto';
import { UpdateAvatarInterface } from './interfaces/update-avatar.interface';
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

@Injectable()
export class AuthService {
  private googleClient: OAuth2Client;

  constructor(private readonly usersRepository: AuthRepository) {
    this.googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }

  async signUp(
    authCredentialsDto: SignupCredentialsDto,
  ): Promise<SignupResponseInterface> {
    return await this.usersRepository.createUser(authCredentialsDto);
  }

  async updateFullname(
    updateFullnameDto: UpdateFullnameDto,
  ): Promise<UpdateFullnameResponseInterfaceDto> {
    return await this.usersRepository.updateFullname(updateFullnameDto);
  }

  async login(
    authCredentialsDto: LoginCredentialsDto,
  ): Promise<AuthResponseInterface> {
    const { email, idToken, provider } = authCredentialsDto;
    logger.info('Login attempt', { email, provider });

    if (provider === 'GOOGLE') {
      if (!idToken) {
        throw new UnauthorizedException(
          'ID Token is required for Google login',
        );
      }

      try {
        const user = await axios.get(
          'https://www.googleapis.com/oauth2/v3/userinfo?access_token=' +
            idToken,
        );
        if (user.data.email !== email) {
          throw new UnauthorizedException('Invalid Google ID token');
        }
      } catch (error) {
        console.error('Error verifying Google ID token:', error);
        throw new UnauthorizedException('Invalid Google ID token');
      }
    } else if (provider === 'FACEBOOK') {
      if (!idToken) {
        throw new UnauthorizedException(
          'Access Token is required for Facebook login',
        );
      }

      try {
        const response = await axios.get(
          `https://graph.facebook.com/me?access_token=${idToken}&fields=email`,
        );
        const payload = response.data;
        if (!payload || payload.email !== email) {
          throw new UnauthorizedException('Invalid Facebook access token');
        }
      } catch (error) {
        console.log('Error verifying Facebook access token:', error);
        throw new UnauthorizedException('Invalid Facebook access token');
      }
    }

    // Proceed with the existing login logic
    return await this.usersRepository.validateUser(authCredentialsDto);
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    return await this.usersRepository.createAccessTokenFromRefreshToken(
      refreshToken,
    );
  }

  async verifyOtp(dto: VerifyOtpDto): Promise<AuthResponseInterface> {
    return this.usersRepository.verifyOtp(dto);
  }

  async sendResetPassword(
    sendEmailDto: SendEmailDto,
  ): Promise<SendResetPasswordResponseInterface> {
    return this.usersRepository.sendResetPasswordEmail(sendEmailDto);
  }

  async resetPassword(
    resetPasswordDto: ResetPasswordDto,
  ): Promise<ResetPasswordResponseInterface> {
    return this.usersRepository.resetPassword(resetPasswordDto);
  }

  async setNewPassword(
    setNewPasswordDto: SetNewPasswordDto,
  ): Promise<SetNewPasswordResponseInterface> {
    return this.usersRepository.setNewPassword(setNewPasswordDto);
  }

  async resendVerificationEmail(
    sendEmailDto: SendEmailDto,
  ): Promise<ResendVerificationEmailResponseInterface> {
    return this.usersRepository.resendVerificationEmail(sendEmailDto);
  }

  async updateCoin(
    updateCoinDto: UpdateCoinDto,
  ): Promise<UpdateCoinResponseInterface> {
    return this.usersRepository.updateCoin(updateCoinDto);
  }

  async updateAvatar(
    updateAvatarParamDto: UpdateAvatarParamDto,
    updateAvatarDto: UpdateAvatarDto,
  ): Promise<UpdateAvatarInterface> {
    return this.usersRepository.updateAvatar(
      updateAvatarParamDto,
      updateAvatarDto,
    );
  }

  async getUserProfileDetail(
    getUserDetailQueryDto: GetUserDetailQueryDto,
    getUserDetailParamDto: GetUserDetailParamDto,
  ): Promise<UserDetailResponseInterface> {
    return this.usersRepository.getUserProfileDetail(
      getUserDetailQueryDto,
      getUserDetailParamDto,
    );
  }

  async verifyPassword(
    verifyPasswordDto: VerifyPasswordBodyDto,
  ): Promise<VerifyPasswordResponseInterface> {
    return this.usersRepository.verifyPassword(verifyPasswordDto);
  }

  async updateEmail(
    updateEmailDto: UpdateEmailDto,
  ): Promise<UpdateEmailResponseInterfaceDto> {
    return this.usersRepository.updateEmail(updateEmailDto);
  }

  async verifyEmail(
    verifyEmailDto: VerifyEmailQueryDto,
  ): Promise<UpdateEmailResponseInterfaceDto> {
    return this.usersRepository.verifyEmail(verifyEmailDto);
  }

  async changeUsername(
    changeUsernameBodyDto: ChangeUsernameBodyDto,
  ): Promise<ChangePasswordResponseInterface> {
    return this.usersRepository.changeUsername(changeUsernameBodyDto);
  }

  async searchUserByUsername(
    searchUserByUsernameQueryDto: SearchUserByUsernameQueryDto,
  ): Promise<UserResponseInterface[]> {
    return this.usersRepository.searchUserByUsername(
      searchUserByUsernameQueryDto,
    );
  }

  async getUserProfileById(
    getUserProfileParamDto: GetUserProfileParamDto,
  ): Promise<GetUserProfileResponseInterface> {
    return this.usersRepository.getUserProfileById(getUserProfileParamDto);
  }

  async updateRole(
    updateRoleDto: UpdateRoleDto,
  ): Promise<UpdateRoleResponseInterfaceDto> {
    return this.usersRepository.updateRole(updateRoleDto);
  }
}
