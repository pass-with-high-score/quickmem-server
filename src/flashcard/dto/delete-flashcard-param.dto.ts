import { IsNotEmpty, IsUUID } from 'class-validator';

export class DeleteFlashcardParamDto {
  @IsNotEmpty({ message: 'Flashcard ID is required' })
  @IsUUID()
  id: string;
}
