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
import { GetFlashcardByIdParam } from './dto/queries/get-flashcard-by-id.param';
import { LearnModeEnum } from './enums/learn-mode.enum';
import { FlipFlashcardStatus } from './enums/flip-flashcard-status';

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
    getFlashcardByIdParam: GetFlashcardByIdParam,
  ): Promise<FlashcardResponseInterface[]> {
    const { id } = getFlashcardsByStudySetIdDto;
    const { learnMode } = getFlashcardByIdParam;

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
      } else {
        filteredFlashcards = flashcards;
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

      // find image in image entity by url, if have update flashcard id for image
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
      explanation: flashcard.explanation,
      isStarred: flashcard.isStarred,
      rating: flashcard.rating,
      flipStatus: flashcard.flipStatus,
      createdAt: flashcard.createdAt,
      updatedAt: flashcard.updatedAt,
    };
  }
}
