import { Injectable } from '@nestjs/common';
import { StudySetRepository } from './study-set.repository';
import { CreateStudySetDto } from './dto/create-study-set.dto';
import { CreateStudySetResponseInterface } from './dto/create-study-set-response.interface';
import { GetAllStudySetResponseInterface } from './dto/get-all-study-set-response.interface';
import { GetStudySetsByOwnerIdDto } from './dto/get-study-sets-by-ownerId.dto';
import { GetStudySetByIdDto } from './dto/get-study-set-by-id.dto';
import { UpdateStudySetByIdParamDto } from './dto/update-study-set-by-id-param.dto';
import { UpdateStudySetByIdBodyDto } from './dto/update-study-set-by-id-body.dto';
import { DeleteStudySetByIdParamDto } from './dto/delete-study-set-by-id-param.dto';
import { DeleteStudySetResponseInterface } from './dto/delete-study-set-response.interface';

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
    getStudySetsByOwnerIdDto: GetStudySetsByOwnerIdDto,
  ): Promise<GetAllStudySetResponseInterface[]> {
    return await this.studySetRepository.getStudySetsByOwnerId(
      getStudySetsByOwnerIdDto,
    );
  }

  async getStudySetById(
    getStudySetByIdDto: GetStudySetByIdDto,
  ): Promise<GetAllStudySetResponseInterface> {
    return await this.studySetRepository.getStudySetById(getStudySetByIdDto);
  }

  async updateStudySetById(
    updateStudySetByIdParamDto: UpdateStudySetByIdParamDto,
    updateStudySetByIdBodyDto: UpdateStudySetByIdBodyDto,
  ): Promise<GetAllStudySetResponseInterface> {
    return await this.studySetRepository.updateStudySetById(
      updateStudySetByIdParamDto,
      updateStudySetByIdBodyDto,
    );
  }

  async deleteStudySetById(
    deleteStudySetByIdParamDto: DeleteStudySetByIdParamDto,
  ): Promise<DeleteStudySetResponseInterface> {
    return await this.studySetRepository.deleteStudySetById(
      deleteStudySetByIdParamDto,
    );
  }
}
