import { Module } from '@nestjs/common';
import { StudySetService } from './study-set.service';
import { StudySetController } from './study-set.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ColorEntity } from './entities/color.entity';
import { SubjectEntity } from './entities/subject.entity';
import { StudySetEntity } from './entities/study-set.entity';
import { StudySetRepository } from './study-set.repository';
import { RecentStudySetEntity } from './entities/recent-study-set.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ColorEntity,
      SubjectEntity,
      StudySetEntity,
      RecentStudySetEntity,
    ]),
  ],
  providers: [StudySetService, StudySetRepository],
  controllers: [StudySetController],
})
export class StudySetModule {}
