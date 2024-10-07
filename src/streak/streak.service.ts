import { Injectable } from '@nestjs/common';
import { StreakRepository } from './streak.repository';

@Injectable()
export class StreakService {
  constructor(
    private readonly streakRepository: StreakRepository,
  ) {
  }
}
