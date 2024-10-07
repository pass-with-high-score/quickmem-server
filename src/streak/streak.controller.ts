import { Controller } from '@nestjs/common';
import { StreakService } from './streak.service';

@Controller('streak')
export class StreakController {
  constructor(
    private readonly streakService: StreakService,
  ) {
  }
}
