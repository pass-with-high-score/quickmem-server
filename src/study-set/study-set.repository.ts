import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { StudySetEntity } from './entities/study-set.entity';
import { UserEntity } from '../auth/entities/user.entity';
import { CreateStudySetDto } from './dto/bodies/create-study-set.dto';
import { CreateStudySetResponseInterface } from './interfaces/create-study-set-response.interface';
import { SubjectEntity } from './entities/subject.entity';
import { ColorEntity } from './entities/color.entity';
import { GetAllStudySetResponseInterface } from './interfaces/get-all-study-set-response.interface';
import { GetStudySetsByOwnerIdDto } from './dto/params/get-study-sets-by-ownerId.dto';
import { GetStudySetByIdDto } from './dto/params/get-study-set-by-id.dto';
import { UpdateStudySetByIdBodyDto } from './dto/bodies/update-study-set-by-id-body.dto';
import { UpdateStudySetByIdParamDto } from './dto/params/update-study-set-by-id-param.dto';
import { DeleteStudySetByIdParamDto } from './dto/params/delete-study-set-by-id-param.dto';
import { DeleteStudySetResponseInterface } from './interfaces/delete-study-set-response.interface';
import { DuplicateStudySetDto } from './dto/bodies/duplicate-study-set.dto';
import { SearchStudySetParamsDto } from './dto/queries/search-study-set-params.dto';
import { FlashcardEntity } from 'src/flashcard/entities/flashcard.entity';
import * as process from 'node:process';
import { randomBytes } from 'crypto';
import { FlashcardStatusEnum } from 'src/flashcard/enums/flashcard-status.enum';
import { ResetFlashcardProgressParamDto } from './dto/params/reset-flashcard-progress-param.dto';
import { ResetFlashcardProgressResponseInterface } from './interfaces/reset-flashcard-progress-response.interface';
import { FlipFlashcardStatus } from '../flashcard/enums/flip-flashcard-status';
import { ImportFlashcardDto } from './dto/bodies/import-flashcard.dto';
import axios from 'axios';
import { ImportFlashcardFromQuizletParamDto } from './dto/params/import-flashcard-from-quizlet.param.dto';

@Injectable()
export class StudySetRepository extends Repository<StudySetEntity> {
  constructor(private dataSource: DataSource) {
    super(StudySetEntity, dataSource.createEntityManager());
  }

  async createStudySet(
    createStudySetDto: CreateStudySetDto,
  ): Promise<CreateStudySetResponseInterface> {
    const studySet = new StudySetEntity();
    studySet.title = createStudySetDto.title;
    studySet.description = createStudySetDto.description;
    studySet.isPublic = createStudySetDto.isPublic;

    try {
      const owner = await this.dataSource
        .getRepository(UserEntity)
        .findOneBy({ id: createStudySetDto.ownerId });

      if (!owner) {
        throw new NotFoundException('User not found or username is missing');
      }

      if (createStudySetDto.subjectId) {
        const subject = await this.dataSource
          .getRepository(SubjectEntity)
          .findOneBy({ id: createStudySetDto.subjectId });
        if (!subject) {
          throw new NotFoundException('Subject not found');
        }
        studySet.subject = subject;
      }

      if (createStudySetDto.colorId) {
        const color = await this.dataSource
          .getRepository(ColorEntity)
          .findOneBy({ id: createStudySetDto.colorId });
        if (!color) {
          throw new NotFoundException('Color not found');
        }
        studySet.color = color;
      }

      studySet.owner = owner;
      studySet.link = randomBytes(7).toString('base64').substring(0, 7);

      await this.dataSource.getRepository(StudySetEntity).save(studySet);

      return {
        id: studySet.id,
        title: studySet.title,
        ownerId: studySet.owner.id,
        subjectId: studySet.subject?.id,
        colorId: studySet.color?.id,
        isPublic: studySet.isPublic,
        description: studySet.description,
        createdAt: studySet.createdAt,
        updatedAt: studySet.updatedAt,
      };
    } catch (error) {
      console.log('Error creating study set', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error creating study set');
    }
  }

  async getStudySets(): Promise<GetAllStudySetResponseInterface[]> {
    try {
      const studySets = await this.dataSource
        .getRepository(StudySetEntity)
        .find({
          relations: ['owner', 'subject', 'color', 'flashcards'], // Load related entities
        });

      return studySets.map((studySet) => this.mapStudySetToResponse(studySet));
    } catch (error) {
      console.log('Error getting study sets', error);
      throw new InternalServerErrorException('Error getting study sets');
    }
  }

  // get all by owner id
  async getStudySetsByOwnerId(
    getStudySetsByOwnerIdDto: GetStudySetsByOwnerIdDto,
  ): Promise<GetAllStudySetResponseInterface[]> {
    const { ownerId } = getStudySetsByOwnerIdDto;
    try {
      const studySets = await this.dataSource
        .getRepository(StudySetEntity)
        .find({
          where: { owner: { id: ownerId } },
          relations: ['owner', 'subject', 'color', 'flashcards'],
        });

      return studySets.map((studySet) => this.mapStudySetToResponse(studySet));
    } catch (error) {
      console.log('Error getting study sets', error);
      throw new InternalServerErrorException('Error getting study sets');
    }
  }

  // get study set by id
  async getStudySetById(
    getStudySetByIdDto: GetStudySetByIdDto,
  ): Promise<GetAllStudySetResponseInterface> {
    const { id } = getStudySetByIdDto;
    try {
      const studySet = await this.dataSource
        .getRepository(StudySetEntity)
        .findOne({
          where: { id }, // Filter by study set ID
          relations: ['owner', 'subject', 'color', 'flashcards'],
        });

      if (!studySet) {
        throw new NotFoundException('Study set not found');
      }

      return this.mapStudySetToResponse(studySet, true);
    } catch (error) {
      console.log('Error getting study set', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error getting study set');
    }
  }

  // update study set by id
  async updateStudySetById(
    updateStudySetByIdParamDto: UpdateStudySetByIdParamDto,
    updateStudySetByIdBodyDto: UpdateStudySetByIdBodyDto,
  ): Promise<GetAllStudySetResponseInterface> {
    const { id } = updateStudySetByIdParamDto;
    // if content are empty, return the original content
    if (
      !updateStudySetByIdBodyDto.title &&
      !updateStudySetByIdBodyDto.description &&
      !updateStudySetByIdBodyDto.isPublic &&
      !updateStudySetByIdBodyDto.subjectId &&
      !updateStudySetByIdBodyDto.colorId
    ) {
      console.log('No content to update');
      return this.getStudySetById({ id });
    }
    try {
      const studySet = await this.dataSource
        .getRepository(StudySetEntity)
        .findOne({
          where: { id },
          relations: ['owner', 'subject', 'color', 'flashcards'],
        });

      if (!studySet) {
        throw new NotFoundException('Study set not found');
      }

      studySet.title = updateStudySetByIdBodyDto.title || studySet.title;
      studySet.description =
        updateStudySetByIdBodyDto.description || studySet.description;
      studySet.isPublic =
        updateStudySetByIdBodyDto.isPublic !== undefined
          ? updateStudySetByIdBodyDto.isPublic
          : studySet.isPublic;

      if (updateStudySetByIdBodyDto.subjectId) {
        const subject = await this.dataSource
          .getRepository(SubjectEntity)
          .findOneBy({ id: updateStudySetByIdBodyDto.subjectId });
        if (!subject) {
          throw new NotFoundException('Subject not found');
        }
        studySet.subject = subject;
      }

      if (updateStudySetByIdBodyDto.colorId) {
        const color = await this.dataSource
          .getRepository(ColorEntity)
          .findOneBy({ id: updateStudySetByIdBodyDto.colorId });
        if (!color) {
          throw new NotFoundException('Color not found');
        }
        studySet.color = color;
      }

      await this.dataSource.getRepository(StudySetEntity).save(studySet);

      return this.mapStudySetToResponse(studySet);
    } catch (error) {
      console.log('Error updating study set', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error updating study set');
    }
  }

  // delete study set by id
  async deleteStudySetById(
    deleteStudySetByIdParamDto: DeleteStudySetByIdParamDto,
  ): Promise<DeleteStudySetResponseInterface> {
    const { id } = deleteStudySetByIdParamDto;
    try {
      const studySet = await this.dataSource
        .getRepository(StudySetEntity)
        .findOne({
          where: { id },
        });

      if (!studySet) {
        throw new NotFoundException('Study set not found');
      }

      await this.dataSource.getRepository(StudySetEntity).delete(id);
      const response: DeleteStudySetResponseInterface = {
        message: 'Study set deleted successfully',
        studySetId: id,
      };
      console.log('response', response);
      return response;
    } catch (error) {
      console.log('Error deleting study set', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error deleting study set');
    }
  }

  // duplicate study set by id
  async duplicateStudySet(
    duplicateStudySet: DuplicateStudySetDto,
  ): Promise<GetAllStudySetResponseInterface> {
    const { studySetId, newOwnerId } = duplicateStudySet;
    const studySet = await this.findOne({
      where: { id: studySetId },
      relations: ['flashcards', 'subject', 'color'],
    });
    if (!studySet) {
      throw new NotFoundException('Study set not found');
    }

    const newOwner = await this.dataSource.getRepository(UserEntity).findOne({
      where: { id: newOwnerId },
    });
    if (!newOwner) {
      throw new NotFoundException('New owner not found');
    }

    if (!newOwner.isVerified) {
      throw new NotFoundException('New owner is not verified');
    }

    const newStudySet = this.create({
      title: studySet.title,
      description: studySet.description,
      isPublic: studySet.isPublic,
      owner: newOwner,
      subject: studySet.subject,
      color: studySet.color,
      flashcards: studySet.flashcards.map((flashcard) => ({
        term: flashcard.term,
        definition: flashcard.definition,
        definitionImageURL: flashcard.definitionImageURL,
        isStarred: flashcard.isStarred,
        hint: flashcard.hint,
        explanation: flashcard.explanation,
        rating: flashcard.rating,
      })),
    });

    try {
      const savedStudySet = await this.save(newStudySet);
      // Duplicate flashcards
      const flashcards = studySet.flashcards.map((flashcard) => {
        const newFlashcard = new FlashcardEntity();
        newFlashcard.term = flashcard.term;
        newFlashcard.definition = flashcard.definition;
        newFlashcard.definitionImageURL = flashcard.definitionImageURL;
        newFlashcard.isStarred = flashcard.isStarred;
        newFlashcard.hint = flashcard.hint;
        newFlashcard.explanation = flashcard.explanation;
        newFlashcard.rating = flashcard.rating;
        newFlashcard.studySet = savedStudySet;
        return newFlashcard;
      });

      await this.dataSource.getRepository(FlashcardEntity).save(flashcards);

      return this.mapStudySetToResponse(savedStudySet, true);
    } catch (error) {
      console.log('Error duplicating study set', error);
      throw new InternalServerErrorException('Error duplicating study set');
    }
  }

  // search study set by title
  async searchStudySetByTitle(
    searchStudySeParamsDto: SearchStudySetParamsDto,
  ): Promise<GetAllStudySetResponseInterface[]> {
    const { title, creatorType, size, page } = searchStudySeParamsDto;
    if (page < 1) {
      throw new NotFoundException('Invalid page number');
    }

    try {
      const queryBuilder = this.dataSource
        .getRepository(StudySetEntity)
        .createQueryBuilder('studySet')
        .leftJoinAndSelect('studySet.owner', 'owner')
        .leftJoinAndSelect('studySet.flashcards', 'flashcards')
        .where('studySet.title ILIKE :title', { title: `%${title}%` });

      if (size) {
        switch (size) {
          case 'lessThan20':
            queryBuilder.andWhere('flashcards.length < 20');
            break;
          case 'between20And49':
            queryBuilder.andWhere('flashcards.length BETWEEN 20 AND 49');
            break;
          case 'moreThan50':
            queryBuilder.andWhere('flashcards.length > 50');
            break;
        }
      }

      if (creatorType) {
        switch (creatorType) {
          case 'teacher':
            queryBuilder.andWhere('owner.role = :role', { role: 'TEACHER' });
            break;
          case 'student':
            queryBuilder.andWhere('owner.role = :role', { role: 'USER' });
            break;
          case 'premium':
            queryBuilder.andWhere('owner.isPremium = true');
            break;
        }
      }
      const studySets = await queryBuilder
        .skip((page - 1) * 40)
        .take(40)
        .getMany();
      return studySets.map((studySet) => this.mapStudySetToResponse(studySet));
    } catch (error) {
      console.log('Error searching study set', error);
      throw new InternalServerErrorException('Error searching study set');
    }
  }

  // Reset progress of all flashcards in a study set
  async resetFlashcardProgress(
    resetFlashcardProgressParamDto: ResetFlashcardProgressParamDto,
  ): Promise<ResetFlashcardProgressResponseInterface> {
    const { id } = resetFlashcardProgressParamDto;
    const studySet = await this.findOne({
      where: { id },
      relations: ['flashcards'],
    });

    if (!studySet) {
      throw new NotFoundException('Study set not found');
    }

    for (const flashcard of studySet.flashcards) {
      flashcard.rating = FlashcardStatusEnum.NOT_STUDIED;
      flashcard.flipStatus = FlipFlashcardStatus.NONE;
      await this.dataSource.getRepository(FlashcardEntity).save(flashcard);
    }
    return {
      message: 'Flashcard progress reset successfully',
      studySetId: id,
    };
  }

  async importFromUrl(
    importFlashcardDto: ImportFlashcardDto,
    importFlashcardFromQuizletParamDto: ImportFlashcardFromQuizletParamDto,
  ): Promise<GetAllStudySetResponseInterface> {
    const { userId } = importFlashcardFromQuizletParamDto;
    const { url } = importFlashcardDto;
    try {
      console.log(url);
      const quizletId = url.split('/')[4];
      console.log(quizletId);
      const LIMIT = 1000;
      const quizletUrl = `https://quizlet.com/webapi/3.4/studiable-item-documents?filters%5BstudiableContainerId%5D=${quizletId}&filters%5BstudiableContainerType%5D=1&perPage=${LIMIT}&page=1`;
      const apiKey = '6e9c093be7ae9995786fe958e7ee32eb';
      const response = await axios.get(`https://api.scraperapi.com/`, {
        params: {
          api_key: apiKey,
          url: quizletUrl,
        },
      });

      console.log(response.data);

      const data = response.data;

      if (!data.responses || !data.responses.length || !data.responses[0]) {
        throw new Error('Invalid Quizlet response');
      }

      const terms = data.responses[0].models.studiableItem;
      const parsedTerms = [];

      for (const term of terms) {
        const wordSide = term.cardSides.find((side) => side.label === 'word');
        const definitionSide = term.cardSides.find(
          (side) => side.label === 'definition',
        );

        if (!wordSide?.media[0] || !definitionSide?.media[0]) {
          continue;
        }

        const definitionMedia = definitionSide.media.map((media) => ({
          plainText: media.plainText,
          attribution: media.attribution,
          imageUrl: media.url,
        }));

        parsedTerms.push({
          word: wordSide.media[0].plainText,
          definition: definitionSide.media[0].plainText,
          definitionMedia,
        });
      }
      console.log(userId);
      // save to database
      const studySet = new StudySetEntity();
      studySet.title = 'Imported from Quizlet';
      studySet.description = 'Imported from Quizlet';
      studySet.isPublic = false;
      studySet.link = randomBytes(7).toString('base64').substring(0, 7);

      const owner = await this.dataSource
        .getRepository(UserEntity)
        .findOneBy({ id: userId });

      if (!owner) {
        throw new NotFoundException('User not found or username is missing');
      }

      studySet.owner = owner;

      const subject = await this.dataSource
        .getRepository(SubjectEntity)
        .findOneBy({ id: 1 });

      if (!subject) {
        throw new NotFoundException('Subject not found');
      }

      studySet.subject = subject;

      const color = await this.dataSource
        .getRepository(ColorEntity)
        .findOneBy({ id: 1 });

      if (!color) {
        throw new NotFoundException('Color not found');
      }

      studySet.color = color;

      await this.dataSource.getRepository(StudySetEntity).save(studySet);

      const flashcards = parsedTerms.map((fc) => {
        // console.log(fc.definitionMedia[1]);
        const flashcard = new FlashcardEntity();
        flashcard.term = fc.word;
        flashcard.definition = fc.definition;
        flashcard.definitionImageURL = fc.definitionMedia[1]?.imageUrl;
        flashcard.studySet = studySet;
        return flashcard;
      });

      await this.dataSource.getRepository(FlashcardEntity).save(flashcards);

      return this.mapStudySetToResponse(studySet, true);
    } catch (error) {
      console.error('Error while importing from Quizlet:', error.message);
      throw new Error('Failed to import flashcards from Quizlet');
    }
  }

  private mapStudySetToResponse(
    studySet: StudySetEntity,
    getFlashcards: boolean = false,
  ): GetAllStudySetResponseInterface {
    return {
      id: studySet.id,
      title: studySet.title,
      description: studySet.description,
      isPublic: studySet.isPublic,
      createdAt: studySet.createdAt,
      updatedAt: studySet.updatedAt,
      ownerId: studySet.owner ? studySet.owner.id : undefined,
      linkShareCode: studySet.link,
      subject: studySet.subject
        ? {
            id: studySet.subject.id,
            name: studySet.subject.name,
          }
        : undefined,
      user: {
        id: studySet.owner ? studySet.owner.id : undefined,
        username: studySet.owner ? studySet.owner.username : undefined,
        avatarUrl: studySet.owner
          ? `${process.env.HOST}/public/images/avatar/${studySet.owner.avatarUrl}.png`
          : undefined,
        role: studySet.owner ? studySet.owner.role : undefined,
      },
      color: studySet.color
        ? {
            id: studySet.color.id,
            name: studySet.color.name,
            hexValue: studySet.color.hexValue,
          }
        : undefined,
      flashCardCount: studySet.flashcards ? studySet.flashcards.length : 0,
      flashcards: getFlashcards ? studySet.flashcards : [],
    };
  }
}
