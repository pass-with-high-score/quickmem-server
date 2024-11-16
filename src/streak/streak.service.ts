import { Injectable } from '@nestjs/common';
import { StreakRepository } from './streak.repository';
import { GetStreaksByUserIdParamDto } from './dto/params/get-streaks-by-user-id.param.dto';
import { GetStreaksResponseInterface } from './interfaces/get-streaks-response.interface';
import { IncrementStreakDto } from './dto/bodies/increment-streak.dto';
import { StreakInterface } from './interfaces/streak.interface';
import { Cron, CronExpression } from '@nestjs/schedule';
import { logger } from '../winston-logger.service';
import { GetTopStreakQueryDto } from './dto/queries/get-top-streak-query.dto';
import { GetTopStreakResponseInterface } from './interfaces/get-top-streak-response.interface';

@Injectable()
export class StreakService {
  constructor(private readonly streakRepository: StreakRepository) {}

  async getStreaksByUserId(
    getStreaksByUserIdParamDto: GetStreaksByUserIdParamDto,
  ): Promise<GetStreaksResponseInterface> {
    return this.streakRepository.getStreaksByUserId(getStreaksByUserIdParamDto);
  }

  async incrementStreak(
    incrementStreakDto: IncrementStreakDto,
  ): Promise<StreakInterface> {
    return this.streakRepository.incrementStreak(incrementStreakDto);
  }

  async getTopUsers(
    getTopStreakQueryDto: GetTopStreakQueryDto,
  ): Promise<GetTopStreakResponseInterface[]> {
    return this.streakRepository.getTopUsers(getTopStreakQueryDto);
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCron() {
    logger.info('Running streak cron job');
    try {
      const users = await this.streakRepository.getAllUsers();
      for (const user of users) {
        const streaks = await this.streakRepository.getStreaksByUserId({
          userId: user.id,
        });
        const lastStreak = streaks.streaks[streaks.streaks.length - 1];
        const currentDate = new Date();
        const yesterday = new Date();
        yesterday.setDate(currentDate.getDate() - 1);

        if (
          lastStreak &&
          lastStreak.date.toDateString() !== yesterday.toDateString()
        ) {
          await this.streakRepository.resetStreak(user.id);
        }
      }
    } catch (error) {
      logger.error('Error in streak cron job:', error);
    }
  }
}
