import { DataSource, ILike, Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import {
  ConflictException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { SignupCredentialsDto } from './dto/bodies/signup-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthResponseInterface } from './interfaces/auth-response.interface';
import { LoginCredentialsDto } from './dto/bodies/login-credentials.dto';
import { ConfigService } from '@nestjs/config';
import { SignupResponseInterface } from './interfaces/signup-response.interface';
import { VerifyOtpDto } from './dto/bodies/verify-otp.dto';
import { SendEmailDto } from './dto/bodies/send-email.dto';
import { SendResetPasswordResponseInterface } from './interfaces/send-reset-password-response.interface';
import { ResetPasswordDto } from './dto/bodies/reset-password.dto';
import { ResetPasswordResponseInterface } from './interfaces/reset-password-response.interface';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { SetNewPasswordDto } from './dto/bodies/set-new-password.dto';
import { SetNewPasswordResponseInterface } from './interfaces/set-new-password-response.interface';
import { ResendVerificationEmailResponseInterface } from './interfaces/resend-verification-email-response.interface';
import { UpdateFullnameResponseInterfaceDto } from './interfaces/update-fullname-response.interface.dto';
import { UpdateFullnameDto } from './dto/bodies/update-fullname.dto';
import { SubscriptionTypeEnum } from '../subscription/enums/subscription.enum';
import { UpdateCoinDto } from './dto/bodies/update-coin.dto';
import { UpdateCoinResponseInterface } from './interfaces/update-coin-response.interface';
import { logger } from '../winston-logger.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UpdateAvatarDto } from './dto/bodies/update-avatar.dto';
import { UpdateAvatarInterface } from './interfaces/update-avatar.interface';
import { UserDetailResponseInterface } from './interfaces/user-detail-response.interface';
import { GetUserDetailParamDto } from './dto/params/get-user-detail-param.dto';
import { GetUserDetailQueryDto } from './dto/queries/get-user-detail-query.dto';
import { FolderEntity } from '../folder/entities/folder.entity';
import { StudySetEntity } from '../study-set/entities/study-set.entity';
import { VerifyPasswordBodyDto } from './dto/bodies/verify-password-body.dto';
import { VerifyPasswordResponseInterface } from './interfaces/verify-password-response.interface';
import { UpdateEmailDto } from './dto/bodies/update-email.dto';
import { UpdateEmailResponseInterfaceDto } from './interfaces/update-email-response.interface.dto';
import { VerifyEmailQueryDto } from './dto/queries/verify-email-query.dto';
import { ChangeUsernameBodyDto } from './dto/bodies/change-username-body.dto';
import { ChangePasswordResponseInterface } from './interfaces/change-password-response.interface';
import { SearchUserByUsernameQueryDto } from './dto/queries/search-user-by-username-query.dto';
import { UserResponseInterface } from './interfaces/user-response.interface';
import { GetUserProfileResponseInterface } from './interfaces/get-user-profile-response.interface';
import { UserStatusEnum } from './enums/user-status.enum';
import { GetAvatarsResponseInterface } from './interfaces/get-avatars-response.interface';
import { DefaultImageEntity } from './entities/default-image.entity';
import { CloudinaryProvider } from '../cloudinary/cloudinary.provider';
import { SocialSignupCredentialBodyDto } from './dto/bodies/social-signup-credential-body.dto';
import { SocialLoginCredentialBodyDto } from './dto/bodies/social-login-credential-body.dto';
import { HttpService } from '@nestjs/axios';
import { CheckEmailQueryDto } from './dto/queries/check-email.query.dto';
import { CheckEmailResponseInterface } from './interfaces/check-email.response.interface';
import { lastValueFrom } from 'rxjs';
import { GetNewTokenResponseInterface } from './interfaces/get-new-token.response.interface';

@Injectable()
export class AuthRepository extends Repository<UserEntity> {
  constructor(
    private readonly dataSource: DataSource,
    private readonly jwtService: JwtService,
    @InjectQueue('send-email') private readonly sendEmailQueue: Queue,
    private readonly configService: ConfigService,
    @Inject(CloudinaryProvider)
    private readonly cloudinaryProvider: CloudinaryProvider,
    private readonly httpService: HttpService,
  ) {
    super(UserEntity, dataSource.createEntityManager());
  }

  async updateCoin(
    updateCoinDto: UpdateCoinDto,
    userId: string,
  ): Promise<UpdateCoinResponseInterface> {
    const { coin, action } = updateCoinDto;

    const user = await this.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'User not found',
      });
    }

    if (action === 'add') {
      user.coins += coin;
    } else if (action === 'subtract') {
      if (user.coins < coin) {
        throw new ConflictException({
          statusCode: HttpStatus.CONFLICT,
          message: 'Insufficient coins',
        });
      }
      user.coins -= coin;
    } else {
      throw new ConflictException({
        statusCode: HttpStatus.CONFLICT,
        message: 'Invalid action',
      });
    }

    await this.save(user);

    return {
      message: 'Coins updated successfully',
      coinAction: action,
      coins: user.coins,
    };
  }

  async createUser(
    authCredentialsDto: SignupCredentialsDto,
  ): Promise<SignupResponseInterface> {
    const {
      email,
      username,
      password,
      fullName,
      avatarUrl,
      birthday,
      provider,
    } = authCredentialsDto;

    const emailExists = await this.findOne({
      where: [{ email }],
    });

    if (emailExists) {
      if (emailExists.isVerified === false) {
        throw new ConflictException({
          statusCode: HttpStatus.PRECONDITION_FAILED,
          message: 'User already exists but not verified',
        });
      } else {
        throw new ConflictException({
          statusCode: HttpStatus.CONFLICT,
          message: 'User already exists',
        });
      }
    }

    let currentUsername = username;

    let userExits = await this.findOne({
      where: [{ username }],
    });

    // if exists, add a random number to the username
    while (userExits) {
      currentUsername = username + Math.floor(Math.random() * 1000);
      userExits = await this.findOne({
        where: [{ username: currentUsername }],
      });
    }

    let hashedPassword = null;
    let isVerified = false;

    // hash the password if it is not null
    if (provider === 'EMAIL') {
      const salt = await bcrypt.genSalt();
      hashedPassword = await bcrypt.hash(password, salt);
    } else {
      isVerified = true;
    }

    const otp = crypto.randomInt(100000, 999999).toString(); // Generate a 6-digit OTP

    const defaultImage = await this.dataSource
      .getRepository(DefaultImageEntity)
      .findOne({ where: { id: avatarUrl } });

    const user = this.create({
      email,
      username: currentUsername,
      password: hashedPassword,
      fullName: fullName,
      avatarUrl: defaultImage.url,
      coins: 5,
      birthday,
      otp,
      isVerified,
      provider: [provider],
      otpExpires: new Date(Date.now() + 10 * 60 * 1000), // OTP expires in 10 minutes
    });

    try {
      await this.save(user);
      await this.sendEmailQueue.add('send-otp-email', {
        from: `QuickMem <${this.configService.get('MAILER_USER')}>`,
        email: email,
        otp: otp,
        fullName: fullName,
      });
      return {
        message: 'User created successfully. Check your email for OTP',
        isVerified,
        success: true,
      };
    } catch (error) {
      logger.error(error);
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Failed to create user',
      });
    }
  }

  async validateUser(
    authCredentialsDto: LoginCredentialsDto,
  ): Promise<AuthResponseInterface> {
    const { email, password, provider } = authCredentialsDto;
    try {
      const user = await this.findOne({ where: { email } });
      logger.info(user);
      if (user) {
        if (
          provider === 'EMAIL' &&
          !(await bcrypt.compare(password, user.password))
        ) {
          throw new UnauthorizedException({
            statusCode: HttpStatus.UNAUTHORIZED,
            message: 'Password is incorrect',
          });
        }
        if (!user.provider.includes(provider)) {
          throw new UnauthorizedException({
            statusCode: HttpStatus.UNAUTHORIZED,
            message: 'Invalid login provider',
            provider: user.provider,
          });
        }
        const accessTokenPayload = {
          email,
          userId: user.id,
        };
        const refreshTokenPayload = {
          userId: user.id,
          type: 'refresh',
        };
        const accessToken: string = this.jwtService.sign(accessTokenPayload);
        const refreshToken: string = this.jwtService.sign(refreshTokenPayload, {
          expiresIn: '30d',
        });
        const isPremium = await this.isUserPremium(user.id);
        if (user.isVerified && user.userStatus !== UserStatusEnum.BLOCKED) {
          await this.sendEmailQueue.add('send-login-email', {
            fullName: user.fullName,
            email: user.email,
            from: `QuickMem <${this.configService.get('MAILER_USER')}>`,
          });
        }
        return {
          id: user.id,
          username: user.username,
          email,
          fullName: user.fullName,
          avatarUrl: user.avatarUrl,
          accessToken: accessToken,
          isPremium,
          provider: user.provider,
          coin: user.coins,
          isVerified: user.isVerified,
          refreshToken: refreshToken,
          birthday: user.birthday,
          bannedAt: user.bannedAt,
          userStatus: user.userStatus,
          bannedReason: user.bannedReason,
        };
      } else {
        throw new NotFoundException({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'User not found',
        });
      }
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      } else if (error instanceof NotFoundException) {
        throw error;
      }
      logger.error(error);
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Failed to validate user',
      });
    }
  }

  async updateFullname(
    updateFullnameDto: UpdateFullnameDto,
    userId: string,
  ): Promise<UpdateFullnameResponseInterfaceDto> {
    const { fullname } = updateFullnameDto;
    const user = await this.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'User not found',
      });
    } else if (user.isVerified === false) {
      throw new UnauthorizedException({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'User is not verified',
      });
    } else if (user.fullName === fullname) {
      throw new ConflictException({
        statusCode: HttpStatus.CONFLICT,
        message: 'Full name is the same as the old full name',
      });
    }
    user.fullName = fullname;
    try {
      await this.save(user);
      const response = new UpdateFullnameResponseInterfaceDto();
      response.message = 'Full name updated successfully';
      response.success = true;
      response.fullname = fullname;
      return response;
    } catch (error) {
      logger.error(error);
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Failed to update full name',
      });
    }
  }

  async createAccessTokenFromRefreshToken(
    refreshToken: string,
  ): Promise<GetNewTokenResponseInterface> {
    console.log(refreshToken);
    try {
      const payload = this.jwtService.verify(refreshToken);

      if (!payload.userId || payload.type !== 'refresh') {
        throw new UnauthorizedException({
          statusCode: HttpStatus.UNAUTHORIZED,
          message: 'Invalid refresh token format',
        });
      }

      console.log(payload.userId);

      const user = await this.findOne({
        where: { id: payload.userId },
      });
      console.log(user.email);

      if (!user) {
        throw new UnauthorizedException({
          statusCode: HttpStatus.UNAUTHORIZED,
          message: 'User not found',
        });
      }

      const accessTokenPayload = {
        email: user.email,
        userId: user.id,
      };
      const refreshTokenPayload = {
        userId: user.id,
        type: 'refresh',
      };

      const accessToken = this.jwtService.sign(accessTokenPayload);
      const newRefreshToken = this.jwtService.sign(refreshTokenPayload, {
        expiresIn: '30d',
      });
      return {
        accessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      logger.error(error);
      throw new UnauthorizedException({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Invalid refresh token',
      });
    }
  }

  async verifyOtp(dto: VerifyOtpDto): Promise<AuthResponseInterface> {
    const { email, otp } = dto;
    const user = await this.findOne({ where: { email, otp } });

    if (!user || user.otpExpires < new Date()) {
      throw new UnauthorizedException({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Invalid or expired OTP',
      });
    }

    user.otp = null; // Clear OTP after verification
    user.otpExpires = null;
    user.isVerified = true;
    await this.save(user);
    const refreshTokenPayload = {
      userId: user.id,
      type: 'refresh',
    };
    const accessTokenPayload = {
      email: user.email,
      userId: user.id,
    };
    const accessToken = this.jwtService.sign(accessTokenPayload);
    const refreshToken = this.jwtService.sign(refreshTokenPayload, {
      expiresIn: '30d',
    });
    await this.sendEmailQueue.add('send-signup-email', {
      fullName: user.fullName,
      email: user.email,
      from: `QuickMem <${this.configService.get('MAILER_USER')}>`,
    });

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      avatarUrl: user.avatarUrl,
      coin: user.coins,
      provider: user.provider,
      isVerified: user.isVerified,
      isPremium: false,
      accessToken: accessToken,
      refreshToken: refreshToken,
      birthday: user.birthday,
      bannedAt: user.bannedAt,
      userStatus: user.userStatus,
      bannedReason: user.bannedReason,
    };
  }

  async sendResetPasswordEmail(
    sendEmailDto: SendEmailDto,
  ): Promise<SendResetPasswordResponseInterface> {
    const { email } = sendEmailDto;
    const user = await this.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'User not found',
      });
    }

    const token = crypto.randomBytes(20).toString('hex');
    const otp = crypto.randomInt(100000, 999999).toString(); // Generate a 6-digit OTP
    user.resetPasswordToken = token;
    user.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000); // Token expires in 10 minutes
    user.otp = otp; // Store OTP
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes
    await this.save(user);

    // send otp to email
    await this.sendEmailQueue.add('send-reset-password-email', {
      fullName: user.fullName,
      email: user.email,
      from: `QuickMem <${this.configService.get('MAILER_USER')}>`,
      otp: otp,
    });

    return {
      message: 'OTP sent to your email',
      isSent: true,
      resetPasswordToken: token,
      email: user.email,
    };
  }

  async resetPassword(
    resetPasswordDto: ResetPasswordDto,
  ): Promise<ResetPasswordResponseInterface> {
    const { email, newPassword, resetPasswordToken, otp } = resetPasswordDto;
    const user = await this.findOne({
      where: { resetPasswordToken: resetPasswordToken, otp, email },
    });

    if (
      !user ||
      user.resetPasswordExpires < new Date() ||
      user.otpExpires < new Date()
    ) {
      throw new UnauthorizedException({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Invalid or expired token or OTP',
      });
    }

    try {
      const salt = await bcrypt.genSalt();

      user.password = await bcrypt.hash(newPassword, salt);
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;
      user.otp = null;
      user.otpExpires = null;
      await this.save(user);
      await this.sendEmailQueue.add('reset-password-success', {
        fullName: user.fullName,
        email: user.email,
        from: `QuickMem <${this.configService.get('MAILER_USER')}>`,
      });

      return {
        isReset: true,
        message: 'Password reset successful',
        email: user.email,
      };
    } catch (error) {
      logger.error(error);
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Failed to reset password',
      });
    }
  }

  async setNewPassword(
    setNewPasswordDto: SetNewPasswordDto,
    email: string,
  ): Promise<SetNewPasswordResponseInterface> {
    const { oldPassword, newPassword } = setNewPasswordDto;
    const user = await this.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'User not found',
      });
    }

    if (!(await bcrypt.compare(oldPassword, user.password))) {
      throw new UnauthorizedException({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Old password is incorrect',
      });
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // check if the new password is the same as the old password
    if (await bcrypt.compare(newPassword, user.password)) {
      throw new ConflictException({
        statusCode: HttpStatus.CONFLICT,
        message: 'New password is the same as the old password',
      });
    }

    user.password = hashedPassword;
    await this.save(user);

    // send email
    await this.sendEmailQueue.add('update-password-success', {
      fullName: user.fullName,
      email: user.email,
      from: `QuickMem <${this.configService.get('MAILER_USER')}>`,
    });

    return {
      isSet: true,
      message: 'Password set successfully',
      email: user.email,
    };
  }

  async resendVerificationEmail(
    sendEmailDto: SendEmailDto,
  ): Promise<ResendVerificationEmailResponseInterface> {
    const { email } = sendEmailDto;
    const user = await this.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'User not found',
      });
    }

    if (user.isVerified) {
      throw new ConflictException({
        statusCode: HttpStatus.CONFLICT,
        message: 'User is already verified',
      });
    }

    if (user.otpExpires > new Date()) {
      await this.sendEmailQueue.add('send-otp-email', {
        from: `QuickMem <${this.configService.get('MAILER_USER')}>`,
        email: email,
        otp: user.otp,
        fullName: user.fullName,
      });
      return {
        message: 'Resend OTP successful',
        isVerified: false,
        success: true,
      };
    } else {
      const otp = crypto.randomInt(100000, 999999).toString(); // Generate a 6-digit OTP
      user.otp = otp;
      user.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes
      await this.save(user);
      await this.sendEmailQueue.add('send-otp-email', {
        from: `QuickMem <${this.configService.get('MAILER_USER')}>`,
        email: email,
        otp: otp,
        fullName: user.fullName,
      });
      return {
        message: 'Resend OTP successful',
        isVerified: false,
        success: true,
      };
    }
  }

  // every 30 minutes remove every token, otp, and reset password token
  @Cron(CronExpression.EVERY_30_MINUTES)
  async removeExpiredTokens() {
    try {
      logger.info('Removing expired tokens every 30 minutes');
      await this.createQueryBuilder()
        .update(UserEntity)
        .set({
          otp: null,
          otpExpires: null,
          resetPasswordToken: null,
          resetPasswordExpires: null,
        })
        .where('otpExpires < :date', { date: new Date() })
        .orWhere('resetPasswordExpires < :date', { date: new Date() })
        .execute();
    } catch (error) {
      logger.error(error);
      logger.error('Error removing expired tokens:', error);
    }
  }

  async updateAvatar(
    updateAvatarDto: UpdateAvatarDto,
    userId: string,
  ): Promise<UpdateAvatarInterface> {
    const { avatar } = updateAvatarDto;

    try {
      const user = await this.findOne({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'User not found',
        });
      }

      if (user.avatarUrl === avatar) {
        throw new ConflictException({
          statusCode: HttpStatus.CONFLICT,
          message: 'Avatar is the same as the old avatar',
        });
      }
      if (user.avatarUrl.includes('avatar_upload')) {
        await this.cloudinaryProvider.deleteImage(user.avatarUrl);
      }
      user.avatarUrl = avatar;
      await this.save(user);

      return {
        message: 'Avatar updated successfully',
        avatarUrl: avatar,
      };
    } catch (error) {
      logger.error(
        `Failed to update avatar for user ID ${userId}: ${error.message}`,
      );
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Failed to update avatar',
      });
    }
  }

  async getUserProfileDetail(
    getUserDetailQueryDto: GetUserDetailQueryDto,
    getUserDetailParamDto: GetUserDetailParamDto,
  ): Promise<UserDetailResponseInterface> {
    const { id } = getUserDetailParamDto;
    const { isOwner = false } = getUserDetailQueryDto;

    const userPromise = this.findOne({
      where: { id },
      select: ['id', 'username', 'fullName', 'avatarUrl'],
    });

    const studySetsPromise = this.dataSource
      .getRepository(StudySetEntity)
      .find({
        where: isOwner ? { owner: { id } } : { owner: { id }, isPublic: true },
        relations: ['color', 'subject', 'flashcards', 'owner'],
      });

    const foldersPromise = this.dataSource.getRepository(FolderEntity).find({
      where: isOwner ? { owner: { id } } : { owner: { id }, isPublic: true },
      relations: ['studySets', 'owner'],
    });

    // Wait for all promises to resolve
    const [user, studySets, folders] = await Promise.all([
      userPromise,
      studySetsPromise,
      foldersPromise,
    ]);

    if (!user) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'User not found',
      });
    }

    const formattedStudySets = studySets.map((studySet) => ({
      id: studySet.id,
      title: studySet.title,
      isAIGenerated: studySet.isAIGenerated,
      flashcardCount: studySet.flashcards.length,
      owner: {
        id: studySet.owner.id,
        username: studySet.owner.username,
        avatarUrl: studySet.owner.avatarUrl,
      },
      color: {
        id: studySet.color.id,
        name: studySet.color.name,
        hexValue: studySet.color.hexValue,
      },
      subject: {
        id: studySet.subject.id,
        name: studySet.subject.name,
      },
      createdAt: studySet.createdAt,
      updatedAt: studySet.updatedAt,
    }));

    const formattedFolders = folders.map((folder) => ({
      id: folder.id,
      title: folder.title,
      linkShareCode: folder.link,
      description: folder.description,
      isPublic: folder.isPublic,
      studySetCount: folder.studySets.length,
      owner: {
        id: folder.owner.id,
        username: folder.owner.username,
        avatarUrl: folder.owner.avatarUrl,
      },
      createdAt: folder.createdAt,
      updatedAt: folder.updatedAt,
    }));

    console.log(formattedStudySets);
    console.log(formattedFolders);

    return {
      id: user.id,
      username: user.username,
      fullname: user.fullName,
      avatarUrl: user.avatarUrl,
      studySets: formattedStudySets,
      folders: formattedFolders,
    };
  }

  async verifyPassword(
    verifyPasswordDto: VerifyPasswordBodyDto,
    userId: string,
  ): Promise<VerifyPasswordResponseInterface> {
    const { password } = verifyPasswordDto;
    const user = await this.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordMatching = await bcrypt.compare(password, user.password);

    if (!isPasswordMatching) {
      throw new UnauthorizedException('Incorrect password');
    }

    return {
      success: true,
      message: 'Password verified successfully',
    };
  }

  async updateEmail(
    updateEmailDto: UpdateEmailDto,
    userId: string,
  ): Promise<UpdateEmailResponseInterfaceDto> {
    console.log(updateEmailDto);
    const { email } = updateEmailDto;

    const user = await this.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'User not found',
      });
    }

    const existingUser = await this.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException({
        statusCode: HttpStatus.CONFLICT,
        message: 'Email is already in use',
      });
    }

    // Generate a temporary token for email verification
    const tokenTempEmail = crypto.randomBytes(16).toString('hex');

    user.tempEmail = email;
    user.tokenTempEmail = tokenTempEmail;
    await this.save(user);

    // Send verification email
    await this.sendEmailQueue.add('send-verification-email', {
      email,
      from: `QuickMem <${this.configService.get('MAILER_USER')}>`,
      tokenTempEmail,
      fullName: user.fullName,
      userId: user.id,
    });

    return {
      message: 'Email updated successfully. Check your email for verification',
      success: true,
      email,
    };
  }

  async verifyEmail(
    verifyEmailDto: VerifyEmailQueryDto,
  ): Promise<UpdateEmailResponseInterfaceDto> {
    const { userId, token } = verifyEmailDto;

    const user = await this.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'User not found',
      });
    }

    const existingUser = await this.findOne({
      where: { email: user.tempEmail },
    });
    if (existingUser) {
      throw new ConflictException({
        statusCode: HttpStatus.CONFLICT,
        message: 'Email is already in use',
      });
    }

    if (user.tokenTempEmail !== token) {
      throw new UnauthorizedException({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Invalid or expired token',
      });
    }

    const oldEmail = user.email;
    const newEmail = user.tempEmail;

    user.tempEmail = null;
    user.email = newEmail;
    user.emailChangedAt = new Date();
    user.tokenTempEmail = null;
    await this.save(user);
    await this.sendEmailQueue.add('update-email-success', {
      fullName: user.fullName,
      oldEmail: oldEmail,
      newEmail: newEmail,
      userName: user.username,
      from: `QuickMem <${this.configService.get('MAILER_USER')}>`,
    });
    return {
      message: 'Email verified successfully',
      success: true,
      email: user.email,
    };
  }

  async changeUsername(
    changeUsernameBodyDto: ChangeUsernameBodyDto,
    userId: string,
  ): Promise<ChangePasswordResponseInterface> {
    const { newUsername } = changeUsernameBodyDto;
    const user = await this.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'User not found',
      });
    }

    const existingUser = await this.findOne({
      where: { username: newUsername },
    });
    if (existingUser) {
      throw new ConflictException({
        statusCode: HttpStatus.CONFLICT,
        message: 'Username is already in use',
      });
    }

    if (user.username === newUsername) {
      throw new ConflictException({
        statusCode: HttpStatus.CONFLICT,
        message: 'New username is the same as the old username',
      });
    }

    user.username = newUsername;
    await this.save(user);

    return {
      message: 'Username updated successfully',
      newUsername: newUsername,
    };
  }

  async searchUserByUsername(
    searchUserByUsernameQueryDto: SearchUserByUsernameQueryDto,
  ): Promise<UserResponseInterface[]> {
    const { username, size = 40, page = 1 } = searchUserByUsernameQueryDto;
    if (page < 1) {
      throw new ConflictException('Invalid page number');
    }

    const [users, total] = await this.findAndCount({
      where: {
        username: ILike(`%${username}%`),
        isVerified: true,
        userStatus: UserStatusEnum.ACTIVE,
      },
      select: ['id', 'username', 'avatarUrl'],
      relations: ['subscriptions'],
      take: size,
      skip: (page - 1) * size,
    });

    return users.map((user) => ({
      id: user.id,
      username: user.username,
      avatarUrl: user.avatarUrl,
    }));
  }

  async isUserPremium(userId: string): Promise<boolean> {
    const user = await this.findOne({
      where: { id: userId },
      relations: ['subscriptions'],
    });

    if (!user) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'User not found',
      });
    }

    return user.subscriptions.some(
      (subscription) =>
        subscription.isActive &&
        (subscription.subscriptionType === SubscriptionTypeEnum.FREE_TRIAL ||
          subscription.subscriptionType === SubscriptionTypeEnum.YEARLY ||
          subscription.subscriptionType === SubscriptionTypeEnum.MONTHLY),
    );
  }

  async getUserProfileById(
    userId: string,
  ): Promise<GetUserProfileResponseInterface> {
    const user = await this.findOne({ where: { id: userId } });
    const studySetCount = await this.dataSource
      .getRepository(StudySetEntity)
      .count({ where: { owner: { id: userId } } });

    const folderCount = await this.dataSource
      .getRepository(FolderEntity)
      .count({ where: { owner: { id: userId } } });

    if (!user) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'User not found',
      });
    }

    return {
      id: user.id,
      username: user.username,
      fullname: user.fullName,
      email: user.email,
      avatarUrl: user.avatarUrl,
      coin: user.coins,
      studySetCount,
      folderCount,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      bannedAt: user.bannedAt,
      userStatus: user.userStatus,
      bannedReason: user.bannedReason,
    };
  }

  async getAvatars(): Promise<GetAvatarsResponseInterface[]> {
    const avatars = await this.dataSource
      .getRepository(DefaultImageEntity)
      .find();

    return avatars.map((avatar) => ({
      id: avatar.id,
      url: avatar.url,
    }));
  }

  async createUserWithGoogle(
    socialSignupCredentialBodyDto: SocialSignupCredentialBodyDto,
  ): Promise<AuthResponseInterface> {
    const {
      email,
      id,
      birthday,
      provider,
      username,
      idToken,
      photoUrl,
      displayName,
    } = socialSignupCredentialBodyDto;

    const emailExists = await this.findOne({
      where: [{ email }],
    });

    if (emailExists) {
      if (emailExists.isVerified === false) {
        throw new ConflictException({
          statusCode: HttpStatus.PRECONDITION_FAILED,
          message: 'User already exists but not verified',
        });
      } else {
        throw new ConflictException({
          statusCode: HttpStatus.CONFLICT,
          message: 'User already exists',
        });
      }
    }

    let currentUsername = username;

    let userExits = await this.findOne({
      where: [{ username }],
    });

    // if exists, add a random number to the username
    while (userExits) {
      currentUsername = username + Math.floor(Math.random() * 1000);
      userExits = await this.findOne({
        where: [{ username: currentUsername }],
      });
    }

    const user = this.create({
      email,
      googleId: id,
      username: currentUsername,
      fullName: displayName,
      avatarUrl: photoUrl,
      birthday,
      provider: [provider],
      googleToken: idToken,
      isVerified: true,
    });

    try {
      await this.save(user);
      const payload: { email: string; userId: string } = {
        email,
        userId: user.id,
      };
      const access_token: string = this.jwtService.sign(payload);
      const refresh_token: string = this.jwtService.sign(payload, {
        expiresIn: '7d',
      });
      await this.sendEmailQueue.add('send-signup-email', {
        fullName: user.fullName,
        email: user.email,
        from: `QuickMem <${this.configService.get('MAILER_USER')}>`,
      });
      return {
        id: user.id,
        username: user.username,
        email,
        fullName: user.fullName,
        avatarUrl: user.avatarUrl,
        accessToken: access_token,
        isPremium: false,
        provider: user.provider,
        coin: user.coins,
        isVerified: user.isVerified,
        refreshToken: refresh_token,
        birthday: user.birthday,
        bannedAt: user.bannedAt,
        userStatus: user.userStatus,
        bannedReason: user.bannedReason,
      };
    } catch (error) {
      logger.error(error);
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Failed to create user',
      });
    }
  }

  async loginGoogle(
    socialLoginCredentialBodyDto: SocialLoginCredentialBodyDto,
  ): Promise<AuthResponseInterface> {
    const { email, id, provider, idToken, photoUrl, displayName } =
      socialLoginCredentialBodyDto;

    const user = await this.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'User not found',
      });
    }

    if (!user.provider.includes(provider)) {
      throw new UnauthorizedException({
        statusCode: HttpStatus.CONFLICT,
        message: 'Invalid login provider',
        provider: user.provider,
      });
    }

    if (user.googleId !== id) {
      throw new UnauthorizedException({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Invalid google id',
      });
    }

    const payload: { email: string; userId: string } = {
      email,
      userId: user.id,
    };

    const access_token: string = this.jwtService.sign(payload);
    const refresh_token: string = this.jwtService.sign(payload, {
      expiresIn: '7d',
    });
    const isPremium = await this.isUserPremium(user.id);
    await this.sendEmailQueue.add('send-login-email', {
      fullName: user.fullName,
      email: user.email,
      from: `QuickMem <${this.configService.get('MAILER_USER')}>`,
    });

    try {
      user.avatarUrl = photoUrl;
      user.googleToken = idToken;
      user.fullName = displayName;
      await this.save(user);
      return {
        id: user.id,
        username: user.username,
        email,
        fullName: user.fullName,
        avatarUrl: user.avatarUrl,
        accessToken: access_token,
        isPremium,
        provider: user.provider,
        coin: user.coins,
        isVerified: user.isVerified,
        refreshToken: refresh_token,
        birthday: user.birthday,
        bannedAt: user.bannedAt,
        userStatus: user.userStatus,
        bannedReason: user.bannedReason,
      };
    } catch (error) {
      logger.error(error);
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Failed to validate user',
      });
    }
  }

  async checkEmail(
    checkEmailQueryDto: CheckEmailQueryDto,
  ): Promise<CheckEmailResponseInterface> {
    const { email } = checkEmailQueryDto;
    try {
      const response = await lastValueFrom(
        this.httpService.post(
          this.configService.get<string>('CHECK_EMAIL_BASE_URL'),
          {
            email,
          },
        ),
      );

      return response.data;
    } catch (error) {
      logger.error(error);
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Failed to check email',
      });
    }
  }
}
