import { IsNotEmpty, IsUUID } from 'class-validator';

export class ResetFlashcardProgressParamDto {
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
