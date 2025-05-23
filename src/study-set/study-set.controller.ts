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
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { AuthGuard } from '@nestjs/passport';
import { StudySetService } from './study-set.service';
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
import { CacheInterceptor } from '@nestjs/cache-manager';

@SkipThrottle()
@UseGuards(AuthGuard('jwt'))
@Controller('study-set')
@UseInterceptors(CacheInterceptor)
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

  @Get()
  @HttpCode(HttpStatus.OK)
  async getStudySetsByOwnerId(
    @Request() req,
    @Query() getStudySetsByOwnerIdParamDto: GetStudySetsByOwnerIdQueryDto,
  ): Promise<GetAllStudySetResponseInterface[]> {
    const userId = req.user.id;
    return await this.studySetService.getStudySetsByOwnerId(
      userId,
      getStudySetsByOwnerIdParamDto,
    );
  }

  @Get('/recent')
  @HttpCode(HttpStatus.OK)
  async getStudySetRecentByUserId(
    @Request() req,
  ): Promise<GetAllStudySetResponseInterface[]> {
    const userId = req.user.id;
    return await this.studySetService.getStudySetRecentByUserId(userId);
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
    @Request() req,
    @Body() createStudySetDto: CreateStudySetDto,
  ): Promise<CreateStudySetResponseInterface> {
    const userId = req.user.id;
    return await this.studySetService.createStudySet(createStudySetDto, userId);
  }

  @Post('/duplicate')
  @HttpCode(HttpStatus.CREATED)
  async duplicateStudySet(
    @Request() req,
    @Body() duplicateStudySet: DuplicateStudySetDto,
  ): Promise<GetAllStudySetResponseInterface> {
    const userId = req.user.id;
    return await this.studySetService.duplicateStudySet(
      duplicateStudySet,
      userId,
    );
  }

  @Post('/import/quizlet')
  async importFromUrl(
    @Body() importFlashcardDto: ImportFlashcardDto,
    @Request() req,
  ): Promise<GetAllStudySetResponseInterface> {
    const userId = req.user.id;
    return this.studySetService.importFromUrl(importFlashcardDto, userId);
  }

  @Post('/ai')
  @HttpCode(HttpStatus.CREATED)
  async createStudySetFromAI(
    @Request() req,
    @Body() createStudySetFromAiDto: CreateStudySetFromAiDto,
  ): Promise<GetAllStudySetResponseInterface> {
    const userId = req.user.id;
    return this.studySetService.createStudySetFromAI(
      createStudySetFromAiDto,
      userId,
    );
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

  @Post('/recent')
  @HttpCode(HttpStatus.CREATED)
  async updateRecentStudySet(
    @Request() req,
    @Body() updateRecentStudySetDto: UpdateRecentStudySetDto,
  ) {
    const userId = req.user.id;
    return this.studySetService.updateRecentStudySet(
      updateRecentStudySetDto,
      userId,
    );
  }

  @Post('/ai/write-hint')
  @HttpCode(HttpStatus.CREATED)
  async createHintFromAIForFlashcard(
    @Body() createWriteHintBodyDto: CreateWriteHintBodyDto,
  ): Promise<CreateWriteHintResponseInterface> {
    return this.studySetService.createHintFromAIForFlashcard(
      createWriteHintBodyDto,
    );
  }

  @Delete('/invalid')
  @HttpCode(HttpStatus.OK)
  async removeInvalidStudySets() {
    return this.studySetService.removeInvalidStudySets();
  }

  @Delete('/user')
  async deleteAllStudySetsOfUser(@Request() req): Promise<void> {
    const userId = req.user.id;
    return this.studySetService.deleteAllStudySetsOfUser(userId);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  async deleteStudySetById(
    @Param() deleteStudySetByIdParamDto: DeleteStudySetByIdParamDto,
  ): Promise<DeleteStudySetResponseInterface> {
    return await this.studySetService.deleteStudySetById(
      deleteStudySetByIdParamDto,
    );
  }
}
