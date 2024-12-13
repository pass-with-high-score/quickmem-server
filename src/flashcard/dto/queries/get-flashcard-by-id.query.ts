import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { LearnModeEnum } from '../../enums/learn-mode.enum';

export class GetFlashcardByIdQuery {
  @IsNotEmpty()
  @IsEnum(LearnModeEnum)
  learnMode: LearnModeEnum;

  @IsNotEmpty()
  isGetAll: boolean;

  @IsOptional()
  isSwapped: boolean;

  @IsOptional()
  isRandom: boolean;
}
