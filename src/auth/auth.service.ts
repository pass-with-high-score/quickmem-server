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
import { GetAvatarsResponseInterface } from './interfaces/get-avatars-response.interface';
import { SocialSignupCredentialBodyDto } from './dto/bodies/social-signup-credential-body.dto';
import { SocialLoginCredentialBodyDto } from './dto/bodies/social-login-credential-body.dto';
import { CheckEmailQueryDto } from './dto/queries/check-email.query.dto';
import { CheckEmailResponseInterface } from './interfaces/check-email.response.interface';

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
  ): Promise<UpdateFullnameResponseInterfaceDto> {
    return await this.usersRepository.updateFullname(updateFullnameDto);
  }

  async login(
    authCredentialsDto: LoginCredentialsDto,
  ): Promise<AuthResponseInterface> {
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
