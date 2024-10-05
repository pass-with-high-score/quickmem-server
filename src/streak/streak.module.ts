import { Module } from '@nestjs/common';
import { StreakController } from './streak.controller';
import { StreakService } from './streak.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StreakEntity } from './entities/streak.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StreakEntity])],
  controllers: [StreakController],
  providers: [StreakService],
})
export class StreakModule {}
