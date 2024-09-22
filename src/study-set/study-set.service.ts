import { Injectable } from '@nestjs/common';
import { StudySetRepository } from './study-set.repository';
import { CreateStudySetDto } from './dto/create-study-set.dto';
import { CreateStudySetResponseInterface } from './dto/create-study-set-response.interface';
import { GetAllStudySetResponseInterface } from './dto/get-all-study-set-response.interface';

@Injectable()
export class StudySetService {
  constructor(private readonly studySetRepository: StudySetRepository) {}

  async createStudySet(
    createStudySetDto: CreateStudySetDto,
  ): Promise<CreateStudySetResponseInterface> {
    return await this.studySetRepository.createStudySet(createStudySetDto);
  }

  async getStudySets(): Promise<GetAllStudySetResponseInterface[]> {
    return await this.studySetRepository.getStudySets();
  }

  async getStudySetsByOwnerId(
    ownerId: string,
  ): Promise<GetAllStudySetResponseInterface[]> {
    return await this.studySetRepository.getStudySetsByOwnerId(ownerId);
  }
}
