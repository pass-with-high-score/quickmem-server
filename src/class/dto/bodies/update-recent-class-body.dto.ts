import { IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateRecentClassBodyDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsUUID()
  @IsNotEmpty()
  classId: string;
}
