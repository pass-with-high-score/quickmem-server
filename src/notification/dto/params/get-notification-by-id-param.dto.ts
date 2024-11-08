import { IsNotEmpty, IsUUID } from 'class-validator';

export class GetNotificationByIdParamDto {
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
