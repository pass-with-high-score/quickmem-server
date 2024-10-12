import { Controller, UseGuards, UseInterceptors } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { SkipThrottle } from '@nestjs/throttler';
import { AuthGuard } from '@nestjs/passport';

@SkipThrottle()
@UseGuards(AuthGuard('jwt'))
@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}
}
