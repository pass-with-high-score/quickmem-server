import { IsEnum, IsNotEmpty } from 'class-validator';
import { ResetFlashcardEnum } from '../../../study-set/enums/reset-flashcard.enum';

export class ResetFlashcardProgressInFolderQueryDto {
  @IsEnum(ResetFlashcardEnum)
  @IsNotEmpty()
  resetType: ResetFlashcardEnum;
}
