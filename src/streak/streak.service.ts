import { Injectable } from '@nestjs/common';
import { StreakRepository } from './streak.repository';
import { GetStreaksByUserIdParamDto } from './dto/params/get-streaks-by-user-id.param.dto';
import { GetStreaksResponseInterface } from './interfaces/get-streaks-response.interface';
import { IncrementStreakDto } from './dto/bodies/increment-streak.dto';
import { StreakInterface } from './interfaces/streak.interface';

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
}
