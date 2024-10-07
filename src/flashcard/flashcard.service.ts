import { Injectable } from '@nestjs/common';
import { FlashcardRepository } from './flashcard.repository';
import { CreateFlashcardDto } from './dto/create-flashcard.dto';
import { FlashcardResponseInterface } from './interface/flashcard-response.interface';
import { GetFlashcardByIdDto } from './dto/get-flashcard-by-id.dto';
import { GetFlashcardsByStudySetIdDto } from './dto/get-flashcards-by-study-set-id.dto';
import { DeleteFlashcardParamDto } from './dto/delete-flashcard-param.dto';
import { UpdateFlashcardParamDto } from './dto/update-flashcard-param.dto';
import { UpdateFlashcardDto } from './dto/update-flashcard.dto';
import { FlashcardEntity } from './entities/flashcard.entity';
import { UpdateFlashcardRatingDto } from './dto/update-flashcard-rating.dto';

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
  ): Promise<FlashcardEntity> {
    return this.flashcardRepository.updateFlashcardById(
      updateFlashcardParamDto,
      updateFlashcardDto,
    );
  }

  async updateFlashcardRating(
    updateFlashcardParamDto: UpdateFlashcardParamDto,
    updateFlashcardRatingDto: UpdateFlashcardRatingDto,
  ): Promise<FlashcardEntity> {
    return this.flashcardRepository.updateFlashcardRating(
      updateFlashcardParamDto,
      updateFlashcardRatingDto,
    );
  }
}
