import { IsEnum, IsNotEmpty } from 'class-validator';
import { LearnModeEnum } from '../../enums/learn-mode.enum';

export class GetFlashcardByIdParam {
  @IsNotEmpty()
  @IsEnum(LearnModeEnum)
  learnMode: LearnModeEnum;
}
