import { Injectable } from '@nestjs/common';
import { StudySetRepository } from './study-set.repository';
import { CreateStudySetDto } from './dto/bodies/create-study-set.dto';
import { CreateStudySetResponseInterface } from './interfaces/create-study-set-response.interface';
import { GetAllStudySetResponseInterface } from './interfaces/get-all-study-set-response.interface';
import { GetStudySetsByOwnerIdDto } from './dto/params/get-study-sets-by-ownerId.dto';
import { GetStudySetByIdDto } from './dto/params/get-study-set-by-id.dto';
import { UpdateStudySetByIdParamDto } from './dto/params/update-study-set-by-id-param.dto';
import { UpdateStudySetByIdBodyDto } from './dto/bodies/update-study-set-by-id-body.dto';
import { DeleteStudySetByIdParamDto } from './dto/params/delete-study-set-by-id-param.dto';
import { DeleteStudySetResponseInterface } from './interfaces/delete-study-set-response.interface';
import { DuplicateStudySetDto } from './dto/bodies/duplicate-study-set.dto';
import { SearchStudySetParamsDto } from './dto/queries/search-study-set-params.dto';

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

  async duplicateStudySet(
    duplicateStudySet: DuplicateStudySetDto,
  ): Promise<GetAllStudySetResponseInterface> {
    return await this.studySetRepository.duplicateStudySet(duplicateStudySet);
  }

  async searchStudySetByTitle(
    searchStudySeParamsDto: SearchStudySetParamsDto,
  ): Promise<GetAllStudySetResponseInterface[]> {
    return await this.studySetRepository.searchStudySetByTitle(
      searchStudySeParamsDto,
    );
  }
}
