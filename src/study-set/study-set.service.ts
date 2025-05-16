import { Injectable } from '@nestjs/common';
import { StudySetRepository } from './study-set.repository';
import { CreateStudySetDto } from './dto/bodies/create-study-set.dto';
import { CreateStudySetResponseInterface } from './interfaces/create-study-set-response.interface';
import { GetAllStudySetResponseInterface } from './interfaces/get-all-study-set-response.interface';
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
import { CreateStudySetFromAiDto } from './dto/bodies/create-study-set-from-ai.dto';
import { ResetFlashcardProgressParamsDto } from './dto/queries/reset-flashcard-progress-params.dto';
import { GetStudySetsByOwnerIdQueryDto } from './dto/queries/get-study-sets-by-owner-Id-query.dto';
import { UpdateFoldersInStudySetDto } from './dto/bodies/update-folders-in-study-set.dto';
import { UpdateFoldersInStudySetResponseInterface } from './interfaces/update-folders-in-study-set-response.interface';
import { GetStudySetByCodeParamDto } from './dto/params/get-study-set-by-code.param.dto';
import { GetStudySetsBySubjectIdParamDto } from './dto/params/get-study-sets-by-subject-id-param.dto';
import { GetStudySetsBySubjectIdQueryDto } from './dto/queries/get-study-sets-by-subject-id-query.dto';
import { TopSubjectResponseInterface } from './interfaces/top-subject-response.interface';
import { UpdateRecentStudySetDto } from './dto/bodies/update-recent-study-set-body.dto';
import { CreateWriteHintBodyDto } from './dto/bodies/create-write-hint-body.dto';
import { CreateWriteHintResponseInterface } from './interfaces/create-write-hint-response.interface';

@Injectable()
export class StudySetService {
  constructor(private readonly studySetRepository: StudySetRepository) {}

  async createStudySet(
    createStudySetDto: CreateStudySetDto,
    ownerId: string,
  ): Promise<CreateStudySetResponseInterface> {
    return await this.studySetRepository.createStudySet(
      createStudySetDto,
      ownerId,
    );
  }

  async getStudySetsByOwnerId(
    ownerId: string,
    getStudySetsByOwnerIdParamDto: GetStudySetsByOwnerIdQueryDto,
  ): Promise<GetAllStudySetResponseInterface[]> {
    return await this.studySetRepository.getStudySetsByOwnerId(
      ownerId,
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
    newOwnerId: string,
  ): Promise<GetAllStudySetResponseInterface> {
    return await this.studySetRepository.duplicateStudySet(
      duplicateStudySet,
      newOwnerId,
    );
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
    userId: string,
  ): Promise<GetAllStudySetResponseInterface> {
    return this.studySetRepository.importFromUrl(importFlashcardDto, userId);
  }

  async createStudySetFromAI(
    createStudySetFromAiDto: CreateStudySetFromAiDto,
    userId: string,
  ): Promise<GetAllStudySetResponseInterface> {
    return this.studySetRepository.createStudySetFromAI(
      createStudySetFromAiDto,
      userId,
    );
  }

  async updateFoldersInStudySet(
    updateFoldersInStudySetDto: UpdateFoldersInStudySetDto,
  ): Promise<UpdateFoldersInStudySetResponseInterface> {
    return this.studySetRepository.updateFoldersInStudySet(
      updateFoldersInStudySetDto,
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

  async updateRecentStudySet(
    updateRecentStudySetDto: UpdateRecentStudySetDto,
    userId: string,
  ) {
    return this.studySetRepository.updateRecentStudySet(
      updateRecentStudySetDto,
      userId,
    );
  }

  async getStudySetRecentByUserId(
    userId: string,
  ): Promise<GetAllStudySetResponseInterface[]> {
    return this.studySetRepository.getStudySetRecentByUserId(userId);
  }

  async removeInvalidStudySets() {
    return this.studySetRepository.removeInvalidStudySets();
  }

  async createHintFromAIForFlashcard(
    createWriteHintBodyDto: CreateWriteHintBodyDto,
  ): Promise<CreateWriteHintResponseInterface> {
    return this.studySetRepository.createHintFromAIForFlashcard(
      createWriteHintBodyDto,
    );
  }

  async deleteAllStudySetsOfUser(userId: string): Promise<void> {
    return this.studySetRepository.deleteAllStudySetsOfUser(userId);
  }
}
