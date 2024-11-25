import { Module } from '@nestjs/common';
import { ClassController } from './class.controller';
import { ClassService } from './class.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassEntity } from './entities/class.entity';
import { ClassRepository } from './class.repository';
import { RecentClassEntity } from './entities/recent-class.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ClassEntity, RecentClassEntity])],
  controllers: [ClassController],
  providers: [ClassService, ClassRepository],
})
export class ClassModule {}
