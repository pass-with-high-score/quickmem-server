import { Module } from '@nestjs/common';
import { MessagingService } from './messaging.service'; // Adjust the path as necessary
import { messagingProvider } from './messaging.provider';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceEntity } from './entities/device.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DeviceEntity])],
  providers: [messagingProvider, MessagingService],
  exports: [MessagingService],
})
export class MessagingModule {}
