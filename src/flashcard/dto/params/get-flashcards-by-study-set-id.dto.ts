import { IsNotEmpty, IsUUID } from 'class-validator';

export class GetFlashcardsByStudySetIdDto {
  @IsNotEmpty({ message: 'Study set ID is required' })
  @IsUUID()
  id: string;
}
