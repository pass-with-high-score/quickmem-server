import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/auth/entities/user.entity';
import { StudyTimeEntity } from './entities/study-time.entity';
import { StudyTimeController } from './study-time.controller';
import { StudyTimeService } from './study-time.service';

@Module({
  imports: [TypeOrmModule.forFeature([StudyTimeEntity, UserEntity])],
  providers: [StudyTimeService],
  controllers: [StudyTimeController],
})
export class StudyTimeModule {}
