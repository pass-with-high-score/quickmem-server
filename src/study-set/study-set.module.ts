import { Module } from '@nestjs/common';
import { StudySetService } from './study-set.service';
import { StudySetController } from './study-set.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ColorEntity } from './color.entity';
import { SubjectEntity } from './subject.entity';
import { StudySetEntity } from './study-set.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ColorEntity, SubjectEntity, StudySetEntity]),
  ],
  providers: [StudySetService],
  controllers: [StudySetController],
})
export class StudySetModule {}

// color: #2970ff, #1eb6d8, #2cbea7, #75cb32, #ecb220, #f65077, #d856f2, #876af8
