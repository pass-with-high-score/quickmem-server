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
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { FlashcardService } from './flashcard.service';
import { SkipThrottle } from '@nestjs/throttler';
import { AuthGuard } from '@nestjs/passport';
import { CreateFlashcardDto } from './dto/bodies/create-flashcard.dto';
import { FlashcardResponseInterface } from './interface/flashcard-response.interface';
import { GetFlashcardByIdDto } from './dto/params/get-flashcard-by-id.dto';
import { GetFlashcardsByStudySetIdDto } from './dto/params/get-flashcards-by-study-set-id.dto';
import { DeleteFlashcardParamDto } from './dto/params/delete-flashcard-param.dto';
import { UpdateFlashcardParamDto } from './dto/params/update-flashcard-param.dto';
import { UpdateFlashcardDto } from './dto/bodies/update-flashcard.dto';
import { UpdateFlashcardRatingDto } from './dto/bodies/update-flashcard-rating.dto';
import { StarredFlashcardDto } from './dto/bodies/starred-flashcard.dto';
import { UpdateFlashcardInterface } from './interface/update-flashcard.interface';
import { UpdateFlashcardFlipStatusDto } from './dto/bodies/update-flashcard-flip-status.dto';
import { GetFlashcardByIdQuery } from './dto/queries/get-flashcard-by-id.query';
import { UpdateQuizStatusParamDto } from './dto/params/update-quiz-status-param.dto';
import { UpdateFlashcardQuizStatusDto } from './dto/bodies/update-flashcard-quiz-status.dto';
import { UpdateFlashcardTrueFalseStatusDto } from './dto/bodies/update-flashcard-true-false-status.dto';
import { UpdateFlashcardWriteStatusDto } from './dto/bodies/update-flashcard-write-status.dto';
import { GetFlashcardsByFolderIdDto } from './dto/params/get-flashcards-by-folder-id.dto';

@SkipThrottle()
@UseGuards(AuthGuard('jwt'))
@Controller('flashcard')
export class FlashcardController {
  constructor(private readonly flashcardService: FlashcardService) {}

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async getFlashcardById(
    @Param() getFlashcardByIdDto: GetFlashcardByIdDto,
  ): Promise<FlashcardResponseInterface> {
    return this.flashcardService.getFlashcardById(getFlashcardByIdDto);
  }

  @Get('/study-set/:id')
  @HttpCode(HttpStatus.OK)
  async getFlashcardByStudySetId(
    @Param() getFlashcardsByStudySetIdDto: GetFlashcardsByStudySetIdDto,
    @Query() getFlashcardByIdQuery: GetFlashcardByIdQuery,
  ): Promise<FlashcardResponseInterface[]> {
    return this.flashcardService.getFlashcardByStudySetId(
      getFlashcardsByStudySetIdDto,
      getFlashcardByIdQuery,
    );
  }

  @Get('/folder/:id')
  @HttpCode(HttpStatus.OK)
  async getFlashcardsByFolderId(
    @Param() getFlashcardsByFolderIdDto: GetFlashcardsByFolderIdDto,
    @Query() getFlashcardByIdParam: GetFlashcardByIdQuery,
  ): Promise<FlashcardResponseInterface[]> {
    return this.flashcardService.getFlashcardsByFolderId(
      getFlashcardsByFolderIdDto,
      getFlashcardByIdParam,
    );
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createFlashcard(
    @Body() createFlashcardDto: CreateFlashcardDto,
  ): Promise<FlashcardResponseInterface> {
    console.log('createFlashcardDto', createFlashcardDto);
    return await this.flashcardService.createFlashcard(createFlashcardDto);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteFlashcardById(
    @Param() deleteFlashcardParamDto: DeleteFlashcardParamDto,
  ): Promise<void> {
    return this.flashcardService.deleteFlashcardById(deleteFlashcardParamDto);
  }

  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  async updateFlashcardById(
    @Param() updateFlashcardParamDto: UpdateFlashcardParamDto,
    @Body() updateFlashcardDto: UpdateFlashcardDto,
  ): Promise<FlashcardResponseInterface> {
    return this.flashcardService.updateFlashcardById(
      updateFlashcardParamDto,
      updateFlashcardDto,
    );
  }

  @Patch('/:id/rating')
  @HttpCode(HttpStatus.OK)
  async updateFlashcardRating(
    @Param() updateFlashcardParamDto: UpdateFlashcardParamDto,
    @Body() updateFlashcardRatingDto: UpdateFlashcardRatingDto,
  ): Promise<UpdateFlashcardInterface> {
    return this.flashcardService.updateFlashcardRating(
      updateFlashcardParamDto,
      updateFlashcardRatingDto,
    );
  }

  @Patch('/:id/flip-status')
  @HttpCode(HttpStatus.OK)
  async updateFlashcardFlipStatus(
    @Param() updateFlashcardParamDto: UpdateFlashcardParamDto,
    @Body() updateFlashcardFlipStatusDto: UpdateFlashcardFlipStatusDto,
  ): Promise<UpdateFlashcardInterface> {
    return this.flashcardService.updateFlashcardFlipStatus(
      updateFlashcardParamDto,
      updateFlashcardFlipStatusDto,
    );
  }

  @Patch('/:id/quiz-status')
  @HttpCode(HttpStatus.OK)
  async updateFlashcardQuizStatus(
    @Param() updateQuizStatusParamDto: UpdateQuizStatusParamDto,
    @Body() updateFlashcardQuizStatusDto: UpdateFlashcardQuizStatusDto,
  ): Promise<UpdateFlashcardInterface> {
    return this.flashcardService.updateFlashcardQuizStatus(
      updateQuizStatusParamDto,
      updateFlashcardQuizStatusDto,
    );
  }

  @Patch('/:id/true-false-status')
  @HttpCode(HttpStatus.OK)
  async updateFlashcardTrueFalseStatus(
    @Param() updateFlashcardParamDto: UpdateFlashcardParamDto,
    @Body()
    updateFlashcardTrueFalseStatusDto: UpdateFlashcardTrueFalseStatusDto,
  ): Promise<UpdateFlashcardInterface> {
    return this.flashcardService.updateFlashcardTrueFalseStatus(
      updateFlashcardParamDto,
      updateFlashcardTrueFalseStatusDto,
    );
  }

  @Patch('/:id/write-status')
  @HttpCode(HttpStatus.OK)
  async updateWriteStatus(
    @Param() updateFlashcardParamDto: UpdateFlashcardParamDto,
    @Body() updateWriteStatusDto: UpdateFlashcardWriteStatusDto,
  ): Promise<UpdateFlashcardInterface> {
    return this.flashcardService.updateWriteStatus(
      updateFlashcardParamDto,
      updateWriteStatusDto,
    );
  }

  @Patch('/:id/starred')
  @HttpCode(HttpStatus.OK)
  async starredFlashcard(
    @Param() updateFlashcardParamDto: UpdateFlashcardParamDto,
    @Body() starredFlashcardDto: StarredFlashcardDto,
  ): Promise<UpdateFlashcardInterface> {
    return this.flashcardService.updateFlashcardStarred(
      updateFlashcardParamDto,
      starredFlashcardDto,
    );
  }
}
