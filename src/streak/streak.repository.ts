import {
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

@Injectable()
export class StreakRepository extends Repository<StreakEntity> {
  constructor(
    private readonly dataSource: DataSource,
    private configService: ConfigService,
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
      .select('streak.userId', 'userId')
      .addSelect('user.username', 'username')
      .addSelect('streak.streakCount', 'streakCount')
      .addSelect('user.role', 'role')
      .addSelect('user.avatarUrl', 'avatarUrl')
      .innerJoin(UserEntity, 'user', 'user.id = streak.userId')
      .where('streak.updatedAt >= :date', {
        date: new Date(new Date().setDate(new Date().getDate() - 1)),
      })
      .andWhere('user.isVerified = true')
      .andWhere('streak.streakCount > 0')
      .orderBy('streak.streakCount', 'DESC')
      .limit(limit);

    try {
      const topStreaks = await query.getRawMany();
      return topStreaks.map((streak) => ({
        userId: streak.userId,
        username: streak.username,
        avatarUrl: `${this.configService.get<string>('HOST')}/public/images/avatar/${streak.avatarUrl}.jpg`,
        streakCount: parseInt(streak.streakCount, 10),
        role: streak.role,
      }));
    } catch (e) {
      logger.error(e);
      throw new InternalServerErrorException({
        message: 'Error getting top streaks',
      });
    }
  }
}
