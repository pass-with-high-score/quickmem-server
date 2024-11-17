import { DataSource, Repository } from 'typeorm';
import { StudyTimeEntity } from './entities/study-time.entity';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateStudyTimeDto } from './dto/bodies/create-study-time.dto';
import { UserEntity } from '../auth/entities/user.entity';
import { CreateStudyTimeInterface } from './interfaces/create-study-time.interface';

@Injectable()
export class StudyTimeRepository extends Repository<StudyTimeEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(StudyTimeEntity, dataSource.createEntityManager());
  }

  async createStudyTime(
    createStudyTimeDto: CreateStudyTimeDto,
  ): Promise<CreateStudyTimeInterface> {
    const { userId, timeSpent, learnMode } = createStudyTimeDto;

    const user = await this.dataSource
      .getRepository(UserEntity)
      .findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const studyTime = this.create({
      user,
      timeSpent,
      learnMode,
    });

    try {
      await this.save(studyTime);
      return {
        userId: studyTime.user.id,
        timeSpent: studyTime.timeSpent,
        learnMode: studyTime.learnMode,
        createdAt: studyTime.createdAt,
        updatedAt: studyTime.updatedAt,
      };
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

}
