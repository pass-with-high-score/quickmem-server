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
import { SkipThrottle } from '@nestjs/throttler';
import { AuthGuard } from '@nestjs/passport';
import { StudySetService } from './study-set.service';
import { CreateStudySetDto } from './dto/create-study-set.dto';
import { CreateStudySetResponseInterface } from './dto/create-study-set-response.interface';
import { GetAllStudySetResponseInterface } from './dto/get-all-study-set-response.interface';

@SkipThrottle()
@UseGuards(AuthGuard('jwt'))
@Controller('study-set')
export class StudySetController {
  constructor(private readonly studySetService: StudySetService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createStudySet(
    @Body() createStudySetDto: CreateStudySetDto,
  ): Promise<CreateStudySetResponseInterface> {
    console.log('createStudySetDto', createStudySetDto);
    return await this.studySetService.createStudySet(createStudySetDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getStudySets(): Promise<GetAllStudySetResponseInterface[]> {
    return await this.studySetService.getStudySets();
  }

  @Get('/owner/:ownerId')
  @HttpCode(HttpStatus.OK)
  async getStudySetsByOwnerId(
    @Param('ownerId') ownerId: string,
  ): Promise<GetAllStudySetResponseInterface[]> {
    return await this.studySetService.getStudySetsByOwnerId(ownerId);
  }
}
