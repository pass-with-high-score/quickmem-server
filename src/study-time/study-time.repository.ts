import { DataSource, Repository } from 'typeorm';
import { StudyTimeEntity } from './entities/study-time.entity';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateStudyTimeDto } from './dto/bodies/create-study-time.dto';
import { UserEntity } from '../auth/entities/user.entity';
import { CreateStudyTimeInterface } from './interfaces/create-study-time.interface';
import { GetTotalTimeByUserIdParamDto } from './dto/params/get-total-time-by-user-id-param.dto';
import { GetTotalByUserIdResponseInterface } from './interfaces/get-total-by-user-id-response.interface';
import { GetTotalByStudySetIdResponseInterface } from './interfaces/get-total-by-study-set-id-response.interface';
import { GetTotalTimeByStudySetIdParamDto } from './dto/params/get-total-time-by-study-set-id-param.dto';
import { StudySetEntity } from '../study-set/entities/study-set.entity';
import { logger } from '../winston-logger.service';

@Injectable()
export class StudyTimeRepository extends Repository<StudyTimeEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(StudyTimeEntity, dataSource.createEntityManager());
  }

  async createStudyTime(
    createStudyTimeDto: CreateStudyTimeDto,
  ): Promise<CreateStudyTimeInterface> {
    const { userId, studySetId, timeSpent, learnMode } = createStudyTimeDto;

    const user = await this.dataSource
      .getRepository(UserEntity)
      .findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const studySet = await this.dataSource
      .getRepository(StudySetEntity)
      .findOne({ where: { id: studySetId }, relations: ['flashcards'] });

    if (!studySet) {
      throw new NotFoundException('Study set not found');
    }

    if (studySet.flashcards.length === 0) {
      throw new ConflictException('Study set must have flashcards to study');
    }

    if (timeSpent <= 0) {
      throw new ConflictException('Time spent must be greater than 0');
    }

    const studyTime = this.create({
      user,
      studySet,
      timeSpent,
      learnMode,
    });

    try {
      await this.save(studyTime);
      return {
        userId: studyTime.user.id,
        studySetId: studyTime.studySet.id,
        timeSpent: studyTime.timeSpent,
        learnMode: studyTime.learnMode,
        createdAt: studyTime.createdAt,
        updatedAt: studyTime.updatedAt,
      };
    } catch (e) {
      logger.error(e);
      throw new InternalServerErrorException(e);
    }
  }

  async getTotalTimeByUserId(
    getTotalTimeParamDto: GetTotalTimeByUserIdParamDto,
  ): Promise<GetTotalByUserIdResponseInterface> {
    const { userId } = getTotalTimeParamDto;

    const studyTimes = await this.find({
      where: { user: { id: userId } },
    });

    console.log('studyTimes', studyTimes);

    const quiz = studyTimes
      .filter((studyTime) => studyTime.learnMode === 'quiz')
      .reduce((acc, studyTime) => acc + studyTime.timeSpent, 0);

    const flip = studyTimes
      .filter((studyTime) => studyTime.learnMode === 'flip')
      .reduce((acc, studyTime) => acc + studyTime.timeSpent, 0);

    const trueFalse = studyTimes
      .filter((studyTime) => studyTime.learnMode === 'trueFalse')
      .reduce((acc, studyTime) => acc + studyTime.timeSpent, 0);

    const write = studyTimes
      .filter((studyTime) => studyTime.learnMode === 'write')
      .reduce((acc, studyTime) => acc + studyTime.timeSpent, 0);

    const total = studyTimes.reduce(
      (acc, studyTime) => acc + studyTime.timeSpent,
      0,
    );

    return {
      userId,
      quiz,
      flip,
      trueFalse,
      write,
      total,
    };
  }

  async getTotalTimeByStudySetId(
    getTotalTimeByUserIdParamDto: GetTotalTimeByStudySetIdParamDto,
  ): Promise<GetTotalByStudySetIdResponseInterface> {
    const { studySetId } = getTotalTimeByUserIdParamDto;

    const studySet = await this.dataSource
      .getRepository(StudySetEntity)
      .findOne({ where: { id: studySetId } });

    if (!studySet) {
      throw new NotFoundException('Study set not found');
    }

    const studyTimes = await this.find({
      where: { studySet: { id: studySetId } },
    });

    const quiz = studyTimes
      .filter((studyTime) => studyTime.learnMode === 'quiz')
      .reduce((acc, studyTime) => acc + studyTime.timeSpent, 0);

    const flip = studyTimes
      .filter((studyTime) => studyTime.learnMode === 'flip')
      .reduce((acc, studyTime) => acc + studyTime.timeSpent, 0);

    const trueFalse = studyTimes
      .filter((studyTime) => studyTime.learnMode === 'trueFalse')
      .reduce((acc, studyTime) => acc + studyTime.timeSpent, 0);

    const write = studyTimes
      .filter((studyTime) => studyTime.learnMode === 'write')
      .reduce((acc, studyTime) => acc + studyTime.timeSpent, 0);

    const total = studyTimes.reduce(
      (acc, studyTime) => acc + studyTime.timeSpent,
      0,
    );

    return {
      studySetId,
      quiz,
      flip,
      trueFalse,
      write,
      total,
    };
  }
}
