import { DataSource, Repository } from 'typeorm';
import { FlashcardEntity } from './entities/flashcard.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFlashcardDto } from './dto/create-flashcard.dto';
import { FlashcardResponseInterface } from './interface/flashcard-response.interface';
import { StudySetEntity } from '../study-set/entities/study-set.entity';
import { GetFlashcardByIdDto } from './dto/get-flashcard-by-id.dto';
import { GetFlashcardsByStudySetIdDto } from './dto/get-flashcards-by-study-set-id.dto';

@Injectable()
export class FlashcardRepository extends Repository<FlashcardEntity> {
  constructor(private dataSource: DataSource) {
    super(FlashcardEntity, dataSource.createEntityManager());
  }

  async getFlashcardById(
    getFlashcardByIdDto: GetFlashcardByIdDto,
  ): Promise<FlashcardResponseInterface> {
    const { id } = getFlashcardByIdDto;

    // 1. Tìm flashcard dựa trên id
    const flashcard = await this.dataSource
      .getRepository(FlashcardEntity)
      .findOne({
        where: { id },
      });

    if (!flashcard) {
      throw new NotFoundException(`Flashcard with ID ${id} not found`);
    }

    // 2. Trả về FlashcardResponseInterface
    return {
      id: flashcard.id,
      term: flashcard.term,
      definition: flashcard.definition,
      definitionImageURL: flashcard.definitionImageURL,
      isStarred: flashcard.isStarred,
      hint: flashcard.hint,
      explanation: flashcard.explanation,
      rating: flashcard.rating,
      createdAt: flashcard.createdAt,
      updatedAt: flashcard.updatedAt,
    };
  }

  async getFlashcardByStudySetId(
    getFlashcardsByStudySetIdDto: GetFlashcardsByStudySetIdDto,
  ): Promise<FlashcardResponseInterface[]> {
    const { id } = getFlashcardsByStudySetIdDto;

    // 1. Tìm flashcards dựa trên studySetId
    const flashcards = await this.dataSource
      .getRepository(FlashcardEntity)
      .find({
        where: { studySet: { id: id } },
      });

    // 2. Trả về mảng FlashcardResponseInterface
    return flashcards.map((flashcard) => ({
      id: flashcard.id,
      term: flashcard.term,
      definition: flashcard.definition,
      definitionImageURL: flashcard.definitionImageURL,
      isStarred: flashcard.isStarred,
      hint: flashcard.hint,
      explanation: flashcard.explanation,
      rating: flashcard.rating,
      createdAt: flashcard.createdAt,
      updatedAt: flashcard.updatedAt,
    }));
  }

  async createFlashcard(
    createFlashcardDto: CreateFlashcardDto,
  ): Promise<FlashcardResponseInterface> {
    const {
      term,
      definition,
      definitionImageUrl,
      hint,
      explanation,
      studySetId,
    } = createFlashcardDto;

    // 1. Tìm study set dựa trên studySetId
    const studySet = await this.dataSource
      .getRepository(StudySetEntity)
      .findOne({ where: { id: studySetId } });

    if (!studySet) {
      throw new NotFoundException(`Study set with ID ${studySetId} not found`);
    }

    // 2. Tạo FlashcardEntity mới
    const flashcard = new FlashcardEntity();
    flashcard.term = term;
    flashcard.definition = definition;
    flashcard.definitionImageURL = definitionImageUrl;
    flashcard.hint = hint;
    flashcard.explanation = explanation;
    flashcard.studySet = studySet;

    // 4. Lưu flashcard và các options vào cơ sở dữ liệu
    const savedFlashcard = await this.save(flashcard);

    // 5. Trả về FlashcardResponseInterface
    return {
      id: savedFlashcard.id,
      term: savedFlashcard.term,
      definition: savedFlashcard.definition,
      definitionImageURL: savedFlashcard.definitionImageURL,
      isStarred: savedFlashcard.isStarred,
      hint: savedFlashcard.hint,
      explanation: savedFlashcard.explanation,
      rating: savedFlashcard.rating,
      createdAt: savedFlashcard.createdAt,
      updatedAt: savedFlashcard.updatedAt,
    };
  }
}
