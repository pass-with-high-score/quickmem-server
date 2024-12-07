import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import * as process from 'node:process';
import { AuthRepository } from '../auth.repository';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private authRepository: AuthRepository) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'https://api.quickmem.app/auth/google/callback',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, photos } = profile;
    const email = emails[0].value;
    const existingUser = await this.authRepository.findOne({
      where: { email },
    });
    const user = {
      email: email,
      fullName: name.givenName + ' ' + name.familyName,
      picture: photos[0].value,
      accessToken,
      isSignUp: !!existingUser,
    };
    done(null, user);
  }
}
