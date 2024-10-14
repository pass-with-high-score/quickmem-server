import { IsNotEmpty, IsUUID } from 'class-validator';

export class GetSubscriptionByUserIdParamDto {
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
