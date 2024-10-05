import { Module } from '@nestjs/common';
import { MessagingService } from './messaging.service'; // Adjust the path as necessary
import { messagingProvider } from './messaging.provider';

@Module({
  providers: [messagingProvider, MessagingService],
  exports: [MessagingService],
})
export class MessagingModule {}
