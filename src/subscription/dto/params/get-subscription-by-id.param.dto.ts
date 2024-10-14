import { IsNotEmpty, IsUUID } from 'class-validator';

export class GetSubscriptionByIdParamDto {
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
