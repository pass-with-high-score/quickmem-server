import { IsNotEmpty, IsUUID } from 'class-validator';

export class DeleteNotificationParamDto {
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
