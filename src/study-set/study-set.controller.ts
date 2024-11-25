import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { AuthGuard } from '@nestjs/passport';
import { StudySetService } from './study-set.service';
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

@SkipThrottle()
@UseGuards(AuthGuard('jwt'))
@Controller('study-set')
export class StudySetController {
  constructor(private readonly studySetService: StudySetService) {}

  @Get('/search')
  @HttpCode(HttpStatus.OK)
  async searchStudySetByTitle(
    @Query() searchStudySetsQueryDto: SearchStudySetsQueryDto,
  ): Promise<GetAllStudySetResponseInterface[]> {
    return await this.studySetService.searchStudySetByTitle(
      searchStudySetsQueryDto,
    );
  }

  @Get('/link/:code')
  @HttpCode(HttpStatus.OK)
  async getStudySetByCode(
    @Param() getClassByCodeParamDto: GetStudySetByCodeParamDto,
  ): Promise<GetAllStudySetResponseInterface> {
    return await this.studySetService.getStudySetByCode(getClassByCodeParamDto);
  }

  @Get('/owner/:ownerId')
  @HttpCode(HttpStatus.OK)
  async getStudySetsByOwnerId(
    @Param() getStudySetsByOwnerIdDto: GetStudySetsByOwnerIdDto,
    @Query() getStudySetsByOwnerIdParamDto: GetStudySetsByOwnerIdQueryDto,
  ): Promise<GetAllStudySetResponseInterface[]> {
    return await this.studySetService.getStudySetsByOwnerId(
      getStudySetsByOwnerIdDto,
      getStudySetsByOwnerIdParamDto,
    );
  }

  @Get('/recent/:userId')
  @HttpCode(HttpStatus.OK)
  async getStudySetRecentByUserId(
    @Param() getStudySetsByUserIdDto: GetStudySetsByUserIdDto,
  ): Promise<GetAllStudySetResponseInterface[]> {
    return await this.studySetService.getStudySetRecentByUserId(
      getStudySetsByUserIdDto,
    );
  }

  @Get('/subject/:subjectId')
  @HttpCode(HttpStatus.OK)
  async getStudySetsBySubjectId(
    @Param() getStudySetsBySubjectIdParamDto: GetStudySetsBySubjectIdParamDto,
    @Query() getStudySetsBySubjectIdQueryDto: GetStudySetsBySubjectIdQueryDto,
  ): Promise<GetAllStudySetResponseInterface[]> {
    return await this.studySetService.getStudySetsBySubjectId(
      getStudySetsBySubjectIdParamDto,
      getStudySetsBySubjectIdQueryDto,
    );
  }

  @Get('/top-subject')
  @HttpCode(HttpStatus.OK)
  async getTop5SubjectByStudySetCount(): Promise<
    TopSubjectResponseInterface[]
  > {
    return await this.studySetService.getTop5SubjectByStudySetCount();
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async getStudySetById(
    @Param() getStudySetByIdDto: GetStudySetByIdDto,
  ): Promise<GetAllStudySetResponseInterface> {
    return await this.studySetService.getStudySetById(getStudySetByIdDto);
  }

  @Patch('/:id')
  @HttpCode(HttpStatus.OK)
  async updateStudySetById(
    @Param() updateStudySetByIdParamDto: UpdateStudySetByIdParamDto,
    @Body() updateStudySetByIdBodyDto: UpdateStudySetByIdBodyDto,
  ): Promise<GetAllStudySetResponseInterface> {
    return await this.studySetService.updateStudySetById(
      updateStudySetByIdParamDto,
      updateStudySetByIdBodyDto,
    );
  }

  @Patch('/:id/reset-progress')
  @HttpCode(HttpStatus.OK)
  async resetFlashcardProgress(
    @Param() resetFlashcardProgressParamDto: ResetFlashcardProgressParamDto,
    @Query()
    resetFlashcardProgressParamsDto: ResetFlashcardProgressParamsDto,
  ): Promise<ResetFlashcardProgressResponseInterface> {
    return this.studySetService.resetFlashcardProgress(
      resetFlashcardProgressParamDto,
      resetFlashcardProgressParamsDto,
    );
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createStudySet(
    @Body() createStudySetDto: CreateStudySetDto,
  ): Promise<CreateStudySetResponseInterface> {
    console.log('createStudySetDto', createStudySetDto);
    return await this.studySetService.createStudySet(createStudySetDto);
  }

  @Post('/duplicate')
  @HttpCode(HttpStatus.CREATED)
  async duplicateStudySet(
    @Body() duplicateStudySet: DuplicateStudySetDto,
  ): Promise<GetAllStudySetResponseInterface> {
    return await this.studySetService.duplicateStudySet(duplicateStudySet);
  }

  @Post('/import/:userId')
  async importFromUrl(
    @Body() importFlashcardDto: ImportFlashcardDto,
    @Param()
    importFlashcardFromQuizletParamDto: ImportFlashcardFromQuizletParamDto,
  ): Promise<GetAllStudySetResponseInterface> {
    return this.studySetService.importFromUrl(
      importFlashcardDto,
      importFlashcardFromQuizletParamDto,
    );
  }

  @Post('/ai')
  @HttpCode(HttpStatus.CREATED)
  async createStudySetFromAI(
    @Body() createStudySetFromAiDto: CreateStudySetFromAiDto,
  ): Promise<GetAllStudySetResponseInterface> {
    return this.studySetService.createStudySetFromAI(createStudySetFromAiDto);
  }

  @Post('/folders')
  @HttpCode(HttpStatus.CREATED)
  async updateFoldersInStudySet(
    @Body() updateFoldersInStudySetDto: UpdateFoldersInStudySetDto,
  ): Promise<UpdateFoldersInStudySetResponseInterface> {
    return this.studySetService.updateFoldersInStudySet(
      updateFoldersInStudySetDto,
    );
  }

  @Post('/classes')
  @HttpCode(HttpStatus.CREATED)
  async updateClassesInStudySet(
    @Body() updateClassesInStudySetDto: UpdateClassesInStudySetDto,
  ): Promise<UpdateClassesInStudySetResponseInterface> {
    return this.studySetService.updateClassesInStudySet(
      updateClassesInStudySetDto,
    );
  }

  @Post('/recent')
  @HttpCode(HttpStatus.CREATED)
  async updateRecentStudySet(
    @Body() updateRecentStudySetDto: UpdateRecentStudySetDto,
  ) {
    return this.studySetService.updateRecentStudySet(updateRecentStudySetDto);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.OK) // can change to 204 (No Content) but it will not return any response
  async deleteStudySetById(
    @Param() deleteStudySetByIdParamDto: DeleteStudySetByIdParamDto,
  ): Promise<DeleteStudySetResponseInterface> {
    return await this.studySetService.deleteStudySetById(
      deleteStudySetByIdParamDto,
    );
  }
}
