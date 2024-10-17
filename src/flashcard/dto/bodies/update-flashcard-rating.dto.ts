import { IsEnum, IsNotEmpty } from 'class-validator';
import { FlashcardStatusEnum } from '../../enums/flashcard-status.enum';

export class UpdateFlashcardRatingDto {
  @IsNotEmpty()
  @IsEnum(FlashcardStatusEnum)
  rating: FlashcardStatusEnum;
}
