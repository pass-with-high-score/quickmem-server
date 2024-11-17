import { Injectable } from '@nestjs/common';
import { CreateStudyTimeDto } from './dto/bodies/create-study-time.dto';
import { StudyTimeRepository } from './study-time.repository';
import { CreateStudyTimeInterface } from './interfaces/create-study-time.interface';
import { GetTotalByUserIdResponseInterface } from './interfaces/get-total-by-user-id-response.interface';
import { GetTotalTimeByUserIdParamDto } from './dto/params/get-total-time-by-user-id-param.dto';
import { GetTotalTimeByStudySetIdParamDto } from './dto/params/get-total-time-by-study-set-id-param.dto';
import { GetTotalByStudySetIdResponseInterface } from './interfaces/get-total-by-study-set-id-response.interface';

@Injectable()
export class StudyTimeService {
  constructor(private readonly studyTimeRepository: StudyTimeRepository) {}

  async createStudyTime(
    createStudyTimeDto: CreateStudyTimeDto,
  ): Promise<CreateStudyTimeInterface> {
    return this.studyTimeRepository.createStudyTime(createStudyTimeDto);
  }

  async getTotalTimeByUserId(
    getTotalTimeParamDto: GetTotalTimeByUserIdParamDto,
  ): Promise<GetTotalByUserIdResponseInterface> {
    return this.studyTimeRepository.getTotalTimeByUserId(getTotalTimeParamDto);
  }

  async getTotalTimeByStudySetId(
    getTotalTimeByUserIdParamDto: GetTotalTimeByStudySetIdParamDto,
  ): Promise<GetTotalByStudySetIdResponseInterface> {
    return this.studyTimeRepository.getTotalTimeByStudySetId(
      getTotalTimeByUserIdParamDto,
    );
  }
}
