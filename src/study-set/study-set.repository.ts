import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { StudySetEntity } from './study-set.entity';
import { UserEntity } from '../auth/user.entity';
import { CreateStudySetDto } from './dto/create-study-set.dto';
import { CreateStudySetResponseInterface } from './dto/create-study-set-response.interface';
import { SubjectEntity } from './subject.entity';
import { ColorEntity } from './color.entity';
import { GetAllStudySetResponseInterface } from './dto/get-all-study-set-response.interface';

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
          relations: ['owner', 'subject', 'color'], // Load related entities
        });

      return studySets.map(this.mapStudySetToResponse);
    } catch (error) {
      console.log('Error getting study sets', error);
      throw new InternalServerErrorException('Error getting study sets');
    }
  }

  // get all by owner id
  async getStudySetsByOwnerId(
    ownerId: string,
  ): Promise<GetAllStudySetResponseInterface[]> {
    try {
      const studySets = await this.dataSource
        .getRepository(StudySetEntity)
        .find({
          where: { owner: { id: ownerId } }, // Filter by ownerId
          relations: ['owner', 'subject', 'color'], // Load relations (subject and color)
        });
      console.log('studySets', studySets);

      return studySets.map(this.mapStudySetToResponse);
    } catch (error) {
      console.log('Error getting study sets', error);
      throw new InternalServerErrorException('Error getting study sets');
    }
  }

  // get study set by id
  async getStudySetById(id: string): Promise<GetAllStudySetResponseInterface> {
    try {
      const studySet = await this.dataSource
        .getRepository(StudySetEntity)
        .findOne({
          where: { id }, // Filter by study set ID
          relations: ['owner', 'subject', 'color'], // Load related entities
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

  async updateStudySetById(
    id: string,
    updateStudySetDto: Partial<CreateStudySetDto>,
  ): Promise<GetAllStudySetResponseInterface> {
    try {
      const studySet = await this.dataSource
        .getRepository(StudySetEntity)
        .findOne({
          where: { id },
          relations: ['owner', 'subject', 'color'],
        });

      if (!studySet) {
        throw new NotFoundException('Study set not found');
      }

      studySet.title = updateStudySetDto.title || studySet.title;
      studySet.description =
        updateStudySetDto.description || studySet.description;
      studySet.isPublic = updateStudySetDto.isPublic || studySet.isPublic;

      if (updateStudySetDto.subjectId) {
        const subject = await this.dataSource
          .getRepository(SubjectEntity)
          .findOneBy({ id: updateStudySetDto.subjectId });
        if (!subject) {
          throw new NotFoundException('Subject not found');
        }
        studySet.subject = subject;
      }

      if (updateStudySetDto.colorId) {
        const color = await this.dataSource
          .getRepository(ColorEntity)
          .findOneBy({ id: updateStudySetDto.colorId });
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

  async deleteStudySetById(id: string): Promise<void> {
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
    } catch (error) {
      console.log('Error deleting study set', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error deleting study set');
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
      subject: studySet.subject
        ? {
            id: studySet.subject.id,
            name: studySet.subject.name,
          }
        : undefined,
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
