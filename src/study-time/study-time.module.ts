import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudyTimeEntity } from './entities/study-time.entity';
import { StudyTimeController } from './study-time.controller';
import { StudyTimeService } from './study-time.service';
import { StudyTimeRepository } from './study-time.repository';

@Module({
  imports: [TypeOrmModule.forFeature([StudyTimeEntity])],
  providers: [StudyTimeService, StudyTimeRepository],
  controllers: [StudyTimeController],
})
export class StudyTimeModule {}
