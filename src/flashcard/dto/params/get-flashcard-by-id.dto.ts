import { IsNotEmpty, IsUUID } from 'class-validator';

export class GetFlashcardByIdDto {
  @IsNotEmpty({ message: 'Flashcard ID is required' })
  @IsUUID()
  id: string;
}
