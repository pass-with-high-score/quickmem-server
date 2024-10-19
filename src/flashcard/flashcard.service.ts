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
  ): Promise<FlashcardResponseInterface[]> {
    return this.flashcardRepository.getFlashcardByStudySetId(
      getFlashcardsByStudySetIdDto,
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
  ): Promise<FlashcardResponseInterface> {
    return this.flashcardRepository.updateFlashcardRating(
      updateFlashcardParamDto,
      updateFlashcardRatingDto,
    );
  }

  async updateFlashcardStarred(
    updateFlashcardParamDto: UpdateFlashcardParamDto,
    updateFlashcardStarredDto: StarredFlashcardDto,
  ): Promise<FlashcardResponseInterface> {
    return this.flashcardRepository.updateFlashcardStarred(
      updateFlashcardParamDto,
      updateFlashcardStarredDto,
    );
  }
}
