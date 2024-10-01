import { Injectable } from '@nestjs/common';
import { FlashcardRepository } from './flashcard.repository';
import { CreateFlashcardDto } from './dto/create-flashcard.dto';
import { FlashcardResponseInterface } from './interface/flashcard-response.interface';
import { GetFlashcardByIdDto } from './dto/get-flashcard-by-id.dto';
import { GetFlashcardsByStudySetIdDto } from './dto/get-flashcards-by-study-set-id.dto';

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
}
