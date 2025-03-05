import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
  Request,
} from '@nestjs/common';
import { StreakService } from './streak.service';
import { SkipThrottle } from '@nestjs/throttler';
import { AuthGuard } from '@nestjs/passport';
import { GetStreaksResponseInterface } from './interfaces/get-streaks-response.interface';
import { StreakInterface } from './interfaces/streak.interface';
import { GetTopStreakQueryDto } from './dto/queries/get-top-streak-query.dto';
import { GetTopStreakResponseInterface } from './interfaces/get-top-streak-response.interface';
import { CacheInterceptor } from '@nestjs/cache-manager';

@SkipThrottle()
@UseGuards(AuthGuard('jwt'))
@UseInterceptors(CacheInterceptor)
@Controller('streak')
export class StreakController {
  constructor(private readonly streakService: StreakService) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  async getStreaksByUserId(
    @Request() req,
  ): Promise<GetStreaksResponseInterface> {
    const userId = req.user.id;
    return this.streakService.getStreaksByUserId(userId);
  }

  @Get('/top')
  @HttpCode(HttpStatus.OK)
  async getTopUsers(
    @Query() getTopStreakQueryDto: GetTopStreakQueryDto,
  ): Promise<GetTopStreakResponseInterface[]> {
    return this.streakService.getTopUsers(getTopStreakQueryDto);
  }

  @Post()
  async incrementStreak(@Request() req): Promise<StreakInterface> {
    const userId = req.user.id;
    return this.streakService.incrementStreak(userId);
  }
}
