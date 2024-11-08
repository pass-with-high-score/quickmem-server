import { IsArray, IsNotEmpty, IsString, IsUUID } from 'class-validator';

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
}
