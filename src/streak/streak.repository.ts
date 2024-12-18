import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { StreakEntity } from './entities/streak.entity';
import { GetStreaksByUserIdParamDto } from './dto/params/get-streaks-by-user-id.param.dto';
import { GetStreaksResponseInterface } from './interfaces/get-streaks-response.interface';
import { logger } from '../winston-logger.service';
import { UserEntity } from '../auth/entities/user.entity';
import { IncrementStreakDto } from './dto/bodies/increment-streak.dto';
import { StreakInterface } from './interfaces/streak.interface';
import { GetTopStreakQueryDto } from './dto/queries/get-top-streak-query.dto';
import { GetTopStreakResponseInterface } from './interfaces/get-top-streak-response.interface';
import { ConfigService } from '@nestjs/config';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { NotificationService } from '../notification/notification.service';
import { NotificationTypeEnum } from '../notification/enums/notification-type.enum';

@Injectable()
export class StreakRepository extends Repository<StreakEntity> {
  constructor(
    private readonly dataSource: DataSource,
    private readonly configService: ConfigService,
    @InjectQueue('send-email-streak') private readonly emailQueue: Queue,
    @Inject(NotificationService)
    private readonly notificationService: NotificationService,
  ) {
    super(StreakEntity, dataSource.createEntityManager());
  }

  async getStreaksByUserId(
    getStreaksByUserIdParamDto: GetStreaksByUserIdParamDto,
  ): Promise<GetStreaksResponseInterface> {
    const { userId } = getStreaksByUserIdParamDto;

    // Get current date and yesterday
    const currentDate = new Date();
    const yesterday = new Date();
    yesterday.setDate(currentDate.getDate() - 1);

    try {
      // Find the user
      const user = await this.dataSource
        .getRepository(UserEntity)
        .findOne({ where: { id: userId } });

      if (!user) {
        throw new NotFoundException({ message: 'User not found' });
      }
      if (!user.isVerified) {
        throw new UnauthorizedException({
          message: 'User is not verified',
        });
      }

      // Find all streaks for the user
      const streaks = await this.find({ where: { user: { id: userId } } });

      // Check for existing streaks
      if (streaks.length > 0) {
        const lastStreak = streaks[streaks.length - 1];
        if (lastStreak.updatedAt.toDateString() === yesterday.toDateString()) {
          return {
            userId,
            streaks: streaks.map((streak) => ({
              id: streak.id,
              streakCount: streak.streakCount,
              date: streak.updatedAt,
            })),
          };
        }

        // If last streak is today, return the existing streak without creating a new one
        if (
          lastStreak.updatedAt.toDateString() === currentDate.toDateString()
        ) {
          return {
            userId,
            streaks: streaks.map((streak) => ({
              id: streak.id,
              streakCount: streak.streakCount,
              date: streak.updatedAt,
            })),
          };
        }
      }

      // Create a new streak if none exists or last streak is not updated today
      const newStreak = this.create({
        user: { id: userId },
        streakCount: 0,
        createdAt: currentDate,
        updatedAt: currentDate,
      });

      await this.save(newStreak);

      const updatedStreaks = await this.find({
        where: { user: { id: userId } },
      });

      return {
        userId,
        streaks: updatedStreaks.map((streak) => ({
          id: streak.id,
          streakCount: streak.streakCount,
          date: streak.updatedAt,
        })),
      };
    } catch (error) {
      logger.error(error);
      throw new InternalServerErrorException({
        message: 'Error retrieving streaks',
      });
    }
  }

  async incrementStreak(
    incrementStreakDto: IncrementStreakDto,
  ): Promise<StreakInterface> {
    const { userId } = incrementStreakDto;
    const user = await this.dataSource
      .getRepository(UserEntity)
      .findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException({ message: 'User not found' });
    }

    if (!user.isVerified) {
      throw new UnauthorizedException({
        message: 'User is not verified',
      });
    }
    const date = new Date();
    const streaks = await this.find({
      where: { user: { id: userId } },
      order: { updatedAt: 'DESC' },
      take: 1,
    });

    if (streaks.length === 0) {
      // create a new streak if none exists
      const newStreak = this.create({
        user: { id: userId },
        streakCount: 1,
        createdAt: date,
        updatedAt: date,
      });

      try {
        await this.save(newStreak);
        return {
          id: newStreak.id,
          date,
          streakCount: newStreak.streakCount,
        };
      } catch (e) {
        logger.error(e);
        throw new InternalServerErrorException({
          message: 'Error creating streak',
        });
      }
    } else {
      const lastStreak = streaks[0];

      // Check if streak is already updated today
      const today = new Date();
      if (
        lastStreak.updatedAt.toDateString() === today.toDateString() &&
        lastStreak.streakCount > 0
      ) {
        return {
          id: lastStreak.id,
          date,
          streakCount: lastStreak.streakCount,
        };
      }

      // If streak is not updated today, increment the streak
      lastStreak.streakCount += 1;
      lastStreak.updatedAt = date;

      try {
        await this.save(lastStreak);
        return {
          id: lastStreak.id,
          date,
          streakCount: lastStreak.streakCount,
        };
      } catch (e) {
        logger.error(e);
        throw new InternalServerErrorException({
          message: 'Error incrementing streak',
        });
      }
    }
  }

  async getAllUsers(): Promise<UserEntity[]> {
    return this.dataSource.getRepository(UserEntity).find();
  }

  async resetStreak(userId: string): Promise<void> {
    const streaks = await this.find({ where: { user: { id: userId } } });
    for (const streak of streaks) {
      streak.streakCount = 0;
      await this.save(streak);
    }
  }

  // Get top streaks
  async getTopUsers(
    getTopStreakQueryDto: GetTopStreakQueryDto,
  ): Promise<GetTopStreakResponseInterface[]> {
    const { limit = 10 } = getTopStreakQueryDto;
    const query = this.createQueryBuilder('streak')
      .select([
        'DISTINCT streak.userId AS userId',
        'user.username AS username',
        'MAX(streak.streakCount) AS streakCount',
        'user.role AS role',
        'user.avatarUrl AS avatarUrl',
      ])
      .innerJoin(UserEntity, 'user', 'user.id = streak.userId')
      .where('streak.updatedAt >= :date', {
        date: new Date(new Date().setDate(new Date().getDate() - 2)),
      })
      .andWhere('user.isVerified = true')
      .andWhere('streak.streakCount > 0')
      .groupBy('streak.userId, user.username, user.role, user.avatarUrl')
      .orderBy('streakCount', 'DESC')
      .limit(limit);

    try {
      const topStreaks = await query.getRawMany();
      return topStreaks.map((streak) => ({
        userId: streak.userid,
        username: streak.username,
        avatarUrl: streak.avatarurl,
        streakCount: parseInt(streak.streakcount, 10),
        role: streak.role,
      }));
    } catch (e) {
      logger.error(e);
      throw new InternalServerErrorException({
        message: 'Error getting top streaks',
      });
    }
  }

  async sendStreakReminder() {
    logger.info('Running streak reminder job');

    try {
      const users = await this.getAllUsers();
      const currentDate = new Date();
      const eightHoursBeforeMidnight = new Date();
      eightHoursBeforeMidnight.setHours(16, 0, 0, 0); // 16:00 là 8 giờ trước nửa đêm

      for (const user of users) {
        const streaks = await this.getStreaksByUserId({
          userId: user.id,
        });
        const lastStreak = streaks.streaks[streaks.streaks.length - 1];

        // Kiểm tra nếu người dùng chưa nhận email hôm nay
        const lastReminderSent = new Date(user.lastReminderSentAt || 0);

        const isSameDay =
          lastReminderSent.toDateString() === currentDate.toDateString();

        if (
          lastStreak &&
          lastStreak.date.toDateString() !== currentDate.toDateString() &&
          currentDate >= eightHoursBeforeMidnight &&
          !isSameDay
        ) {
          // Gửi email nhắc nhở
          await this.emailQueue.add('send-streak-reminder', {
            email: user.email,
            name: user.username,
            from: `QuickMem <${this.configService.get('MAILER_USER')}>`,
          });

          // Tạo thông báo nhắc nhở
          await this.notificationService.createNotification({
            userId: [user.id],
            title: '🔥 Don’t Break Your Learning Streak!',
            message:
              'You’ve been doing an amazing job! 🌟 Don’t let your learning streak fade away. Take a few minutes today and complete a quick study session to keep your streak alive. Every day counts! 💪',
            notificationType: NotificationTypeEnum.STREAK_REMINDER,
          });

          await this.updateLastReminderSent(user.id, currentDate);
        }
      }
    } catch (error) {
      logger.error('Error in streak reminder job:', error);
    }
  }

  async updateLastReminderSent(userId: string, date: Date) {
    await this.dataSource
      .getRepository(UserEntity)
      .update(userId, { lastReminderSentAt: date });
  }
}
