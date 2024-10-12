import { Controller, UseInterceptors } from '@nestjs/common';
import { StreakService } from './streak.service';
import { LoggingInterceptor } from '../logging.interceptor';

@UseInterceptors(LoggingInterceptor)
@Controller('streak')
export class StreakController {
  constructor(
    private readonly streakService: StreakService,
  ) {
  }
}
