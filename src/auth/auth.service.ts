import { Injectable } from '@nestjs/common';
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
import { UpdateCoinDto } from './dto/bodies/update-coin.dto';
import { UpdateCoinResponseInterface } from './interfaces/update-coin-response.interface';
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
import { GetUserProfileResponseInterface } from './interfaces/get-user-profile-response.interface';
import { UpdateRoleDto } from './dto/bodies/update-role.dto';
import { UpdateRoleResponseInterfaceDto } from './interfaces/update-role-response.interface.dto';
import { GetAvatarsResponseInterface } from './interfaces/get-avatars-response.interface';
import { SocialSignupCredentialBodyDto } from './dto/bodies/social-signup-credential-body.dto';
import { SocialLoginCredentialBodyDto } from './dto/bodies/social-login-credential-body.dto';
import { CheckEmailQueryDto } from './dto/queries/check-email.query.dto';
import { CheckEmailResponseInterface } from './interfaces/check-email.response.interface';
import { GetNewTokenResponseInterface } from './interfaces/get-new-token.response.interface';

@Injectable()
export class AuthService {
  constructor(private readonly usersRepository: AuthRepository) {}

  async signUp(
    authCredentialsDto: SignupCredentialsDto,
  ): Promise<SignupResponseInterface> {
    return await this.usersRepository.createUser(authCredentialsDto);
  }

  async updateFullname(
    updateFullnameDto: UpdateFullnameDto,
    userId: string,
  ): Promise<UpdateFullnameResponseInterfaceDto> {
    return await this.usersRepository.updateFullname(updateFullnameDto, userId);
  }

  async login(
    authCredentialsDto: LoginCredentialsDto,
  ): Promise<AuthResponseInterface> {
    // Proceed with the existing login logic
    return await this.usersRepository.validateUser(authCredentialsDto);
  }

  async refreshToken(
    refreshToken: string,
  ): Promise<GetNewTokenResponseInterface> {
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
    email: string,
  ): Promise<SetNewPasswordResponseInterface> {
    return this.usersRepository.setNewPassword(setNewPasswordDto, email);
  }

  async resendVerificationEmail(
    sendEmailDto: SendEmailDto,
  ): Promise<ResendVerificationEmailResponseInterface> {
    return this.usersRepository.resendVerificationEmail(sendEmailDto);
  }

  async updateCoin(
    updateCoinDto: UpdateCoinDto,
    userId: string,
  ): Promise<UpdateCoinResponseInterface> {
    return this.usersRepository.updateCoin(updateCoinDto, userId);
  }

  async updateAvatar(
    userId: string,
    updateAvatarDto: UpdateAvatarDto,
  ): Promise<UpdateAvatarInterface> {
    return this.usersRepository.updateAvatar(updateAvatarDto, userId);
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
    userId: string,
  ): Promise<VerifyPasswordResponseInterface> {
    return this.usersRepository.verifyPassword(verifyPasswordDto, userId);
  }

  async updateEmail(
    updateEmailDto: UpdateEmailDto,
    userId: string,
  ): Promise<UpdateEmailResponseInterfaceDto> {
    return this.usersRepository.updateEmail(updateEmailDto, userId);
  }

  async verifyEmail(
    verifyEmailDto: VerifyEmailQueryDto,
  ): Promise<UpdateEmailResponseInterfaceDto> {
    return this.usersRepository.verifyEmail(verifyEmailDto);
  }

  async changeUsername(
    changeUsernameBodyDto: ChangeUsernameBodyDto,
    userId: string,
  ): Promise<ChangePasswordResponseInterface> {
    return this.usersRepository.changeUsername(changeUsernameBodyDto, userId);
  }

  async searchUserByUsername(
    searchUserByUsernameQueryDto: SearchUserByUsernameQueryDto,
  ): Promise<UserResponseInterface[]> {
    return this.usersRepository.searchUserByUsername(
      searchUserByUsernameQueryDto,
    );
  }

  async getUserProfileById(
    userId: string,
  ): Promise<GetUserProfileResponseInterface> {
    return this.usersRepository.getUserProfileById(userId);
  }

  async updateRole(
    updateRoleDto: UpdateRoleDto,
    userId: string,
  ): Promise<UpdateRoleResponseInterfaceDto> {
    return this.usersRepository.updateRole(updateRoleDto, userId);
  }

  async getAvatars(): Promise<GetAvatarsResponseInterface[]> {
    return this.usersRepository.getAvatars();
  }

  async createUserWithGoogle(
    socialSignupCredentialBodyDto: SocialSignupCredentialBodyDto,
  ): Promise<AuthResponseInterface> {
    return this.usersRepository.createUserWithGoogle(
      socialSignupCredentialBodyDto,
    );
  }

  async loginGoogle(
    socialLoginCredentialBodyDto: SocialLoginCredentialBodyDto,
  ): Promise<AuthResponseInterface> {
    return this.usersRepository.loginGoogle(socialLoginCredentialBodyDto);
  }

  async checkEmail(
    checkEmailQueryDto: CheckEmailQueryDto,
  ): Promise<CheckEmailResponseInterface> {
    return this.usersRepository.checkEmail(checkEmailQueryDto);
  }
}
