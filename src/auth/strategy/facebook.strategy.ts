import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-facebook';
import * as process from 'node:process';
import { AuthRepository } from '../auth.repository';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(private authRepository: AuthRepository) {
    super({
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: 'https://api.quickmem.app/auth/facebook/callback',
      profileFields: ['id', 'name', 'displayName', 'photos', 'emails'],
      scope: ['email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: any,
  ): Promise<any> {
    const { displayName, emails, photos } = profile;
    console.log('Facebook profile', profile);
    const email = emails && emails.length > 0 ? emails[0].value : null;
    const existingUser = await this.authRepository.findOne({
      where: [{ email: email }, { facebookId: profile.id }],
    });
    const user = {
      email: email,
      fullName: displayName,
      picture: photos && photos.length > 0 ? photos[0].value : null,
      accessToken,
      isSignUp: !!existingUser,
    };
    done(null, user);
  }
}
