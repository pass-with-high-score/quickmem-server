import { Module } from '@nestjs/common';
import { ClassController } from './class.controller';
import { ClassService } from './class.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassEntity } from './entities/class.entity';
import { ClassRepository } from './class.repository';
import { RecentClassEntity } from './entities/recent-class.entity';
import { BullModule } from '@nestjs/bull';
import { ConfigModule } from '@nestjs/config';
import { EmailConsumerClass } from './email-consumer-class';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ClassEntity, RecentClassEntity]),
    BullModule.registerQueue({
      name: 'send-email-class',
    }),
    ConfigModule,
    NotificationModule,
  ],
  controllers: [ClassController],
  providers: [ClassService, ClassRepository, EmailConsumerClass],
})
export class ClassModule {}
