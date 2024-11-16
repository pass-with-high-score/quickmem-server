import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { StreakService } from './streak.service';
import { SkipThrottle } from '@nestjs/throttler';
import { AuthGuard } from '@nestjs/passport';
import { GetStreaksByUserIdParamDto } from './dto/params/get-streaks-by-user-id.param.dto';
import { GetStreaksResponseInterface } from './interfaces/get-streaks-response.interface';
import { IncrementStreakDto } from './dto/bodies/increment-streak.dto';
import { StreakInterface } from './interfaces/streak.interface';
import { GetTopStreakQueryDto } from './dto/queries/get-top-streak-query.dto';
import { GetTopStreakResponseInterface } from './interfaces/get-top-streak-response.interface';

@SkipThrottle()
@UseGuards(AuthGuard('jwt'))
@Controller('streak')
export class StreakController {
  constructor(private readonly streakService: StreakService) {}

  @Get('/top')
  @HttpCode(HttpStatus.OK)
  async getTopUsers(
    @Query() getTopStreakQueryDto: GetTopStreakQueryDto,
  ): Promise<GetTopStreakResponseInterface[]> {
    return this.streakService.getTopUsers(getTopStreakQueryDto);
  }

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
