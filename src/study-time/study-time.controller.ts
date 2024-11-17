import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { StudyTimeService } from "./study-time.service";
import { CreateStudyTimeDto } from "./dto/create-study-time.dto";

@Controller('study-time')
export class StudyTimeController {
  constructor(private readonly studyTimeService: StudyTimeService) {}

  @Post()
  async createStudyTime(@Body() createStudyTimeDto: CreateStudyTimeDto) {
    return this.studyTimeService.createStudyTime(createStudyTimeDto);
  }

  @Get('/:userId/total')
  async getTotalStudyTime(@Param('userId') userId: string) {
    return this.studyTimeService.getTotalStudyTime(userId);
  }
}