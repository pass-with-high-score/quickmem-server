import { IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateFlashcardParamDto {
  @IsNotEmpty({ message: 'Flashcard ID is required' })
  @IsUUID()
  id: string;
}
