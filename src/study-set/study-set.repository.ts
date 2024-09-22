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
