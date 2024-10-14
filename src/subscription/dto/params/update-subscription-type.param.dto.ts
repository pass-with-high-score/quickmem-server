import { IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateSubscriptionTypeParamDto {
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
