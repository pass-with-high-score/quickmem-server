import { IsEnum, IsNotEmpty } from 'class-validator';
import { FlashcardStatusEnum } from '../../entities/flashcard-status.enum';

export class UpdateFlashcardRatingDto {
  @IsNotEmpty()
  @IsEnum(FlashcardStatusEnum)
  rating: FlashcardStatusEnum;
}
