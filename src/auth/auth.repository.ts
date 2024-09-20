import { DataSource, Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
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
import { ConfigService } from '@nestjs/config';
import { SignupResponseDto } from './dto/signup-response.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { SendResetPasswordDto } from './dto/send-reset-password.dto';
import { SendResetPasswordResponseDto } from './dto/send-reset-password-response.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ResetPasswordResponseDto } from './dto/reset-password-response.dto';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class AuthRepository extends Repository<UserEntity> {
  constructor(
    private dataSource: DataSource,
    private jwtService: JwtService,
    private readonly mailerService: MailerService,
    @InjectQueue('send-email') private readonly sendEmailQueue: Queue,
    private configService: ConfigService,
  ) {
    super(UserEntity, dataSource.createEntityManager());
  }

  async createUser(
    authCredentialsDto: SignupCredentialsDto,
  ): Promise<SignupResponseDto> {
    const { email, username, password, full_name, avatar_url, role, birthday } =
      authCredentialsDto;

    const userExists = await this.findOne({
      where: [{ email }, { username }],
    });

    if (userExists) {
      throw new ConflictException('User already exists');
    }

    // hash the password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const otp = crypto.randomInt(100000, 999999).toString(); // Generate a 6-digit OTP

    const user = this.create({
      email,
      username,
      password: hashedPassword,
      full_name,
      avatar_url,
      role,
      birthday,
      otp, // Store OTP
      is_verified: false,
      otpExpires: new Date(Date.now() + 10 * 60 * 1000), // OTP expires in 10 minutes
    });

    try {
      await this.save(user);
      await this.sendEmailQueue.add('send-otp-email', {
        from: `QuickMem <${this.configService.get('MAILER_USER')}>`,
        email: email,
        otp: otp,
        full_name: full_name,
      });
      const response = new SignupResponseDto();
      response.message = 'User created successfully. Check your email for OTP';
      response.is_verified = false;
      response.success = true;
      return response;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
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
        await this.sendEmailQueue.add('send-login-email', {
          full_name: user.full_name,
          email: user.email,
          from: `QuickMem <${this.configService.get('MAILER_USER')}>`,
        });
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
        throw new UnauthorizedException('User not found');
      }
    } catch (error) {
      console.log(error);
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
        await this.sendEmailQueue.add('send-login-email', {
          full_name: user.full_name,
          email: user.email,
          from: `QuickMem <${this.configService.get('MAILER_USER')}>`,
        });
        return {
          username,
          email: user.email,
          full_name: user.full_name,
          avatar_url: avatar,
          role: user.role,
          birthday: user.birthday,
          access_token: access_token,
          refresh_token: refresh_token,
        };
      } else {
        throw new UnauthorizedException('User not found');
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

  async verifyOtp(dto: VerifyOtpDto): Promise<AuthResponseInterface> {
    const { email, otp } = dto;
    const user = await this.findOne({ where: { email, otp } });

    if (!user || user.otpExpires < new Date()) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    user.otp = null; // Clear OTP after verification
    user.otpExpires = null;
    user.is_verified = true;
    await this.save(user);

    const payload = { email: user.email };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
    const avatar = `${process.env.HOST}/public/images/${user.avatar_url}.png`;
    user.refreshToken = refreshToken;
    await this.save(user);
    await this.sendEmailQueue.add('send-signup-email', {
      full_name: user.full_name,
      email: user.email,
      from: `QuickMem <${this.configService.get('MAILER_USER')}>`,
    });

    return {
      username: user.username,
      email: user.email,
      full_name: user.full_name,
      avatar_url: avatar,
      role: user.role,
      access_token: accessToken,
      refresh_token: refreshToken,
      birthday: user.birthday,
    };
  }

  async sendResetPasswordEmail(
    sendResetPasswordDto: SendResetPasswordDto,
  ): Promise<SendResetPasswordResponseDto> {
    const { email } = sendResetPasswordDto;
    const user = await this.findOne({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const token = crypto.randomBytes(20).toString('hex');
    const otp = crypto.randomInt(100000, 999999).toString(); // Generate a 6-digit OTP
    user.resetPasswordToken = token;
    user.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000); // Token expires in 10 minutes
    user.otp = otp; // Store OTP
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes
    await this.save(user);
    console.log('Reset Password Token:', token + ' OTP:', otp);

    // send otp to email
    await this.sendEmailQueue.add('send-reset-password-email', {
      full_name: user.full_name,
      email: user.email,
      from: `QuickMem <${this.configService.get('MAILER_USER')}>`,
      otp: otp,
    });

    const response = new SendResetPasswordResponseDto();
    response.message = 'OTP sent to your email';
    response.is_sent = true;
    response.reset_password_token = token;
    return response;
  }

  async resetPassword(
    resetPasswordDto: ResetPasswordDto,
  ): Promise<ResetPasswordResponseDto> {
    const { email, new_password, reset_password_token, otp } = resetPasswordDto;
    const user = await this.findOne({
      where: { resetPasswordToken: reset_password_token, otp, email },
    });

    if (
      !user ||
      user.resetPasswordExpires < new Date() ||
      user.otpExpires < new Date()
    ) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(new_password, salt);

    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    user.otp = null;
    user.otpExpires = null;
    user.refreshToken = null;
    await this.save(user);
    await this.sendEmailQueue.add('reset-password-success', {
      full_name: user.full_name,
      email: user.email,
      from: `QuickMem <${this.configService.get('MAILER_USER')}>`,
    });

    const response = new ResetPasswordResponseDto();
    response.is_reset = true;
    response.message = 'Password reset successful';
    response.email = user.email;
    return response;
  }
}
