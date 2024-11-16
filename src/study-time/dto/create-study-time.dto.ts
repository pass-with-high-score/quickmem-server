import { IsDate, IsInt, IsUUID } from 'class-validator';

export class CreateStudyTimeDto {
  @IsUUID()
  userId: string;

  @IsInt()
  timeSpent: number;

  @IsDate()
  date: Date;
}
