import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthRepository } from './auth.repository';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserEntity } from './user.entity';
import { ConfigService } from '@nestjs/config';

class JwtPayloadInterface {
  user_id: string;
  email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly usersRepository: AuthRepository,
    private readonly configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.get('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: JwtPayloadInterface): Promise<UserEntity> {
    const { user_id, email } = payload;

    const user: UserEntity = await this.usersRepository.findOne({
      where: { id: user_id, email },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }
}
