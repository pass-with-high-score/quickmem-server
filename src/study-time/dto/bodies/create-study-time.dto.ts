import { IsEnum, IsInt, IsNotEmpty, IsUUID } from 'class-validator';
import { LearnModeEnum } from '../../../flashcard/enums/learn-mode.enum';

export class CreateStudyTimeDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsUUID()
  @IsNotEmpty()
  studySetId: string;

  @IsInt()
  @IsNotEmpty()
  timeSpent: number;

  @IsEnum(LearnModeEnum)
  @IsNotEmpty()
  learnMode: LearnModeEnum;
}
