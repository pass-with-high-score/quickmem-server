import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { StudySetEntity } from './entities/study-set.entity';
import { UserEntity } from '../auth/entities/user.entity';
import { CreateStudySetDto } from './dto/create-study-set.dto';
import { CreateStudySetResponseInterface } from './dto/create-study-set-response.interface';
import { SubjectEntity } from './entities/subject.entity';
import { ColorEntity } from './entities/color.entity';
import { GetAllStudySetResponseInterface } from './dto/get-all-study-set-response.interface';
import { GetStudySetsByOwnerIdDto } from './dto/get-study-sets-by-ownerId.dto';
import { GetStudySetByIdDto } from './dto/get-study-set-by-id.dto';
import { UpdateStudySetByIdBodyDto } from './dto/update-study-set-by-id-body.dto';
import { UpdateStudySetByIdParamDto } from './dto/update-study-set-by-id-param.dto';
import { DeleteStudySetByIdParamDto } from './dto/delete-study-set-by-id-param.dto';
import { DeleteStudySetResponseInterface } from './dto/delete-study-set-response.interface';
import { DuplicateStudySetDto } from './dto/duplicate-study-set.dto';
import { DuplicateStudySetResponseInterface } from './dto/duplicate-study-set-response.interface';
import { FlashcardResponseInterface } from '../flashcard/interface/flashcard-response.interface';
import { SearchStudySetParamsDto } from './dto/search-study-set-params.dto';

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
      console.log('owner', owner);

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

      await this.dataSource.getRepository(StudySetEntity).save(studySet);

      const response: CreateStudySetResponseInterface = {
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
      return response;
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

      return studySets.map(this.mapStudySetToResponse);
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
          where: { owner: { id: ownerId } }, // Filter by ownerId
          relations: ['owner', 'subject', 'color', 'flashcards'], // Load relations (subject and color)
        });
      console.log('studySets', studySets);

      return studySets.map(this.mapStudySetToResponse);
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
          relations: ['owner', 'subject', 'color', 'flashcards'], // Load related entities
        });

      if (!studySet) {
        throw new NotFoundException('Study set not found');
      }

      return this.mapStudySetToResponse(studySet);
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
        updateStudySetByIdBodyDto.isPublic || studySet.isPublic;

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
  ): Promise<DuplicateStudySetResponseInterface> {
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
      const flashcards: FlashcardResponseInterface[] =
        savedStudySet.flashcards.map((flashcard) => ({
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

      return {
        id: savedStudySet.id,
        title: savedStudySet.title,
        description: savedStudySet.description,
        ownerId: savedStudySet.owner.id,
        subjectId: savedStudySet.subject?.id,
        colorId: savedStudySet.color?.id,
        isPublic: savedStudySet.isPublic,
        createdAt: savedStudySet.createdAt,
        updatedAt: savedStudySet.updatedAt,
        flashcards: flashcards,
      };
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
        .where('studySet.title LIKE :title', { title: `%${title}%` });

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
      return studySets.map(this.mapStudySetToResponse);
    } catch (error) {
      console.log('Error searching study set', error);
      throw new InternalServerErrorException('Error searching study set');
    }
  }

  private mapStudySetToResponse(
    studySet: StudySetEntity,
  ): GetAllStudySetResponseInterface {
    return {
      id: studySet.id,
      title: studySet.title,
      description: studySet.description,
      isPublic: studySet.isPublic,
      createdAt: studySet.createdAt,
      updatedAt: studySet.updatedAt,
      ownerId: studySet.owner ? studySet.owner.id : undefined,
      flashCardCount: studySet.flashcards ? studySet.flashcards.length : 0,
      subject: studySet.subject
        ? {
            id: studySet.subject.id,
            name: studySet.subject.name,
          }
        : undefined,
      user: {
        id: studySet.owner ? studySet.owner.id : undefined,
        username: studySet.owner ? studySet.owner.username : undefined,
        avatarUrl: studySet.owner ? studySet.owner.avatarUrl : undefined,
      },
      color: studySet.color
        ? {
            id: studySet.color.id,
            name: studySet.color.name,
            hexValue: studySet.color.hexValue,
          }
        : undefined,
    };
  }
}
