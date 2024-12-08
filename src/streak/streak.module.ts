import { Module } from '@nestjs/common';
import { StreakController } from './streak.controller';
import { StreakService } from './streak.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StreakEntity } from './entities/streak.entity';
import { StreakRepository } from './streak.repository';
import { BullModule } from '@nestjs/bull';
import { ConfigModule } from '@nestjs/config';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([StreakEntity]),
    BullModule.registerQueue({
      name: 'send-email-streak',
    }),
    ConfigModule,
    NotificationModule,
  ],
  controllers: [StreakController],
  providers: [StreakService, StreakRepository],
})
export class StreakModule {}
