import { Injectable } from '@nestjs/common';
import { CreateStudyTimeDto } from './dto/bodies/create-study-time.dto';
import { StudyTimeRepository } from './study-time.repository';
import { CreateStudyTimeInterface } from './interfaces/create-study-time.interface';

@Injectable()
export class StudyTimeService {
  constructor(private readonly studyTimeRepository: StudyTimeRepository) {}

  async createStudyTime(
    createStudyTimeDto: CreateStudyTimeDto,
  ): Promise<CreateStudyTimeInterface> {
    return this.studyTimeRepository.createStudyTime(createStudyTimeDto);
  }
}
