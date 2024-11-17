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
import { StudyTimeService } from './study-time.service';
import { CreateStudyTimeDto } from './dto/bodies/create-study-time.dto';
import { SkipThrottle } from '@nestjs/throttler';
import { AuthGuard } from '@nestjs/passport';
import { CreateStudyTimeInterface } from './interfaces/create-study-time.interface';
import { GetTotalTimeByUserIdParamDto } from './dto/params/get-total-time-by-user-id-param.dto';
import { GetTotalByUserIdResponseInterface } from './interfaces/get-total-by-user-id-response.interface';
import { GetTotalTimeByStudySetIdParamDto } from './dto/params/get-total-time-by-study-set-id-param.dto';
import { GetTotalByStudySetIdResponseInterface } from './interfaces/get-total-by-study-set-id-response.interface';

@Controller('study-time')
@SkipThrottle()
@UseGuards(AuthGuard('jwt'))
export class StudyTimeController {
  constructor(private readonly studyTimeService: StudyTimeService) {}

  @Get('user/:userId')
  @HttpCode(HttpStatus.OK)
  async getTotalTimeByUserId(
    @Param() getTotalTimeParamDto: GetTotalTimeByUserIdParamDto,
  ): Promise<GetTotalByUserIdResponseInterface> {
    return this.studyTimeService.getTotalTimeByUserId(getTotalTimeParamDto);
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
    @Body() createStudyTimeDto: CreateStudyTimeDto,
  ): Promise<CreateStudyTimeInterface> {
    return this.studyTimeService.createStudyTime(createStudyTimeDto);
  }
}
