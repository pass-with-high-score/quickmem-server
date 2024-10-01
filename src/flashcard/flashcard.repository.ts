import { DataSource, Repository } from 'typeorm';
import { FlashcardEntity } from './entities/flashcard.entity';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateFlashcardDto } from './dto/create-flashcard.dto';
import { FlashcardResponseInterface } from './interface/flashcard-response.interface';
import { StudySetEntity } from '../study-set/entities/study-set.entity';
import { OptionEntity } from './entities/option.entity';
import { Rating } from './entities/rating.enum';
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
        relations: ['options'],
      });

    if (!flashcard) {
      throw new NotFoundException(`Flashcard with ID ${id} not found`);
    }

    // 2. Trả về FlashcardResponseInterface
    const response: FlashcardResponseInterface = {
      id: flashcard.id,
      question: flashcard.question,
      answer: flashcard.answer,
      imageURL: flashcard.imageURL,
      hint: flashcard.hint,
      explanation: flashcard.explanation,
      rating: flashcard.rating,
      options: flashcard.options?.map((option) => ({
        answerText: option.answerText,
        isCorrect: option.isCorrect,
        imageURL: option.imageURL,
      })),
      createdAt: flashcard.createdAt,
      updatedAt: flashcard.updatedAt,
    };

    return response;
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
        relations: ['options'],
      });

    // 2. Trả về mảng FlashcardResponseInterface
    return flashcards.map((flashcard) => ({
      id: flashcard.id,
      question: flashcard.question,
      answer: flashcard.answer,
      imageURL: flashcard.imageURL,
      hint: flashcard.hint,
      explanation: flashcard.explanation,
      rating: flashcard.rating,
      options: flashcard.options?.map((option) => ({
        answerText: option.answerText,
        isCorrect: option.isCorrect,
        imageURL: option.imageURL,
      })),
      createdAt: flashcard.createdAt,
      updatedAt: flashcard.updatedAt,
    }));
  }

  async createFlashcard(
    createFlashcardDto: CreateFlashcardDto,
  ): Promise<FlashcardResponseInterface> {
    const {
      question,
      answer,
      imageURL,
      hint,
      explanation,
      options,
      studySetId,
      rating,
    } = createFlashcardDto;

    // 1. Tìm study set dựa trên studySetId
    const studySet = await this.dataSource
      .getRepository(StudySetEntity)
      .findOne({ where: { id: studySetId } });

    if (!studySet) {
      throw new NotFoundException(`Study set with ID ${studySetId} not found`);
    }

    if (options.length > 6) {
      throw new BadRequestException('Number of options must not exceed 6');
    }

    // 2. Tạo FlashcardEntity mới
    const flashcard = new FlashcardEntity();
    flashcard.question = question;
    flashcard.answer = answer;
    flashcard.imageURL = imageURL;
    flashcard.hint = hint;
    flashcard.explanation = explanation;
    flashcard.studySet = studySet;
    flashcard.rating = rating || Rating.UNRATED;

    // 3. Tạo OptionEntity (nếu có)
    if (options && options.length > 0) {
      flashcard.options = options.map((optionDto) => {
        const option = new OptionEntity();
        option.answerText = optionDto.answerText;
        option.isCorrect = optionDto.isCorrect;
        option.imageURL = optionDto.imageURL;
        return option;
      });
    }

    // 4. Lưu flashcard và các options vào cơ sở dữ liệu
    const savedFlashcard = await this.save(flashcard);

    // 5. Trả về FlashcardResponseInterface
    const response: FlashcardResponseInterface = {
      id: savedFlashcard.id,
      question: savedFlashcard.question,
      answer: savedFlashcard.answer,
      imageURL: savedFlashcard.imageURL,
      hint: savedFlashcard.hint,
      explanation: savedFlashcard.explanation,
      rating: savedFlashcard.rating,
      options: savedFlashcard.options?.map((option) => ({
        answerText: option.answerText,
        isCorrect: option.isCorrect,
        imageURL: option.imageURL,
      })),
      createdAt: savedFlashcard.createdAt,
      updatedAt: savedFlashcard.updatedAt,
    };

    return response;
  }
}
