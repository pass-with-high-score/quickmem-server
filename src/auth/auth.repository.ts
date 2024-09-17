import { DataSource, Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import * as bcrypt from 'bcrypt';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { SignupCredentialsDto } from './dto/signup-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthResponseInterface } from './dto/auth-response.interface';
import { LoginCredentialsDto } from './dto/login-credentials.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { EmailDto } from './dto/email.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthRepository extends Repository<UserEntity> {
  constructor(
    private dataSource: DataSource,
    private jwtService: JwtService,
    private readonly mailerService: MailerService,
    private configService: ConfigService,
  ) {
    super(UserEntity, dataSource.createEntityManager());
  }

  async createUser(
    authCredentialsDto: SignupCredentialsDto,
  ): Promise<AuthResponseInterface> {
    const { email, username, password, full_name, avatar_url, role, birthday } =
      authCredentialsDto;

    // hash the password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.create({
      email,
      username,
      password: hashedPassword,
      full_name,
      avatar_url,
      role,
      birthday,
    });
    const access_token = this.jwtService.sign({ username });
    const refresh_token = this.jwtService.sign(
      { username },
      { expiresIn: '7d' },
    );
    const avatar = `${process.env.HOST}/public/images/${avatar_url}.png`;
    try {
      await this.save(user);
      return {
        birthday: birthday,
        username,
        email,
        full_name: full_name,
        avatar_url: avatar,
        role,
        access_token: access_token,
        refresh_token: refresh_token,
      };
    } catch (error) {
      console.log();
      if (error.code === '23505') {
        throw new ConflictException('Username or email already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async validateEmailPassword(
    authCredentialsDto: LoginCredentialsDto,
  ): Promise<AuthResponseInterface> {
    const { email, password } = authCredentialsDto;
    try {
      const user = await this.findOne({ where: { email } });

      if (user && (await bcrypt.compare(password, user.password))) {
        const payload: { email: string } = { email };
        const access_token: string = this.jwtService.sign(payload);
        const refresh_token: string = this.jwtService.sign(payload, {
          expiresIn: '7d',
        });
        const avatar = `${process.env.HOST}/public/images/${user.avatar_url}.png`;
        return {
          username: user.username,
          email,
          full_name: user.full_name,
          avatar_url: avatar,
          role: user.role,
          access_token: access_token,
          refresh_token: refresh_token,
          birthday: user.birthday,
        };
      } else {
        throw new UnauthorizedException('Invalid credentials');
      }
    } catch (error) {
      throw new UnauthorizedException('Invalid credentials' + error);
    }
  }

  async validateUsernamePassword(
    authCredentialsDto: LoginCredentialsDto,
  ): Promise<AuthResponseInterface> {
    const { username, password } = authCredentialsDto;
    try {
      const user = await this.findOne({ where: { username } });

      if (user && (await bcrypt.compare(password, user.password))) {
        const payload: { username: string } = { username };
        const access_token: string = this.jwtService.sign(payload);
        const refresh_token: string = this.jwtService.sign(payload, {
          expiresIn: '7d',
        });
        const avatar = `${process.env.HOST}/public/images/${user.avatar_url}.png`;
        return {
          username,
          email: user.email,
          full_name: user.full_name,
          avatar_url: avatar,
          role: user.role,
          access_token: access_token,
          refresh_token: refresh_token,
          birthday: user.birthday,
        };
      } else {
        throw new UnauthorizedException('Invalid credentials');
      }
    } catch (error) {
      throw new UnauthorizedException('Invalid credentials' + error);
    }
  }

  async createAccessTokenFromRefreshToken(
    refreshToken: string,
  ): Promise<{ accessToken: string }> {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const user = await this.findOne({
        where: { username: payload.username, refreshToken },
      });

      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const accessToken = this.jwtService.sign({ username: payload.username });
      return { accessToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token' + error);
    }
  }

  async sendEmail(dto: EmailDto): Promise<any> {
    return new Promise(async (resolve, reject) => {
      await this.mailerService
        .sendMail({
          to: dto.email,
          from: `NestJs <${this.configService.get('MAILER_USER')}>`,
          subject: 'This is a test email',
          html: `<h1>Hello!</h1>
                    <p>This is a test email from NestJs</p>
                    `,
        })
        .then((resp) => {
          resolve(resp);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
