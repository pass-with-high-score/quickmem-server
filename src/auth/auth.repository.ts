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
import { EmailDto } from './dto/email.dto';
import { ConfigService } from '@nestjs/config';
import { SignupResponseDto } from './dto/signup-response.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

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
  ): Promise<SignupResponseDto> {
    const { email, username, password, full_name, avatar_url, role, birthday } =
      authCredentialsDto;

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
      await this.sendOtpEmail(full_name, email, otp); // Send OTP email
      const response = new SignupResponseDto();
      response.message = 'User created successfully. Check your email for OTP';
      response.is_verified = false;
      response.success = true;
      return response;
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Username or email already exists');
      } else {
        console.log(error);
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
        await this.sendLoginEmail(user.full_name, email); // Send login email
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
        await this.sendLoginEmail(user.full_name, user.email); // Send login email
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

  async sendOtpEmail(name: string, email: string, otp: string): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      from: `QuickMem <${this.configService.get('MAILER_USER')}>`,
      subject: 'Your OTP Code',
      html: `
      <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
          <h2 style="color: #333;">Hello, ${name}</h2>
          <p style="font-size: 16px; color: #555;">
            Welcome to QuickMem! To complete your verification process, please use the OTP code below.
          </p>
          <div style="text-align: center; margin: 20px 0;">
            <p style="font-size: 24px; font-weight: bold; color: #007bff; letter-spacing: 2px;">${otp}</p>
          </div>
          <p style="font-size: 16px; color: #555;">
            This OTP is valid for <strong>10 minutes</strong>. Please enter it before the time expires.
          </p>
          <p style="font-size: 14px; color: #999;">
            If you did not request this code, please ignore this email or contact our support team if you have any concerns.
          </p>
        </div>
        <div style="max-width: 600px; margin: 20px auto; text-align: center; font-size: 12px; color: #999;">
          <p>© 2024 QuickMem. All rights reserved.</p>
        </div>
      </div>
    `,
    });
  }

  async sendLoginEmail(name: string, email: string): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      from: `QuickMem <${this.configService.get('MAILER_USER')}>`,
      subject: 'Login Notification',
      html: `
      <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
          <h2 style="color: #333;">Hello, ${name}</h2>
          <p style="font-size: 16px; color: #555;">
            You have successfully logged in to your QuickMem account.
          </p>
          <p style="font-size: 14px; color: #999;">
            If you did not log in, please contact our support team immediately.
          </p>
        </div>
        <div style="max-width: 600px; margin: 20px auto; text-align: center; font-size: 12px; color: #999;">
          <p>© 2024 QuickMem. All rights reserved.</p>
        </div>
      </div>
    `,
    });
  }

  async sendSignupEmail(name: string, email: string): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      from: `QuickMem <${this.configService.get('MAILER_USER')}>`,
      subject: 'Welcome to QuickMem',
      html: `
      <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
          <h2 style="color: #333;">Hello, ${name}</h2>
          <p style="font-size: 16px; color: #555;">
            Welcome to QuickMem! We are excited to have you on board.
          </p>
          <p style="font-size: 14px; color: #999;">
            If you have any questions or need assistance, please feel free to contact our support team.
          </p>
        </div>
        <div style="max-width: 600px; margin: 20px auto; text-align: center; font-size: 12px; color: #999;">
          <p>© 2024 QuickMem. All rights reserved.</p>
        </div>
      </div>
    `,
    });
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
    await this.sendSignupEmail(user.full_name, user.email); // Send welcome email

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

  async sendResetPasswordEmail(email: string): Promise<void> {
    if (!email) {
      throw new UnauthorizedException('Email is required');
    }

    const user = await this.findOne({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const token = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
    await this.save(user);
    console.log('Reset Password Token:', token);

    await this.mailerService.sendMail({
      to: email,
      from: `QuickMem <${this.configService.get('MAILER_USER')}>`,
      subject: 'Reset Password',
      html: `
    <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        <h2 style="color: #333;">Reset Your Password</h2>
        <p style="font-size: 16px; color: #555;">
          You are receiving this email because you have requested to reset your password.
        </p>
        <p style="font-size: 16px; color: #555;">
          Please click the link below to reset your password. This link will expire in 1 hour.
        </p>
        <div style="text-align: center; margin: 20px 0;">
          <a href="${process.env.HOST}/reset-password/${token}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px;">Reset Password</a>
        </div>
        <p style="font-size: 14px; color: #999;">
          If you did not request this, please ignore this email and your password will remain unchanged.
        </p>
      </div>
      <div style="max-width: 600px; margin: 20px auto; text-align: center; font-size: 12px; color: #999;">
        <p>© 2024 QuickMem. All rights reserved.</p>
      </div>
    </div>
    `,
    });
  }

  async resetPassword(token: string, password: string): Promise<void> {
    const user = await this.findOne({ where: { resetPasswordToken: token } });

    if (!user || user.resetPasswordExpires < new Date()) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await this.save(user);

    await this.mailerService.sendMail({
      to: user.email,
      from: `QuickMem <${this.configService.get('MAILER_USER')}>`,
      subject: 'Password Reset Confirmation',
      html: `
      <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
          <h2 style="color: #333;">Password Reset Successful</h2>
          <p style="font-size: 16px; color: #555;">
            Your password has been successfully reset. If you did not make this change, please contact our support team immediately.
          </p>
        </div>
        <div style="max-width: 600px; margin: 20px auto; text-align: center; font-size: 12px; color: #999;">
          <p>© 2024 QuickMem. All rights reserved.</p>
        </div>
      </div>
    `,
    });
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
