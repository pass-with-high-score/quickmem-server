import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { StreakService } from './streak.service';
import { SkipThrottle } from '@nestjs/throttler';
import { AuthGuard } from '@nestjs/passport';
import { GetStreaksByUserIdParamDto } from './dto/params/get-streaks-by-user-id.param.dto';
import { GetStreaksResponseInterface } from './interfaces/get-streaks-response.interface';
import { IncrementStreakDto } from './dto/bodies/increment-streak.dto';
import { StreakInterface } from './interfaces/streak.interface';

@SkipThrottle()
@UseGuards(AuthGuard('jwt'))
@Controller('streak')
export class StreakController {
  constructor(private readonly streakService: StreakService) {}

  @Get('/:userId')
  @HttpCode(HttpStatus.OK)
  async getStreaksByUserId(
    @Param() getStreaksByUserIdParamDto: GetStreaksByUserIdParamDto,
  ): Promise<GetStreaksResponseInterface> {
    return this.streakService.getStreaksByUserId(getStreaksByUserIdParamDto);
  }

  @Post()
  async incrementStreak(
    @Body() incrementStreakDto: IncrementStreakDto,
  ): Promise<StreakInterface> {
    return this.streakService.incrementStreak(incrementStreakDto);
  }
}
