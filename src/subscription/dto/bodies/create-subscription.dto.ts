import { IsEnum, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { SubscriptionTypeEnum } from '../../enums/subscription.enum';
import { TrialTypeEnum } from '../../enums/trial-type.enum';

export class CreateSubscriptionDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  @IsEnum(SubscriptionTypeEnum)
  subscriptionType: SubscriptionTypeEnum;

  @IsOptional()
  @IsEnum(TrialTypeEnum)
  trialForType?: string;
}
