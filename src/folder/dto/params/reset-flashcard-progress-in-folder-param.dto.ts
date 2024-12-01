import { IsNotEmpty, IsUUID } from 'class-validator';

export class ResetFlashcardProgressInFolderParamDto {
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
