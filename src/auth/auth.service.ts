import { Injectable } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { SignupCredentialsDto } from './dto/signup-credentials.dto';
import { AuthResponseInterface } from './dto/auth-response.interface';
import { LoginCredentialsDto } from './dto/login-credentials.dto';
import { EmailDto } from './dto/email.dto';
import { SignupResponseDto } from './dto/signup-response.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usersRepository: AuthRepository) {}

  async signUp(
    authCredentialsDto: SignupCredentialsDto,
  ): Promise<SignupResponseDto> {
    return await this.usersRepository.createUser(authCredentialsDto);
  }

  async logInWithEmail(
    authCredentialsDto: LoginCredentialsDto,
  ): Promise<AuthResponseInterface> {
    return await this.usersRepository.validateEmailPassword(authCredentialsDto);
  }

  async logInWithUsername(
    authCredentialsDto: LoginCredentialsDto,
  ): Promise<AuthResponseInterface> {
    return await this.usersRepository.validateUsernamePassword(
      authCredentialsDto,
    );
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    return await this.usersRepository.createAccessTokenFromRefreshToken(
      refreshToken,
    );
  }
  async sendEmail(dto: EmailDto): Promise<any> {
    return this.usersRepository.sendEmail(dto);
  }

  async verifyOtp(dto: VerifyOtpDto): Promise<AuthResponseInterface> {
    return this.usersRepository.verifyOtp(dto);
  }
}
