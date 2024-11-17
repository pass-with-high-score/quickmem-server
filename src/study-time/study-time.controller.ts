import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { StudyTimeService } from './study-time.service';
import { CreateStudyTimeDto } from './dto/bodies/create-study-time.dto';
import { SkipThrottle } from '@nestjs/throttler';
import { AuthGuard } from '@nestjs/passport';
import { CreateStudyTimeInterface } from './interfaces/create-study-time.interface';

@Controller('study-time')
@SkipThrottle()
@UseGuards(AuthGuard('jwt'))
export class StudyTimeController {
  constructor(private readonly studyTimeService: StudyTimeService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createStudyTime(
    @Body() createStudyTimeDto: CreateStudyTimeDto,
  ): Promise<CreateStudyTimeInterface> {
    return this.studyTimeService.createStudyTime(createStudyTimeDto);
  }
}
