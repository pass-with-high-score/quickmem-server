import { Controller, UseGuards, UseInterceptors } from '@nestjs/common';
import { StreakService } from './streak.service';
import { SkipThrottle } from '@nestjs/throttler';
import { AuthGuard } from '@nestjs/passport';

@SkipThrottle()
@UseGuards(AuthGuard('jwt'))
@Controller('streak')
export class StreakController {
  constructor(
    private readonly streakService: StreakService,
  ) {
  }
}
