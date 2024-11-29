import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { NotificationTypeEnum } from '../../enums/notification-type.enum';

export class CreateNotificationBodyDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  message: string;

  @IsArray()
  @IsUUID('4', { each: true })
  userId: string[];

  @IsOptional()
  data?: any;

  @IsEnum(NotificationTypeEnum)
  notificationType: NotificationTypeEnum;
}
