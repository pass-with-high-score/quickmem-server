import { IsEnum, IsNotEmpty } from 'class-validator';
import { ResetFlashcardEnum } from '../../enums/reset-flashcard.enum';

export class ResetFlashcardProgressParamsDto {
  @IsEnum(ResetFlashcardEnum)
  @IsNotEmpty()
  resetType: ResetFlashcardEnum;
}
