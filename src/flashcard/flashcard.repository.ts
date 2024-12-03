import { DataSource, Repository } from 'typeorm';
import { FlashcardEntity } from './entities/flashcard.entity';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateFlashcardDto } from './dto/bodies/create-flashcard.dto';
import { FlashcardResponseInterface } from './interface/flashcard-response.interface';
import { StudySetEntity } from '../study-set/entities/study-set.entity';
import { GetFlashcardByIdDto } from './dto/params/get-flashcard-by-id.dto';
import { GetFlashcardsByStudySetIdDto } from './dto/params/get-flashcards-by-study-set-id.dto';
import { UpdateFlashcardDto } from './dto/bodies/update-flashcard.dto';
import { DeleteFlashcardParamDto } from './dto/params/delete-flashcard-param.dto';
import { UpdateFlashcardParamDto } from './dto/params/update-flashcard-param.dto';
import { UpdateFlashcardRatingDto } from './dto/bodies/update-flashcard-rating.dto';
import { logger } from '../winston-logger.service';
import { StarredFlashcardDto } from './dto/bodies/starred-flashcard.dto';
import { ImageEntity } from '../cloudinary/entities/image.entity';
import { UpdateFlashcardFlipStatusDto } from './dto/bodies/update-flashcard-flip-status.dto';
import { UpdateFlashcardInterface } from './interface/update-flashcard.interface';
import { GetFlashcardByIdQuery } from './dto/queries/get-flashcard-by-id.query';
import { LearnModeEnum } from './enums/learn-mode.enum';
import { FlipFlashcardStatus } from './enums/flip-flashcard-status';
import { QuizFlashcardStatusEnum } from './enums/quiz-flashcard-status.enum';
import { UpdateFlashcardQuizStatusDto } from './dto/bodies/update-flashcard-quiz-status.dto';
import { UpdateQuizStatusParamDto } from './dto/params/update-quiz-status-param.dto';
import { TrueFalseStatusEnum } from './enums/true-false-status.enum';
import { UpdateFlashcardTrueFalseStatusDto } from './dto/bodies/update-flashcard-true-false-status.dto';
import { UpdateFlashcardWriteStatusDto } from './dto/bodies/update-flashcard-write-status.dto';
import { WriteStatusEnum } from './enums/write-status.enum';
import { GetFlashcardsByFolderIdDto } from './dto/params/get-flashcards-by-folder-id.dto';

@Injectable()
export class FlashcardRepository extends Repository<FlashcardEntity> {
  constructor(private dataSource: DataSource) {
    super(FlashcardEntity, dataSource.createEntityManager());
  }

  async getFlashcardById(
    getFlashcardByIdDto: GetFlashcardByIdDto,
  ): Promise<FlashcardResponseInterface> {
    const { id } = getFlashcardByIdDto;

    try {
      const flashcard = await this.dataSource
        .getRepository(FlashcardEntity)
        .findOne({
          where: { id },
          relations: ['studySet'],
        });

      if (!flashcard) {
        throw new NotFoundException(`Flashcard with ID ${id} not found`);
      }

      return this.mapFlashcardEntityToResponseInterface(flashcard);
    } catch (error) {
      logger.error('Error getting flashcard by ID:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error retrieving flashcard');
    }
  }

  async getFlashcardByStudySetId(
    getFlashcardsByStudySetIdDto: GetFlashcardsByStudySetIdDto,
    getFlashcardByIdQuery: GetFlashcardByIdQuery,
  ): Promise<FlashcardResponseInterface[]> {
    const { id } = getFlashcardsByStudySetIdDto;
    const { learnMode, isGetAll } = getFlashcardByIdQuery;

    try {
      const flashcards = await this.dataSource
        .getRepository(FlashcardEntity)
        .find({
          where: { studySet: { id: id } },
          relations: ['studySet'],
        });

      let filteredFlashcards: FlashcardEntity[];

      if (learnMode === LearnModeEnum.FLIP) {
        filteredFlashcards = flashcards.filter(
          (flashcard) =>
            flashcard.flipStatus === FlipFlashcardStatus.NONE ||
            flashcard.flipStatus === FlipFlashcardStatus.STILL_LEARNING,
        );
      } else if (learnMode == LearnModeEnum.QUIZ) {
        filteredFlashcards = flashcards.filter(
          (flashcard) =>
            flashcard.quizStatus === QuizFlashcardStatusEnum.NONE ||
            flashcard.quizStatus === QuizFlashcardStatusEnum.SKIPPED ||
            flashcard.quizStatus === QuizFlashcardStatusEnum.WRONG,
        );
      } else if (learnMode === LearnModeEnum.TRUE_FALSE) {
        filteredFlashcards = flashcards.filter(
          (flashcard) =>
            flashcard.trueFalseStatus === TrueFalseStatusEnum.NONE ||
            flashcard.trueFalseStatus === TrueFalseStatusEnum.WRONG,
        );
      } else if (learnMode === LearnModeEnum.WRITE) {
        filteredFlashcards = flashcards.filter(
          (flashcard) =>
            flashcard.writeStatus === WriteStatusEnum.NONE ||
            flashcard.writeStatus === WriteStatusEnum.SKIPPED ||
            flashcard.writeStatus === WriteStatusEnum.WRONG,
        );
      }
      if (String(isGetAll) === 'false') {
        console.log('isGetAll', isGetAll);
        filteredFlashcards = filteredFlashcards.slice(0, 10);
      }

      return await Promise.all(
        filteredFlashcards.map((flashcard) =>
          this.mapFlashcardEntityToResponseInterface(flashcard),
        ),
      );
    } catch (error) {
      logger.error('Error getting flashcards by study set ID:', error);
      throw new InternalServerErrorException('Error retrieving flashcards');
    }
  }

  async createFlashcard(
    createFlashcardDto: CreateFlashcardDto,
  ): Promise<FlashcardResponseInterface> {
    const {
      term,
      definition,
      definitionImageURL,
      hint,
      explanation,
      studySetId,
    } = createFlashcardDto;

    try {
      const studySet = await this.dataSource
        .getRepository(StudySetEntity)
        .findOne({
          where: { id: studySetId },
        });

      if (!studySet) {
        throw new NotFoundException(
          `Study set with ID ${studySetId} not found`,
        );
      }

      const flashcard = new FlashcardEntity();
      flashcard.term = term;
      flashcard.definition = definition;
      flashcard.definitionImageURL = definitionImageURL;
      flashcard.hint = hint;
      flashcard.explanation = explanation;
      flashcard.studySet = studySet;

      const savedFlashcard = await this.save(flashcard);

      if (definitionImageURL) {
        const image = await this.dataSource.getRepository(ImageEntity).findOne({
          where: { url: definitionImageURL },
        });
        console.log('image', image);
        if (image) {
          image.flashcard = savedFlashcard;
          console.log('image', image.flashcard);
          await this.dataSource
            .getRepository(ImageEntity)
            .update(image.id, image);
        }
      }

      return this.mapFlashcardEntityToResponseInterface(savedFlashcard);
    } catch (error) {
      logger.error('Error creating flashcard:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error creating flashcard');
    }
  }

  async deleteFlashcardById(
    deleteFlashcardParamDto: DeleteFlashcardParamDto,
  ): Promise<void> {
    const { id } = deleteFlashcardParamDto;

    try {
      const result = await this.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Flashcard with ID ${id} not found`);
      }
    } catch (error) {
      logger.error('Error deleting flashcard:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error deleting flashcard');
    }
  }

  async updateFlashcardById(
    updateFlashcardParamDto: UpdateFlashcardParamDto,
    updateFlashcardDto: UpdateFlashcardDto,
  ): Promise<FlashcardResponseInterface> {
    const { id } = updateFlashcardParamDto;
    try {
      const flashcard = await this.findOne({
        where: { id },
        relations: ['studySet'],
      });
      if (!flashcard) {
        throw new NotFoundException(`Flashcard with ID ${id} not found`);
      }

      const { term, definition, definitionImageURL, hint, explanation } =
        updateFlashcardDto;
      flashcard.term = term || flashcard.term;
      flashcard.definition = definition || flashcard.definition;
      flashcard.definitionImageURL =
        definitionImageURL || flashcard.definitionImageURL;
      flashcard.hint = hint;
      flashcard.explanation = explanation;
      console.log('flashcard', flashcard);

      await this.save(flashcard);
      return this.mapFlashcardEntityToResponseInterface(flashcard);
    } catch (error) {
      logger.error('Error updating flashcard by ID:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error updating flashcard');
    }
  }

  async updateFlashcardRating(
    updateFlashcardParamDto: UpdateFlashcardParamDto,
    updateFlashcardRatingDto: UpdateFlashcardRatingDto,
  ): Promise<UpdateFlashcardInterface> {
    const { id } = updateFlashcardParamDto;
    try {
      const flashcard = await this.findOne({
        where: { id },
        relations: ['studySet'],
      });
      if (!flashcard) {
        throw new NotFoundException(`Flashcard with ID ${id} not found`);
      }

      flashcard.rating = updateFlashcardRatingDto.rating;
      await this.save(flashcard);
      return {
        id: flashcard.id,
        rating: flashcard.rating,
        message: 'Flashcard rating updated successfully',
      };
    } catch (error) {
      logger.error('Error updating flashcard rating:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error updating flashcard rating');
    }
  }

  async updateFlashcardFlipStatus(
    updateFlashcardParamDto: UpdateFlashcardParamDto,
    updateFlashcardFlipStatusDto: UpdateFlashcardFlipStatusDto,
  ): Promise<UpdateFlashcardInterface> {
    const { id } = updateFlashcardParamDto;
    try {
      const flashcard = await this.findOne({
        where: { id },
        relations: ['studySet'],
      });
      if (!flashcard) {
        throw new NotFoundException(`Flashcard with ID ${id} not found`);
      }

      flashcard.flipStatus = updateFlashcardFlipStatusDto.flipStatus;
      await this.save(flashcard);
      return {
        id: flashcard.id,
        flipStatus: flashcard.flipStatus,
        message: 'Flashcard flip status updated successfully',
      };
    } catch (error) {
      logger.error('Error updating flashcard flip status:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error updating flashcard flip status',
      );
    }
  }

  async updateFlashcardQuizStatus(
    updateQuizStatusParamDto: UpdateQuizStatusParamDto,
    updateFlashcardQuizStatusDto: UpdateFlashcardQuizStatusDto,
  ): Promise<UpdateFlashcardInterface> {
    const { id } = updateQuizStatusParamDto;
    try {
      const flashcard = await this.findOne({
        where: { id },
        relations: ['studySet'],
      });
      if (!flashcard) {
        throw new NotFoundException(`Flashcard with ID ${id} not found`);
      }

      flashcard.quizStatus = updateFlashcardQuizStatusDto.quizStatus;
      await this.save(flashcard);
      return {
        id: flashcard.id,
        quizStatus: flashcard.quizStatus,
        message: 'Flashcard quiz status updated successfully',
      };
    } catch (error) {
      logger.error('Error updating flashcard quiz status:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error updating flashcard quiz status',
      );
    }
  }

  async updateFlashcardStarred(
    updateFlashcardParamDto: UpdateFlashcardParamDto,
    updateFlashcardStarredDto: StarredFlashcardDto,
  ): Promise<UpdateFlashcardInterface> {
    const { id } = updateFlashcardParamDto;
    try {
      const flashcard = await this.findOne({
        where: { id },
        relations: ['studySet'],
      });
      if (!flashcard) {
        throw new NotFoundException(`Flashcard with ID ${id} not found`);
      }

      flashcard.isStarred = updateFlashcardStarredDto.isStarred;
      await this.save(flashcard);
      return {
        id: flashcard.id,
        isStarred: flashcard.isStarred,
        message: 'Flashcard starred status updated successfully',
      };
    } catch (error) {
      logger.error('Error updating flashcard starred:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error updating flashcard starred',
      );
    }
  }

  async updateFlashcardTrueFalseStatus(
    updateFlashcardParamDto: UpdateFlashcardParamDto,
    updateFlashcardTrueFalseStatusDto: UpdateFlashcardTrueFalseStatusDto,
  ): Promise<UpdateFlashcardInterface> {
    const { id } = updateFlashcardParamDto;
    try {
      const flashcard = await this.findOne({
        where: { id },
        relations: ['studySet'],
      });
      if (!flashcard) {
        throw new NotFoundException(`Flashcard with ID ${id} not found`);
      }

      flashcard.trueFalseStatus =
        updateFlashcardTrueFalseStatusDto.trueFalseStatus;
      await this.save(flashcard);
      return {
        id: flashcard.id,
        trueFalseStatus: flashcard.trueFalseStatus,
        message: 'Flashcard true false status updated successfully',
      };
    } catch (error) {
      logger.error('Error updating flashcard true false status:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error updating flashcard true false status',
      );
    }
  }

  async updateWriteStatus(
    updateFlashcardParamDto: UpdateFlashcardParamDto,
    updateWriteStatusDto: UpdateFlashcardWriteStatusDto,
  ): Promise<UpdateFlashcardInterface> {
    const { id } = updateFlashcardParamDto;
    try {
      const flashcard = await this.findOne({
        where: { id },
        relations: ['studySet'],
      });
      if (!flashcard) {
        throw new NotFoundException(`Flashcard with ID ${id} not found`);
      }

      flashcard.writeStatus = updateWriteStatusDto.writeStatus;
      await this.save(flashcard);
      return {
        id: flashcard.id,
        writeStatus: flashcard.writeStatus,
        message: 'Flashcard write status updated successfully',
      };
    } catch (error) {
      logger.error('Error updating flashcard write status:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error updating flashcard write status',
      );
    }
  }

  async getFlashcardsByFolderId(
    getFlashcardsByFolderIdDto: GetFlashcardsByFolderIdDto,
    getFlashcardByIdParam: GetFlashcardByIdQuery,
  ): Promise<FlashcardResponseInterface[]> {
    const { id } = getFlashcardsByFolderIdDto;
    const { learnMode, isGetAll } = getFlashcardByIdParam;
    try {
      // get all study set belonging to the folder
      const studySets = await this.dataSource
        .getRepository(StudySetEntity)
        .find({
          where: { folders: { id: id } },
        });

      let flashcards: FlashcardEntity[] = [];
      // get all flashcards belonging to the study set
      await Promise.all(
        studySets.map(async (studySet) => {
          const studySetFlashcards = await this.dataSource
            .getRepository(FlashcardEntity)
            .find({
              where: { studySet: { id: studySet.id } },
              relations: ['studySet'],
            });

          flashcards = [...flashcards, ...studySetFlashcards];
        }),
      );

      let filteredFlashcards: FlashcardEntity[];
      if (learnMode === LearnModeEnum.FLIP) {
        filteredFlashcards = flashcards.filter(
          (flashcard) =>
            flashcard.flipStatus === FlipFlashcardStatus.NONE ||
            flashcard.flipStatus === FlipFlashcardStatus.STILL_LEARNING,
        );
      } else if (learnMode == LearnModeEnum.QUIZ) {
        filteredFlashcards = flashcards.filter(
          (flashcard) =>
            flashcard.quizStatus === QuizFlashcardStatusEnum.NONE ||
            flashcard.quizStatus === QuizFlashcardStatusEnum.SKIPPED ||
            flashcard.quizStatus === QuizFlashcardStatusEnum.WRONG,
        );
      } else if (learnMode === LearnModeEnum.TRUE_FALSE) {
        filteredFlashcards = flashcards.filter(
          (flashcard) =>
            flashcard.trueFalseStatus === TrueFalseStatusEnum.NONE ||
            flashcard.trueFalseStatus === TrueFalseStatusEnum.WRONG,
        );
      } else if (learnMode === LearnModeEnum.WRITE) {
        filteredFlashcards = flashcards.filter(
          (flashcard) =>
            flashcard.writeStatus === WriteStatusEnum.NONE ||
            flashcard.writeStatus === WriteStatusEnum.SKIPPED ||
            flashcard.writeStatus === WriteStatusEnum.WRONG,
        );
      }

      if (String(isGetAll) === 'false') {
        filteredFlashcards = filteredFlashcards.slice(0, 20);
      }

      return await Promise.all(
        filteredFlashcards.map((flashcard) =>
          this.mapFlashcardEntityToResponseInterface(flashcard),
        ),
      );
    } catch (error) {
      logger.error('Error getting flashcards by folder ID:', error);
      throw new InternalServerErrorException('Error retrieving flashcards');
    }
  }

  async mapFlashcardEntityToResponseInterface(
    flashcard: FlashcardEntity,
  ): Promise<FlashcardResponseInterface> {
    return {
      id: flashcard.id,
      studySetId: flashcard.studySet.id,
      term: flashcard.term,
      definition: flashcard.definition,
      definitionImageURL: flashcard.definitionImageURL,
      hint: flashcard.hint,
      isAIGenerated: flashcard.isAIGenerated,
      explanation: flashcard.explanation,
      isStarred: flashcard.isStarred,
      rating: flashcard.rating,
      quizStatus: flashcard.quizStatus,
      flipStatus: flashcard.flipStatus,
      writeStatus: flashcard.writeStatus,
      trueFalseStatus: flashcard.trueFalseStatus,
      createdAt: flashcard.createdAt,
      updatedAt: flashcard.updatedAt,
    };
  }
}
