import { IsNotEmpty, IsUUID } from 'class-validator';

export class ImportFlashcardFromQuizletParamDto {
  @IsNotEmpty()
  @IsUUID()
  userId: string;
}
