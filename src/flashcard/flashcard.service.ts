import { Injectable } from '@nestjs/common';
import { FlashcardRepository } from './flashcard.repository';
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
import { GetFlashcardByIdParam } from './dto/queries/get-flashcard-by-id.param';
import { UpdateQuizStatusParamDto } from './dto/params/update-quiz-status-param.dto';
import { UpdateFlashcardQuizStatusDto } from './dto/bodies/update-flashcard-quiz-status.dto';

@Injectable()
export class FlashcardService {
  constructor(private readonly flashcardRepository: FlashcardRepository) {}

  async getFlashcardById(
    getFlashcardByIdDto: GetFlashcardByIdDto,
  ): Promise<FlashcardResponseInterface> {
    return this.flashcardRepository.getFlashcardById(getFlashcardByIdDto);
  }

  async getFlashcardByStudySetId(
    getFlashcardsByStudySetIdDto: GetFlashcardsByStudySetIdDto,
    getFlashcardByIdParam: GetFlashcardByIdParam,
  ): Promise<FlashcardResponseInterface[]> {
    return this.flashcardRepository.getFlashcardByStudySetId(
      getFlashcardsByStudySetIdDto,
      getFlashcardByIdParam,
    );
  }

  async createFlashcard(
    createFlashcardDto: CreateFlashcardDto,
  ): Promise<FlashcardResponseInterface> {
    return this.flashcardRepository.createFlashcard(createFlashcardDto);
  }

  async deleteFlashcardById(
    deleteFlashcardParamDto: DeleteFlashcardParamDto,
  ): Promise<void> {
    return this.flashcardRepository.deleteFlashcardById(
      deleteFlashcardParamDto,
    );
  }

  async updateFlashcardById(
    updateFlashcardParamDto: UpdateFlashcardParamDto,
    updateFlashcardDto: UpdateFlashcardDto,
  ): Promise<FlashcardResponseInterface> {
    return this.flashcardRepository.updateFlashcardById(
      updateFlashcardParamDto,
      updateFlashcardDto,
    );
  }

  async updateFlashcardRating(
    updateFlashcardParamDto: UpdateFlashcardParamDto,
    updateFlashcardRatingDto: UpdateFlashcardRatingDto,
  ): Promise<UpdateFlashcardInterface> {
    return this.flashcardRepository.updateFlashcardRating(
      updateFlashcardParamDto,
      updateFlashcardRatingDto,
    );
  }

  async updateFlashcardStarred(
    updateFlashcardParamDto: UpdateFlashcardParamDto,
    updateFlashcardStarredDto: StarredFlashcardDto,
  ): Promise<UpdateFlashcardInterface> {
    return this.flashcardRepository.updateFlashcardStarred(
      updateFlashcardParamDto,
      updateFlashcardStarredDto,
    );
  }

  async updateFlashcardFlipStatus(
    updateFlashcardParamDto: UpdateFlashcardParamDto,
    updateFlashcardFlipStatusDto: UpdateFlashcardFlipStatusDto,
  ): Promise<UpdateFlashcardInterface> {
    return this.flashcardRepository.updateFlashcardFlipStatus(
      updateFlashcardParamDto,
      updateFlashcardFlipStatusDto,
    );
  }

  async updateFlashcardQuizStatus(
    updateQuizStatusParamDto: UpdateQuizStatusParamDto,
    updateFlashcardQuizStatusDto: UpdateFlashcardQuizStatusDto,
  ): Promise<UpdateFlashcardInterface> {
    return this.flashcardRepository.updateFlashcardQuizStatus(
      updateQuizStatusParamDto,
      updateFlashcardQuizStatusDto,
    );
  }
}
