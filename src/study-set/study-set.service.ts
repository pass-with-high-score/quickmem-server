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
import { SearchStudySetsQueryDto } from './dto/queries/search-study-sets-query.dto';
import { ResetFlashcardProgressParamDto } from './dto/params/reset-flashcard-progress-param.dto';
import { ResetFlashcardProgressResponseInterface } from './interfaces/reset-flashcard-progress-response.interface';
import { ImportFlashcardDto } from './dto/bodies/import-flashcard.dto';
import { ImportFlashcardFromQuizletParamDto } from './dto/params/import-flashcard-from-quizlet.param.dto';
import { CreateStudySetFromAiDto } from './dto/bodies/create-study-set-from-ai.dto';
import { ResetFlashcardProgressParamsDto } from './dto/queries/reset-flashcard-progress-params.dto';
import { GetStudySetsByOwnerIdQueryDto } from './dto/queries/get-study-sets-by-owner-Id-query.dto';
import { UpdateFoldersInStudySetDto } from './dto/bodies/update-folders-in-study-set.dto';
import { UpdateFoldersInStudySetResponseInterface } from './interfaces/update-folders-in-study-set-response.interface';
import { UpdateClassesInStudySetDto } from './dto/bodies/update-classes-in-study-set.dto';
import { UpdateClassesInStudySetResponseInterface } from './interfaces/update-classes-in-study-set-response.interface';
import { GetStudySetByCodeParamDto } from './dto/params/get-study-set-by-code.param.dto';
import { GetStudySetsBySubjectIdParamDto } from './dto/params/get-study-sets-by-subject-id-param.dto';
import { GetStudySetsBySubjectIdQueryDto } from './dto/queries/get-study-sets-by-subject-id-query.dto';
import { TopSubjectResponseInterface } from './interfaces/top-subject-response.interface';
import { UpdateRecentStudySetDto } from './dto/bodies/update-recent-study-set-body.dto';
import { GetStudySetsByUserIdDto } from './dto/params/get-study-sets-by-user-Id.dto';

@Injectable()
export class StudySetService {
  constructor(private readonly studySetRepository: StudySetRepository) {}

  async createStudySet(
    createStudySetDto: CreateStudySetDto,
  ): Promise<CreateStudySetResponseInterface> {
    return await this.studySetRepository.createStudySet(createStudySetDto);
  }

  async getStudySetsByOwnerId(
    getStudySetsByOwnerIdDto: GetStudySetsByOwnerIdDto,
    getStudySetsByOwnerIdParamDto: GetStudySetsByOwnerIdQueryDto,
  ): Promise<GetAllStudySetResponseInterface[]> {
    return await this.studySetRepository.getStudySetsByOwnerId(
      getStudySetsByOwnerIdDto,
      getStudySetsByOwnerIdParamDto,
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
    searchStudySetsQueryDto: SearchStudySetsQueryDto,
  ): Promise<GetAllStudySetResponseInterface[]> {
    return await this.studySetRepository.searchStudySetByTitle(
      searchStudySetsQueryDto,
    );
  }

  async resetFlashcardProgress(
    resetFlashcardProgressParamDto: ResetFlashcardProgressParamDto,
    resetFlashcardProgressParamsDto: ResetFlashcardProgressParamsDto,
  ): Promise<ResetFlashcardProgressResponseInterface> {
    return this.studySetRepository.resetFlashcardProgress(
      resetFlashcardProgressParamDto,
      resetFlashcardProgressParamsDto,
    );
  }

  async importFromUrl(
    importFlashcardDto: ImportFlashcardDto,
    importFlashcardFromQuizletParamDto: ImportFlashcardFromQuizletParamDto,
  ): Promise<GetAllStudySetResponseInterface> {
    return this.studySetRepository.importFromUrl(
      importFlashcardDto,
      importFlashcardFromQuizletParamDto,
    );
  }

  async createStudySetFromAI(
    createStudySetFromAiDto: CreateStudySetFromAiDto,
  ): Promise<GetAllStudySetResponseInterface> {
    return this.studySetRepository.createStudySetFromAI(
      createStudySetFromAiDto,
    );
  }

  async updateFoldersInStudySet(
    updateFoldersInStudySetDto: UpdateFoldersInStudySetDto,
  ): Promise<UpdateFoldersInStudySetResponseInterface> {
    return this.studySetRepository.updateFoldersInStudySet(
      updateFoldersInStudySetDto,
    );
  }

  async updateClassesInStudySet(
    updateClassesInStudySetDto: UpdateClassesInStudySetDto,
  ): Promise<UpdateClassesInStudySetResponseInterface> {
    return this.studySetRepository.updateClassesInStudySet(
      updateClassesInStudySetDto,
    );
  }

  async getStudySetByCode(
    getClassByCodeParamDto: GetStudySetByCodeParamDto,
  ): Promise<GetAllStudySetResponseInterface> {
    return this.studySetRepository.getStudySetByCode(getClassByCodeParamDto);
  }

  async getStudySetsBySubjectId(
    getStudySetsBySubjectIdParamDto: GetStudySetsBySubjectIdParamDto,
    getStudySetsBySubjectIdQueryDto: GetStudySetsBySubjectIdQueryDto,
  ): Promise<GetAllStudySetResponseInterface[]> {
    return this.studySetRepository.getStudySetsBySubjectId(
      getStudySetsBySubjectIdParamDto,
      getStudySetsBySubjectIdQueryDto,
    );
  }

  async getTop5SubjectByStudySetCount(): Promise<
    TopSubjectResponseInterface[]
  > {
    return this.studySetRepository.getTop5SubjectByStudySetCount();
  }

  async updateRecentStudySet(updateRecentStudySetDto: UpdateRecentStudySetDto) {
    return this.studySetRepository.updateRecentStudySet(
      updateRecentStudySetDto,
    );
  }

  async getStudySetRecentByUserId(
    getStudySetsByUserIdDto: GetStudySetsByUserIdDto,
  ): Promise<GetAllStudySetResponseInterface[]> {
    return this.studySetRepository.getStudySetRecentByUserId(
      getStudySetsByUserIdDto,
    );
  }
}
