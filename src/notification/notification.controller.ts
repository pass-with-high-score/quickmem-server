import { Body, Controller, Post } from '@nestjs/common';
import { MessagingService } from '../firebase/messaging.service';
import { IMessaginToTokensParams } from '../firebase/imessaging.interface';
import { NotificationService } from './notification.service';

@Controller('notifications')
export class NotificationController {
  constructor(
    private readonly messagingService: MessagingService,
    private readonly notificationService: NotificationService,
  ) {}

  @Post('send')
  async sendNotification(@Body() params: IMessaginToTokensParams) {
    console.log(params);
    try {
      const failedTokens =
        await this.messagingService.sendMessageToTokens(params);
      if (failedTokens.length > 0) {
        return {
          message: 'Notification sent with some failures.',
          failedTokens,
        };
      }
      return {
        message: 'Notification sent successfully!',
      };
    } catch (error) {
      console.log(error);
      return {
        message: 'Failed to send notification.',
        error: error.message,
      };
    }
  }
}
