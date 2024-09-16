import { Injectable } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { SignupCredentialsDto } from './dto/signup-credentials.dto';
import { AuthResponseInterface } from './dto/auth-response.interface';
import { LoginCredentialsDto } from './dto/login-credentials.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usersRepository: AuthRepository) {}

  async signUp(
    authCredentialsDto: SignupCredentialsDto,
  ): Promise<AuthResponseInterface> {
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
}
