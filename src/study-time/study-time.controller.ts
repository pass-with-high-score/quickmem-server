import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
  Request,
} from '@nestjs/common';
import { StudyTimeService } from './study-time.service';
import { CreateStudyTimeDto } from './dto/bodies/create-study-time.dto';
import { SkipThrottle } from '@nestjs/throttler';
import { AuthGuard } from '@nestjs/passport';
import { CreateStudyTimeInterface } from './interfaces/create-study-time.interface';
import { GetTotalByUserIdResponseInterface } from './interfaces/get-total-by-user-id-response.interface';
import { GetTotalTimeByStudySetIdParamDto } from './dto/params/get-total-time-by-study-set-id-param.dto';
import { GetTotalByStudySetIdResponseInterface } from './interfaces/get-total-by-study-set-id-response.interface';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('study-time')
@SkipThrottle()
@UseGuards(AuthGuard('jwt'))
@UseInterceptors(CacheInterceptor)
export class StudyTimeController {
  constructor(private readonly studyTimeService: StudyTimeService) {}

  @Get('user/total')
  @HttpCode(HttpStatus.OK)
  async getTotalTimeByUserId(
    @Request() req,
  ): Promise<GetTotalByUserIdResponseInterface> {
    const userId = req.user.id;
    return this.studyTimeService.getTotalTimeByUserId(userId);
  }

  @Get('study-set/:studySetId')
  @HttpCode(HttpStatus.OK)
  async getTotalTimeByStudySetId(
    @Param() getTotalTimeByUserIdParamDto: GetTotalTimeByStudySetIdParamDto,
  ): Promise<GetTotalByStudySetIdResponseInterface> {
    return this.studyTimeService.getTotalTimeByStudySetId(
      getTotalTimeByUserIdParamDto,
    );
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createStudyTime(
    @Request() req,
    @Body() createStudyTimeDto: CreateStudyTimeDto,
  ): Promise<CreateStudyTimeInterface> {
    const userId = req.user.id;
    return this.studyTimeService.createStudyTime(createStudyTimeDto, userId);
  }
}
