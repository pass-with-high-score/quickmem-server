import { IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateQuizStatusParamDto {
  @IsNotEmpty({ message: 'Flashcard ID is required' })
  @IsUUID()
  id: string;
}
