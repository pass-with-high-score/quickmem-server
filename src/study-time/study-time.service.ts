import { Injectable } from '@nestjs/common';
import { CreateStudyTimeDto } from './dto/bodies/create-study-time.dto';
import { StudyTimeRepository } from './study-time.repository';
import { CreateStudyTimeInterface } from './interfaces/create-study-time.interface';
import { GetTotalByUserIdResponseInterface } from './interfaces/get-total-by-user-id-response.interface';
import { GetTotalTimeByStudySetIdParamDto } from './dto/params/get-total-time-by-study-set-id-param.dto';
import { GetTotalByStudySetIdResponseInterface } from './interfaces/get-total-by-study-set-id-response.interface';

@Injectable()
export class StudyTimeService {
  constructor(private readonly studyTimeRepository: StudyTimeRepository) {}

  async createStudyTime(
    createStudyTimeDto: CreateStudyTimeDto,
    userId: string,
  ): Promise<CreateStudyTimeInterface> {
    return this.studyTimeRepository.createStudyTime(createStudyTimeDto, userId);
  }

  async getTotalTimeByUserId(
    userId: string,
  ): Promise<GetTotalByUserIdResponseInterface> {
    return this.studyTimeRepository.getTotalTimeByUserId(userId);
  }

  async getTotalTimeByStudySetId(
    getTotalTimeByUserIdParamDto: GetTotalTimeByStudySetIdParamDto,
  ): Promise<GetTotalByStudySetIdResponseInterface> {
    return this.studyTimeRepository.getTotalTimeByStudySetId(
      getTotalTimeByUserIdParamDto,
    );
  }
}
