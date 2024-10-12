import { Controller, UseInterceptors } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { LoggingInterceptor } from '../logging.interceptor';
@UseInterceptors(LoggingInterceptor)
@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}
}
