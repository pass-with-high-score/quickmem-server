import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationEntity } from './entities/notification.entity';
import { NotificationRepository } from './notification.repository';
import { NotificationController } from './notification.controller';
import { MessagingModule } from '../firebase/messaging.module';

@Module({
  imports: [TypeOrmModule.forFeature([NotificationEntity]), MessagingModule],
  controllers: [NotificationController],
  providers: [NotificationService, NotificationRepository],
  exports: [NotificationService, NotificationRepository],
})
export class NotificationModule {}
