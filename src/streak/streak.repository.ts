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

@Injectable()
export class StreakRepository extends Repository<StreakEntity> {
  constructor(private readonly dataSource: DataSource) {
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
}
