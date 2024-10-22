import { IsEnum, IsNotEmpty } from 'class-validator';
import { FlipFlashcardStatus } from '../../enums/flip-flashcard-status';

export class UpdateFlashcardFlipStatusDto {
  @IsNotEmpty()
  @IsEnum(FlipFlashcardStatus)
  flipStatus: FlipFlashcardStatus;
}
