import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { SubscriptionTypeEnum } from '../../enums/subscription.enum';
import { TrialTypeEnum } from '../../enums/trial-type.enum';

export class CreateSubscriptionDto {
  @IsNotEmpty()
  @IsEnum(SubscriptionTypeEnum)
  subscriptionType: SubscriptionTypeEnum;

  @IsOptional()
  @IsEnum(TrialTypeEnum)
  trialForType?: string;
}
