import { IsNotEmpty, IsUUID } from 'class-validator';

export class GetNotificationByUserIdParamDto {
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
