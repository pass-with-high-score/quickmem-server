import { Body, Controller, Post } from '@nestjs/common';
import { MessagingService } from '../firebase/messaging.service';
import { IMessaginToTokensParams } from '../firebase/imessaging.interface';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly messagingService: MessagingService) {
  }

  @Post('send')
  async sendNotification(@Body() params: IMessaginToTokensParams) {
    const failedTokens = await this.messagingService.sendMessageToTokens(params);
    if (failedTokens.length > 0) {
      return {
        message: 'Notification sent with some failures.',
        failedTokens,
      };
    }
    return {
      message: 'Notification sent successfully!',
    };
  }
}
