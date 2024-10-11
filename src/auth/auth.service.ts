import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { SignupCredentialsDto } from './dto/bodies/signup-credentials.dto';
import { AuthResponseInterface } from './interfaces/auth-response.interface';
import { LoginCredentialsDto } from './dto/bodies/login-credentials.dto';
import { SignupResponseInterface } from './interfaces/signup-response.interface';
import { VerifyOtpDto } from './dto/bodies/verify-otp.dto';
import { SendResetPasswordDto } from './dto/bodies/send-reset-password.dto';
import { SendResetPasswordResponseInterface } from './interfaces/send-reset-password-response.interface';
import { ResetPasswordDto } from './dto/bodies/reset-password.dto';
import { ResetPasswordResponseInterface } from './interfaces/reset-password-response.interface';
import { SetNewPasswordResponseInterface } from './interfaces/set-new-password-response.interface';
import { SetNewPasswordDto } from './dto/bodies/set-new-password.dto';
import { ResendVerificationEmailDto } from './dto/bodies/resend-verification-email.dto';
import { ResendVerificationEmailResponseInterface } from './interfaces/resend-verification-email-response.interface';
import { UpdateFullnameDto } from './dto/bodies/update-fullname.dto';
import { UpdateFullnameResponseInterfaceDto } from './interfaces/update-fullname-response.interface.dto';
import axios from 'axios';
import { OAuth2Client } from 'google-auth-library';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private googleClient: OAuth2Client;

  constructor(
    private readonly usersRepository: AuthRepository,
    private configService: ConfigService,
  ) {
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
    console.log('provider', provider);

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
    sendResetPasswordDto: SendResetPasswordDto,
  ): Promise<SendResetPasswordResponseInterface> {
    return this.usersRepository.sendResetPasswordEmail(sendResetPasswordDto);
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
    resendVerificationEmailDto: ResendVerificationEmailDto,
  ): Promise<ResendVerificationEmailResponseInterface> {
    return this.usersRepository.resendVerificationEmail(
      resendVerificationEmailDto,
    );
  }
}
